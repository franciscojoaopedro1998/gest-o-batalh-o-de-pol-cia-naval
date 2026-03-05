
import { GoogleGenAI } from "@google/genai";
import { Militar } from "./types";

/**
 * Generates strategic insights for naval troop management using Gemini.
 * Follows strict @google/genai SDK guidelines.
 */
export async function getTroopInsights(militares: Militar[]) {
  if (!process.env.API_KEY) return "Integração AI pendente: Chave de API não detectada.";

  // Create a new instance right before making the call as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const activeCount = militares.filter(m => m.situacao === 'Ativo').length;
  const missionCount = militares.filter(m => m.situacao === 'Em Missão').length;
  const summary = militares.slice(0, 10).map(m => `- ${m.nome} (${m.patente}): ${m.situacao}`).join("\n");
  
  const prompt = `
    Como um analista estratégico do Batalhão de Polícia Naval (Marinha de Guerra), avalie o status atual do efetivo:
    
    ESTATÍSTICAS RÁPIDAS:
    - Total de Militares: ${militares.length}
    - Prontos (Ativos): ${activeCount}
    - Em Missão: ${missionCount}
    
    AMOSTRA DO EFETIVO:
    ${summary}
    
    FORNEÇA:
    1. Uma análise breve da prontidão operacional.
    2. Uma recomendação de gestão para manter o moral ou a eficiência.
    3. Seja direto, profissional e use terminologia naval angolana. 
    (Máximo 100 palavras)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    if (!response.text) {
      throw new Error("Resposta vazia do modelo.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Fallback message for specific RPC/XHR errors often found in proxy environments
    if (error?.message?.includes('xhr error') || error?.message?.includes('ProxyUnaryCall')) {
      return "O sistema de inteligência estratégica está temporariamente indisponível devido a uma oscilação na rede de comando. Por favor, verifique a conectividade da base.";
    }
    
    return "Relatório de inteligência suspenso por erro técnico nos servidores centrais.";
  }
}
