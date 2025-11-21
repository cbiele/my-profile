import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, LoadingState } from '../types';

// Icons
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const GeminiCoach: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Hi! I'm the AI Assistant for this portfolio. Ask me about my creator's skills, or ask for advice on building your own site!",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || status === LoadingState.LOADING) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setStatus(LoadingState.LOADING);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the AI brain right now. Please check your API key or try again later.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-2xl shadow-stone-900/10 flex flex-col overflow-hidden transition-all duration-300 ease-in-out animate-fade-in">
          {/* Header */}
          <div className="bg-terracotta-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChatIcon />
              <h3 className="font-bold text-white">Portfolio Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-orange-100 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-terracotta-500 text-white rounded-br-none'
                      : msg.isError 
                        ? 'bg-red-50 text-red-800 rounded-bl-none border border-red-200'
                        : 'bg-sand-100 text-stone-800 rounded-bl-none border border-sand-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {status === LoadingState.LOADING && (
               <div className="flex justify-start">
                 <div className="bg-sand-100 p-3 rounded-2xl rounded-bl-none border border-sand-200 flex gap-1 items-center shadow-sm">
                   <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></span>
                 </div>
               </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-sand-50 border-t border-stone-200 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me a question..."
              className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-2 text-sm text-stone-900 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={status === LoadingState.LOADING || !inputValue.trim()}
              className="p-2 bg-terracotta-600 hover:bg-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors shadow-sm"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-stone-600 hover:bg-stone-500' : 'bg-terracotta-600 hover:bg-terracotta-500'
        } p-4 rounded-full shadow-xl shadow-terracotta-900/20 text-white transition-all duration-300 hover:scale-110 border-2 border-white`}
      >
        {isOpen ? <XIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};