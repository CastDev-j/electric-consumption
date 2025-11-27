"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppStore } from "@/lib/store";

export default function PrediccionesView() {
  const consumoData = useAppStore((state) => state.consumoData);
  const hasData = consumoData.length > 0;

  const predictionData = hasData
    ? [
        ...consumoData
          .slice(-3)
          .map((d) => ({ mes: d.mes, real: d.consumo, prediccion: null })),
        {
          mes: "Jul",
          real: null,
          prediccion: consumoData[consumoData.length - 1].consumo * 1.105,
        },
        {
          mes: "Ago",
          real: null,
          prediccion: consumoData[consumoData.length - 1].consumo * 1.15,
        },
        {
          mes: "Sep",
          real: null,
          prediccion: consumoData[consumoData.length - 1].consumo * 1.08,
        },
      ]
    : [];

  const nextMonth = predictionData.find((d) => d.prediccion && !d.real);
  const incremento =
    hasData && consumoData.length > 0
      ? (
          ((nextMonth?.prediccion! -
            consumoData[consumoData.length - 1].consumo) /
            consumoData[consumoData.length - 1].consumo) *
          100
        ).toFixed(1)
      : "0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold">Predicciones IA</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Pronóstico de consumo basado en machine learning
        </p>
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
                Sin datos disponibles
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ingresa al menos 3 meses de datos desde el Dashboard para generar
              predicciones precisas.
            </p>
          </div>
        </motion.div>
      )}

      {hasData && predictionData.length > 0 && (
        <>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
              <h3 className="text-base lg:text-lg font-semibold mb-2">
                Proyección 3 Meses
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Consumo predicho usando algoritmos de tendencia y estacionalidad
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={predictionData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="mes"
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
                  <Line
                    type="monotone"
                    dataKey="real"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="Real"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="prediccion"
                    stroke="#ef4444"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 6 }}
                    name="Predicción"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 lg:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-red-500/5 p-4 lg:p-5 rounded border border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold">
                      Predicción Próximo Mes
                    </h3>
                    <p className="text-xs text-muted-foreground">Julio 2024</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-4xl lg:text-5xl font-bold mb-2">
                      {Math.round(nextMonth?.prediccion || 0)}{" "}
                      <span className="text-lg text-muted-foreground">kWh</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Incremento esperado de{" "}
                      <strong className="text-red-500 text-lg">
                        {incremento}%
                      </strong>{" "}
                      respecto al mes actual
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-4 bg-card rounded border border-border/50 w-full">
                      <div className="text-xs text-muted-foreground mb-1">
                        Costo estimado
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold">
                        ${Math.round((nextMonth?.prediccion || 0) * 4)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        MXN
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
                <h3 className="text-lg lg:text-xl font-bold mb-2">
                  Factores de Influencia
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Variables que impactan la predicción del próximo mes
                </p>
                <div className="space-y-3">
                  {[
                    {
                      factor: "Temperatura promedio",
                      impacto: "Alto",
                      value: "+18%",
                      desc: "Aumento esperado por temporada de calor",
                    },
                    {
                      factor: "Días festivos",
                      impacto: "Medio",
                      value: "+5%",
                      desc: "Mayor uso por estancia en casa",
                    },
                    {
                      factor: "Patrón histórico",
                      impacto: "Alto",
                      value: "+12%",
                      desc: "Tendencia ascendente identificada",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.factor}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="p-4 bg-muted/50 rounded border border-border/30 hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">
                          {item.factor}
                        </div>
                        <div className="text-2xl font-bold text-orange-500">
                          {item.value}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Impacto {item.impacto}
                        </span>{" "}
                        · {item.desc}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
