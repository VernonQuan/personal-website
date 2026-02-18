import { FormEvent, useMemo } from 'react';

import './Composer.css';
import LoadingSpinner from '@/components/Spinner/LoadingSpinner';
import { FaPaperPlane } from 'react-icons/fa';
type ComposerProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disableSend?: boolean;
  isLoading?: boolean;
};

export function Composer({ onSubmit, disableSend, isLoading }: ComposerProps) {
  const shouldAutoFocus = useMemo(() => {
    // Only autofocus on desktop (screen width > 720px)
    return window.matchMedia('(min-width: 721px)').matches;
  }, []);

  return (
    <form className="composer" onSubmit={onSubmit}>
      <input
        className="composer-input"
        name="message"
        type="text"
        placeholder="Type your message..."
        autoFocus={shouldAutoFocus}
      />
      <button className="composer-send" type="submit" disabled={disableSend || isLoading}>
        {isLoading ? <LoadingSpinner size={16} /> : <FaPaperPlane size={16} />}
      </button>
    </form>
  );
}
