const LoaderState = ({ type }: { type: "trend" | "contributor" }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Title Skeleton */}
      <div
        style={{
          height: "24px",
          width: "180px",
          backgroundColor: "#e5e7eb",
          borderRadius: "6px",
          marginBottom: "8px",
          animation: "pulse 1.5s infinite",
        }}
      />

      {/* Subtitle Skeleton */}
      <div
        style={{
          height: "14px",
          width: "120px",
          backgroundColor: "#f3f4f6",
          borderRadius: "4px",
          marginBottom: "32px",
          animation: "pulse 1.5s infinite",
          animationDelay: "0.2s",
        }}
      />

      {/* Chart Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "12px",
          borderLeft: "2px solid #e5e7eb",
          borderBottom: "2px solid #e5e7eb",
          padding: "20px",
          position: "relative",
        }}
      >
        {type === "contributor" ? (
          // Simple vertical bars for contributor
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "8px",
              width: "100%",
              height: "100%",
            }}
          >
            {[60, 80, 55, 90, 70, 65, 85, 50].map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  maxWidth: "60px",
                  height: `${height}%`,
                  backgroundColor: "#EBE4DD",
                  borderRadius: "4px 4px 0 0",
                  animation: "pulse 1.5s infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : (
          // Simple line with dots for trend
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {/* Dots */}
              {[
                [0, 60],
                [12.5, 40],
                [25, 50],
                [37.5, 25],
                [50, 45],
                [62.5, 20],
                [75, 35],
                [87.5, 30],
                [100, 25],
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="5"
                  fill="#3b82f6"
                  style={{
                    animation: "pulse 1.5s infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Y-axis line indicator */}
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "10px",
            bottom: "10px",
            width: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        ></div>
      </div>

      {/* Bottom labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
          gap: "8px",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "8px",
              backgroundColor: "#f3f4f6",
              borderRadius: "2px",
              animation: "pulse 1.5s infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default LoaderState;
