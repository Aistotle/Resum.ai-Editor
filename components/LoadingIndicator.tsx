import React, { useState, useEffect, useMemo } from 'react';

interface LoadingIndicatorProps {
  message: string;
  progress?: number;
  t: (key: string) => string;
}

const MagicParticles: React.FC = () => {
    const sparkles = useMemo(() => Array.from({ length: 60 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 2}s`,
        animationDelay: `${Math.random() * 3}s`,
        size: `${Math.random() * 2 + 1}px`,
        color: ['#a855f7', '#6366f1', '#ec4899'][Math.floor(Math.random() * 3)],
    })), []);

    const shootingStars = useMemo(() => Array.from({ length: 5 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: '-10%',
        animationDuration: `${Math.random() * 2 + 1}s`,
        animationDelay: `${Math.random() * 5}s`,
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {sparkles.map((style, i) => (
                <div
                    key={`sparkle-${i}`}
                    className="absolute rounded-full animate-sparkle"
                    style={{
                        top: style.top,
                        left: style.left,
                        width: style.size,
                        height: style.size,
                        backgroundColor: style.color,
                        animationDuration: style.animationDuration,
                        animationDelay: style.animationDelay,
                    }}
                />
            ))}
            {shootingStars.map((style, i) => (
                <div
                    key={`star-${i}`}
                    className="absolute h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent animate-shooting-star"
                    style={{
                        top: style.top,
                        left: style.left,
                        width: `${Math.random() * 100 + 100}px`,
                        animationDuration: style.animationDuration,
                        animationDelay: style.animationDelay,
                    }}
                />
            ))}
        </div>
    );
};


const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, t }) => {
  const [displayedMessage, setDisplayedMessage] = useState(message);

  useEffect(() => {
    const loadingSteps = [
        "Analyzing content...",
        "Refining structure...",
        "Optimizing for impact...",
        "Applying AI magic...",
        "Finalizing the design...",
    ];
    const allMessages = [message, ...loadingSteps];
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % allMessages.length;
      setDisplayedMessage(allMessages[currentIndex]);
    }, 4000);
    setDisplayedMessage(message);
    return () => clearInterval(intervalId);
  }, [message]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center text-center p-8 w-full h-full bg-background">
      <MagicParticles />
      <div className="relative z-10 w-full max-w-4xl">
        <h2 className="text-3xl sm:text-5xl font-bold animated-text-gradient animate-fade-in">
            {displayedMessage}
        </h2>
        <p className="mt-4 text-md sm:text-lg text-muted-foreground animate-fade-in [animation-delay:0.2s]">
            {t('loadingMoment')}
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;