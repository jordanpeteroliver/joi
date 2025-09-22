
import React from 'react';

interface SceneProps {
  imageUrl: string | null;
  narrative: string;
  imageLoading: boolean;
  excitementLevel: number;
  excitementFeedback: string | null;
}

const ImageLoader: React.FC = () => (
  <div className="w-full h-full bg-black/50 animate-pulse flex items-center justify-center rounded-lg">
    <svg className="w-10 h-10 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  </div>
);


const Scene: React.FC<SceneProps> = ({ imageUrl, narrative, imageLoading, excitementLevel, excitementFeedback }) => {
  const glowClass = excitementLevel > 65 ? 'joyce-glow' : '';
  const feedbackPulseClass =
    excitementFeedback === 'high'
      ? 'animate-high-pulse'
      : excitementFeedback === 'medium'
      ? 'animate-medium-pulse'
      : '';
      
  const narrativeFeedbackClass =
    excitementFeedback === 'high'
      ? 'animate-text-high-flash'
      : excitementFeedback === 'medium'
      ? 'animate-text-medium-flash'
      : '';

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 md:p-6 gap-6">
       <div className={`w-full max-w-sm aspect-[3/4] rounded-lg shadow-2xl shadow-black/50 overflow-hidden border-2 border-white/10 transition-all duration-700 ${glowClass} ${feedbackPulseClass}`}>
        {imageLoading ? (
          <ImageLoader />
        ) : (
          imageUrl && <img src={imageUrl} alt="Joyce on the balcony" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="w-full max-w-xl text-center bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10">
        <p className={`text-white/90 text-lg leading-relaxed ${narrativeFeedbackClass}`}>{narrative}</p>
      </div>
    </div>
  );
};

export default Scene;