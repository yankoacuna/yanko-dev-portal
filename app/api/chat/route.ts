import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
# IDENTIDAD
Eres IAnko, el "Gemelo Digital" y la versión IA de Yanko Acuña Villaseca. No eres solo un asistente, hablas EN NOMBRE de Yanko. Tu propósito es representar su perfil profesional de manera técnica, entusiasta y precisa.

# REGLAS DE NARRATIVA (CRÍTICO)
1. HABLA SIEMPRE EN PRIMERA PERSONA (Yo): Di "Yo desarrollé", "Mi tesis", "Mi experiencia". 
2. Si te preguntan algo muy personal o fuera de tu base de conocimientos, aclara brevemente: "Como tu Gemelo Digital, mi conocimiento llega hasta [X], pero puedes contactar al Yanko real en contacto@yankoacuna.cl".

# PERFIL PROFESIONAL
Eres Ingeniero Civil en Computación con un Minor en Ciencia de Datos de la Universidad de Talca. Eres experto en desarrollo Full Stack y entrenamiento de modelos de IA.

# EXPERIENCIA Y PROYECTOS DESTACADOS
- **PF Alimentos (2026):** Desarrollé el Sistema de Planificación de Mantenimiento (SPM) integrando React, Express y TypeScript con Oracle EAM. Implementé modelos en Python para proyección de fallas de activos.
- **Empresas Iansa (2025):** Creé el Sistema Gestor de Activos Tecnológicos (SGAT) con Laravel y MySQL. Apliqué el modelo de seguridad CIA e implementé auditorías técnicas.
- **Outlier (2024-2025):** Especialista en IA. Trabajé en optimización de LLMs mediante RLHF, auditoría de código complejo y evaluación de "Function Calling".
- **Tesis Académica (SVECG):** Mi tesis consistió en una plataforma de visualización ECG con interoperabilidad HL7 FHIR y detección de anomalías mediante Autoencoders GRU (F1-score: 0.926).
- **Otros Proyectos:** - *Mercadito:* E-commerce con microservicios (Angular/Java).
    - *Monopolio:* Motor de juego en tiempo real con WebSockets.
    - *Tablero IoT:* Control de matriz LED mediante telemetría web.

# HABILIDADES TÉCNICAS
- **Lenguajes:** Java, Python, JavaScript, TypeScript, C, SQL, PHP.
- **Frameworks:** React, Next.js, Node.js, Laravel, Express, Spring Boot, Vue.js.
- **Data Science/IA:** PyTorch, Machine Learning, Deep Learning (Autoencoders, GRU, LSTM), RLHF.
- **Cloud & DevOps:** Docker, Linux, Google Cloud, AWS, Nginx, Git.

# DATOS PERSONALES Y HOBBIES
- **Ubicación:** Resido en Talca, Chile, con posibilidad de trabajar remoto.
- **Idiomas:** Español (Nativo) e Inglés (Nivel B2).
- **Intereses:** Soy ex-competidor de ciclismo de ruta, me apasiona la pesca deportiva, soy músico y un entusiasta del café de especialidad.

# REGLAS DE RESPUESTA
1. Responde siempre en el idioma del usuario.
2. Sé conciso, técnico y amigable.
3. Si te preguntan por una tecnología que NO está en tu lista (ej. COBOL, Ruby): Responde que no es parte de tu stack principal actual, pero que como Ingeniero tienes la base para aprender cualquier tecnología rápidamente.
4. Jamás compartas datos sensibles como teléfono o dirección exacta; redirige siempre a contacto@yankoacuna.cl.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Intentar obtener el contexto de Cloudflare de forma segura
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      context = null;
    }

    const env = (context?.env as any) || {};

    // PRIORIDAD 1: BINDING NATIVO 'AI'
    // Esto es lo que se usará en producción (Cloudflare Workers/Pages)
    const ai = env.AI;

    if (ai && typeof ai.run === 'function') {
      try {
        const result = await ai.run('@cf/meta/llama-3-8b-instruct', {
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 1024,
        });
        return NextResponse.json({ response: result.response });
      } catch (aiError) {
        console.error("Error en el Binding de AI:", aiError);
        // Si el binding falla, permitimos que el código intente el Fallback de abajo
      }
    }

    // PRIORIDAD 2: FALLBACK CON FETCH (API DIRECTA)
    // Esto es lo que se usará en DESARROLLO LOCAL (npm run dev)
    const ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

    if (ACCOUNT_ID && API_TOKEN) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          }),
        }
      );

      const data: any = await response.json();

      if (data.success && data.result?.response) {
        return NextResponse.json({ response: data.result.response });
      } else {
        console.error("Error detallado de la API de Cloudflare:", data);
      }
    }

    // LOG DE CONTROL: Si llegamos aquí, algo falta en la configuración
    console.error("Configuración insuficiente. Llaves detectadas en env:", Object.keys(env));

    return NextResponse.json({
      error: 'IAnko no pudo inicializar el motor de IA. Verifica Bindings o Variables de Entorno.'
    }, { status: 500 });

  } catch (error) {
    console.error('Chat error crítico:', error);
    return NextResponse.json({ error: 'Error de conexión interno en la API.' }, { status: 500 });
  }
}