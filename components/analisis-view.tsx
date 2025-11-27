"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function AnalisisView() {
  const consumoData = useAppStore((state) => state.consumoData);
  const hasData = consumoData.length > 0;

  const avgConsumo = hasData
    ? consumoData.reduce((acc, curr) => acc + curr.consumo, 0) /
      consumoData.length
    : 320;

  const currentConsumo = hasData
    ? consumoData[consumoData.length - 1].consumo
    : 380;
  const diferencia = (
    ((currentConsumo - avgConsumo) / avgConsumo) *
    100
  ).toFixed(2);

  const anomalies = [
    {
      fecha: "15 de Junio",
      consumo: "28.5 kWh",
      tipo: "Pico alto",
      severidad: "alta",
      descripcion: "Consumo 2.3x mayor al promedio diario del mes",
    },
    {
      fecha: "8 de Junio",
      consumo: "22.1 kWh",
      tipo: "Pico moderado",
      severidad: "media",
      descripcion: "Incremento de 80% respecto al día anterior",
    },
  ];

  const recommendations = [
    {
      titulo: "Optimiza tu aire acondicionado",
      descripcion:
        "Aumenta la temperatura 1°C para ahorrar hasta $150/mes sin sacrificar comodidad",
      ahorro: "$150",
      impacto: "alto",
      icon: Lightbulb,
    },
    {
      titulo: "Cambia a LED",
      descripcion:
        "Reemplaza 8 focos incandescentes restantes por tecnología LED de bajo consumo",
      ahorro: "$80",
      impacto: "medio",
      icon: CheckCircle,
    },
    {
      titulo: "Horario óptimo para lavadora",
      descripcion:
        "Usa la lavadora entre 10pm - 6am para aprovechar tarifa nocturna reducida",
      ahorro: "$45",
      impacto: "bajo",
      icon: Info,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-2">
        <h2 className="text-2xl font-bold">Análisis Inteligente</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Detección de anomalías y recomendaciones personalizadas con IA
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
                Análisis con datos de ejemplo
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              El análisis será más preciso y personalizado cuando ingreses tus
              datos reales desde el Dashboard.
            </p>
          </div>
        </motion.div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Anomalías Detectadas en Consumo Diario
        </h3>
        <div className="space-y-4">
          {anomalies.map((anomaly, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div
                className={`${
                  anomaly.severidad === "alta"
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-orange-500/10 border-orange-500/20"
                } p-5 lg:p-6 rounded-lg border`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold">{anomaly.fecha}</h4>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-md ${
                      anomaly.severidad === "alta"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-orange-500/20 text-orange-500"
                    }`}
                  >
                    {anomaly.tipo}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {anomaly.descripcion}
                </p>
                <div className="text-3xl font-bold">{anomaly.consumo}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          Recomendaciones Personalizadas de Ahorro
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {recommendations.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="h-full bg-blue-600/5 p-4 rounded border border-blue-600/20 hover:bg-blue-600/10 hover:border-blue-600/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 bg-blue-600/20 px-2 py-0.5 rounded">
                      {rec.impacto}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold mb-2">{rec.titulo}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.descripcion}
                  </p>
                  <div className="text-3xl font-bold text-blue-600">
                    {rec.ahorro}
                    <span className="text-base">/mes</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
          <h3 className="text-base lg:text-lg font-semibold mb-2">
            Comparación Regional
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tu consumo mensual vs promedio de la zona geográfica
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-5 bg-blue-600/5 rounded border border-blue-600/20">
              <div className="text-xs text-muted-foreground mb-2">
                Tu Consumo Actual
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600">
                {currentConsumo} kWh
              </div>
            </div>
            <div className="text-center p-5 bg-muted/50 rounded border border-border/50">
              <div className="text-xs text-muted-foreground mb-2">
                Promedio Regional
              </div>
              <div className="text-3xl lg:text-4xl font-bold">
                {Math.round(avgConsumo)} kWh
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-orange-500/5 rounded border border-orange-500/20">
            <p className="text-sm">
              Tu consumo es{" "}
              <strong className="text-orange-500">
                {Math.abs(Number.parseFloat(diferencia))}%{" "}
                {Number.parseFloat(diferencia) > 0 ? "mayor" : "menor"}
              </strong>{" "}
              al promedio.
              {Number.parseFloat(diferencia) > 0 &&
                " Implementando nuestras recomendaciones podrías reducirlo hasta el promedio regional y ahorrar significativamente."}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
