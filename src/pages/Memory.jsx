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
  
  // Novo useEffect para garantir reprodução automática
  useEffect(() => {
    if (memoryData && !loading) {
      console.log('[Memory] Garantindo reprodução automática');
      
      // Força isPlaying como true
      setIsPlaying(true);
      
      // Para players de Spotify, tentamos iniciar a reprodução após a carga completa da página
      if (memoryData.musicType === 1 && memoryData.trackId) {
        // Verificar se o iframe já existe (em caso de carregamento rápido)
        setTimeout(() => {
          const spotifyIframe = document.getElementById('spotify-preview-iframe');
          if (spotifyIframe) {
            console.log('[Memory] Forçando inicialização do player do Spotify');
            
            try {
              // Determina o tipo de conteúdo Spotify
              let contentType = 'track';
              if (memoryData.musicUrl) {
                if (memoryData.musicUrl.includes('/playlist/')) contentType = 'playlist';
                if (memoryData.musicUrl.includes('/album/')) contentType = 'album';
              }
              
              // Forçar a atualização do iframe com todos os parâmetros necessários
              const newSrc = `https://open.spotify.com/embed/${contentType}/${memoryData.trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${new Date().getTime()}`;
              spotifyIframe.src = newSrc;
              
              // Tentar enviar comando de play após um curto período
              window.addEventListener('message', function spotifyMessageHandler(e) {
                if (e.data && typeof e.data === 'object' && e.data.type === 'ready') {
                  console.log('[Memory] Player do Spotify pronto, enviando comando de play');
                  spotifyIframe.contentWindow.postMessage({ command: 'play' }, '*');
                  window.removeEventListener('message', spotifyMessageHandler);
                }
              });
            } catch (error) {
              console.error('[Memory] Erro ao inicializar player:', error);
            }
          }
        }, 1000);
      }
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