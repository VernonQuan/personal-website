import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { Message, MessageProps } from '@/components/Chatbox/Message';
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
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const defaultQuestions = [
    { buttonText: 'About Vernon', questionText: 'What can you tell me about Vernon?' },
    { buttonText: 'Work History', questionText: 'What is Vernon’s work history?' },
    { buttonText: 'Technologies', questionText: 'What technologies does Vernon work with?' },
  ];

  const apiUrl = useMemo(
    () => import.meta.env.VITE_CHAT_API_URL ?? 'http://localhost:8787/api/chat',
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

  const requestAnswer = useCallback(
    async (userMessageId: string, content: string, snapshot: MessageProps[]) => {
      const history = buildHistory(snapshot);
      try {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId ? { ...msg, status: 'sending', retry: undefined } : msg
          )
        );
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {}),
          },
          body: JSON.stringify({ message: content, history }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? 'Unable to reach the chat service.');
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId ? { ...msg, status: 'sent', retry: undefined } : msg
          )
        );
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.reply ?? 'Sorry, I do not have a response right now.',
            timestamp: Date.now(),
          },
        ]);
      } catch (error) {
        console.warn('Chat request failed.', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId
              ? {
                  ...msg,
                  status: 'error',
                  retry: () => requestAnswer(userMessageId, content, prev),
                }
              : msg
          )
        );
      }
    },
    [apiKey, apiUrl, buildHistory]
  );

  const onSendMessage = useCallback(
    (message: string) => {
      if (!message.trim() || waitingForResponse) {
        return;
      }

      const userMessageId = Date.now().toString();
      const userMessage: MessageProps = {
        id: userMessageId,
        role: 'user',
        content: message,
        timestamp: Date.now(),
        status: 'sending',
      };
      setMessages((prev) => [...prev, userMessage]);
      setWaitingForResponse(true);
      requestAnswer(userMessageId, message, [...messages, userMessage]).finally(() => {
        setWaitingForResponse(false);
      });
    },
    [messages, requestAnswer, waitingForResponse]
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
        <button onClick={() => setIsOpen(true)} className="chatbox-open-btn" aria-label="Open chat">
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
