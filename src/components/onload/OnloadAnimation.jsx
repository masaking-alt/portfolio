import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PAGE_BACKGROUND_COLOR } from '../../constants/window';

export function OnloadAnimation({ onComplete }) {
  const [hasWindowLoaded, setHasWindowLoaded] = useState(false);
  const [isBackground, setIsBackground] = useState(false);
  const dotLottieRef = useRef(null);
  const completeHandlerRef = useRef(null);

  const cleanupCompleteListener = useCallback(() => {
    if (dotLottieRef.current && completeHandlerRef.current) {
      dotLottieRef.current.removeEventListener('complete', completeHandlerRef.current);
    }

    completeHandlerRef.current = null;
  }, []);

  const handleDotLottieRef = useCallback((dotLottie) => {
    cleanupCompleteListener();
    dotLottieRef.current = dotLottie;

    if (!dotLottie) {
      return;
    }

    const handleComplete = () => {
      if (typeof dotLottie.totalFrames === 'number' && dotLottie.totalFrames > 0) {
        dotLottie.setFrame(dotLottie.totalFrames - 1);
      }
      dotLottie.pause();
      setIsBackground(true);
      onComplete?.();
    };

    dotLottie.addEventListener('complete', handleComplete);
    completeHandlerRef.current = handleComplete;
  }, [cleanupCompleteListener, onComplete]);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setHasWindowLoaded(true);
      return undefined;
    }

    const handleWindowLoad = () => setHasWindowLoaded(true);
    window.addEventListener('load', handleWindowLoad, { once: true });

    return () => window.removeEventListener('load', handleWindowLoad);
  }, []);

  useEffect(() => cleanupCompleteListener, [cleanupCompleteListener]);

  if (!hasWindowLoaded) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`onload-lottie ${isBackground ? 'onload-lottie--background' : 'onload-lottie--intro'}`}
    >
      <DotLottieReact
        autoplay
        backgroundColor={PAGE_BACKGROUND_COLOR}
        className="block h-full w-full"
        dotLottieRefCallback={handleDotLottieRef}
        layout={{ fit: 'cover', align: [0.5, 0.5] }}
        loop={false}
        src="/onload.lottie"
        style={{ display: 'block', height: '100%', width: '100%' }}
      />
    </div>
  );
}
