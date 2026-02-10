import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
    onSelectPrompt: (prompt: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
    const prompts = [
        {
            title: 'Crafting Digital Solutions That Work',
            text: 'Analyze the current software architecture and suggest optimizations.',
            image: '/prism_bg_jet_black_1770461465994.png' // Use existing artifact image
        },
        {
            title: 'Unlock a New World of Convenience',
            text: 'How can we simplify the user onboarding process?',
        },
        {
            title: 'Empowering Ideas with Algorithms',
            text: 'Suggest advanced data processing methods for our platform.',
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-10 py-20 overflow-y-auto custom-scrollbar relative z-10">
            <div className="text-center mb-20 space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase transition-all">
                    Get The Insights <br />
                    <span className="text-gray-600 block mt-2">You Want For Growth</span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-medium tracking-wide max-w-xl mx-auto">
                    Prizm AI: Your Next-Gen Intelligent Partner <br /> for Product Innovation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {prompts.map((prompt, index) => (
                    <div
                        key={index}
                        className="flex flex-col p-8 rounded-[32px] border border-white/5 bg-surface hover:border-white/10 transition-all group relative overflow-hidden h-[320px] justify-between shadow-2xl"
                    >
                        {prompt.image && (
                            <div className="absolute inset-0 opacity-20 grayscale hover:grayscale-0 transition-all">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={prompt.image} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                            </div>
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-white leading-snug max-w-[80%]">
                                    {prompt.title}
                                </h3>
                                <Sparkles className="w-5 h-5 text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {prompt.text}
                            </p>
                        </div>

                        <button
                            onClick={() => onSelectPrompt(prompt.text)}
                            className="relative z-10 w-fit px-6 py-2 bg-primary rounded-full text-white font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all self-end shadow-lg"
                        >
                            Get This <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmptyState;
