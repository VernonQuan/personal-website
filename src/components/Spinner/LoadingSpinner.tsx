import { ClipLoader } from 'react-spinners';

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};
export default function LoadingSpinner({ className = '', size = 40 }: LoadingSpinnerProps = {}) {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <ClipLoader size={size} color="#6ee7ff" />
    </div>
  );
}
