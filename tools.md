# LangGraph Tools Reference - CodersGPT

All tools are defined in `app/api/chat/tools.ts` using the `tool()` function from `@langchain/core/tools` with Zod schemas for input validation.

---

## Overview

| # | Tool Name | Purpose | External API | API Key Required |
|---|-----------|---------|-------------|-----------------|
| 1 | `displayCryptoPrice` | Get current crypto price | Yahoo Finance | No |
| 2 | `displayCryptoChart` | Show historical price chart | Yahoo Finance | No |
| 3 | `displayNews` | Fetch latest news headlines | Yahoo Finance Search | No |
| 4 | `displayCryptoSentiment` | Crypto Fear & Greed Index | Alternative.me | No |
| 5 | `displayWeather` | Current weather for a city | Open-Meteo | No |
| 6 | `displayProducts` | Search e-commerce products | SerpApi (Google Shopping) | Yes (`SERPAPI_API_KEY`) |

---

## Tool 1: `displayCryptoPrice`

> Get the current price for a cryptocurrency (e.g., Bitcoin, Ethereum, SOL).

### Input Schema

```ts
z.object({
  symbol: z.string()  // e.g., "BTC", "ETH", "SOL", "DOGE"
})
```

### How It Works

1. Normalizes symbol to Yahoo Finance format: `BTC` -> `BTC-USD`
2. Calls Yahoo Finance Chart API to get current market data
3. Extracts `regularMarketPrice`, `currency`, and `chartPreviousClose` (for 24h change calculation)
4. Returns a logo URL from DigitalOcean CDN

### API Endpoint

```
GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}-USD?range=1d&interval=1d
```

### Return Value

```ts
{
  symbol: string;        // "BTC" (clean, without -USD)
  price: number;         // Current market price
  currency: string;      // "USD"
  previousClose: number; // Previous close price (for calculating 24h % change)
  logoUrl: string;       // Crypto logo image URL
  error?: string;        // Only present on failure
}
```

### UI Component

`components/gen-ui/crypto-card.tsx` - Renders a card showing price, 24h change, and logo.

---

## Tool 2: `displayCryptoChart`

> Display a historical price chart for a cryptocurrency over a specific period of time.

### Input Schema

```ts
z.object({
  symbol: z.string(),              // e.g., "BTC", "ETH"
  range: z.string().optional()     // "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "ytd" | "max"
                                   // Default: "1mo"
})
```

### How It Works

1. Normalizes symbol: `ETH` -> `ETH-USD`
2. Chooses interval based on range:
   - `1d` or `5d` -> `60m` (hourly candles for higher resolution)
   - All other ranges -> `1d` (daily candles)
3. Fetches historical chart data from Yahoo Finance
4. Extracts timestamps and closing prices from the response

### API Endpoint

```
GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}-USD?range={range}&interval={interval}
```

### Return Value

```ts
{
  symbol: string;              // "ETH" (clean)
  prices: (number | null)[];   // Array of closing prices
  timestamp: number[];         // Corresponding Unix timestamps
  currentPrice: number;        // Latest market price
  currency: string;            // "USD"
  rangeUsed: string;           // The range that was used (e.g., "1mo")
  error?: string;
}
```

### UI Component

`components/gen-ui/crypto-chart.tsx` - Renders an interactive line chart with the price history.

---

## Tool 3: `displayNews`

> Get the latest news headlines for a specific stock, cryptocurrency, or company.

### Input Schema

```ts
z.object({
  query: z.string()  // e.g., "AAPL", "Bitcoin", "Tesla"
})
```

### How It Works

1. Calls Yahoo Finance Search API with the query
2. Takes the top 5 news items from the response
3. Formats each item: extracts `title`, `publisher`, `link`, `publishTime`, and `thumbnail`
4. Converts Unix timestamps to readable format using `toLocaleString()`

### API Endpoint

```
GET https://query2.finance.yahoo.com/v1/finance/search?q={query}
```

### Return Value

```ts
{
  query: string;
  news: Array<{
    uuid: string;         // Unique identifier
    title: string;        // News headline
    publisher: string;    // News source (e.g., "Reuters")
    link: string;         // URL to full article
    publishTime: string;  // Formatted date (e.g., "Mar 13, 2:30 PM")
    thumbnail: string | null;  // Thumbnail image URL
  }>;
  error?: string;
}
```

### UI Component

`components/gen-ui/news-card.tsx` - Renders a list of clickable news cards with thumbnails.

---

## Tool 4: `displayCryptoSentiment`

> Get the current Fear & Greed sentiment index for the crypto market. Score: 0 (Extreme Fear) to 100 (Extreme Greed).

### Input Schema

```ts
z.object({
  dummy: z.string().optional()  // No real input needed - this is a global market index
})
```

### How It Works

1. Fetches the latest Fear & Greed Index value from Alternative.me API
2. Returns the numeric score (0-100), classification label, and update timing
3. No user input is required since this is a global crypto market index

### API Endpoint

```
GET https://api.alternative.me/fng/?limit=1
```

### Return Value

```ts
{
  value: number;            // 0-100 score
  classification: string;  // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
  timestamp: number;        // Unix timestamp of the data point
  timeUntilUpdate: number;  // Seconds until next index update
  error?: string;
}
```

### UI Component

`components/gen-ui/sentiment-meter.tsx` - Renders a gauge/meter visualization of the sentiment score.

---

## Tool 5: `displayWeather`

> Get the current real-time weather for a specific city or location.

### Input Schema

```ts
z.object({
  location: z.string()  // e.g., "New York", "London", "Tokyo"
})
```

### How It Works

This tool uses a **two-step process**:

**Step 1 - Geocoding:** Convert city name to latitude/longitude coordinates
```
GET https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1&language=en&format=json
```

**Step 2 - Weather Fetch:** Get current weather using coordinates
```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&wind_speed_unit=mph&timezone=auto
```

### Return Value

```ts
{
  location: string;      // "New York, United States" (name + country)
  temperature: number;   // Temperature in the default unit (Celsius)
  feelsLike: number;     // Apparent/feels-like temperature
  humidity: number;      // Relative humidity (%)
  windSpeed: number;     // Wind speed in mph
  isDay: boolean;        // true if daytime at location
  weatherCode: number;   // WMO standard weather interpretation code
  error?: string;
}
```

### WMO Weather Codes (for reference)

| Code | Meaning |
|------|---------|
| 0 | Clear sky |
| 1-3 | Mainly clear, partly cloudy, overcast |
| 45, 48 | Fog |
| 51-55 | Drizzle |
| 61-65 | Rain |
| 71-75 | Snow |
| 80-82 | Rain showers |
| 95 | Thunderstorm |

### UI Component

`components/gen-ui/weather-card.tsx` - Renders a weather card with temperature, conditions, and wind info.

---

## Tool 6: `displayProducts`

> Search for real e-commerce products and display a carousel of prices and details.

### Input Schema

```ts
z.object({
  query: z.string()  // e.g., "iPhone 15", "MacBook Pro"
})
```

### How It Works

1. Calls SerpApi with the Google Shopping engine
2. Location is hardcoded to `"India"`
3. Takes top 6 products from the `shopping_results` array
4. Extracts product ID, title, source, price, rating, thumbnail, and link

### API Used

```ts
import { getJson } from "serpapi";

getJson({
  engine: "google_shopping",
  q: query,
  location: "India",
  api_key: process.env.SERPAPI_API_KEY
});
```

### Return Value

```ts
{
  query: string;
  products: Array<{
    id: string | number;    // Product ID
    title: string;          // Product name
    description: string;    // Store/source name (e.g., "Amazon", "Flipkart")
    price: number;          // Extracted price
    rating: number;         // Product rating (0 if unavailable)
    thumbnail: string;      // Product image URL
    product_link: string;   // Direct link to product page
  }>;
  error?: string;
}
```

### Environment Variable Required

```
SERPAPI_API_KEY=your_serpapi_key_here
```
---

## How Tools Integrate with the Graph

All tools are registered in the LangGraph state graph at `app/api/chat/graph.ts`:

```
START -> llmCall -> toolNode -> (route)
                                                   |
                                          UI Tool? -> END (render component)
```

### Tool Registration (tools.ts)

```ts
export const toolsByName = {
  displayNews: newsTool,
  displayCryptoSentiment: sentimentTool,
  displayCryptoPrice: cryptoPriceTool,
  displayCryptoChart: cryptoChartTool,
  displayWeather: weatherTool,
  displayProducts: productsTool
};

export const tools = Object.values(toolsByName);
```

### UI vs Non-UI Routing (graph.ts)

```ts
export const UI_TOOL_NAMES = [
  "displayCryptoChart",
  "displayNews",
  "displayCryptoPrice",
  "displayCryptoSentiment",
  "displayWeather",
  "displayProducts",
];

// After tool execution:
// - If tool name is in UI_TOOL_NAMES -> END (component renders the output)
// - Otherwise -> back to llmCall (LLM processes the tool output)
```

### Model Binding

```ts
const modelWithTools = model.bindTools(tools);
// All 7 tools are bound to the LLM so it can decide when to call them
```

---

## Key Packages Used

| Package | Purpose |
|---------|---------|
| `@langchain/core/tools` | `tool()` function for defining tools with Zod schemas |
| `@langchain/langgraph` | StateGraph, ToolNode for graph-based orchestration |
| `@langchain/langgraph/prebuilt` | `ToolNode` - automatically executes tool calls from LLM |
| `zod` | Input schema validation for each tool |
| `serpapi` | Google Shopping product search |

---

## Quick Implementation Checklist

When implementing a new tool, you need to:

1. **Define the tool** in `tools.ts` using the `tool()` function with a Zod schema
2. **Add it to `toolsByName`** object so it gets registered
3. **Decide if it's a UI tool** - if yes, add its name to `UI_TOOL_NAMES` array
4. **Create a React component** in `components/gen-ui/` if it's a UI tool
5. **No changes needed in `graph.ts`** - tools are auto-imported and bound to the model
