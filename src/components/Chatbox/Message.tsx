import { Fragment, type ReactNode } from 'react';
import { FaCheck, FaCheckDouble, FaTimesCircle } from 'react-icons/fa';

import './Message.css';

export type Role = 'user' | 'assistant' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'error';

export type MessageProps = {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  retry?: () => void;
  isStreaming?: boolean;
};

const inlinePattern = /\*\*(.+?)\*\*|(https?:\/\/[^\s<>"']+)/g;

function renderInlineSegment(raw: string, index: number): ReactNode {
  if (/^https?:\/\//.test(raw)) {
    let display = raw;
    try {
      const u = new URL(raw);
      display = u.hostname + (u.pathname !== '/' ? u.pathname : '');
    } catch {
      // leave as-is
    }
    return (
      <a
        key={`link-${index}`}
        href={raw}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-link"
      >
        {display}
      </a>
    );
  }
  return <strong key={`bold-${index}`}>{raw.replace(/^\*\*|\*\*$/g, '')}</strong>;
}

function renderSafeBoldMarkdown(text: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match = inlinePattern.exec(text);

  while (match) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    if (matchStart > lastIndex) {
      nodes.push(text.slice(lastIndex, matchStart));
    }

    nodes.push(renderInlineSegment(match[0], matchStart));
    lastIndex = matchEnd;
    match = inlinePattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 0) {
    return text;
  }

  return nodes.map((node, index) => <Fragment key={`part-${index}`}>{node}</Fragment>);
}

export function Message({
  id,
  role,
  content,
  timestamp,
  status,
  retry,
  isStreaming,
}: MessageProps) {
  const getTimeFromTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const displayContent = () => {
    if (isStreaming && !content) {
      return <span className="thinking-indicator">Thinking...</span>;
    }
    return renderSafeBoldMarkdown(content);
  };

  const showStatus = role === 'user' && status;

  return (
    <div className={`message ${role} ${status}${isStreaming ? ' streaming' : ''}`} key={id}>
      <div className="message-bubble">
        <div className="message-text">{displayContent()}</div>
        <div className="message-subtext">
          <span className="timestamp">{getTimeFromTimestamp(timestamp)}</span>
          <span className="status" aria-hidden={!showStatus}>
            {showStatus === 'sending' && <FaCheck size={12} className="muted" />}
            {showStatus === 'sent' && <FaCheckDouble size={12} className="muted" />}
            {showStatus === 'error' && !isStreaming && (
              <FaTimesCircle size={12} className="error pointer" onClick={retry} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
