# Insight SDK

A React SDK for displaying insights with interactive charts and data visualizations. Built with TypeScript and powered by Recharts.

## Features

- 📊 **Interactive Charts**: Trend and contributor insights with responsive visualizations
- 🔄 **Real-time Data**: Asynchronous data fetching with loading and error states
- 🎨 **Customizable**: Flexible styling and configuration options
- 📱 **Responsive**: Mobile-friendly charts that adapt to different screen sizes
- ⚡ **TypeScript**: Full type safety and IntelliSense support
- 🪝 **React Hooks**: Modern React patterns with hooks for state management

## Installation

```bash
npm install insight-sdk
```

**Peer Dependencies**: This package requires React 16.8+ and React DOM.

```bash
npm install react react-dom
```

## Quick Start

```tsx
import React from 'react';
import { Insight } from 'insight-sdk';

function App() {
  // Example data resolver - replace with your actual data fetching logic
  const dataResolver = async (metric: string, grain: string, fromTime: Date, toTime: Date) => {
    // Fetch data from your API
    const response = await fetch(`/api/metrics/${metric}?from=${fromTime.toISOString()}&to=${toTime.toISOString()}`);
    return response.json();
  };

  return (
    <div>
      <Insight
        type="trend"
        metric="page_views"
        timeGrain="daily"
        timeRange={30}
        dataResolver={dataResolver}
      />
    </div>
  );
}

export default App;
```

## API Reference

### `<Insight />` Component

The main component for rendering insights.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `"trend" \| "contributor"` | ✅ | Type of insight to display |
| `metric` | `string` | ✅ | The metric to analyze (e.g., "page_views", "revenue") |
| `dimension` | `string` | ❌ | Dimension for contributor insights (e.g., "country", "device") |
| `timeGrain` | `"daily" \| "weekly" \| "monthly"` | ✅ | Time granularity for data aggregation |
| `timeRange` | `number` | ✅ | Number of days to look back from today |
| `dataResolver` | `function` | ✅ | Async function to fetch metric data |
| `dimensionValuesResolver` | `function` | ❌ | Async function to fetch dimension values (required for contributor insights) |

#### Data Resolver Function

```typescript
dataResolver: (
  metric: string,
  grain: TimeGrain,
  fromTime: Date,
  toTime: Date
) => Promise<any[]>
```

**Parameters:**
- `metric`: The metric name
- `grain`: Time granularity ("daily", "weekly", or "monthly")
- `fromTime`: Start date for data range
- `toTime`: End date for data range

**Returns:** Promise resolving to an array of data points

#### Dimension Values Resolver Function (for contributor insights)

```typescript
dimensionValuesResolver?: (
  metric: string,
  dimension: string
) => Promise<string[]>
```

**Parameters:**
- `metric`: The metric name
- `dimension`: The dimension name

**Returns:** Promise resolving to an array of dimension values

## Usage Examples

### Trend Insight

Displays a line chart showing how a metric changes over time.

```tsx
import { Insight } from 'insight-sdk';

const dataResolver = async (metric, grain, fromTime, toTime) => {
  // Example: Fetch daily page views for the last 30 days
  const data = [
    { date: '2024-01-01', value: 1200 },
    { date: '2024-01-02', value: 1350 },
    { date: '2024-01-03', value: 1180 },
    // ... more data points
  ];
  return data;
};

<Insight
  type="trend"
  metric="page_views"
  timeGrain="daily"
  timeRange={30}
  dataResolver={dataResolver}
/>
```

### Contributor Insight

Displays a stacked bar chart showing how different dimension values contribute to the metric.

```tsx
import { Insight } from 'insight-sdk';

const dataResolver = async (metric, grain, fromTime, toTime) => {
  // Example: Fetch contributor data
  const data = [
    { dimension: 'desktop', value: 800 },
    { dimension: 'mobile', value: 600 },
    { dimension: 'tablet', value: 200 },
  ];
  return data;
};

const dimensionValuesResolver = async (metric, dimension) => {
  // Return available dimension values
  return ['desktop', 'mobile', 'tablet'];
};

<Insight
  type="contributor"
  metric="page_views"
  dimension="device"
  timeGrain="daily"
  timeRange={30}
  dataResolver={dataResolver}
  dimensionValuesResolver={dimensionValuesResolver}
/>
```

## Data Format Requirements

### Trend Data
Your `dataResolver` should return an array of objects with `date` and `value` properties:

```typescript
[
  { date: '2024-01-01', value: 1200 },
  { date: '2024-01-02', value: 1350 },
  // ...
]
```

### Contributor Data
For contributor insights, return an array with `dimension` and `value` properties:

```typescript
[
  { dimension: 'desktop', value: 800 },
  { dimension: 'mobile', value: 600 },
  // ...
]
```

## Individual Components

You can also import and use individual chart components directly:

```tsx
import { TrendChart, ContributorChart } from 'insight-sdk';

// Use TrendChart with pre-transformed data
<TrendChart data={trendData} metric="page_views" />

// Use ContributorChart with pre-transformed data
<ContributorChart data={contributorData} dimensionValues={['desktop', 'mobile']} />
```

## Utility Functions

The SDK exports several utility functions you can use:

```tsx
import { calculateTimeRange, formatDate } from 'insight-sdk';

// Calculate date range
const { fromTime, toTime } = calculateTimeRange(30); // Last 30 days

// Format dates
const formatted = formatDate(new Date()); // "01-01-2024"
```

## Development

### Building the SDK

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Insight.tsx     # Main insight component
│   ├── TrendChart.tsx  # Line chart component
│   └── ContributorChart.tsx # Stacked bar chart
├── types/              # TypeScript definitions
├── utils/              # Utility functions
│   ├── timeUtils.ts    # Date/time utilities
│   ├── transformers.ts # Data transformation
│   └── constants.ts    # Configuration constants
└── index.ts            # Main exports
```

## License

ISC License - see [LICENSE](LICENSE) file for details.
"
