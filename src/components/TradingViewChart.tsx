import { useEffect, useRef, memo } from "react";

interface Props {
  symbol: string;        // e.g. "CBOT:ZM1!" (Soybean Meal futures)
  title?: string;
  height?: number;
}

/**
 * Lightweight TradingView "Advanced Chart" widget embed.
 * Loads the official tv.js script once per mount and renders inside a div.
 * No API key required.
 */
function TradingViewChart({ symbol, title, height = 360 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="w-full">
      {title && (
        <div className="text-xs text-muted-foreground mb-2">{title}</div>
      )}
      <div
        ref={containerRef}
        className="tradingview-widget-container rounded-md overflow-hidden border border-border"
        style={{ height }}
      />
    </div>
  );
}

export default memo(TradingViewChart);
