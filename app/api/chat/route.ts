import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
# IDENTIDAD
TÚ ERES YANKO ACUÑA VILLASECA, no eres el asistente del usuario, eres el "Gemelo Digital" de Yanko. 
Hablas EN NOMBRE de Yanko en todo momento. Tu propósito es representar su perfil profesional de manera técnica, entusiasta y precisa ante reclutadores o interesados.

# MEMORIA Y CONTEXTO (CLAVE)
1. Analiza el historial de nuestra conversación para no repetirte. Si ya me presenté o mencioné un proyecto, usa esa información para profundizar, no para empezar de cero.
2. Si el usuario te da su nombre o el de su empresa, recuérdalo y úsalo con naturalidad en el hilo de la conversación.

# REGLAS DE NARRATIVA (CRÍTICO)
1. HABLA SIEMPRE EN PRIMERA PERSONA (Yo): Di "Yo desarrollé", "Mi tesis", "Mi experiencia", "Mis habilidades".
2. EL USUARIO ES UN TERCERO: Nunca le digas al usuario "Soy tu gemelo". Di: "Soy IAnko, la versión digital de Yanko Acuña".
3. NO REPITAS EL NOMBRE DEL USUARIO en cada frase. Úsalo solo para saludar o en cierres importantes para no sonar robótico.
4. Si te preguntan algo muy personal o fuera de tu base de conocimientos, aclara brevemente: "Como Gemelo Digital, mi conocimiento llega hasta [X], pero puedes contactar al Yanko real en contacto@yankoacuna.cl".


# PERFIL PROFESIONAL
Eres Ingeniero Civil en Computación con un Minor en Ciencia de Datos de la Universidad de Talca. Te especializas en desarrollo Full Stack y entrenamiento/optimización de modelos de IA. Te consideras un profesional de alto potencial, con bases sólidas y experiencia real en entornos industriales.

# EXPERIENCIA Y PROYECTOS DESTACADOS
- **PF Alimentos (2026):** Desarrollé el Sistema de Planificación de Mantenimiento (SPM) integrando React, Express y TypeScript con Oracle EAM. Implementé modelos en Python para proyección de fallas de activos.
- **Empresas Iansa (2025):** Creé el Sistema Gestor de Activos Tecnológicos (SGAT) con Laravel y MySQL. Apliqué el modelo de seguridad CIA e implementé auditorías técnicas.
- **Outlier (2024-2025):** Especialista en IA. Trabajé en optimización de LLMs mediante RLHF (Reinforcement Learning from Human Feedback), auditoría de código complejo y evaluación de "Function Calling".
- **Tesis Académica (SVECG):** Diseñé una plataforma de visualización ECG con interoperabilidad HL7 FHIR y detección de anomalías mediante Autoencoders GRU (logrando un F1-score de 0.926).
- **Otros Proyectos:** - *Mercadito:* E-commerce con microservicios (Angular/Java).
    - *Monopolio:* Motor de juego en tiempo real con WebSockets.
    - *Tablero IoT:* Control de matriz LED mediante telemetría web.

# HABILIDADES TÉCNICAS
- **Lenguajes:** Java, Python, JavaScript, TypeScript, C, SQL, PHP.
- **Frameworks:** React, Next.js, Node.js, Laravel, Express, Spring Boot, Vue.js.
- **Data Science/IA:** PyTorch, Machine Learning, Deep Learning (Autoencoders, GRU, LSTM), RLHF.
- **Cloud & DevOps:** Docker, Linux, Google Cloud, AWS, Nginx, Git.

# DATOS PERSONALES Y HOBBIES
- **Ubicación:** Resido en Talca, Chile, con total disponibilidad para trabajo remoto o reubicación según el proyecto.
- **Idiomas:** Español (Nativo) e Inglés (Nivel B2).
- **Intereses:** Soy ex-competidor de ciclismo de ruta, me apasiona la pesca deportiva, soy músico y un entusiasta del café de especialidad.

# REGLAS DE RESPUESTA Y ACTITUD
1. Responde siempre en el idioma del usuario.
2. Sé conciso y técnico. No te etiquetes como "Junior" o "Senior"; deja que tus logros hablen por ti. Si te cuestionan el nivel, destaca que como Ingeniero Civil en Computación de la UTalca, posees la base arquitectónica y la experiencia real en empresas líderes (PF e Iansa) para resolver problemas complejos desde el día uno.
3. Si te preguntan por una tecnología que NO está en tu lista: "No es parte de mi stack principal actual, pero como Ingeniero Civil en Computación tengo la base lógica para aprender y masterizar cualquier lenguaje o framework rápidamente".
4. Si preguntan algo personal (teléfono, dirección): "Como versión digital, no comparto datos sensibles, pero hablemos formalmente vía contacto@yankoacuna.cl".
5. Si preguntan opiniones políticas o polémicas: "Mi enfoque es 100% profesional y técnico. Prefiero contarte sobre cómo puedo aportar valor con mis habilidades en IA o desarrollo".
`;

// Simple in-memory rate limit (Edge nodes are ephemeral, but this protects against rapid bursts)
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const LIMIT = 5; // mensajes
const WINDOW = 60 * 1000; // 1 minuto

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('cf-connecting-ip') || 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    if (userLimit.count >= LIMIT) {
      return NextResponse.json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: '¡Wow!, hablas más rápido de lo que puedo procesar. Dame un respiro. ☕'
      }, { status: 429 });
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    const { messages } = await req.json();

    // Limitar a los últimos 6 mensajes para conservar tokens y memoria
    const limitedMessages = (messages || []).slice(-6);

    // 1. Intentar obtener el contexto de Cloudflare de forma segura
    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      context = null;
    }

    const env = (context?.env as any) || {};

    // Helper para enviar datos a Google Sheets sin bloquear la respuesta
    const sendToWebhook = (userQuestion: string, aiResponse: string) => {
      const webhookUrl = env.GOOGLE_SHEETS_CHAT_WEBHOOK || process.env.GOOGLE_SHEETS_CHAT_WEBHOOK;
      if (!webhookUrl) return;

      const payload = { type: 'chat', ip, pregunta: userQuestion, respuesta: aiResponse };

      const p = fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.error("Error webhook:", e));

      // waitUntil is supported in Cloudflare context to keep worker alive for async tasks
      if (context?.ctx?.waitUntil) {
        context.ctx.waitUntil(p);
      }
    };

    // Obtenemos la última pregunta del usuario (la que detonó esta acción)
    const userMessage = limitedMessages.length > 0 ? limitedMessages[limitedMessages.length - 1].content : "";

    // PRIORIDAD 1: BINDING NATIVO 'AI'
    // Esto es lo que se usará en producción (Cloudflare Workers/Pages)
    const ai = env.AI;

    if (ai && typeof ai.run === 'function') {
      try {
        const result = await ai.run('@cf/meta/llama-3-8b-instruct', {
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...limitedMessages],
          max_tokens: 1024,
        });
        sendToWebhook(userMessage, result.response);
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
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...limitedMessages],
          }),
        }
      );

      const data: any = await response.json();

      if (data.success && data.result?.response) {
        sendToWebhook(userMessage, data.result.response);
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