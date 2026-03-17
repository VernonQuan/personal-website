import { isPathEnabled } from '@/utils/pages';

export type NavigateAction = {
  type: 'navigate';
  target: string;
  label: string;
  requiresConfirmation: boolean;
  reason: string;
};

export type HighlightAction = {
  type: 'highlight';
  target: string;
  label: string;
  requiresConfirmation: boolean;
  reason: string;
};

export type ChatAction = NavigateAction | HighlightAction;

const affirmativePattern =
  /^(?:yes|yeah|yep|sure|ok|okay|please|go ahead|do it|sounds good|take me there|lead me there|show me|navigate there|let'?s go|yes please)$/i;

const negativePattern = /^(?:no|nope|nah|not now|maybe later|cancel|stop|never mind|dont|don't)$/i;

export const isChatAction = (value: unknown): value is ChatAction => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.type === 'navigate' || candidate.type === 'highlight') &&
    typeof candidate.target === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.requiresConfirmation === 'boolean' &&
    typeof candidate.reason === 'string'
  );
};

export const isAffirmativeMessage = (message: string) => affirmativePattern.test(message.trim());

export const isNegativeMessage = (message: string) => negativePattern.test(message.trim());

export const isActionAvailable = (action: ChatAction) => {
  switch (action.type) {
    case 'navigate':
      return isPathEnabled(action.target);
    case 'highlight':
      if (typeof document === 'undefined') {
        return false;
      }
      return document.querySelector(`[data-nux-id="${action.target}"]`) !== null;
  }
};

export const getActionConfirmationMessage = (action: ChatAction) => {
  switch (action.type) {
    case 'navigate':
      return `Taking you to ${action.label} now.`;
    case 'highlight':
      return `I highlighted ${action.label} for you.`;
  }
};
