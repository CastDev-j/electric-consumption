"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIInsightsProps {
  data: any;
  prompt: string;
  title?: string;
}

export function AIInsights({
  data,
  prompt,
  title = "Análisis con IA",
}: AIInsightsProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const analyzeData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, data }),
      });

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error("[v0] Error al obtener análisis:", error);
      setAnalysis(
        "Error al obtener el análisis. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    const { pdf, Document, Page, Text, View, StyleSheet } = await import(
      "@react-pdf/renderer"
    );

    // Limpiar markdown del texto
    const cleanText = analysis
      .replace(/^#{1,6}\s+/gm, "") // Eliminar encabezados markdown
      .replace(/\*\*(.*?)\*\*/g, "$1") // Eliminar negritas
      .replace(/\*(.*?)\*/g, "$1") // Eliminar cursivas
      .replace(/`(.*?)`/g, "$1") // Eliminar código inline
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Eliminar enlaces, dejar solo el texto
      .replace(/^[-*+]\s+/gm, "• ") // Convertir listas a bullets
      .replace(/^\d+\.\s+/gm, "• ") // Convertir listas numeradas a bullets
      .replace(/^>\s+/gm, "") // Eliminar citas
      .replace(/^---+$/gm, "") // Eliminar separadores ---
      .replace(/^===+$/gm, "") // Eliminar separadores ===
      .replace(/^___+$/gm, "") // Eliminar separadores ___
      .replace(/\*\*\*/g, "") // Eliminar *** (separadores)
      .replace(/^\s*\n{3,}/gm, "\n\n") // Limitar saltos de línea múltiples
      .trim();

    const styles = StyleSheet.create({
      page: {
        padding: 72,
        fontFamily: "Times-Roman",
        fontSize: 11,
        lineHeight: 1.6,
      },
      title: {
        fontSize: 16,
        fontFamily: "Times-Bold",
        marginBottom: 20,
        textAlign: "center",
      },
      author: {
        fontSize: 11,
        fontFamily: "Times-Italic",
        marginBottom: 6,
        textAlign: "center",
      },
      institution: {
        fontSize: 10,
        marginBottom: 4,
        textAlign: "center",
        color: "#333",
      },
      date: {
        fontSize: 10,
        marginBottom: 30,
        textAlign: "center",
        color: "#666",
      },
      sectionTitle: {
        fontSize: 12,
        fontFamily: "Times-Bold",
        marginBottom: 10,
        marginTop: 20,
      },
      content: {
        fontSize: 11,
        textAlign: "justify",
        lineHeight: 1.6,
      },
    });

    const MyDocument = (
      <Document>
        <Page size="LETTER" style={styles.page}>
          <Text style={styles.title}>Análisis de Consumo Eléctrico</Text>
          <Text style={styles.author}>Andrés Castillo Jiménez</Text>
          <Text style={styles.institution}>
            Instituto Tecnológico de Celaya
          </Text>
          <Text style={styles.institution}>
            Ingeniería en Sistemas Computacionales
          </Text>
          <Text style={styles.institution}>Materia: Principios Eléctricos</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.sectionTitle}>Abstract</Text>
          <Text style={styles.content}>{cleanText}</Text>
        </Page>
      </Document>
    );

    const blob = await pdf(MyDocument).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analisis-consumo-${new Date().getTime()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card/50 p-4 lg:p-5 rounded border border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-blue-600" />
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis inteligente generado por Gemini AI
          </p>
        </div>
        <Button onClick={analyzeData} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Analizando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analizar con IA
            </>
          )}
        </Button>
      </div>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card p-6 rounded border border-border text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-sm text-muted-foreground">
            Analizando tus datos con inteligencia artificial...
          </p>
        </motion.div>
      )}
      {!loading && analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-card border border-border p-5 lg:p-6 rounded">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-base">Resultados del Análisis</h4>
              </div>
              <Button onClick={exportToPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-3 mt-4 text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold mb-2 mt-3 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold mb-2 mt-3 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed text-foreground">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-3 space-y-1 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-3 space-y-1 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-foreground">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-border pl-4 italic my-3 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
      {!loading && !analysis && (
        <div className="bg-card p-6 rounded border border-dashed border-border text-center">
          <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Haz clic en "Analizar con IA" para obtener insights inteligentes
            sobre tus datos de consumo
          </p>
        </div>
      )}
    </div>
  );
}
