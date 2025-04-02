import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import TitlePreview from '../components/TitlePreview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getMemoryByUrl } from '../supabase/supabaseClient';
import VisualEffects from '../components/VisualEffects';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import '../styles/memoryAnimation.css';

export default function Memory() {
  const { urlPath } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showInitialBlackScreen, setShowInitialBlackScreen] = useState(true);
  const maxRetries = 5;
  
  // Estado para controlar a tela preta inicial
  const [showBlackScreen, setShowBlackScreen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Detecta se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // Monitora interações do usuário
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteraction(true);
    };

    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  // Efeito para atualizar o progresso do carregamento
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setLoadingProgress(Math.min(progress, 100));
    }, 30); // Atualiza a cada 30ms para completar em 3 segundos

    return () => clearInterval(interval);
  }, []);

  // Efeito para carregar os dados da memória
  useEffect(() => {
    const fetchMemory = async () => {
      setLoading(true);
      
      try {
        console.log('[Memory] Buscando memória com urlPath:', urlPath);
        
        // Adiciona um delay artificial de 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Buscar dados usando a nova API que retorna diretamente o objeto
        const data = await getMemoryByUrl(urlPath);
        
        console.log('[Memory] Dados recebidos do Supabase:', data);
        
        // Definir os dados recuperados
        setMemoryData(data);
        setLoading(false);
      } catch (fetchError) {
        console.error('[Memory] Erro ao buscar memória:', fetchError);
        setError('Não foi possível carregar esta memória. Ela pode não existir ou houve um problema de conexão.');
        setLoading(false);
      }
    };
    
    fetchMemory();
  }, [urlPath]);
  
  // Efeito para garantir reprodução automática do Spotify
  useEffect(() => {
    if (memoryData && !loading && !showBlackScreen) {
      console.log('[Memory] Garantindo reprodução automática');
      
      // Força isPlaying como true
      setIsPlaying(true);
      
      // Verifica especificamente se é Spotify para iniciar a reprodução
      if (memoryData.musicType === 1 && memoryData.trackId) {
        const attemptToPlay = () => {
          try {
            // Tenta encontrar o iframe do Spotify
            const spotifyFrame = document.getElementById('spotify-preview-iframe');
            if (spotifyFrame) {
              console.log('[Memory] Tentando iniciar reprodução do Spotify via iframe:', spotifyFrame);
              
              // Atualiza a URL do iframe com parâmetros de autoplay
              const timestamp = new Date().getTime();
              spotifyFrame.src = `https://open.spotify.com/embed/track/${memoryData.trackId}?utm_source=generator&autoplay=1&play=1&t=${timestamp}`;
              
              // Tenta múltiplas abordagens para iniciar a reprodução
              setTimeout(() => {
                try {
                  console.log('[Memory] Enviando comandos postMessage para o iframe');
                  // Comando padrão
                  spotifyFrame.contentWindow.postMessage({ command: 'play' }, '*');
                  // Comando alternativo
                  spotifyFrame.contentWindow.postMessage({ type: 'spotify', action: 'play' }, '*');
                  // Comando específico da API Embed do Spotify
                  spotifyFrame.contentWindow.postMessage({ command: 'toggle', toggle: true }, '*');
                } catch (err) {
                  console.error('[Memory] Erro ao enviar comando para o iframe:', err);
                }
              }, 1000);
            } else {
              console.log('[Memory] Iframe do Spotify não encontrado, tentando novamente em 500ms');
              // Se o iframe ainda não estiver disponível, tenta novamente após um curto período
              setTimeout(attemptToPlay, 500);
            }
          } catch (error) {
            console.error('[Memory] Erro ao tentar iniciar player:', error);
            if (retryCount < maxRetries) {
              setRetryCount(prev => prev + 1);
              setTimeout(attemptToPlay, 1000);
            }
          }
        };
        
        // Primeira tentativa após um delay inicial
        setTimeout(attemptToPlay, 1000);
        
        // Segunda tentativa após um delay maior, caso a primeira falhe
        setTimeout(attemptToPlay, 3000);
      }
    }
  }, [memoryData, loading, retryCount, showBlackScreen]);

  // Função para iniciar a transição ao clicar no botão
  const handleStartMemory = () => {
    setIsTransitioning(true);
    setHasUserInteraction(true);
    
    // Em dispositivos móveis, precisamos pré-carregar o áudio para garantir que ele funcionará
    if (isMobile) {
      // Cria um contexto de áudio silencioso para "desbloquear" o áudio em iOS/Android
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 1; // Valor muito baixo, inaudível
        oscillator.connect(audioContext.destination);
        oscillator.start(0);
        oscillator.stop(0.1); // Para imediatamente
        
        console.log('[Memory] Contexto de áudio desbloqueado para iOS/Android');
        
        // Em iOS, o iframe também precisa ser recarregado após a interação
        if (memoryData && memoryData.musicType === 1 && memoryData.trackId) {
          setTimeout(() => {
            const spotifyFrame = document.getElementById('spotify-preview-iframe');
            if (spotifyFrame) {
              // Marca o iframe para ser recarregado quando a tela preta desaparecer
              spotifyFrame.dataset.needsReload = 'true';
            }
          }, 100);
        }
      } catch (e) {
        console.error('[Memory] Erro ao tentar desbloquear áudio:', e);
      }
    }
    
    // Timer para remover a tela preta após a animação completar
    setTimeout(() => {
      setShowBlackScreen(false);
      
      // Após a tela desaparecer, tenta iniciar a reprodução novamente
      if (memoryData && memoryData.musicType === 1 && memoryData.trackId) {
        setTimeout(() => {
          const spotifyFrame = document.getElementById('spotify-preview-iframe');
          if (spotifyFrame && spotifyFrame.dataset.needsReload === 'true') {
            // Recarrega o iframe com novos parâmetros após a interação do usuário
            const timestamp = new Date().getTime();
            spotifyFrame.src = `https://open.spotify.com/embed/track/${memoryData.trackId}?utm_source=generator&autoplay=1&play=1&t=${timestamp}`;
            
            // Envia mensagens de controle após um curto delay
            setTimeout(() => {
              try {
                spotifyFrame.contentWindow.postMessage({ command: 'play' }, '*');
                spotifyFrame.contentWindow.postMessage({ type: 'spotify', action: 'play' }, '*');
                spotifyFrame.contentWindow.postMessage({ command: 'toggle', toggle: true }, '*');
              } catch (err) {
                console.error('[Memory] Erro ao enviar comando para o iframe após transição:', err);
              }
            }, 800);
          }
        }, 100);
      }
    }, 1500); // 1.5 segundos para a animação completar
  };
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  // Efeito para controlar a tela preta inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialBlackScreen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Renderiza um indicador de carregamento
  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: showInitialBlackScreen ? '#000000' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          transition: 'background-color 0.5s ease-in-out'
        }}
      >
        {!showInitialBlackScreen && (
          <>
            <CircularProgress 
              variant="determinate" 
              value={loadingProgress} 
              size={80}
              thickness={4}
              sx={{
                color: '#1976D2',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Typography variant="h6" color="primary">
              Carregando sua memória...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(loadingProgress)}%
            </Typography>
          </>
        )}
      </Box>
    );
  }
  
  // Renderiza uma mensagem de erro
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        p={3}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Voltar para a Home
        </Button>
      </Box>
    );
  }
  
  // Se chegou até aqui, temos dados para mostrar
  if (memoryData) {
    // Verificar se a cor de fundo é um gradiente
    const isGradient = typeof memoryData.webBgColor === 'string' && memoryData.webBgColor.includes('gradient');
    
    console.log('[Memory] Renderizando memória:', memoryData);
    console.log('[Memory] Propriedades importantes:', {
      title: memoryData.title,
      url: memoryData.urlPath,
      webBgColor: memoryData.webBgColor,
      musicInfo: memoryData.musicInfo,
      videoId: memoryData.videoId
    });
    
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          ...(isGradient
            ? { 
                backgroundImage: memoryData.webBgColor,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center'
              }
            : { 
                backgroundColor: memoryData.webBgColor || '#f5f5f5'
              })
        }}
      >
        {/* Tela preta inicial com botão usando CSS puro */}
        {showBlackScreen && (
          <div className={`black-screen ${isTransitioning ? 'fade-out' : ''}`}>
            <div className={`button-container ${isTransitioning ? 'button-exit' : ''}`}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleStartMemory}
                disabled={isTransitioning}
                className="memory-start-button"
                sx={{
                  padding: { xs: '10px 24px', sm: '12px 30px' },
                  borderRadius: '30px',
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  background: 'linear-gradient(45deg, #1565C0 30%, #1976D2 90%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                  },
                }}
              >
                {isTransitioning ? 'Carregando...' : 'Ver Memória'}
              </Button>
            </div>
          </div>
        )}

        {/* Botão para voltar */}
        <IconButton
          onClick={handleGoBack}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: '#333',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#000'
            },
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        {/* Efeitos visuais */}
        {memoryData.visualEffect && (
          <VisualEffects effect={memoryData.visualEffect} />
        )}
        
        {/* Componente TitlePreview para mostrar o título - com container responsivo */}
        <Box 
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '95%', md: '85%' },
            padding: { xs: 1, sm: 2, md: 3 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <TitlePreview 
            {...memoryData}
            isMemoryPage={true}
            isPlaying={isPlaying && !showBlackScreen}
            onPlayPause={() => setIsPlaying(!isPlaying)}
          />
        </Box>
      </Box>
    );
  }
  
  // Fallback
  return null;
} 