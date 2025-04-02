import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress, IconButton, Fade } from '@mui/material';
import TitlePreview from '../components/TitlePreview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getMemoryByUrl } from '../supabase/supabaseClient';
import VisualEffects from '../components/VisualEffects';

export default function Memory() {
  const { urlPath } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const spotifyIframeRef = useRef(null);
  
  // Função para iniciar a reprodução após interação do usuário
  const startPlayback = () => {
    console.log('[Memory] Iniciando reprodução após interação do usuário');
    setShowOverlay(false);
    
    try {
      // Tenta iniciar a reprodução imediatamente após a interação do usuário
      const iframe = document.getElementById('spotify-preview-iframe');
      if (iframe && memoryData?.musicType === 1 && memoryData?.trackId) {
        // Determina o tipo de conteúdo
        let contentType = 'track';
        if (memoryData.musicUrl) {
          if (memoryData.musicUrl.includes('/playlist/')) contentType = 'playlist';
          if (memoryData.musicUrl.includes('/album/')) contentType = 'album';
        }
        
        // Recarrega o iframe com parâmetros otimizados e um timestamp para evitar cache
        const newSrc = `https://open.spotify.com/embed/${contentType}/${memoryData.trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${Date.now()}`;
        console.log('[Memory] Atualizando URL do iframe após interação:', newSrc);
        iframe.src = newSrc;
        
        // Armazena a referência para usar em tentativas posteriores
        spotifyIframeRef.current = iframe;
        
        // Programa múltiplas tentativas de reprodução em diferentes momentos
        setTimeout(() => {
          try {
            console.log('[Memory] Tentativa 1 de reprodução');
            if (spotifyIframeRef.current) {
              spotifyIframeRef.current.contentWindow.postMessage({ command: 'play' }, '*');
            }
          } catch (e) {
            console.log('[Memory] Erro na tentativa 1:', e);
          }
        }, 500);
        
        setTimeout(() => {
          try {
            console.log('[Memory] Tentativa 2 de reprodução');
            if (spotifyIframeRef.current) {
              spotifyIframeRef.current.contentWindow.postMessage({ command: 'play' }, '*');
            }
          } catch (e) {
            console.log('[Memory] Erro na tentativa 2:', e);
          }
        }, 1500);
        
        // Uma tentativa final após um tempo mais longo
        setTimeout(() => {
          try {
            console.log('[Memory] Tentativa final de reprodução');
            if (spotifyIframeRef.current) {
              // Recarrega o iframe uma última vez com novos parâmetros
              spotifyIframeRef.current.src = `https://open.spotify.com/embed/${contentType}/${memoryData.trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${Date.now()}-final`;
              // Tenta enviar o comando novamente após um breve atraso
              setTimeout(() => {
                spotifyIframeRef.current.contentWindow.postMessage({ command: 'play' }, '*');
              }, 300);
            }
          } catch (e) {
            console.log('[Memory] Erro na tentativa final:', e);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('[Memory] Erro ao iniciar reprodução:', error);
    }
  };

  // Efeito para carregar os dados da memória
  useEffect(() => {
    const fetchMemory = async () => {
      setLoading(true);
      
      try {
        console.log('[Memory] Buscando memória com urlPath:', urlPath);
        
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
  
  // Efeito para monitorar eventos de interação com a página
  useEffect(() => {
    if (!loading && memoryData?.musicType === 1 && showOverlay) {
      const handleUserInteraction = (e) => {
        // Se o clique foi dentro do botão de play no overlay ou qualquer lugar na página
        startPlayback();
      };
      
      // Adiciona handlers para eventos de interação comuns
      window.addEventListener('click', handleUserInteraction, { once: true });
      window.addEventListener('touchstart', handleUserInteraction, { once: true });
      window.addEventListener('keydown', handleUserInteraction, { once: true });
      
      return () => {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
      };
    }
  }, [loading, memoryData, showOverlay]);
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  // Renderiza um indicador de carregamento
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
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
        {/* Overlay para forçar interação do usuário */}
        {showOverlay && memoryData.musicType === 1 && (
          <Fade in={showOverlay}>
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                padding: 3,
                cursor: 'pointer',
              }}
              onClick={startPlayback}
            >
              <Box 
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 40, color: '#333' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  textAlign: 'center',
                  maxWidth: 400,
                  fontWeight: 'medium',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Clique para iniciar a experiência com música
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mt: 1, 
                  textAlign: 'center',
                  maxWidth: 450,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                O navegador exige uma interação do usuário para ativar a reprodução automática de áudio
              </Typography>
            </Box>
          </Fade>
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
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            spotifyInteractionForced={!showOverlay}
          />
        </Box>
      </Box>
    );
  }
  
  // Fallback
  return null;
} 