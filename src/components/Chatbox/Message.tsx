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
};

export function Message({ id, role, content, timestamp, status, retry }: MessageProps) {
  const getTimeFromTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div className={`message ${role} ${status}`} key={id}>
      <div className="message-bubble">
        <div className="message-text">{content}</div>
        <div className="message-subtext">
          <span className="timestamp">{getTimeFromTimestamp(timestamp)}</span>
          <span className="status">
            {status === 'sending' && <FaCheck size={12} className="muted" />}
            {status === 'sent' && <FaCheckDouble size={12} className="muted" />}
            {status === 'error' && (
              <FaTimesCircle size={12} className="error pointer" onClick={retry} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
