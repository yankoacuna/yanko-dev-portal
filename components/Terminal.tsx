'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface TerminalLine {
  id: number;
  content: string;
  type: 'output' | 'input' | 'prompt';
}

export default function Terminal() {
  const { lang, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 1, type: 'output', content: 'Welcome to YankoOS v2.0.0 (Next.js Edition)' },
    { id: 2, type: 'output', content: '* System load:  0.01' },
    { id: 3, type: 'output', content: '* Usage of /:   42.0%' },
    { id: 4, type: 'output', content: ' ' },
    { id: 5, type: 'output', content: `Type <span class="cmd-focus">'help'</span> to see available commands.` },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [history, isOpen]);

  const printLine = (content: string, type: 'output' | 'input' | 'prompt' = 'output') => {
    setHistory(prev => [...prev, { id: Date.now() + Math.random(), content, type }]);
  };

  const processCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const mainCmd = args[0].toLowerCase();

    // Antihack Easter Egg detection
    const hackPatterns = [
      '<script', 'onerror', 'onclick', 'eval(', 'document.cookie',
      'SELECT ', 'UNION SELECT', 'INSERT INTO', 'DROP TABLE', 'OR 1=1'
    ];

    const isAttempt = hackPatterns.some(p => cmd.toUpperCase().includes(p.toUpperCase()));

    if (isAttempt) {
      const toasts = ['hackToast1', 'hackToast2', 'hackToast3'];
      const randomToast = toasts[Math.floor(Math.random() * toasts.length)];
      toast.error(t(randomToast as any));
      printLine(cmd, 'input');
      return;
    }

    printLine(cmd, 'input');

    switch (mainCmd) {
      case 'help':
        printLine(lang === 'es' ? 'Comandos disponibles:' : 'Available commands:');
        printLine('  <span class="cmd-focus">whoami</span>    - ' + (lang === 'es' ? 'Saber más sobre mí' : 'Learn more about me'));
        printLine('  <span class="cmd-focus">skills</span>    - ' + (lang === 'es' ? 'Lista de habilidades técnicas' : 'List my technical stack'));
        printLine('  <span class="cmd-focus">projects</span>  - ' + (lang === 'es' ? 'Mostrar proyectos destacados' : 'Show latest projects'));
        printLine('  <span class="cmd-focus">contact</span>   - ' + (lang === 'es' ? 'Información de contacto' : 'Show contact info'));
        printLine('  <span class="cmd-focus">clear</span>     - ' + (lang === 'es' ? 'Limpiar la pantalla' : 'Clear terminal screen'));
        printLine('  <span class="cmd-focus">date</span>      - ' + (lang === 'es' ? 'Fecha y hora actual' : 'Show current date/time'));
        printLine('  <span class="cmd-focus">exit</span>      - ' + (lang === 'es' ? 'Cerrar terminal' : 'Close terminal'));
        break;
      case 'whoami':
        printLine('Yanko Acuña Villaseca');
        printLine(t('heroDesc'));
        break;
      case 'skills':
        printLine('<span style="color:#3fb950">Frontend:</span> React, Next.js, TypeScript, Tailwind');
        printLine('<span style="color:#4f8ef7">Backend:</span>  Node.js, Express, NestJS, Python, Laravel');
        printLine('<span style="color:#f0883e">Db/Infra:</span> Oracle, MongoDB, PostgreSQL, Docker, GCP');
        break;
      case 'projects':
        printLine('1. <span class="cmd-focus">SPM:</span> Maintenance Planning System (React, Node, Oracle).');
        printLine('2. <span class="cmd-focus">SVECG:</span> ECG Signal Analyzer with AI (React, Flask, PyTorch).');
        printLine('3. <span class="cmd-focus">SGAT:</span> Tech Asset Manager (Laravel, MySQL).');
        break;
      case 'contact':
        printLine('Email:    contacto@yankoacuna.cl');
        printLine('LinkedIn: linkedin.com/in/yanko-acuna-villaseca');
        printLine('GitHub:   github.com/yankoacuna');
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'date':
        printLine(new Date().toString());
        break;
      case 'exit':
        setIsOpen(false);
        break;
      case 'ls':
        printLine('<span style="color:#4f8ef7; font-weight:bold;">app/</span>  <span style="color:#4f8ef7; font-weight:bold;">components/</span>  <span style="color:#4f8ef7; font-weight:bold;">public/</span>  package.json  README.md');
        break;
      case 'sudo':
        printLine('yanko is not in the sudoers file. This incident will be reported.');
        break;
      default:
        if (cmd.trim() !== '') {
          printLine(`${mainCmd}: command not found. Type 'help' for assistance.`);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input;
      if (cmd.trim()) {
        const newHistory = [...cmdHistory, cmd];
        setCmdHistory(newHistory);
        setHistoryIndex(newHistory.length);
        processCommand(cmd);
      }
      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < cmdHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      } else {
        setHistoryIndex(cmdHistory.length);
        setInput('');
      }
    }
  };

  return (
    <>
      <button
        className="terminal-floating-btn"
        onClick={() => setIsOpen(true)}
        title={lang === 'es' ? 'Abrir Terminal' : 'Open Terminal'}
        aria-label={lang === 'es' ? 'Abrir terminal de comandos' : 'Open command terminal'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="terminal-overlay" onClick={() => setIsOpen(false)} role="dialog" aria-modal="true">
          <div className="terminal-window" onClick={(e) => e.stopPropagation()} role="document">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-close" onClick={() => setIsOpen(false)} role="button" aria-label={lang === 'es' ? 'Cerrar' : 'Close'}></span>
                <span className="btn-min" role="button" aria-label={lang === 'es' ? 'Minimizar' : 'Minimize'}></span>
                <span className="btn-max" role="button" aria-label={lang === 'es' ? 'Maximizar' : 'Maximize'}></span>
              </div>
              <div className="terminal-title">yanko@portfolio:~</div>
            </div>
            <div className="terminal-body" onClick={() => inputRef.current?.focus()} role="presentation">
              <div ref={scrollRef} className="flex-1 overflow-y-auto">
                <div className="terminal-output">
                  {history.map((line) => (
                    <div key={line.id} className="terminal-line">
                      {line.type === 'input' ? (
                        <div className="flex">
                          <span className="prompt">yanko@portfolio:~$ </span>
                          <span>{line.content}</span>
                        </div>
                      ) : (
                        <div>
                          {/* Solo usamos dangerouslySetInnerHTML para líneas internas de confianza (que contienen HTML estático) */}
                          {line.content.includes('<span') || line.content.includes('<a') || line.content.includes('<div') ? (
                            <div dangerouslySetInnerHTML={{ __html: line.content }} />
                          ) : (
                            <span>{line.content}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="terminal-input-line">
                    <span className="prompt">yanko@portfolio:~$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      spellCheck="false"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
