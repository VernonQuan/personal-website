import { FormEvent } from 'react';

import './Composer.css';
import LoadingSpinner from '@/components/Spinner/LoadingSpinner';
import { FaPaperPlane } from 'react-icons/fa';
type ComposerProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disableSend?: boolean;
  isLoading?: boolean;
};

export function Composer({ onSubmit, disableSend, isLoading }: ComposerProps) {
  return (
    <form className="composer" onSubmit={onSubmit}>
      <input
        className="composer-input"
        name="message"
        type="text"
        placeholder="Type your message..."
        autoFocus
      />
      <button className="composer-send" type="submit" disabled={disableSend || isLoading}>
        {isLoading ? <LoadingSpinner size={16} /> : <FaPaperPlane size={16} />}
      </button>
    </form>
  );
}
