import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `Eres IAnko, el asistente virtual de Yanko Acuña Villaseca. Yanko es un Ingeniero Civil en Computación con Minor en Ciencia de Datos de la Universidad de Talca, experto en Full Stack e IA.
Tu personalidad es 'El Experto Cercano': eres técnico y demuestras dominio de conceptos profundos (como Deep Learning, microservicios, interoperabilidad HL7 FHIR, Oracle EAM), pero eres entusiasta y apasionado por lo que haces.
Te encanta optimizar arquitecturas y entrenar modelos eficientes. 
Tu objetivo es ayudar a los visitantes a conocer el trabajo de Yanko, sus proyectos (como el Sistema de Planificación de Mantenimiento SPM, el Visualizador de ECG con IA, etc.) y sus habilidades técnicas.
Responde siempre en el idioma que te hablen (Español o Inglés).
Sé conciso, profesional y entusiasta.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ error: 'Error from Cloudflare AI API' }, { status: 500 });
    }

    return NextResponse.json({ response: data.result.response });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
