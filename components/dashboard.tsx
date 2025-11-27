"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AIInsights } from "@/components/ai-insights";
import { DataInputForm } from "@/components/data-input-form";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const consumoData = useAppStore((state) => state.consumoData);
  const deleteConsumoData = useAppStore((state) => state.deleteConsumoData);
  const setConsumoData = useAppStore((state) => state.setConsumoData);
  const [hydrated, setHydrated] = React.useState(false);

  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editData, setEditData] = React.useState({
    mes: "",
    consumo: 0,
    costo: 0,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const monthlyData = React.useMemo(() => consumoData, [consumoData]);
  const totalPages = React.useMemo(
    () => Math.ceil(monthlyData.length / itemsPerPage),
    [monthlyData.length]
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = React.useMemo(
    () => monthlyData.slice(startIndex, endIndex),
    [monthlyData, startIndex, endIndex]
  );

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  if (!hydrated) {
    return null;
  }

  if (monthlyData.length === 0) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <DataInputForm />
        </motion.div>
        <div className="bg-blue-600/5 p-4 rounded border border-blue-600/20 text-center max-w-2xl mx-auto">
          <Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-sm text-muted-foreground">
            Ingresa tus datos de consumo usando el formulario de arriba para
            comenzar el análisis.
          </p>
        </div>
      </motion.div>
    );
  }

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const avgConsumo =
    monthlyData.reduce((acc, curr) => acc + curr.consumo, 0) /
    monthlyData.length;

  const consumoChange = previousMonth
    ? (
        ((currentMonth.consumo - previousMonth.consumo) /
          previousMonth.consumo) *
        100
      ).toFixed(1)
    : "0";
  const costoChange = previousMonth
    ? (
        ((currentMonth.costo - previousMonth.costo) / previousMonth.costo) *
        100
      ).toFixed(1)
    : "0";

  const stats = [
    {
      label: "Consumo Actual",
      value: `${currentMonth.consumo} kWh`,
      description: "Último mes registrado",
      change: `${consumoChange}%`,
      trend: Number.parseFloat(consumoChange) > 0 ? "up" : "down",
      icon: Zap,
      color: "text-blue-600",
    },
    {
      label: "Costo Mensual",
      value: `$${currentMonth.costo}`,
      description: "Gasto del último mes",
      change: `${costoChange}%`,
      trend: Number.parseFloat(costoChange) > 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-orange-500",
    },
    {
      label: "Predicción Próximo Mes",
      value: `${Math.round(currentMonth.consumo * 1.105)} kWh`,
      description: "Estimación basada en tendencia",
      change: "+10.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-red-500",
    },
    {
      label: "Ahorro Potencial",
      value: `$${Math.round((currentMonth.consumo - avgConsumo) * 4)}`,
      description: "Reduciendo al promedio histórico",
      change: "vs promedio",
      trend: "down",
      icon: Lightbulb,
      color: "text-blue-600",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <DataInputForm />
      </motion.div>

      <motion.div variants={item}>
        <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base lg:text-lg font-bold">
              Datos Registrados
            </h3>
            <p className="text-xs text-muted-foreground">
              {monthlyData.length} registro{monthlyData.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-xs font-semibold">Mes</th>
                  <th className="text-left p-2 text-xs font-semibold">
                    Consumo (kWh)
                  </th>
                  <th className="text-left p-2 text-xs font-semibold">
                    Costo ($)
                  </th>
                  <th className="text-right p-2 text-xs font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((data, index) => {
                  const globalIndex = startIndex + index;
                  const isEditing = editingIndex === globalIndex;

                  return (
                    <tr
                      key={globalIndex}
                      className="border-b border-border/50 text-sm"
                    >
                      {isEditing ? (
                        <>
                          <td className="p-2">
                            <Input
                              value={editData.mes}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  mes: e.target.value,
                                })
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={editData.consumo}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  consumo: parseFloat(e.target.value),
                                })
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={editData.costo}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  costo: parseFloat(e.target.value),
                                })
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newData = [...monthlyData];
                                  newData[globalIndex] = editData;
                                  setConsumoData(newData);
                                  setEditingIndex(null);
                                }}
                                className="h-7 text-xs text-green-600 hover:text-green-700"
                              >
                                Guardar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingIndex(null)}
                                className="h-7 text-xs"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2">{data.mes}</td>
                          <td className="p-2">{data.consumo}</td>
                          <td className="p-2">{data.costo}</td>
                          <td className="p-2">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingIndex(globalIndex);
                                  setEditData(data);
                                }}
                                className="h-7 text-xs text-blue-600 hover:text-blue-700"
                              >
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteConsumoData(globalIndex)}
                                className="h-7 text-xs text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 text-xs"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 text-xs"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={item}>
              <div className="bg-card/50 p-4 rounded border border-border/50 hover:border-primary/30 transition-colors h-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {stat.description}
                  </p>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      stat.trend === "up" ? "text-red-500" : "text-blue-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <motion.div variants={item}>
          <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
            <h3 className="text-lg font-bold mb-1">Tendencia de Consumo</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Histórico de kilowatts hora (kWh) consumidos por mes
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={monthlyData}
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
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                    formatter={(value: number) => [`${value} kWh`, "Consumo"]}
                  />

                  <Line
                    type="monotone"
                    dataKey="consumo"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
            <h3 className="text-lg font-bold mb-1">Costos Mensuales</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Gasto en pesos mexicanos por cada periodo
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={monthlyData}
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
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
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
                    formatter={(value: number) => [`$${value}`, "Costo"]}
                  />
                  <Bar dataKey="costo" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <AIInsights
          data={monthlyData}
          prompt="Analiza estos datos de consumo eléctrico y dame recomendaciones específicas para reducir costos"
          title="Análisis con IA - Gemini"
        />
      </motion.div>

      <motion.div variants={item}>
        <div className="bg-orange-500/10 p-4 rounded border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-orange-500">
              Alerta de Consumo
            </h3>
          </div>
          <p className="text-xs lg:text-sm">
            Tu consumo actual está un{" "}
            <strong className="text-orange-500">{consumoChange}%</strong>{" "}
            respecto al mes anterior.
            {Number.parseFloat(consumoChange) > 10 &&
              " Considera revisar el uso de electrodomésticos de alto consumo."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
