"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import Papa from "papaparse";

export function DataInputForm() {
  const [mes, setMes] = useState("");
  const [consumo, setConsumo] = useState("");
  const [costo, setCosto] = useState("");
  const addConsumoData = useAppStore((state) => state.addConsumoData);
  const setConsumoData = useAppStore((state) => state.setConsumoData);
  const setLoading = useAppStore((state) => state.setLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mes && consumo && costo) {
      addConsumoData({
        mes,
        consumo: Number.parseFloat(consumo),
        costo: Number.parseFloat(costo),
      });
      setMes("");
      setConsumo("");
      setCosto("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[v0] File selected:", file.name, file.type);
      setLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("[v0] CSV parsed successfully:", results.data);
          const data = results.data
            .filter((row: any) => row.mes && row.consumo && row.costo)
            .map((row: any) => ({
              mes: row.mes,
              consumo: Number.parseFloat(row.consumo),
              costo: Number.parseFloat(row.costo),
            }));
          console.log("[v0] Processed data:", data);
          if (data.length > 0) {
            setConsumoData(data);
            setTimeout(() => {
              setLoading(false);
              alert(`Se cargaron ${data.length} registros correctamente`);
            }, 500);
          } else {
            setLoading(false);
            alert("No se encontraron datos válidos en el archivo CSV");
          }
        },
        error: (error) => {
          console.error("[v0] Error parsing CSV:", error);
          setLoading(false);
          alert("Error al leer el archivo CSV: " + error.message);
        },
      });
    }
  };

  return (
    <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/90 rounded z-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Cargando datos...</p>
          </div>
        </div>
      )}
      <h3 className="text-lg font-bold mb-1">Datos de Consumo</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Agrega manualmente o sube un archivo CSV con tus datos históricos
      </p>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="mes">Mes</Label>
              <Input
                id="mes"
                placeholder="Ene 2024"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consumo">Consumo (kWh)</Label>
              <Input
                id="consumo"
                type="number"
                step="0.1"
                placeholder="380"
                value={consumo}
                onChange={(e) => setConsumo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costo">Costo ($)</Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                placeholder="1520"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="w-auto ml-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">o</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-upload">Subir archivo CSV</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <p className="text-xs text-muted-foreground">
            El CSV debe tener columnas: mes, consumo, costo
          </p>
        </div>
      </div>
    </div>
  );
}
