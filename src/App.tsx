/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, History, Scroll, User, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateHistoryStory } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [step, setStep] = useState<'entry' | 'story'>('entry');
  const [story, setStory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>('');

  const startStory = async (prompt?: string) => {
    setStep('story');
    setLoading(true);
    try {
      const content = await generateHistoryStory(prompt);
      setStory(content);
    } catch (error) {
      console.error(error);
      setStory("Kshama karein, kahani sunane mein kuch takleef ho rahi hai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 'entry') {
        // Optionally start with a default story or wait for user input
      }
    }, 3000); // Show welcome for 3 seconds then start
    return () => clearTimeout(timer);
  }, [step]);

  const refreshStory = async () => {
    setLoading(true);
    try {
      const content = await generateHistoryStory(userPrompt);
      setStory(content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-serif selection:bg-[#5A5A40] selection:text-white">
      <AnimatePresence mode="wait">
        {step === 'entry' ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-[#5A5A40] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <User size={48} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-2">
                Swagat hai, <span className="italic font-normal">Sunny Vaishnav</span>
              </h1>
              <p className="text-xl opacity-60 max-w-md mx-auto">
                Itihas ke panno ko palatne ka samay aa gaya hai.
              </p>
              <textarea
                className="w-full max-w-md p-4 mt-6 rounded-lg border border-[#1a1a1a]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#5A5A40] transition-colors text-lg"
                placeholder="Apni kahani ke liye ek prompt likhein... (Jaise: Prachin Bharat ke raja, ya Duniya ki sabse purani sabhyata)"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
              ></textarea>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startStory(userPrompt)}
              className="bg-[#5A5A40] text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-[#4a4a35] transition-colors flex items-center gap-3"
            >
              <BookOpen size={20} />
              Kahani Shuru Karein
            </motion.button>
          </motion.div>
        ) : (
          <motion.main
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-6 py-12 md:py-24"
          >
            <header className="mb-16 border-b border-[#1a1a1a]/10 pb-8 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 text-[#5A5A40] mb-4">
                  <History size={20} />
                  <span className="uppercase tracking-[0.2em] text-xs font-sans font-bold">Prachin Itihas</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-light">Itihas ki Kahani</h2>
              </div>
              <button 
                onClick={refreshStory}
                disabled={loading}
                className="p-3 rounded-full border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors disabled:opacity-50"
                title="Nayi Kahani"
              >
                <RefreshCw size={20} className={cn(loading && "animate-spin")} />
              </button>
            </header>

            <div className="relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                  <Loader2 size={48} className="animate-spin" />
                  <p className="italic">Puraane panno ko dhundha ja raha hai...</p>
                </div>
              ) : (
                <motion.article
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-stone prose-lg max-w-none"
                >
                  <div className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-[32px] shadow-sm border border-white/20 leading-relaxed text-xl">
                    <ReactMarkdown>{story}</ReactMarkdown>
                  </div>
                  
                  <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
                    <div className="h-px w-12 bg-[#1a1a1a]" />
                    <Scroll size={24} />
                    <div className="h-px w-12 bg-[#1a1a1a]" />
                  </div>
                </motion.article>
              )}
            </div>

            <footer className="mt-24 text-center opacity-40 text-sm font-sans uppercase tracking-widest">
              Sunny Vaishnav &bull; Itihas ki Kahaniyan
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
