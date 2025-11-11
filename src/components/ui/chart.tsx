import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// region Chart

const ChartContext = React.createContext<
  | {
      theme: string;
      setTheme: (theme: string) => void;
      config: Record<string, { label: string; color: string }>;
    }
  | undefined
>(undefined);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartProvider />");
  }

  return context;
}

const Chart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, { label: string; color: string }>;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ config, children, className, ...props }, ref) => {
  const [theme, setTheme] = React.useState("");

  return (
    <div
      ref={ref}
      className={cn("h-[300px] w-full", className)}
      {...props}
    >
      <ChartContext.Provider value={{ theme, setTheme, config }}>
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </ChartContext.Provider>
    </div>
  );
});
Chart.displayName = "Chart";

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
    config: Record<string, { label: string; color: string }>;
    className?: string;
  }
>(({ children, className, config, ...props }, ref) => {
  const { theme, setTheme } = useChart();
  const chartConfig = React.useMemo(() => {
    const chartColors: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      chartColors[key] = `hsl(${value.color})`;
    }
    return chartColors;
  }, [config]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    const currentTheme = root.style.getPropertyValue("--theme");
    setTheme(currentTheme);
  }, [setTheme]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve]:stroke-[2px] [&_.recharts-dot]:fill-background [&_.recharts-dot]:stroke-primary",
        className
      )}
      style={
        {
          ...chartConfig,
        } as React.CSSProperties
      }
      {...props}
    >
      <ChartContext.Provider value={{ theme, setTheme, config }}>
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </ChartContext.Provider>
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

// region Chart Tooltip

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "dot" | "line";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      className,
      viewBox,
      content,
      payload,
      label,
      formatter,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
      ...props
    },
    ref
  ) => {
    const { config } = useChart();
    const chartConfig = config;

    const customContent = React.useCallback(
      (props: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
        const { payload, label } = props;

        if (!payload || !payload.length) {
          return null;
        }

        return (
          <div
            ref={ref}
            className={cn(
              "rounded-lg border border-border bg-background p-2 shadow-md",
              className
            )}
            {...props}
          >
            {!hideLabel && label ? (
              <div className="text-sm font-medium">
                {labelKey
                  ? payload[0]?.payload[labelKey]
                  : label}
              </div>
            ) : null}
            <div className="grid gap-1 pt-2">
              {payload.map((item, index) => {
                if (!item.color) {
                  return null;
                }
                const key = nameKey ? item.payload[nameKey] : item.name;
                const color = chartConfig[key]?.color || item.color;

                return (
                  <div
                    key={item.dataKey}
                    className={cn(
                      "flex items-center justify-between gap-4",
                      !color && "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!hideIndicator && (
                        <span
                          className={cn(
                            "h-3 w-3 shrink-0 rounded-full",
                            indicator === "line" && "h-0.5 w-5 rounded-none",
                            item.color === "hsl(var(--chart-1))" &&
                              "bg-chart-1",
                            item.color === "hsl(var(--chart-2))" &&
                              "bg-chart-2",
                            item.color === "hsl(var(--chart-3))" &&
                              "bg-chart-3",
                            item.color === "hsl(var(--chart-4))" &&
                              "bg-chart-4",
                            item.color === "hsl(var(--chart-5))" &&
                              "bg-chart-5",
                            item.color === "hsl(var(--chart-6))" &&
                              "bg-chart-6"
                          )}
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      )}
                      <span className="text-muted-foreground">
                        {chartConfig[key]?.label || item.name}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {formatter && item.value !== undefined
                        ? formatter(item.value, item.name, item, index, payload) // Added missing 5th argument (payload)
                        : item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
      [
        className,
        chartConfig,
        formatter,
        hideLabel,
        hideIndicator,
        indicator,
        labelKey,
        nameKey,
        ref,
      ]
    );

    return (
      <ChartTooltip
        content={content || customContent} // Use customContent if content is not provided
        viewBox={viewBox}
        label={label}
        payload={payload}
        {...props}
      />
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// endregion

// region Chart Legend

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: {
      value: string;
      color: string;
      id: string;
      type: "line" | "square" | "rect" | "circle" | "cross" | "diamond" | "star" | "triangle" | "wye";
    }[];
    verticalAlign?: "top" | "middle" | "bottom";
    hideIcon?: boolean;
  }
>(({ className, payload, verticalAlign = "bottom", hideIcon = false, ...props }, ref) => {
  const { theme } = useChart();

  if (!payload) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        verticalAlign === "top" && "pb-3",
        verticalAlign === "bottom" && "pt-3",
        className
      )}
      {...props}
    >
      {payload.map((item) => {
        const { value, color } = item;
        return (
          <div
            key={value}
            className={cn(
              "flex items-center gap-1.5",
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            )}
          >
            {!hideIcon && (
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  color === "hsl(var(--chart-1))" && "bg-chart-1",
                  color === "hsl(var(--chart-2))" && "bg-chart-2",
                  color === "hsl(var(--chart-3))" && "bg-chart-3",
                  color === "hsl(var(--chart-4))" && "bg-chart-4",
                  color === "hsl(var(--chart-5))" && "bg-chart-5",
                  color === "hsl(var(--chart-6))" && "bg-chart-6"
                )}
                style={{ backgroundColor: color }}
              />
            )}
            <span className="text-sm">{value}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegend.displayName = "ChartLegend";

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<
      {
        payload?: {
          value: string;
          color: string;
          id: string;
          type: "line" | "square" | "rect" | "circle" | "cross" | "diamond" | "star" | "triangle" | "wye";
        }[];
        verticalAlign?: "top" | "middle" | "bottom";
      },
      "payload" | "verticalAlign"
    > & {
      hideIcon?: boolean;
    }
>(({ className, payload, ...props }, ref) => {
  return (
    <ChartLegend
      ref={ref}
      className={cn("flex flex-wrap justify-center", className)}
      payload={payload}
      {...props}
    />
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

// endregion

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
};