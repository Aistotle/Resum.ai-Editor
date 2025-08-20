import React, { useState, useRef, useEffect } from 'react';
import { ConversationMessage } from '../types';
import { SparklesIcon, SendIcon } from './Icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface ConsultantChatbotProps {
    conversation: ConversationMessage[];
    isProcessing: boolean;
    onSendMessage: (message: string) => void;
    onGenerateInitialReport: () => void;
    t: (key: string) => string;
}

const ConsultantChatbot: React.FC<ConsultantChatbotProps> = ({ conversation, isProcessing, onSendMessage, onGenerateInitialReport, t }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (conversation.length === 0) {
            onGenerateInitialReport();
        }
    }, [onGenerateInitialReport, conversation.length]);
    
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
            <header className="p-4 border-b border-border flex-shrink-0">
                <h3 className="font-bold text-lg text-secondary-foreground">{t('consultantHeader')}</h3>
                <p className="text-sm text-muted-foreground">{t('consultantSubtitle')}</p>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'ai' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary text-primary flex items-center justify-center"><SparklesIcon className="w-5 h-5"/></div>}
                            <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isProcessing && conversation.length > 0 && (
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary text-primary flex items-center justify-center"><SparklesIcon className="w-5 h-5"/></div>
                            <div className="px-4 py-3 rounded-lg bg-secondary text-secondary-foreground">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <footer className="p-4 border-t border-border bg-transparent flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chatPlaceholder')}
                        className="flex-grow p-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-ring focus:outline-none transition"
                        disabled={isProcessing}
                    />
                    <button type="submit" disabled={isProcessing || !input.trim()} className="p-2 bg-primary text-primary-foreground rounded-lg disabled:bg-muted-foreground disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ConsultantChatbot;