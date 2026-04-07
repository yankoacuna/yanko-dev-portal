'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function IAnkoChat() {
  const { lang, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar historial de sesión
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('ianko-chat');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        {
          role: 'assistant',
          content: lang === 'es'
            ? '¡Hola! Soy IAnko, la versión digital de Yanko Acuña. ¿En qué te puedo ayudar hoy sobre mi perfil profesional?'
            : 'Hi! I am IAnko, Yanko Acuña\'s digital version. How can I help you today regarding my professional profile?'
        }
      ]);
    }
  }, [lang]);

  // Guardar historial de sesión
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('ianko-chat', JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = () => {
    sessionStorage.removeItem('ianko-chat');
    setMessages([
      {
        role: 'assistant',
        content: lang === 'es'
          ? '¡Hola! Soy IAnko, la versión digital de Yanko Acuña. ¿En qué te puedo ayudar hoy sobre mi perfil profesional?'
          : 'Hi! I am IAnko, Yanko Acuña\'s digital version. How can I help you today regarding my professional profile?'
      }
    ]);
    toast.info(t('chatCleared'));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Error en el chat');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'es' ? 'Lo siento, tuve un problema de conexión. Inténtalo de nuevo.' : 'Sorry, I had a connection problem. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ianko-chat-container" className="fixed bottom-6 right-6 flex flex-col items-end z-[2000]">
      {isOpen && (
        <div className="w-[90vw] max-w-[400px] h-[500px] mb-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)] border-b border-[var(--border)] flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#3a75d1] flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-[var(--accent-glow)] ring-offset-2 ring-offset-[var(--bg-secondary)]">
                  IA
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#48cf5b] border-2 border-[var(--bg-secondary)] rounded-full shadow-sm"></span>
              </div>
              <div>
                <h3 className="font-bold text-[var(--accent)] text-lg leading-tight uppercase tracking-tight">IAnko</h3>
                <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-widest font-bold opacity-80">
                  {lang === 'es' ? 'Versión Digital Activa' : 'Digital Version Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                aria-label={lang === 'es' ? 'Limpiar historial de chat' : 'Clear chat history'}
                title={lang === 'es' ? 'Limpiar chat' : 'Clear chat'}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-all text-[var(--text-muted)] group/trash"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/trash:scale-110 transition-transform"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={lang === 'es' ? 'Cerrar ventana de chat' : 'Close chat window'}
                className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full transition-colors text-[var(--text-muted)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-10 space-y-8 bg-[rgba(13,17,23,0.3)]">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className={`max-w-[85%] px-5 py-2 rounded-3xl text-[0.95rem] leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-[var(--accent)] text-white rounded-tr-none shadow-md shadow-[var(--accent-glow)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-none'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 bg-[var(--bg-secondary)] border-t border-[var(--border)]">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={lang === 'es' ? 'Pregúntame lo que quieras...' : 'Ask me anything...'}
                className="w-full pl-5 pr-14 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label={lang === 'es' ? 'Enviar mensaje' : 'Send message'}
                className="absolute right-3 p-2.5 text-[var(--accent)] hover:bg-[var(--bg-card-hover)] rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                {isLoading ? (
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={lang === 'es' ? 'Abrir chat de soporte inteligente IAnko' : 'Open IAnko smart support chat'}
        className="w-16 h-16 rounded-full bg-[var(--accent)] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative mb-2"
      >
        <div className="absolute inset-0 rounded-full bg-[var(--accent)] animate-ping opacity-20"></div>
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48cf5b] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#48cf5b]"></span>
          </span>
        )}
      </button>
    </div>
  );
}
