"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppStore } from "@/lib/store";

const defaultDailyData = Array.from({ length: 30 }, (_, i) => ({
  dia: i + 1,
  consumo: Math.floor(Math.random() * 15) + 8,
}));

export default function HistoricoView() {
  const consumoData = useAppStore((state) => state.consumoData);
  const hasData = consumoData.length > 0;

  const [period, setPeriod] = React.useState<"mes" | "trimestre" | "año">(
    "mes"
  );
  const [filterType, setFilterType] = React.useState<"todos" | "alto" | "bajo">(
    "todos"
  );
  const [showPeriodMenu, setShowPeriodMenu] = React.useState(false);
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

  const dailyData = defaultDailyData;
  const avgDaily =
    dailyData.reduce((acc, curr) => acc + curr.consumo, 0) / dailyData.length;
  const maxDay = Math.max(...dailyData.map((d) => d.consumo));
  const minDay = Math.min(...dailyData.map((d) => d.consumo));

  const filteredData = React.useMemo(() => {
    let data = [...dailyData];

    if (filterType === "alto") {
      data = data.filter((d) => d.consumo > avgDaily);
    } else if (filterType === "bajo") {
      data = data.filter((d) => d.consumo <= avgDaily);
    }

    if (period === "trimestre") {
      data = data.slice(0, 15);
    } else if (period === "mes") {
      data = data.slice(0, 30);
    }

    return data;
  }, [period, filterType, avgDaily]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Consumo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualiza tus patrones de consumo a través del tiempo
          </p>
        </div>
        <div className="flex gap-2 relative">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPeriodMenu(!showPeriodMenu);
                setShowFilterMenu(false);
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {period === "mes"
                ? "Mes"
                : period === "trimestre"
                ? "Trimestre"
                : "Año"}
            </Button>
            {showPeriodMenu && (
              <div className="absolute top-full mt-2 right-0 bg-popover border border-border rounded z-10 min-w-[140px]">
                <button
                  onClick={() => {
                    setPeriod("mes");
                    setShowPeriodMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Último Mes
                </button>
                <button
                  onClick={() => {
                    setPeriod("trimestre");
                    setShowPeriodMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Trimestre
                </button>
                <button
                  onClick={() => {
                    setPeriod("año");
                    setShowPeriodMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Año Completo
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowPeriodMenu(false);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              {filterType === "todos"
                ? "Todos"
                : filterType === "alto"
                ? "Alto"
                : "Bajo"}
            </Button>
            {showFilterMenu && (
              <div className="absolute top-full mt-2 right-0 bg-popover border border-border rounded z-10 min-w-[140px]">
                <button
                  onClick={() => {
                    setFilterType("todos");
                    setShowFilterMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Todos
                </button>
                <button
                  onClick={() => {
                    setFilterType("alto");
                    setShowFilterMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Consumo Alto
                </button>
                <button
                  onClick={() => {
                    setFilterType("bajo");
                    setShowFilterMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Consumo Bajo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hasData && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="bg-blue-600/5 p-4 rounded border border-blue-600/20 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold text-blue-600">
                Datos de ejemplo
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Estos son datos simulados. Ingresa tus propios datos desde el
              Dashboard para ver tu consumo real.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
          <h3 className="text-base lg:text-lg font-semibold mb-2">
            Consumo Diario - Junio 2024
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Kilowatts hora (kWh) consumidos cada día del mes
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={filteredData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="dia"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--popover-foreground))",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
                labelStyle={{
                  color: "hsl(var(--popover-foreground))",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              />
              <Area
                type="monotone"
                dataKey="consumo"
                stroke="#2563eb"
                strokeWidth={2}
                fill="#2563eb"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {[
          {
            label: "Promedio Diario",
            value: `${avgDaily.toFixed(1)} kWh`,
            desc: "Consumo medio por día",
          },
          {
            label: "Día Máximo",
            value: `${maxDay} kWh`,
            desc: "Pico más alto registrado",
          },
          {
            label: "Día Mínimo",
            value: `${minDay} kWh`,
            desc: "Consumo más bajo del periodo",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <div className="bg-card/50 p-4 rounded border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
              <div className="text-2xl lg:text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
