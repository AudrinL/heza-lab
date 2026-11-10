import React, { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, MessageCircle, RotateCcw, Send, WifiOff, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type MessageRole = 'user' | 'assistant';

interface AssistantMessage {
  id: string;
  role: MessageRole;
  content: string;
}

const WELCOME_MESSAGE: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi, I’m Heza, your science learning assistant. Ask me to explain a concept, help you understand a lab step, or give you a hint.'
};

const SUGGESTED_QUESTIONS = [
  'Explain this experiment simply',
  'What should I observe?',
  'Give me a hint, not the answer'
];

export const AiAssistant: React.FC = () => {
  const {
    route,
    role,
    experiments,
    selectedExperimentId,
    isOfflineSimulated
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentExperiment = experiments.find(experiment => experiment.id === selectedExperimentId);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isLoading]);

  const resetConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  };

  const sendMessage = async (question?: string) => {
    const content = (question ?? input).trim();
    if (!content || isLoading || isOfflineSimulated) return;

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter(message => message.id !== 'welcome')
            .map(({ role: messageRole, content: messageContent }) => ({
              role: messageRole,
              content: messageContent
            })),
          context: {
            appRoute: route,
            userRole: role,
            experiment: currentExperiment
              ? {
                  title: currentExperiment.title,
                  subject: currentExperiment.subject,
                  gradeLevel: currentExperiment.gradeLevel,
                  curriculumRef: currentExperiment.curriculumRef,
                  summary: currentExperiment.summary,
                  learningObjectives: currentExperiment.learningObjectives,
                  equipmentList: currentExperiment.equipmentList,
                  instructions: currentExperiment.instructions
                }
              : undefined
          }
        })
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !data.message) {
        throw new Error(data.error || 'The assistant could not answer right now.');
      }

      setMessages(previous => [
        ...previous,
        { id: crypto.randomUUID(), role: 'assistant', content: data.message! }
      ]);
    } catch (error) {
      setMessages(previous => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: error instanceof Error
            ? error.message
            : 'The assistant is temporarily unavailable. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-4 sm:left-auto sm:right-5 z-50">
      {isOpen && (
        <section
          aria-label="Heza AI science assistant"
          className="mb-3 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] sm:w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white dark:border-slate-700">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold">Ask Heza</h2>
                <p className="truncate text-[11px] text-slate-300">
                  {route === 'lab' && currentExperiment
                    ? `Helping with ${currentExperiment.title}`
                    : 'Your AI science learning assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetConversation}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label="Close AI assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-teal-600 text-white'
                      : 'rounded-bl-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Heza is thinking…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isOfflineSimulated && (
            <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 dark:border-slate-800">
              {SUGGESTED_QUESTIONS.map(question => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="shrink-0 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-medium text-teal-800 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {isOfflineSimulated ? (
            <div className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              <WifiOff className="h-4 w-4 shrink-0" />
              AI help needs an internet connection. Your lab work remains available offline.
            </div>
          ) : (
            <form
              className="border-t border-slate-200 p-3 dark:border-slate-700"
              onSubmit={event => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white p-2 focus-within:ring-2 focus-within:ring-teal-500 dark:border-slate-700 dark:bg-slate-950">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={event => setInput(event.target.value.slice(0, 2_000))}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask a science question…"
                  aria-label="Message Heza"
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                AI can make mistakes. Check important answers with your teacher.
              </p>
            </form>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(previous => !previous)}
        className="ml-auto flex items-center gap-2 rounded-full bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{isOpen ? 'Close' : 'Ask Heza'}</span>
      </button>
    </div>
  );
};
