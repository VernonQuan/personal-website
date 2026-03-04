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

function renderSafeBoldMarkdown(text: string) {
  const boldPattern = /\*\*(.+?)\*\*/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match = boldPattern.exec(text);

  while (match) {
    const [fullMatch, boldText] = match;
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    if (matchStart > lastIndex) {
      nodes.push(text.slice(lastIndex, matchStart));
    }

    nodes.push(<strong key={`bold-${matchStart}-${matchEnd}`}>{boldText}</strong>);
    lastIndex = matchEnd;
    match = boldPattern.exec(text);
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

  return (
    <div className={`message ${role} ${status}${isStreaming ? ' streaming' : ''}`} key={id}>
      <div className="message-bubble">
        <div className="message-text">{displayContent()}</div>
        <div className="message-subtext">
          <span className="timestamp">{getTimeFromTimestamp(timestamp)}</span>
          <span className="status">
            {status === 'sending' && <FaCheck size={12} className="muted" />}
            {status === 'sent' && <FaCheckDouble size={12} className="muted" />}
            {status === 'error' && !isStreaming && (
              <FaTimesCircle size={12} className="error pointer" onClick={retry} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
