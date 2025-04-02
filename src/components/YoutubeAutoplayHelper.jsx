import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

/**
 * Componente auxiliar para garantir a reprodução automática do YouTube
 * Usa ReactPlayer diretamente com configurações específicas para forçar o autoplay
 */
export default function YoutubeAutoplayHelper({ videoId, volume = 100 }) {
  const playerRef = useRef(null);
  
  // Este componente será renderizado, mas não visível
  const containerStyles = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    opacity: 0,
    pointerEvents: 'none',
    zIndex: -1
  };
  
  // Configura várias tentativas de iniciar a reprodução
  useEffect(() => {
    if (!videoId) return;
    
    const delays = [300, 1000, 2000, 5000];
    
    const timers = delays.map(delay => 
      setTimeout(() => {
        if (playerRef.current) {
          console.log(`Tentativa de iniciar reprodução direta após ${delay}ms`);
          playerRef.current.seekTo(0);
          playerRef.current.getInternalPlayer()?.playVideo?.();
        }
      }, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, [videoId]);
  
  if (!videoId) return null;
  
  return (
    <div style={containerStyles}>
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={true}
        controls={false}
        volume={volume / 100}
        muted={false}
        width="1px"
        height="1px"
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              rel: 0
            }
          }
        }}
      />
    </div>
  );
} 