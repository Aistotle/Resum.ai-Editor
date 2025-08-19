import React, { useState, useEffect } from 'react';

interface LoadingIndicatorProps {
  message: string;
  progress?: number;
  t: (key: string) => string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, t }) => {
  const [displayedMessage, setDisplayedMessage] = useState(message);

  useEffect(() => {
    // A list of generic, dynamic steps to cycle through.
    const loadingSteps = [
        "Analyzing content...",
        "Refining structure...",
        "Optimizing for impact...",
        "Applying AI magic...",
        "Finalizing the design...",
    ];

    // Use the prop message as the first one, then cycle through the generic steps.
    const allMessages = [message, ...loadingSteps];

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      // We use the initial message from props in the cycle.
      currentIndex = (currentIndex + 1) % allMessages.length;
      setDisplayedMessage(allMessages[currentIndex]);
    }, 4000); // Change message every 4 seconds.

    // Set the initial message immediately without waiting for the first interval
    setDisplayedMessage(message);

    return () => clearInterval(intervalId); // Cleanup on component unmount.
  }, [message]); // Rerun effect if the initial message from props changes.

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center text-center p-8 w-full h-full bg-gradient-to-br from-fuchsia-500 via-red-500 to-orange-400 animate-background-pan [background-size:400%_400%]">
      <div className="relative z-10 w-full max-w-4xl">
        <h2 className="text-3xl sm:text-5xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.2)] animate-fade-in">
            {displayedMessage}
        </h2>
        <p className="mt-4 text-md sm:text-lg text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.1)] animate-fade-in [animation-delay:0.2s]">
            {t('loadingMoment')}
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;