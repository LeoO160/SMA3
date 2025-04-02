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
  
  // Novo useEffect para garantir reprodução automática do Spotify
  useEffect(() => {
    if (memoryData && !loading) {
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
              
              // Registra um listener para mensagens do iframe
              window.addEventListener('message', (event) => {
                // Verifica se a origem da mensagem é confiável (Spotify)
                if (event.origin.includes('spotify.com')) {
                  console.log('[Memory] Mensagem recebida do Spotify:', event.data);
                }
              }, { once: true });
              
              // Tenta múltiplas abordagens para iniciar a reprodução
              try {
                console.log('[Memory] Enviando comandos postMessage para o iframe');
                // Comando padrão
                spotifyFrame.contentWindow.postMessage({ command: 'play' }, '*');
                // Comando alternativo
                spotifyFrame.contentWindow.postMessage({ type: 'spotify', action: 'play' }, '*');
                // Comando específico da API Embed do Spotify
                spotifyFrame.contentWindow.postMessage({ command: 'toggle', toggle: true }, '*');
                
                // Opção alternativa: recarregar o iframe com parâmetros para autoplay
                const currentSrc = spotifyFrame.src;
                if (!currentSrc.includes('autoplay=1')) {
                  console.log('[Memory] Atualizando URL do iframe para forçar autoplay');
                  const timestamp = new Date().getTime();
                  spotifyFrame.src = `${currentSrc.split('?')[0]}?autoplay=1&play=1&t=${timestamp}`;
                }
              } catch (err) {
                console.error('[Memory] Erro ao enviar comando para o iframe:', err);
              }
            } else {
              console.log('[Memory] Iframe do Spotify não encontrado, tentando novamente em 500ms');
              // Se o iframe ainda não estiver disponível, tenta novamente após um curto período
              setTimeout(attemptToPlay, 500);
            }
          } catch (error) {
            console.error('[Memory] Erro ao tentar iniciar player:', error);
          }
        };
        
        // Primeira tentativa após um delay inicial
        setTimeout(attemptToPlay, 1000);
        
        // Segunda tentativa após um delay maior, caso a primeira falhe
        setTimeout(attemptToPlay, 3000);
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