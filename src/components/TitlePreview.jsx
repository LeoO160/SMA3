import { Box, Paper, Typography, IconButton, Avatar, ImageList, ImageListItem, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LockIcon from '@mui/icons-material/Lock';
import { useState, useEffect, useCallback } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React from 'react';
import VisualEffects from './VisualEffects';

export default function TitlePreview({ 
  title, 
  titleColor, 
  titleBgColor,
  showTitleCard,
  style, 
  timeText,
  counterColor,
  counterFont,
  counterBgColor,
  showCounterCard,
  showAnimation,
  selectedEmoji,
  message,
  messageFont,
  messageStyle,
  messageColor,
  messageBgColor,
  showMessageCard,
  webBgColor,
  musicUrl,
  musicType,
  isPlaying,
  onPlayPause,
  videoId,
  musicInfo,
  trackId,
  isFinal,
  memories = [],
  isMemoryPage = false,
  visualEffect,
  memoryData // Para compatibilidade com o modo antigo
}) {
  // Log para diagnóstico de props
  console.log('[TitlePreview] Props recebidas:', {
    title,
    titleColor,
    titleBgColor,
    showTitleCard,
    musicUrl,
    isMemoryPage,
    memoryData: memoryData ? 'presente' : 'ausente'
  });

  // Se recebemos o objeto memoryData (modo antigo), extrair as propriedades dele
  if (memoryData && !title) {
    console.log('[TitlePreview] Usando objeto memoryData para extrair propriedades');
    // Extrair propriedades do objeto memoryData para compatibilidade
    title = memoryData.title;
    titleColor = memoryData.titleColor;
    titleBgColor = memoryData.titleBgColor;
    showTitleCard = memoryData.showTitleCard;
    style = memoryData.style;
    timeText = memoryData.timeText;
    counterColor = memoryData.counterColor;
    counterFont = memoryData.counterFont;
    counterBgColor = memoryData.counterBgColor;
    showCounterCard = memoryData.showCounterCard;
    showAnimation = memoryData.showAnimation;
    selectedEmoji = memoryData.selectedEmoji;
    message = memoryData.message;
    messageFont = memoryData.messageFont;
    messageStyle = memoryData.messageStyle;
    messageColor = memoryData.messageColor;
    messageBgColor = memoryData.messageBgColor;
    showMessageCard = memoryData.showMessageCard;
    webBgColor = memoryData.webBgColor;
    musicUrl = memoryData.musicUrl;
    musicType = memoryData.musicType;
    videoId = memoryData.videoId;
    musicInfo = memoryData.musicInfo;
    trackId = memoryData.trackId;
    memories = memoryData.memories || [];
    visualEffect = memoryData.visualEffect;
  }

  // Ajusta o tamanho dos elementos com base em ser página de memória ou preview
  const getFontSize = (base, modifier = 1) => {
    // Se estiver na página de memória, aumenta o tamanho
    const increase = isMemoryPage ? 1.3 : 1;
    return {
      xs: isMemoryPage 
        ? `${base * 1.1 * modifier}rem` 
        : `${base * 0.8 * modifier}rem`,
      sm: isMemoryPage 
        ? `${base * 1.2 * modifier}rem` 
        : `${base * 0.9 * modifier}rem`,
      md: isMemoryPage 
        ? `${base * 1.3 * modifier}rem` 
        : `${base * modifier}rem`
    };
  };

  // Detectar dispositivo móvel usando resolução de tela
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Atualizar o estado quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatUrl = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const floatAnimation = {
    y: [0, -5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const musicCardAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  // Verificação para mostrar o card de música
  const shouldShowMusicCard = musicUrl || (musicInfo && (musicInfo.title || musicInfo.image));

  // Determinar origem da música e verificar validade
  const isSpotify = musicType === 1 || (musicUrl && musicUrl.includes('spotify'));
  const isYoutube = musicType === 0 || (musicUrl && musicUrl.includes('youtube'));
  
  // Verificação adicional para Spotify
  const isValidSpotifyTrack = isSpotify && trackId && trackId.length > 5;
  
  // Detectar tipo de conteúdo Spotify
  const getSpotifyContentType = () => {
    if (!isSpotify || !musicUrl) return 'track';
    
    if (musicUrl.includes('/playlist/')) return 'playlist';
    if (musicUrl.includes('/album/')) return 'album';
    return 'track'; // padrão
  };
  
  const spotifyContentType = getSpotifyContentType();

  // Estado para controlar a reprodução de vídeo do YouTube
  const [isYoutubeVideoPlaying, setIsYoutubeVideoPlaying] = useState(false);
  const [isYoutubePlayerReady, setIsYoutubePlayerReady] = useState(false);
  
  // Função para alternar entre play e pause do vídeo do YouTube
  const toggleYoutubePlayback = () => {
    if (isYoutubePlayerReady) {
      const newPlayingState = !isYoutubeVideoPlaying;
      setIsYoutubeVideoPlaying(newPlayingState);
      
      // Chama o callback para notificar o componente pai
      if (onPlayPause) {
        onPlayPause(newPlayingState);
      }
      
      // Controla o vídeo diretamente via API
      if (newPlayingState) {
        controlYoutubeVideo('playVideo');
      } else {
        controlYoutubeVideo('pauseVideo');
      }
    }
  };

  // Referência para o iframe do YouTube
  const youtubeIframeRef = React.useRef(null);

  // Função para controlar o vídeo do YouTube
  const controlYoutubeVideo = (command) => {
    try {
      if (youtubeIframeRef.current && youtubeIframeRef.current.contentWindow) {
        youtubeIframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: command,
            args: [],
          }), 
          '*'
        );
      }
    } catch (error) {
      console.error('Erro ao controlar o vídeo do YouTube:', error);
    }
  };

  // Inicializar API do YouTube quando o componente montar
  useEffect(() => {
    // Tratador de eventos para mensagens da API do YouTube
    const handleYouTubeMessages = (event) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (data.event === 'onReady') {
            console.log('Player do YouTube pronto');
            setIsYoutubePlayerReady(true);
          } else if (data.event === 'onStateChange') {
            // -1: não iniciado, 0: encerrado, 1: reproduzindo, 2: pausado, 3: armazenando em buffer, 5: vídeo em fila
            console.log('Estado do YouTube alterado:', data.info);
            setIsYoutubeVideoPlaying(data.info === 1);
          }
        }
      } catch (e) {
        // Ignorar mensagens que não são JSON da API do YouTube
      }
    };

    window.addEventListener('message', handleYouTubeMessages);

    // Definir um timeout para forçar o estado de pronto após 3 segundos
    // Isso resolve o problema de carregamento infinito caso a API não responda
    const readyTimeout = setTimeout(() => {
      if (!isYoutubePlayerReady && isYoutube && videoId) {
        console.log('Forçando estado de pronto após timeout');
        setIsYoutubePlayerReady(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('message', handleYouTubeMessages);
      clearTimeout(readyTimeout);
    };
  }, [isYoutubePlayerReady, isYoutube, videoId]);

  // Efeito para sincronizar o estado isPlaying com isYoutubeVideoPlaying
  useEffect(() => {
    if (isYoutube && videoId && isYoutubePlayerReady) {
      // Sincronizando o estado externo com o estado interno
      if (isPlaying !== isYoutubeVideoPlaying) {
        setIsYoutubeVideoPlaying(isPlaying);
        if (isPlaying) {
          controlYoutubeVideo('playVideo');
        } else {
          controlYoutubeVideo('pauseVideo');
        }
      }
    }
  }, [isPlaying, isYoutube, videoId, isYoutubePlayerReady]);

  // Efeito para recarregar o iframe quando a URL ou videoId mudar
  useEffect(() => {
    if (isYoutube && videoId && youtubeIframeRef.current) {
      console.log('URL ou videoId mudou, recarregando iframe');
      
      // Atualiza o src do iframe para carregar o novo vídeo
      const newSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=${isPlaying ? '1' : '0'}&controls=0&fs=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&mute=0&start=0&iv_load_policy=3`;
      
      // Recria o iframe para forçar o carregamento
      youtubeIframeRef.current.src = newSrc;
      
      // Reinicia o estado do player
      setIsYoutubePlayerReady(false);
      
      // Define um timeout para forçar o estado de pronto se a API não responder
      const readyTimeout = setTimeout(() => {
        if (!isYoutubePlayerReady) {
          console.log('Forçando estado de pronto após reload');
          setIsYoutubePlayerReady(true);
          
          // Se deve estar reproduzindo, tenta iniciar
          if (isPlaying) {
            setIsYoutubeVideoPlaying(true);
            controlYoutubeVideo('playVideo');
          }
        }
      }, 3000);
      
      return () => clearTimeout(readyTimeout);
    }
  }, [musicUrl, videoId, isYoutube]);

  // Efeito para iniciar a reprodução automática na página de memória
  useEffect(() => {
    // Se estiver na página de memória e tiver um ID de vídeo válido, inicia automaticamente
    if (isMemoryPage && isYoutube && videoId) {
      console.log('Configurando reprodução automática na página de memória');
      
      // Aguarda um curto período para garantir que o elemento iframe foi renderizado
      const timer = setTimeout(() => {
        setIsYoutubeVideoPlaying(true);
        
        // Tenta diferentes abordagens para iniciar a reprodução
        if (isYoutubePlayerReady) {
          console.log('Player pronto, iniciando reprodução via API');
          controlYoutubeVideo('playVideo');
        } else {
          console.log('Player não pronto, tentando recriar iframe');
          // Recria o iframe para forçar autoplay
          const iframe = youtubeIframeRef.current;
          if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = ''; // Limpa o src
            setTimeout(() => {
              iframe.src = currentSrc; // Restaura com os mesmos parâmetros
            }, 100);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isMemoryPage, isYoutubePlayerReady, isYoutube, videoId]);

  // Adiciona um novo efeito para garantir reprodução mesmo após problemas de carregamento
  useEffect(() => {
    if (isMemoryPage && isYoutube && videoId) {
      // Uma única tentativa de reprodução é suficiente para evitar duplicação
      const timer = setTimeout(() => {
        console.log('Tentativa única de reprodução após carregamento');
        if (!isYoutubeVideoPlaying) {
          setIsYoutubeVideoPlaying(true);
          if (isYoutubePlayerReady) {
            controlYoutubeVideo('playVideo');
          }
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isMemoryPage, isYoutube, videoId, isYoutubePlayerReady]);

  // Efeito para garantir que o estado da reprodução esteja sincronizado com autoplay
  useEffect(() => {
    if (isMemoryPage && isSpotify && trackId) {
      // Simplificando a lógica - apenas uma tentativa para evitar múltiplos recarregamentos
      console.log('Configurando reprodução única do Spotify');
      
      // Primeira tentativa - imediata
      const iframe = document.getElementById('spotify-preview-iframe');
      if (iframe) {
        console.log('Configurando parâmetros iniciais do iframe do Spotify');
        // Garantir que os parâmetros de autoplay e init estejam presentes
        if (!iframe.src.includes('autoplay=1')) {
          iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
        }
        if (!iframe.src.includes('init=1')) {
          iframe.src = iframe.src + '&init=1';
        }
      }
      
      // Atraso para garantir que o iframe já esteja montado na DOM
      const timer = setTimeout(() => {
        const iframe = document.getElementById('spotify-preview-iframe');
        if (iframe) {
          console.log('Iniciando player do Spotify apenas uma vez');
          
          // Atualiza o iframe com autoplay=1 apenas uma vez
          iframe.src = `https://open.spotify.com/embed/${spotifyContentType}/${trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${new Date().getTime()}`;
          
          // Uma única tentativa com postMessage após um tempo razoável
          setTimeout(() => {
            try {
              iframe.contentWindow.postMessage({ command: 'play' }, '*');
            } catch (error) {
              console.error("Erro ao tentar controlar o player via postMessage:", error);
            }
          }, 1500);
        }
      }, 800);
      
      // Terceira tentativa com um atraso maior
      const lastAttempt = setTimeout(() => {
        const iframe = document.getElementById('spotify-preview-iframe');
        if (iframe) {
          try {
            console.log('Última tentativa de ativar player do Spotify');
            iframe.src = `https://open.spotify.com/embed/${spotifyContentType}/${trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${new Date().getTime()}-final`;
            iframe.contentWindow.postMessage({ command: 'play' }, '*');
          } catch (error) {
            console.error("Erro na tentativa final de controlar o player:", error);
          }
        }
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(lastAttempt);
      };
    }
  }, [isMemoryPage, isSpotify, trackId, spotifyContentType]);

  // Estado para controlar a foto atual no rolo de fotos
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Efeito para mudar a foto automaticamente a cada 4 segundos
  useEffect(() => {
    let slideInterval;
    
    if (memories && memories.length > 1) {
      slideInterval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => 
          prevIndex === memories.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    }
    
    // Limpeza do intervalo quando o componente for desmontado
    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [memories]);
  
  // Funções para navegação das fotos
  const nextPhoto = () => {
    if (memories && memories.length > 0) {
      setCurrentPhotoIndex((prevIndex) => 
        prevIndex === memories.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevPhoto = () => {
    if (memories && memories.length > 0) {
      setCurrentPhotoIndex((prevIndex) => 
        prevIndex === 0 ? memories.length - 1 : prevIndex - 1
      );
    }
  };

  const renderContent = () => (
    <>
      {/* Player de música movido para o início */}
      {shouldShowMusicCard && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            width: '100%',
            maxWidth: isMemoryPage ? { xs: '85%', sm: '75%', md: '60%', lg: '50%', xl: '40%' } : '100%',
            mt: isMemoryPage ? { xs: 0.3, sm: 0.5 } : { xs: 1, sm: 1.5 },
            mb: isMemoryPage ? { xs: 0.3, sm: 0.5 } : { xs: 1.5, sm: 2 },
            mx: 'auto'
          }}
        >
          {isValidSpotifyTrack ? (
            <iframe 
              id="spotify-preview-iframe"
              src={`https://open.spotify.com/embed/${spotifyContentType}/${trackId}?utm_source=generator&theme=1${isMemoryPage ? '&autoplay=1&init=1' : '&autoplay=0'}&loop=1`}
              width="100%" 
              height={80}
              frameBorder="0" 
              allowFullScreen=""
              allowtransparency="true" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="eager"
              style={{ 
                display: 'block',
                backgroundColor: 'transparent',
                borderRadius: '12px',
                maxWidth: '100%'
              }}
            />
          ) : (
            isYoutube && videoId ? (
              <>
                <Box
                  component={motion.div}
                  {...musicCardAnimation}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    height: { xs: '70px', sm: '90px' },
                    backgroundColor: '#121212',
                    color: 'white',
                    borderRadius: { xs: 2, sm: 4 },
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Ícone de música ou thumbnail à esquerda */}
                  <Box sx={{ 
                    height: '100%', 
                    width: { xs: '60px', sm: '80px' }, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    bgcolor: '#333', 
                    flexShrink: 0 
                  }}>
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                      alt="Thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  
                  {/* Conteúdo do card */}
                  <Box sx={{ 
                    flexGrow: 1, 
                    px: { xs: 1, sm: 1.5 }, 
                    py: { xs: 0.5, sm: 1 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    maxWidth: { xs: 'calc(100% - 110px)', sm: 'calc(100% - 140px)' },
                    overflow: 'hidden'
                  }}>
                    <Typography 
                      variant="body1" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'white', 
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        mb: { xs: 0.1, sm: 0.3 },
                        fontSize: { xs: '0.65rem', sm: '0.8rem' }
                      }}
                    >
                      {musicInfo?.title || 'Vídeo do YouTube'}
                    </Typography>
                    
                    {/* Status de reprodução */}
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: { xs: '0.5rem', sm: '0.6rem' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <YouTubeIcon sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }} />
                      {!isYoutubePlayerReady 
                        ? 'Carregando...' 
                        : isYoutubeVideoPlaying 
                          ? 'Reproduzindo' 
                          : 'Pausado'}
                    </Typography>
                  </Box>
                  
                  {/* Área dos botões */}
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: '35px', sm: '50px' },
                    height: '100%',
                    flexShrink: 0
                  }}>
                    <IconButton 
                      onClick={toggleYoutubePlayback}
                      disabled={!isYoutubePlayerReady}
                      sx={{ 
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          backgroundColor: isYoutubePlayerReady ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
                        },
                        width: { xs: 28, sm: 36 },
                        height: { xs: 28, sm: 36 }
                      }}
                    >
                      {!isYoutubePlayerReady ? (
                        <CircularProgress size={18} sx={{ color: 'white' }} />
                      ) : isYoutubeVideoPlaying ? (
                        <PauseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      ) : (
                        <PlayArrowIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Player do YouTube oculto para controle via API */}
                <Box sx={{ 
                  width: '1px', 
                  height: '1px', 
                  overflow: 'hidden', 
                  position: 'absolute', 
                  top: -9999,
                  left: -9999
                }}>
                  <iframe
                    ref={youtubeIframeRef}
                    width="1"
                    height="1"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=${isMemoryPage ? '1' : '0'}&controls=0&fs=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&mute=0&start=0&iv_load_policy=3`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                      console.log('Iframe do YouTube carregado');
                      // Define um timeout para dar tempo à API de se inicializar
                      setTimeout(() => {
                        if (!isYoutubePlayerReady) {
                          console.log('Forçando estado de pronto após carregamento do iframe');
                          setIsYoutubePlayerReady(true);
                        }
                      }, 1000);
                    }}
                  />
                </Box>
              </>
            ) : (
              // Não exibir o quadro de fallback para Spotify inválido
              !isSpotify && musicInfo && (
                <Box
                  component={motion.div}
                  {...musicCardAnimation}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    height: { xs: '80px', sm: '90px' },
                    backgroundColor: '#121212',
                    color: 'white',
                    borderRadius: { xs: 3, md: 4 },
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Ícone de música à esquerda */}
                  <Box sx={{ 
                    height: '100%', 
                    width: { xs: '70px', sm: '80px' }, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    bgcolor: '#333', 
                    flexShrink: 0 
                  }}>
                    <MusicNoteIcon sx={{ fontSize: { xs: 24, sm: 30 }, color: 'white' }} />
                  </Box>
                  
                  {/* Conteúdo do card */}
                  <Box sx={{ 
                    flexGrow: 1, 
                    px: { xs: 1, sm: 1.5 }, 
                    py: { xs: 0.5, sm: 1 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    maxWidth: { xs: 'calc(100% - 90px)', sm: 'calc(100% - 100px)' },
                    overflow: 'hidden'
                  }}>
                    <Typography 
                      variant="body1" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'white', 
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}
                    >
                      {musicInfo?.title || 'Música'}
                    </Typography>
                  </Box>
                </Box>
              )
            )
          )}
        </Box>
      )}

      {/* Rolo de fotos */}
      {memories?.length > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{
            width: '100%',
            maxWidth: isMemoryPage ? { xs: '95%', sm: '90%', md: '90%', lg: '85%', xl: '80%' } : '100%',
            position: 'relative',
            mb: isMemoryPage ? { xs: 0.8, sm: 1 } : 2,
            height: 'auto',
            minHeight: isMemoryPage ? '200px' : '300px',
            maxHeight: isMemoryPage ? 'none' : '450px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mx: 'auto'
          }}
        >
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              height: '100%',
              borderRadius: isMemoryPage ? 2 : 0,
              overflow: 'visible',
              backgroundColor: isMemoryPage ? 'transparent' : 'transparent'
            }}
          >
            <AnimatePresence mode="wait">
              <Box
                component={motion.div}
                key={currentPhotoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <img
                  src={memories[currentPhotoIndex]?.url || memories[currentPhotoIndex]}
                  alt={`Memória ${currentPhotoIndex + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto', 
                    minHeight: '200px',
                    maxHeight: isMemoryPage ? '600px' : '400px',
                    objectFit: 'contain',
                    borderRadius: isMemoryPage ? '8px' : '0',
                    boxShadow: isMemoryPage ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
                    background: 'transparent'
                  }}
                />
              </Box>
            </AnimatePresence>

            {/* Navegação */}
            {memories.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    backgroundColor: isMemoryPage ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      backgroundColor: isMemoryPage ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'
                    },
                    zIndex: 5,
                    boxShadow: isMemoryPage ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onClick={prevPhoto}
                >
                  <NavigateBeforeIcon sx={{ fontSize: '1rem', color: isMemoryPage ? '#333' : undefined }} />
                </IconButton>

                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    transform: 'translateY(-50%)',
                    backgroundColor: isMemoryPage ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      backgroundColor: isMemoryPage ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'
                    },
                    zIndex: 5,
                    boxShadow: isMemoryPage ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onClick={nextPhoto}
                >
                  <NavigateNextIcon sx={{ fontSize: '1rem', color: isMemoryPage ? '#333' : undefined }} />
                </IconButton>

                {/* Indicadores */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 0.5,
                    zIndex: 5
                  }}
                >
                  {memories.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      sx={{
                        width: isMemoryPage ? 10 : 8,
                        height: isMemoryPage ? 10 : 8,
                        borderRadius: '50%',
                        bgcolor: index === currentPhotoIndex 
                          ? (isMemoryPage ? 'primary.main' : 'primary.main') 
                          : (isMemoryPage ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'),
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: isMemoryPage ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                        '&:hover': {
                          bgcolor: index === currentPhotoIndex 
                            ? 'primary.main' 
                            : (isMemoryPage ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)')
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* Contador de fotos */}
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: isMemoryPage ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    fontWeight: 'medium',
                    zIndex: 5,
                    boxShadow: isMemoryPage ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    color: '#333'
                  }}
                >
                  {currentPhotoIndex + 1} / {memories.length}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Título */}
      {showTitleCard ? (
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
          minHeight: '40px',
          backgroundColor: titleBgColor || style.backgroundColor,
          borderRadius: isMemoryPage ? 3 : 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: isMemoryPage ? { xs: 0.8, sm: 1.5 } : { xs: 0.8, sm: 2.5 },
          py: isMemoryPage ? { xs: 1, sm: 1.5 } : { xs: 1.5, sm: 2.5 },
          mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.5, sm: 1 },
          boxShadow: isMemoryPage ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.05)',
          mx: 'auto'
        }}
      >
        <Typography
          variant="h3"
          component="div"
          sx={{
            color: titleColor,
            fontFamily: style.fontFamily,
            fontSize: {
              xs: isMemoryPage 
                ? `calc(${style.titleSize || 48}px * 0.25)` 
                : `calc(${style.titleSize || 48}px * 0.18)`,
              sm: isMemoryPage 
                ? `calc(${style.titleSize || 48}px * 0.35)` 
                : `calc(${style.titleSize || 48}px * 0.25)`,
              md: isMemoryPage 
                ? `calc(${style.titleSize || 48}px * 0.45)` 
                : `calc(${style.titleSize || 48}px * 0.45)`
            },
            textAlign: 'center',
            fontWeight: 'medium',
            lineHeight: 1.1,
            mb: timeText ? 0.5 : 0,
            py: 0.2,
            display: 'block',
            overflow: 'visible',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            width: '100%',
            maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
            mx: 'auto',
            hyphens: 'auto',
            overflowWrap: 'break-word',
            wordWrap: 'break-word'
          }}
        >
          {title || 'Digite seu título'}
        </Typography>
      </Paper>
      ) : (
        <Typography
          variant="h3"
          component="div"
          sx={{
            color: titleColor,
            fontFamily: style.fontFamily,
            fontSize: {
              xs: isMemoryPage 
                ? `calc(${style.titleSize || 48}px * 0.25)` 
                : `calc(${style.titleSize || 48}px * 0.18)`,
              sm: isMemoryPage 
                ? `calc(${style.titleSize || 48}px * 0.35)` 
                : `calc(${style.titleSize || 48}px * 0.25)`,
              md: isMemoryPage 
                ? `calc(${style.titleSize || 48}px * 0.45)` 
                : `calc(${style.titleSize || 48}px * 0.45)`
            },
            textAlign: 'center',
            fontWeight: 'medium',
            lineHeight: 1.1,
            mb: timeText ? 0.5 : 0,
            py: 0.2,
            display: 'block',
            overflow: 'visible',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            width: '100%',
            maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
            mx: 'auto',
            hyphens: 'auto',
            overflowWrap: 'break-word',
            wordWrap: 'break-word'
          }}
        >
          {title || 'Digite seu título'}
        </Typography>
      )}

      {/* Contador */}
        {timeText && (
        showCounterCard ? (
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
              backgroundColor: counterBgColor || style.backgroundColor,
              borderRadius: isMemoryPage ? 3 : 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: isMemoryPage ? { xs: 0.8, sm: 1.2 } : { xs: 0.4, sm: 0.8 },
              mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.3, sm: 0.5 },
              boxShadow: isMemoryPage ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.05)',
              mx: 'auto'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2, md: 3 },
                position: 'relative',
                width: '100%',
                maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
                mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.3, sm: 0.5 },
                mx: 'auto'
              }}
            >
              <AnimatePresence>
                {showAnimation && selectedEmoji && (
                  <>
                    <Box
                      component={motion.div}
                      animate={floatAnimation}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                      }}
                    >
                      {selectedEmoji}
                    </Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: counterColor,
                        fontFamily: counterFont,
                        textAlign: 'center',
                        fontWeight: 'medium',
                        fontSize: { 
                          xs: isMemoryPage ? '0.9rem' : '0.65rem', 
                          sm: isMemoryPage ? '1.1rem' : '0.8rem',
                          md: isMemoryPage ? '1.3rem' : '0.9rem'
                        },
                        display: 'block',
                        overflow: 'visible',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        flex: 1,
                        hyphens: 'auto',
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word'
                      }}
                    >
                      {timeText}
                    </Typography>
                    <Box
                      component={motion.div}
                      animate={floatAnimation}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                      }}
                    >
                      {selectedEmoji}
                    </Box>
                  </>
                )}
                {(!showAnimation || !selectedEmoji) && (
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: counterColor,
                      fontFamily: counterFont,
                      textAlign: 'center',
                      fontWeight: 'medium',
                      fontSize: { 
                        xs: isMemoryPage ? '0.9rem' : '0.65rem', 
                        sm: isMemoryPage ? '1.1rem' : '0.8rem',
                        md: isMemoryPage ? '1.3rem' : '0.9rem'
                      },
                      display: 'block',
                      overflow: 'visible',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      flex: 1,
                      hyphens: 'auto',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word'
                    }}
                  >
                    {timeText}
                  </Typography>
                )}
              </AnimatePresence>
            </Box>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2, md: 3 },
              position: 'relative',
              width: '100%',
              maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
              mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.3, sm: 0.5 },
              mx: 'auto'
            }}
          >
            <AnimatePresence>
              {showAnimation && selectedEmoji && (
                <>
                  <Box
                    component={motion.div}
                    animate={floatAnimation}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    {selectedEmoji}
                  </Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: counterColor,
                      fontFamily: counterFont,
                      textAlign: 'center',
                      fontWeight: 'medium',
                      fontSize: { 
                        xs: isMemoryPage ? '0.9rem' : '0.65rem', 
                        sm: isMemoryPage ? '1.1rem' : '0.8rem',
                        md: isMemoryPage ? '1.3rem' : '0.9rem'
                      },
                      display: 'block',
                      overflow: 'visible',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      flex: 1,
                      hyphens: 'auto',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word'
                    }}
                  >
                    {timeText}
                  </Typography>
                  <Box
                    component={motion.div}
                    animate={floatAnimation}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    {selectedEmoji}
                  </Box>
                </>
              )}
              {(!showAnimation || !selectedEmoji) && (
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: counterColor,
                    fontFamily: counterFont,
                    textAlign: 'center',
                    fontWeight: 'medium',
                    fontSize: { 
                      xs: isMemoryPage ? '0.9rem' : '0.65rem', 
                      sm: isMemoryPage ? '1.1rem' : '0.8rem',
                      md: isMemoryPage ? '1.3rem' : '0.9rem'
                    },
                    display: 'block',
                    overflow: 'visible',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    flex: 1,
                    hyphens: 'auto',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word'
                  }}
                >
                  {timeText}
                </Typography>
              )}
            </AnimatePresence>
          </Box>
        )
        )}

      {/* Mensagem */}
        {message && (
        showMessageCard ? (
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: isMemoryPage ? { xs: '95%', sm: '85%', md: '90%', lg: '85%', xl: '80%' } : '100%',
              backgroundColor: messageBgColor || style.backgroundColor,
              borderRadius: isMemoryPage ? 3 : 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: isMemoryPage ? { xs: 0.8, sm: 1.2 } : { xs: 0.4, sm: 0.8 },
              mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.3, sm: 0.5 },
              boxShadow: isMemoryPage ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.05)',
              mx: 'auto'
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                color: messageColor || 'text.primary',
                fontFamily: messageFont,
                textAlign: 'center',
                fontSize: { 
                  xs: isMemoryPage ? '0.75rem' : '0.55rem', 
                  sm: isMemoryPage ? '0.85rem' : '0.6rem', 
                  md: isMemoryPage ? '1rem' : '0.7rem', 
                  lg: isMemoryPage ? '1.1rem' : '0.75rem' 
                },
                maxWidth: '100%',
                width: '100%',
                display: 'block',
                overflow: 'visible',
                wordBreak: 'break-word',
                fontWeight: messageStyle?.includes('bold') ? 'bold' : 'normal',
                fontStyle: messageStyle?.includes('italic') ? 'italic' : 'normal',
                whiteSpace: 'pre-line',
                mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.3, sm: 0.5 },
                mx: 'auto',
                hyphens: 'auto',
                overflowWrap: 'break-word',
                wordWrap: 'break-word'
              }}
            >
              {message}
            </Typography>
          </Paper>
        ) : (
          <Typography
            variant="body1"
            component="div"
            sx={{
              color: messageColor || 'text.primary',
              fontFamily: messageFont,
              textAlign: 'center',
              fontSize: { 
                xs: isMemoryPage ? '0.75rem' : '0.55rem', 
                sm: isMemoryPage ? '0.85rem' : '0.6rem', 
                md: isMemoryPage ? '1rem' : '0.7rem', 
                lg: isMemoryPage ? '1.1rem' : '0.75rem' 
              },
              maxWidth: '100%',
              width: '100%',
              display: 'block',
              overflow: 'visible',
              wordBreak: 'break-word',
              fontWeight: messageStyle?.includes('bold') ? 'bold' : 'normal',
              fontStyle: messageStyle?.includes('italic') ? 'italic' : 'normal',
              whiteSpace: 'pre-line',
              mt: isMemoryPage ? { xs: 0.2, sm: 0.3 } : { xs: 0.3, sm: 0.5 },
              mx: 'auto',
              hyphens: 'auto',
              overflowWrap: 'break-word',
              wordWrap: 'break-word'
            }}
          >
            {message}
          </Typography>
        )
      )}
    </>
  );

  // Determinar se é um gradiente
  const isGradient = webBgColor && typeof webBgColor === 'string' && webBgColor.includes('gradient');

  // Configurar o background com base no tipo
  const backgroundConfig = isGradient 
    ? { backgroundImage: webBgColor, backgroundColor: 'transparent' } 
    : { backgroundColor: webBgColor, backgroundImage: 'none' };

  useEffect(() => {
    console.log('Configuração de background:', {
      isGradient,
      webBgColor,
      backgroundConfig
    });
  }, [webBgColor, isGradient]);

  // Adiciona flag para controlar se o usuário já interagiu com a página
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Função para reproduzir o player de Spotify após interação do usuário
  const playSpotifyAfterInteraction = useCallback(() => {
    if (userInteracted || !isMemoryPage || !isPlaying || musicType !== 1) return;
    
    setUserInteracted(true);
    console.log('[TitlePreview] Usuário interagiu, tentando reproduzir música');
    
    try {
      const spotifyIframe = document.getElementById('spotify-preview-iframe');
      if (spotifyIframe) {
        // Adicionar parâmetros de autoplay e forçar recarregamento
        let currentSrc = spotifyIframe.src;
        if (!currentSrc.includes('autoplay=1')) {
          currentSrc = currentSrc.includes('?') 
            ? `${currentSrc}&autoplay=1&init=1&t=${Date.now()}`
            : `${currentSrc}?autoplay=1&init=1&t=${Date.now()}`;
          spotifyIframe.src = currentSrc;
        }
        
        // Enviar comando para reproduzir após um curto delay
        setTimeout(() => {
          try {
            spotifyIframe.contentWindow.postMessage({ command: 'play' }, '*');
          } catch (e) {
            console.log('[TitlePreview] Erro ao enviar comando de play:', e);
          }
        }, 300);
      }
    } catch (error) {
      console.error('[TitlePreview] Erro ao tentar reproduzir após interação:', error);
    }
  }, [isMemoryPage, isPlaying, musicType, userInteracted]);
  
  // Adicionar event listeners para interações do usuário
  useEffect(() => {
    if (isMemoryPage && musicType === 1 && !userInteracted) {
      const eventHandler = () => playSpotifyAfterInteraction();
      
      // Eventos que representam interação do usuário
      const events = ['click', 'touchstart', 'keydown', 'scroll'];
      
      events.forEach(event => {
        document.addEventListener(event, eventHandler, { once: true });
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, eventHandler);
        });
      };
    }
  }, [isMemoryPage, musicType, playSpotifyAfterInteraction, userInteracted]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: { xs: isMemoryPage ? '100%' : '100%', md: isMemoryPage ? '1000px' : '520px' },
        width: '100%',
        height: isMemoryPage ? 'auto' : 'auto',
        minHeight: isMemoryPage ? 'auto' : '700px', // Aumentando a altura mínima de 600px para 700px
        maxHeight: isMemoryPage ? 'none' : (memories?.length > 0 ? 'none' : { xs: 'none', md: '800px' }), // Aumentando a altura máxima de 600px para 800px
        position: 'relative',
        overflow: 'visible',
        borderRadius: isMemoryPage ? 0 : 2,
        bgcolor: isMemoryPage ? 'transparent' : webBgColor,
        backgroundImage: !isMemoryPage && typeof webBgColor === 'string' && webBgColor.includes('linear-gradient') ? webBgColor : 'none',
        mx: 'auto',
        boxShadow: isMemoryPage ? 'none' : (visualEffect ? '0 0 15px rgba(0,0,0,0.3)' : '0 0 5px rgba(0,0,0,0.1)'),
        border: isMemoryPage ? 'none' : (visualEffect ? '1px solid rgba(255,255,255,0.2)' : 'none'),
        transform: isMemoryPage ? 'none' : { xs: 'scale(0.85)', md: 'scale(1)' },
        transition: 'all 0.3s ease-in-out',
        py: isMemoryPage ? { xs: 2, md: 0 } : 0
      }}
    >
      {console.log('TitlePreview - Aplicando background:', webBgColor, 'com efeito:', visualEffect)}
      {visualEffect && <VisualEffects effect={visualEffect} />}
      
      {!isMemoryPage ? (
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            height: 'auto',
            borderRadius: isMemoryPage ? { xs: 0, md: 2 } : 2,
            overflow: 'visible',
            boxShadow: isMemoryPage ? { xs: 'none', md: '0 6px 16px rgba(0,0,0,0.1)' } : '0 6px 16px rgba(0,0,0,0.1)',
            aspectRatio: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '700px', // Aumentando a altura mínima de 600px para 700px
            maxHeight: isMemoryPage ? 'none' : 'auto',
            position: 'relative',
            zIndex: 1,
            fontSize: { md: '16px' } // Aumenta o tamanho base da fonte em desktop
          }}
        >
          {/* Barra de título do navegador */}
          <Box 
            sx={{
              bgcolor: '#f0f0f0',
              height: { xs: '32px', sm: '38px' },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 1, sm: 2 },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {/* Círculos de controle da janela */}
            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
              <Box sx={{ width: { xs: 10, sm: 12 }, height: { xs: 10, sm: 12 }, borderRadius: '50%', bgcolor: '#ff5f57' }} />
              <Box sx={{ width: { xs: 10, sm: 12 }, height: { xs: 10, sm: 12 }, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
              <Box sx={{ width: { xs: 10, sm: 12 }, height: { xs: 10, sm: 12 }, borderRadius: '50%', bgcolor: '#28ca41' }} />
            </Box>
            
            {/* Barra de endereço */}
            <Box 
              sx={{ 
                flex: 1, 
                mx: { xs: 1, sm: 2 }, 
                height: { xs: '20px', sm: '24px' }, 
                bgcolor: 'transparent', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: { xs: 1, sm: 3 },
                paddingRight: { xs: 3, sm: 5 },
                fontSize: { xs: '11px', sm: '13px' },
                color: '#666',
                fontFamily: 'monospace',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#2e7d32' }}>
                <LockIcon sx={{ fontSize: { xs: 12, sm: 14 }, mr: 0.5, color: '#2e7d32' }} />
                saymealways.com.br/memory/{formatUrl(title || 'meu-titulo')}
              </Box>
            </Box>
            
            {/* Espaço para botões extras */}
            <Box sx={{ width: { xs: 24, sm: 40 } }} />
          </Box>
          
          {/* Conteúdo da página no navegador */}
          <Box sx={{ 
            ...(isGradient && !isMemoryPage
              ? { backgroundImage: webBgColor, backgroundColor: 'transparent' } 
              : { backgroundColor: isMemoryPage ? 'transparent' : (webBgColor || '#f5f5f5') }), 
            p: isMemoryPage ? { xs: 1, sm: 2 } : { xs: 0.5, sm: 2 },
            py: isMemoryPage ? { xs: 1.5, sm: 2 } : { xs: 2, sm: 3 },
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
            height: 'auto',
            minHeight: 'calc(100% - 38px)', // Garante que preencha todo o espaço disponível menos a barra de navegador
          }}>
            {renderContent()}
          </Box>
        </Paper>
      ) : (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMemoryPage ? { xs: 0.6, sm: 1, md: 1.5 } : { xs: 0.8, sm: 1 },
          width: '100%',
          height: 'auto',
          maxWidth: isMemoryPage ? { xs: '100%', sm: '90%', md: '950px' } : '100%',
          padding: isMemoryPage ? { xs: 1, sm: 1.5, md: 2 } : { xs: 2, sm: 3 },
          overflow: 'visible',
          justifyContent: isMemoryPage ? 'center' : 'flex-start',
          alignItems: 'center',
          margin: '0 auto',
          backgroundColor: isMemoryPage ? 'transparent' : undefined
        }}>
          {renderContent()}
        </Box>
      )}
    </Box>
  );
}
