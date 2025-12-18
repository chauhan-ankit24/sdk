const EmptyState = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <svg
          style={{
            width: "3rem",
            height: "3rem",
            color: "#9ca3af",
            margin: "0 auto 1rem auto",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p style={{ color: "#4b5563" }}>No data available for this insight</p>
      </div>
    </div>
  );
};

export default EmptyState;
