# Insight SDK

A React SDK for displaying insights with interactive charts and data visualizations. Built with TypeScript and powered by Recharts.

## Features

- 📊 **Interactive Charts**: Trend and contributor insights with responsive visualizations
- 🎨 **Customizable**: Flexible styling and configuration options
- 📱 **Responsive**: Mobile-friendly charts that adapt to different screen sizes
- ⚡ **TypeScript**: Full type safety and IntelliSense support
- 🪝 **React Hooks**: Modern React patterns with hooks for state management
- 🧹 **Linting**: ESLint configured for code quality
- ❌ **Error Handling**: Shows errors for wrong data, empty array for 0 data
- 🦴 **Skeleton Loading**: Animated skeleton states during data fetch
- ✅ **Prop Validation**: TypeScript interfaces ensure valid props
- 💾 **Caching**: In-memory caching for performance
- 🔄 **Polling**: refreshInterval={3000} for data updates
- 🛡️ **Error Boundary**: Catches and handles component errors
- 📦 **Min Dependencies**: Only tslib, peer deps for React

## Installation

```bash
npm install insight-sdk
npm install react react-dom  # Peer deps
```

## Quick Start

```tsx
import { Insight } from "insight-sdk";

const dataResolver = async (metric, grain, fromTime, toTime) => {
  // Fetch your data
  return [{ date: "2024-01-01", value: 1200 }];
};

<Insight
  type="trend"
  metric="page_views"
  timeGrain="daily"
  timeRange={30}
  dataResolver={dataResolver}
/>;
```

## API Reference

### `<Insight />` Component

The main component for rendering insights.

#### Props

| Prop                      | Type                               | Required | Description                                                                  |
| ------------------------- | ---------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `type`                    | `"trend" \| "contributor"`         | ✅       | Type of insight to display                                                   |
| `metric`                  | `string`                           | ✅       | The metric to analyze (e.g., "page_views", "revenue")                        |
| `dimension`               | `string`                           | ❌       | Dimension for contributor insights (e.g., "country", "device")               |
| `timeGrain`               | `"daily" \| "weekly" \| "monthly"` | ✅       | Time granularity for data aggregation                                        |
| `timeRange`               | `number`                           | ✅       | Number of days to look back from today                                       |
| `dataResolver`            | `function`                         | ✅       | Async function to fetch metric data                                          |
| `dimensionValuesResolver` | `function`                         | ❌       | Async function to fetch dimension values (required for contributor insights) |
| `width`                   | `string \| number`                 | ❌       | Width of the chart (default: "100%")                                         |
| `height`                  | `string \| number`                 | ❌       | Height of the chart (default: "400px")                                       |
| `refreshInterval`         | `number`                           | ❌       | Polling interval in ms (default: 0, no polling)                              |

## Usage Examples

### Trend Insight

Displays a line chart showing how a metric changes over time.

```tsx
import { Insight } from "insight-sdk";

const dataResolver = async (metric, grain, fromTime, toTime) => {
  // Example: Fetch daily page views for the last 30 days
  const data = [
    { date: "2024-01-01", value: 1200 },
    { date: "2024-01-02", value: 1350 },
    { date: "2024-01-03", value: 1180 },
  ];
  return data;
};

<Insight
  type="trend"
  metric="page_views"
  timeGrain="daily"
  timeRange={30}
  dataResolver={dataResolver}
/>;
```

### Contributor Insight

Displays a stacked bar chart showing how different dimension values contribute to the metric.

```tsx
import { Insight } from "insight-sdk";

const dataResolver = async (metric, grain, fromTime, toTime) => {
  // Example: Fetch contributor data
  const data = [
    { dimension: "desktop", value: 800 },
    { dimension: "mobile", value: 600 },
    { dimension: "tablet", value: 200 },
  ];
  return data;
};

const dimensionValuesResolver = async (metric, dimension) => {
  // Return available dimension values
  return ["desktop", "mobile", "tablet"];
};

<Insight
  type="contributor"
  metric="page_views"
  dimension="device"
  timeGrain="daily"
  timeRange={30}
  dataResolver={dataResolver}
  dimensionValuesResolver={dimensionValuesResolver}
/>;
```

## License

ISC License - see [LICENSE](LICENSE) file for details.
"
