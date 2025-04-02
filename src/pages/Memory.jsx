import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import TitlePreview from '../components/TitlePreview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getMemoryByUrl } from '../supabase/supabaseClient';
import VisualEffects from '../components/VisualEffects';

export default function Memory() {
  const { urlPath } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
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
  
  // Novo useEffect para garantir reprodução automática e contornar bloqueios de navegador
  useEffect(() => {
    if (memoryData && !loading) {
      console.log('[Memory] Garantindo reprodução automática com força máxima');
      
      // Força isPlaying como true
      setIsPlaying(true);
      
      // Função para criar e executar um hack de autoplay
      function createAutoplayHack() {
        console.log('[Memory] Criando hack de autoplay');
        
        // Cria um áudio silencioso para desbloquear o autoplay
        const silentAudio = document.createElement('audio');
        silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        silentAudio.volume = 0.001; // Praticamente inaudível
        document.body.appendChild(silentAudio);
        
        // Tenta reproduzir o áudio silencioso
        silentAudio.play().then(() => {
          console.log('[Memory] Áudio desbloqueado, tentando player');
          forcePlaySpotify();
        }).catch(() => {
          console.log('[Memory] Falha no desbloqueio de áudio');
        });
        
        // Simulador de toque/clique - cria um evento sintético
        const touchSimulator = document.createElement('div');
        touchSimulator.style.position = 'fixed';
        touchSimulator.style.top = '0';
        touchSimulator.style.left = '0';
        touchSimulator.style.width = '100%';
        touchSimulator.style.height = '100%';
        touchSimulator.style.zIndex = '9999';
        touchSimulator.style.opacity = '0';
        touchSimulator.style.pointerEvents = 'none';
        document.body.appendChild(touchSimulator);
        
        // Função para simular clique do usuário
        function simulateClick() {
          // Cria e dispara um evento de mouse
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          touchSimulator.dispatchEvent(clickEvent);
          
          // Tenta iniciar a reprodução após o "clique"
          silentAudio.play().catch(() => {});
          forcePlaySpotify();
        }
        
        // Simulação de interação do usuário
        setTimeout(simulateClick, 500);
        setTimeout(simulateClick, 2000);
        setTimeout(simulateClick, 5000);
        
        // Também tenta via eventos reais
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
          document.addEventListener(event, () => {
            silentAudio.play().catch(() => {});
            forcePlaySpotify();
          }, { once: true });
        });
        
        // Limpa elementos após uso
        return () => {
          if (document.body.contains(silentAudio)) document.body.removeChild(silentAudio);
          if (document.body.contains(touchSimulator)) document.body.removeChild(touchSimulator);
        };
      }
      
      // Força a reprodução do Spotify de várias maneiras
      function forcePlaySpotify() {
        if (memoryData.musicType === 1 && memoryData.trackId) {
          const spotifyIframe = document.getElementById('spotify-preview-iframe');
          if (spotifyIframe) {
            try {
              // Determina o tipo de conteúdo Spotify
              let contentType = 'track';
              if (memoryData.musicUrl) {
                if (memoryData.musicUrl.includes('/playlist/')) contentType = 'playlist';
                if (memoryData.musicUrl.includes('/album/')) contentType = 'album';
              }
              
              // 1. Atualiza URL com parâmetros de força máxima e timestamp
              const newSrc = `https://open.spotify.com/embed/${contentType}/${memoryData.trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${new Date().getTime()}`;
              console.log('[Memory] Atualizando iframe com URL de força máxima:', newSrc);
              spotifyIframe.src = newSrc;
              
              // 2. Mensagem direta para o iframe
              setTimeout(() => {
                try {
                  spotifyIframe.contentWindow.postMessage({ command: 'play' }, '*');
                } catch (e) {
                  console.log('[Memory] Erro ao enviar comando via postMessage:', e);
                }
              }, 800);
              
              // 3. Manipulação direta via JavaScript (hack)
              setTimeout(() => {
                try {
                  // Tenta acessar o botão de play dentro do iframe
                  const iframeDoc = spotifyIframe.contentDocument || spotifyIframe.contentWindow.document;
                  const playButton = iframeDoc.querySelector('[data-testid="play-button"], button.control-button--circled');
                  if (playButton) {
                    console.log('[Memory] Botão de play encontrado, clicando');
                    playButton.click();
                  }
                } catch (e) {
                  console.log('[Memory] Erro ao tentar acessar conteúdo do iframe:', e);
                }
              }, 2000);
            } catch (error) {
              console.error('[Memory] Erro ao tentar reproduzir Spotify:', error);
            }
          }
        }
      }
      
      // Inicia o hack
      const cleanup = createAutoplayHack();
      
      // Retorna função de limpeza
      return cleanup;
    }
  }, [memoryData, loading]);
  
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
          />
        </Box>
      </Box>
    );
  }
  
  // Fallback
  return null;
} 