"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import Dashboard from "@/components/dashboard";
import HistoricoView from "@/components/historico-view";
import PrediccionesView from "@/components/predicciones-view";
import AnalisisView from "@/components/analisis-view";
import { useAppStore } from "@/lib/store";

type TabType = "dashboard" | "historico" | "predicciones" | "analisis";

export default function Home() {
  const { activeTab, setActiveTab } = useAppStore();

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: BarChart3 },
    { id: "historico" as TabType, label: "Histórico", icon: TrendingUp },
    { id: "predicciones" as TabType, label: "Predicciones", icon: Sparkles },
    { id: "analisis" as TabType, label: "Análisis", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="border-b bg-card backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl lg:text-3xl font-bold">EP</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="border-b bg-card backdrop-blur-sm">
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-blue-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "historico" && <HistoricoView />}
            {activeTab === "predicciones" && <PrediccionesView />}
            {activeTab === "analisis" && <AnalisisView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
