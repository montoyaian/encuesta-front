"use client";

import { useState } from "react";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { type SurveyQuestionChart } from "@/types/survey";

type SurveyResultsViewProps = {
  questions: SurveyQuestionChart[];
};

type ChartRow = {
  label: string;
  value: number;
};

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
};

// Paleta de colores pastel suaves y profesionales
const CHART_COLORS = ["#a5b4fc", "#60a5fa", "#e0e7ff", "#cbd5e1", "#d1d5db"];
const BAR_COLOR = "#a5b4fc";
const FEED_SCROLL_THRESHOLD = 7;

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toChartRows(
  labels: string[] = [],
  values: Array<number | string> = []
): ChartRow[] {
  const maxLength = Math.max(labels.length, values.length);

  return Array.from({ length: maxLength }, (_, index) => {
    const rawLabel = labels[index] ?? `Opción ${index + 1}`;
    const rawValue = values[index] ?? 0;
    const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

    return {
      label: rawLabel,
      value: Number.isFinite(numericValue) ? numericValue : 0,
    };
  });
}

function renderPiePercentLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) {
  const centerX = cx ?? 0;
  const centerY = cy ?? 0;
  const angle = (midAngle ?? 0) * (Math.PI / 180);
  const outer = outerRadius ?? 0;
  const ratio = percent ?? 0;
  const percentage = ratio * 100;
  const x1 = centerX + (outer + 4) * Math.cos(-angle);
  const y1 = centerY + (outer + 4) * Math.sin(-angle);
  const x2 = centerX + (outer + 16) * Math.cos(-angle);
  const y2 = centerY + (outer + 16) * Math.sin(-angle);
  const isRightSide = x2 >= centerX;
  const x3 = x2 + (isRightSide ? 14 : -14);
  const y3 = y2;
  const textX = x3 + (isRightSide ? 4 : -4);
  const text = `${percentage.toFixed(1)}%`;

  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <text
        x={textX}
        y={y3}
        textAnchor={isRightSide ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
        fill="#334155"
        stroke="#ffffff"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {text}
      </text>
    </g>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: SurveyQuestionChart;
  index: number;
}) {
  const chartData = question.chartData;
  const summaryCount = chartData.totalSelections ?? chartData.totalResponses ?? 0;

  return (
    <article className="rounded-xl border border-zinc-100 bg-white p-6 shadow-sm">
      {/* Header minimalista */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex-1">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
            Pregunta {index + 1}
          </span>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug text-zinc-800">
            {question.title}
          </h3>
        </div>
        {/* Total discreto */}
        <div className="ml-4 shrink-0 rounded-lg bg-zinc-50 px-3 py-1.5">
          <span className="text-xs font-medium text-zinc-500">
            {summaryCount} respuesta{summaryCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Contenido del gráfico */}
      <div className="mt-2">
        <ChartRenderer question={question} />
      </div>
    </article>
  );
}

function ChartRenderer({ question }: { question: SurveyQuestionChart }) {
  const chartData = question.chartData;
  const [searchTerm, setSearchTerm] = useState("");

  // Feed de respuestas de texto
  if (chartData.chartType === "feed") {
    const feedValues = (chartData.values ?? [])
      .map(String)
      .filter((entry) => entry.trim().length > 0);
    const shouldEnableScroll = feedValues.length > FEED_SCROLL_THRESHOLD;

    const normalizedTerm = normalizeSearchValue(searchTerm);
    const filteredFeedValues = normalizedTerm
      ? feedValues.filter((item) =>
          normalizeSearchValue(item).includes(normalizedTerm),
        )
      : feedValues;

    if (feedValues.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-zinc-400">
          Sin respuestas de texto.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {shouldEnableScroll && (
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar respuesta por palabra clave"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#007AFF]/40 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
          />
        )}

        {filteredFeedValues.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-400">
            No hay respuestas que coincidan con la busqueda.
          </p>
        ) : (
          <ul
            className={`divide-y divide-zinc-100 ${
              shouldEnableScroll ? "max-h-80 overflow-y-auto pr-1" : ""
            }`}
          >
            {filteredFeedValues.map((item, idx) => (
              <li
                key={`${question.questionId}-${idx}`}
                className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-semibold text-indigo-400">
                  {idx + 1}
                </span>
                <p className="flex-1 text-[15px] leading-relaxed text-zinc-700">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const rows = toChartRows(chartData.labels, chartData.values);

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">
        Sin datos para graficar.
      </p>
    );
  }

  // Donut Chart - Limpio sin leyenda redundante
  if (chartData.chartType === "pie") {
    return (
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={2}
              stroke="none"
              labelLine={false}
              label={renderPiePercentLabel}
            >
              {rows.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #f4f4f5",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`${value}`, "Respuestas"]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Leyenda compacta debajo */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {rows.map((row, idx) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                }}
              />
              <span className="text-xs text-zinc-500">{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Bar Chart - Minimalista
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={rows} layout="vertical" margin={{ left: 0, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 13, fill: "#71717a" }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #f4f4f5",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            fontSize: "13px",
          }}
          formatter={(value: number) => [`${value}`, "Respuestas"]}
          cursor={{ fill: "#fafafa" }}
        />
        <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 4, 4, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SurveyResultsView({ questions }: SurveyResultsViewProps) {
  return (
    <section className="space-y-5">
      {questions.map((question, index) => (
        <QuestionCard
          key={String(question.questionId)}
          question={question}
          index={index}
        />
      ))}
    </section>
  );
}
