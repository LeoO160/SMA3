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
        // Uma abordagem para contornar a política de autoplay dos navegadores
        // é usar um evento de interação do usuário para iniciar a reprodução
        
        // Primeira tentativa imediata 
        tryPlaySpotify();
        
        // Segunda tentativa com timeout
        setTimeout(tryPlaySpotify, 1500);
        
        // Último recurso: adicionar um listener para qualquer interação do usuário
        const handleUserInteraction = () => {
          console.log('[Memory] Interação do usuário detectada, tentando reproduzir');
          tryPlaySpotify();
          
          // Remover eventos após primeira interação
          ['click', 'touchstart', 'keydown'].forEach(event => {
            document.removeEventListener(event, handleUserInteraction);
          });
        };
        
        // Adicionar eventos para capturar qualquer interação
        ['click', 'touchstart', 'keydown'].forEach(event => {
          document.addEventListener(event, handleUserInteraction);
        });
        
        // Função para tentar iniciar o player do Spotify
        function tryPlaySpotify() {
          const spotifyIframe = document.getElementById('spotify-preview-iframe');
          if (spotifyIframe) {
            try {
              // Determina o tipo de conteúdo Spotify
              let contentType = 'track';
              if (memoryData.musicUrl) {
                if (memoryData.musicUrl.includes('/playlist/')) contentType = 'playlist';
                if (memoryData.musicUrl.includes('/album/')) contentType = 'album';
              }
              
              // Forçar a atualização do iframe com todos os parâmetros necessários e timestamp para evitar cache
              const newSrc = `https://open.spotify.com/embed/${contentType}/${memoryData.trackId}?utm_source=generator&theme=1&autoplay=1&init=1&loop=1&t=${new Date().getTime()}`;
              console.log('[Memory] Atualizando iframe com:', newSrc);
              spotifyIframe.src = newSrc;
              
              // Tentar enviar comando de play para o iframe do Spotify
              setTimeout(() => {
                try {
                  spotifyIframe.contentWindow.postMessage({ command: 'play' }, '*');
                } catch (e) {
                  console.log('[Memory] Erro ao enviar comando para iframe:', e);
                }
              }, 500);
            } catch (error) {
              console.error('[Memory] Erro ao inicializar player:', error);
            }
          }
        }
        
        // Retornar função de limpeza para remover os event listeners
        return () => {
          ['click', 'touchstart', 'keydown'].forEach(event => {
            document.removeEventListener(event, handleUserInteraction);
          });
        };
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