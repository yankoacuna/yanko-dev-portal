import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('cf-connecting-ip') || 'IP Local / No detectada';
    const country = req.headers.get('cf-ipcountry') || 'Desconocido';
    const city = req.headers.get('cf-ipcity') || 'Desconocida';
    const userAgent = req.headers.get('user-agent') || 'Desconocido';

    let context;
    try {
      context = getRequestContext();
    } catch (e) {
      context = null;
    }

    const env = (context?.env as any) || {};
    const webhookUrl = env.GOOGLE_SHEETS_CHAT_WEBHOOK || process.env.GOOGLE_SHEETS_CHAT_WEBHOOK;
    
    if (!webhookUrl) return NextResponse.json({ success: true });

    const payload = {
      type: 'visit',
      ip,
      country,
      city,
      userAgent
    };

    const p = fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(e => console.error("Error visit webhook:", e));

    if (context?.ctx?.waitUntil) {
      context.ctx.waitUntil(p);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error processing visit' }, { status: 500 });
  }
}
