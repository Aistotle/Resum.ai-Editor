import React, { useState, useRef, useEffect } from 'react';
import { ConversationMessage } from '../types';
import { Logo, SendIcon } from './Icons';

interface ChatbotProps {
    conversation: ConversationMessage[];
    isProcessing: boolean;
    onSendMessage: (message: string) => void;
    t: (key: string) => string;
}

const Chatbot: React.FC<ChatbotProps> = ({ conversation, isProcessing, onSendMessage, t }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [conversation, isProcessing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isProcessing) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent font-sans">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-lg text-neutral dark:text-white">{t('chatHeader')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('chatSubtitle')}</p>
            </header>
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
                <div className="space-y-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'ai' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center"><Logo className="w-5 h-5"/></div>}
                            <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-neutral dark:text-gray-200'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isProcessing && (
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center"><Logo className="w-5 h-5"/></div>
                            <div className="px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-transparent flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chatPlaceholder')}
                        className="flex-grow p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                        disabled={isProcessing}
                    />
                    <button type="submit" disabled={isProcessing || !input.trim()} className="p-2 bg-primary text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default Chatbot;