const ErrorState = ({ error }: { error: string }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fef2f2",
        borderRadius: "12px",
        border: "1px solid #fca5a5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#fee2e2",
            padding: "12px",
            borderRadius: "50%",
            display: "inline-block",
            marginBottom: "16px",
          }}
        >
          <svg
            style={{ width: "32px", height: "32px", color: "#dc2626" }}
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
        <p style={{ color: "#dc2626", fontWeight: 500 }}>{error}</p>
      </div>
    </div>
  );
};
export default ErrorState;
