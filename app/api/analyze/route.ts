import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt, data } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `
Eres un experto en análisis de consumo eléctrico.

Analiza los siguientes datos de consumo mensual:
${JSON.stringify(data, null, 2)}

${prompt}

Instrucciones importantes:
- Escribe en español de forma clara y directa
- No uses títulos como "Resumen Ejecutivo:", "Análisis:", etc.
- No uses separadores como "---" o "===" 
- Presenta la información de manera fluida y natural
- Usa listas con viñetas cuando sea apropiado
- Incluye datos numéricos específicos del análisis
- Proporciona recomendaciones concretas y accionables
- Mantén un tono profesional pero accesible
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("Error al analizar con Gemini:", error);
    return NextResponse.json(
      { error: "Error al procesar el análisis" },
      { status: 500 }
    );
  }
}
