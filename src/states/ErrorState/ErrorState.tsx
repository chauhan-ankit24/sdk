import './ErrorState.css';

const ErrorState = ({ error }: { error: string }) => {
  return (
    <div className="error-state">
      <div className="error-state-content">
        <div className="error-icon-container">
          <svg
            className="error-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="error-message">{error}</p>
      </div>
    </div>
  );
};
export default ErrorState;
