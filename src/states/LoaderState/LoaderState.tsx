import './LoaderState.css';

const LoaderState = ({ type }: { type: "trend" | "contributor" }) => {
  return (
    <div className="loader-state">
      {/* Title Skeleton */}
      <div className="title-skeleton"></div>

      {/* Subtitle Skeleton */}
      <div className="subtitle-skeleton"></div>

      {/* Chart Area */}
      <div className="chart-area">
        {type === "contributor" ? (
          // Simple vertical bars for contributor
          <div className="bars-container">
            {[60, 80, 55, 90, 70, 65, 85, 50].map((height, i) => (
              <div
                key={i}
                className="bar"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ) : (
          // Simple line with dots for trend
          <div className="trend-container">
            <svg className="trend-svg" preserveAspectRatio="none">
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
                  className="trend-dot"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Y-axis line indicator */}
        <div className="y-axis-indicator"></div>
      </div>

      {/* Bottom labels */}
      <div className="bottom-labels">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
          <div key={i} className="label-skeleton"></div>
        ))}
      </div>
    </div>
  );
};

export default LoaderState;
