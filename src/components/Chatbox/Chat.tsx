import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { Message, MessageProps } from '@/components/Chatbox/Message';
import {
  ChatAction,
  getActionConfirmationMessage,
  isAffirmativeMessage,
  isActionAvailable,
  isChatAction,
  isNegativeMessage,
} from '@/components/Chatbox/actions';
import { Composer } from '@/components/Chatbox/Composer';
import { Option } from '@/components/Chatbox/Option';

import './Chat.css';

export type ChatProps = {
  defaultMessage?: string;
  openByDefault?: boolean;
};
export function Chat({ defaultMessage, openByDefault }: ChatProps) {
  const [isOpen, setIsOpen] = useState(openByDefault ?? false);
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        defaultMessage ??
        'Hello! What would you like to know about Vernon? You can click on any of the options below or ask your own question.',
      timestamp: Date.now(),
    },
  ]);
  const [pendingAction, setPendingAction] = useState<ChatAction | null>(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigationTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNavDelayMs = 180;
  const defaultQuestions = [
    { buttonText: 'About Vernon', questionText: 'What can you tell me about Vernon?' },
    { buttonText: 'Work History', questionText: 'What is Vernon’s work history?' },
    { buttonText: 'Technologies', questionText: 'What technologies does Vernon work with?' },
  ];

  const apiUrl = useMemo(
    () => (import.meta.env.VITE_CHAT_API_URL ?? 'http://localhost:8787') + '/api/chat/stream',
    []
  );
  const apiKey = useMemo(() => import.meta.env.VITE_CHAT_API_KEY ?? '', []);

  const buildHistory = useCallback(
    (snapshot: MessageProps[]) =>
      snapshot
        .filter(({ role }) => role === 'user' || role === 'assistant')
        .slice(-8)
        .map(({ role, content }) => ({ role, content })),
    []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(
    () => () => {
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (pendingAction?.type === 'navigate' && pendingAction.target === location.pathname) {
      setPendingAction(null);
    }
  }, [location.pathname, pendingAction]);

  const executeAction = useCallback(
    (action: ChatAction) => {
      switch (action.type) {
        case 'navigate':
          if (location.pathname !== action.target) {
            const isMobileViewport =
              typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches;

            if (isMobileViewport && isOpen) {
              setIsOpen(false);

              if (navigationTimeoutRef.current !== null) {
                window.clearTimeout(navigationTimeoutRef.current);
              }

              navigationTimeoutRef.current = window.setTimeout(() => {
                navigate(action.target);
                navigationTimeoutRef.current = null;
              }, mobileNavDelayMs);

              return;
            }

            navigate(action.target);
          }
          break;
      }
    },
    [isOpen, location.pathname, mobileNavDelayMs, navigate]
  );

  const appendLocalExchange = useCallback((userContent: string, assistantContent: string) => {
    const timestamp = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: timestamp.toString(),
        role: 'user',
        content: userContent,
        timestamp,
        status: 'sent',
      },
      {
        id: (timestamp + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: timestamp + 1,
      },
    ]);
  }, []);

  const requestAnswer = useCallback(
    async (
      assistantMessageId: string,
      userMessageId: string,
      content: string,
      snapshot: MessageProps[]
    ) => {
      const history = buildHistory(snapshot);
      let responseActions: ChatAction[] = [];
      let isError = false;

      const applyStreamChunk = (chunk: unknown) => {
        if (typeof chunk !== 'object' || chunk === null) {
          return;
        }

        const event = chunk as {
          error?: string;
          type?: string;
          content?: string;
          actions?: unknown[];
        };

        if (event.error) {
          isError = true;
          throw new Error(event.error);
        }

        if (Array.isArray(event.actions) && (event.type === 'actions' || !event.type)) {
          responseActions = event.actions.filter(isChatAction).filter(isActionAvailable);
        }

        if (typeof event.content === 'string' && (event.type === 'content' || !event.type)) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: msg.content + event.content } : msg
            )
          );
        }
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {}),
          },
          body: JSON.stringify({ message: content, history, currentPath: location.pathname }),
        });

        if (!response.ok) {
          isError = true;
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error ?? 'Unable to reach the chat service.');
        }

        if (!response.body) {
          throw new Error('No response body from server.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          // Keep the last incomplete line in the buffer
          buffer = lines[lines.length - 1];

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                // Stream complete
              } else if (data.startsWith('{')) {
                try {
                  applyStreamChunk(JSON.parse(data));
                } catch (e) {
                  if (e instanceof Error && e.message.includes('JSON')) {
                    // Ignore JSON parse errors
                  } else {
                    throw e;
                  }
                }
              }
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim().startsWith('data: ')) {
          const data = buffer.trim().slice(6).trim();
          if (data !== '[DONE]' && data.startsWith('{')) {
            try {
              applyStreamChunk(JSON.parse(data));
            } catch (e) {
              if (e instanceof Error && !e.message.includes('JSON')) {
                throw e;
              }
            }
          }
        }

        // Mark the assistant response complete and update the user message as delivered.
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMessageId) {
              return { ...msg, isStreaming: false };
            }

            if (msg.id === userMessageId) {
              return { ...msg, status: 'sent', retry: undefined };
            }

            return msg;
          })
        );

        const suggestedAction =
          responseActions.find((action) => action.requiresConfirmation) ?? null;
        const immediateActions = responseActions.filter((action) => !action.requiresConfirmation);

        setPendingAction(suggestedAction);
        immediateActions.forEach(executeAction);
      } catch (error) {
        console.warn('Chat request failed.', error);
        if (!isError) {
          isError = true;
        }
        // Remove the partial assistant message
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
        // Restore the user message status to error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId
              ? {
                  ...msg,
                  status: 'error',
                  retry: () => requestAnswer(assistantMessageId, userMessageId, content, prev),
                }
              : msg
          )
        );
      } finally {
        setWaitingForResponse(false);
      }
    },
    [apiKey, apiUrl, buildHistory, executeAction, location.pathname]
  );

  const onSendMessage = useCallback(
    (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || waitingForResponse) {
        return;
      }

      if (pendingAction && isAffirmativeMessage(trimmedMessage)) {
        appendLocalExchange(trimmedMessage, getActionConfirmationMessage(pendingAction));
        executeAction(pendingAction);
        setPendingAction(null);
        return;
      }

      if (pendingAction && isNegativeMessage(trimmedMessage)) {
        appendLocalExchange(
          trimmedMessage,
          'Okay. Let me know if you would like help finding something else.'
        );
        setPendingAction(null);
        return;
      }

      if (pendingAction) {
        setPendingAction(null);
      }

      const userMessageId = Date.now().toString();
      const assistantMessageId = (Date.now() + 1).toString();
      const userMessage: MessageProps = {
        id: userMessageId,
        role: 'user',
        content: trimmedMessage,
        timestamp: Date.now(),
        status: 'sending',
      };
      const assistantMessage: MessageProps = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);
      setWaitingForResponse(true);

      requestAnswer(assistantMessageId, userMessageId, trimmedMessage, newMessages);
    },
    [appendLocalExchange, executeAction, messages, pendingAction, requestAnswer, waitingForResponse]
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const message = formData.get('message')?.toString() ?? '';
      if (!message.trim() || waitingForResponse) {
        return;
      }
      onSendMessage(message);
      e.currentTarget.reset();
    },
    [messages, requestAnswer, waitingForResponse]
  );

  return createPortal(
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbox-open-btn"
          aria-label="Open chat window"
        >
          <FiMessageSquare size={24} />
        </button>
      ) : (
        <div
          className="dialogue"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-dialog-title"
        >
          <header className="dialogue-header" onClick={() => setIsOpen(false)}>
            <h2 id="chat-dialog-title">What would you like to know?</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="dialogue-close-btn"
              aria-label="Close chat"
            >
              <FiX size={24} />
            </button>
          </header>
          <div className="dialogue-messages">
            {messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1;
              return (
                <div key={msg.id}>
                  {isLastMessage ? <span ref={messagesEndRef} aria-hidden="true" /> : null}
                  <Message {...msg} />
                </div>
              );
            })}
            <div className="flex-row gap-sm">
              {messages.length < 2 &&
                defaultQuestions.map(({ buttonText, questionText }, index) => (
                  <Option
                    key={index}
                    label={buttonText}
                    onClick={() => onSendMessage(questionText)}
                  />
                ))}
            </div>
          </div>
          <Composer
            onSubmit={onSubmit}
            disableSend={waitingForResponse}
            isLoading={waitingForResponse}
          />
        </div>
      )}
    </>,
    document.body
  );
}
