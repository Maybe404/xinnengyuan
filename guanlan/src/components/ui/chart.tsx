import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

export type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        data-slot="chart"
        className={cn(
          "[_.chart-grid]:stroke-border/70 [&_.recharts-cursor.recharts-layer-cursor]:stroke-border/50 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground/80 [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-surface]:outline-none",
          "flex aspect-video justify-center text-xs [&_.recharts-dot]:!fill-white [&_.recharts-tooltip-cursor]:stroke-white/40",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, configItem]) => configItem.theme || configItem.color
  )
  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix}[data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

// Loose prop shapes for recharts tooltip/legend content (recharts types are unstable across versions).
type TooltipPayloadItem = {
  value?: unknown
  name?: string | number
  dataKey?: string | number
  type?: string
  fill?: string
  color?: string
  unit?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  className?: string
  indicator?: "line" | "dot" | "none"
  hideLabel?: boolean
  hideIndicator?: boolean
  label?: unknown
  labelFormatter?: (label: React.ReactNode, payload: TooltipPayloadItem[]) => React.ReactNode
  labelClassName?: string
  formatter?: (
    value: unknown,
    name: string,
    item: TooltipPayloadItem,
    index: number,
    payload: unknown
  ) => React.ReactNode
  color?: string
  nameKey?: string
  labelKey?: string
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }
    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? ""}`
    const itemConfig = getPayloadConfigFromConfig(config, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [label, labelFormatter, config, hideLabel, labelClassName, payload, labelKey])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "none"

  return (
    <div
      className={cn(
        "glass-deep min-w-36 rounded-xl border-white/60 px-3 py-2 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="flex flex-col gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? ""}`
            const itemConfig = getPayloadConfigFromConfig(config, key)
            const indicatorColor = color ?? item.fill ?? item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, String(item.name), item, index, item.payload)
                ) : (
                  <>
                    <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                      <div className="flex items-center gap-1.5">
                        {!hideIndicator && (
                          <span
                            className="shrink-0 rounded-[2px]"
                            style={{
                              background: indicatorColor,
                              width: indicator === "line" ? 8 : 6,
                              height: indicator === "line" ? 2 : 6,
                            }}
                          />
                        )}
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {String(item.value ?? "")}
                        {item.unit ? ` ${item.unit}` : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromConfig(config: ChartConfig, payload: string) {
  if (typeof payload !== "string" || !config.items) {
    return (config as unknown as { [k: string]: unknown })?.[
      payload as string
    ] as ChartConfig[string] | undefined
  }
  return (config as unknown as { [k: string]: unknown })?.[
    payload as string
  ] as ChartConfig[string] | undefined
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
}

