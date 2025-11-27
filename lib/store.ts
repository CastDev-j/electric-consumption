import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConsumoData {
  mes: string;
  consumo: number;
  costo: number;
}

interface AppState {
  consumoData: ConsumoData[];
  activeTab: "dashboard" | "historico" | "predicciones" | "analisis";
  isLoading: boolean;
  setConsumoData: (data: ConsumoData[]) => void;
  addConsumoData: (data: ConsumoData) => void;
  deleteConsumoData: (index: number) => void;
  setActiveTab: (
    tab: "dashboard" | "historico" | "predicciones" | "analisis"
  ) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      consumoData: [],
      activeTab: "dashboard",
      isLoading: false,
      setConsumoData: (consumoData) => set({ consumoData }),
      addConsumoData: (data) =>
        set((state) => ({ consumoData: [...state.consumoData, data] })),
      deleteConsumoData: (index) =>
        set((state) => ({
          consumoData: state.consumoData.filter((_, i) => i !== index),
        })),
      setActiveTab: (activeTab) => set({ activeTab }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "energy-predict-storage",
    }
  )
);
