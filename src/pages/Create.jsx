import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button,
  Typography,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Slider,
  Grid,
  Alert,
  CircularProgress,
  LinearProgress,
  Link,
  Tooltip,
  Snackbar,
  Divider,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Modal,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TitleForm from '../components/TitleForm';
import TitlePreview from '../components/TitlePreview';
import DateCounter from '../components/DateCounter';
import MessageEditor from '../components/MessageEditor';
import RecoveryDialog from '../components/RecoveryDialog';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';
// Importações para o seletor de música
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ReactPlayer from 'react-player';
// Importações para o seletor de lembranças
import PhotoIcon from '@mui/icons-material/Photo';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { uploadImage, saveMemory, checkSupabaseConnection, ensureStorageBucket, reconnectSupabase, checkLinkExists } from '../supabase/supabaseClient';
// Importação do gerenciador de localStorage
import { saveFormData, getFormData, saveLastStep, getLastStep, hasStoredData, clearStoredData } from '../utils/localStorageManager';
import ThemeSelector from '../components/ThemeSelector';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = ['Tema', 'Título', 'Data', 'Mensagem', 'Lembranças', 'Música', 'Finalizar'];

export default function Create() {
  // Estado para controlar o diálogo de recuperação de dados
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [titleColor, setTitleColor] = useState('#000000');
  const [titleBgColor, setTitleBgColor] = useState('#ffffff');
  const [showTitleCard, setShowTitleCard] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [complementText, setComplementText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [counterColor, setCounterColor] = useState('#000000');
  const [counterFont, setCounterFont] = useState("'Poppins', sans-serif");
  const [counterBgColor, setCounterBgColor] = useState('#ffffff');
  const [showCounterCard, setShowCounterCard] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#000000');
  const [messageFont, setMessageFont] = useState("'Poppins', sans-serif");
  const [messageStyle, setMessageStyle] = useState([]);
  const [messageBgColor, setMessageBgColor] = useState('#ffffff');
  const [showMessageCard, setShowMessageCard] = useState(true);
  const [visualEffect, setVisualEffect] = useState(null);
  const [webBgColor, setWebBgColor] = useState('#f5f5f5');
  const [style, setStyle] = useState({
    backgroundColor: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    titleSize: 48
  });
  // Estados para as lembranças (imagens)
  const [memories, setMemories] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  // Estados para o seletor de música
  const [musicUrl, setMusicUrl] = useState('');
  const [processedMusicUrl, setProcessedMusicUrl] = useState('');
  const [musicType, setMusicType] = useState(0); // 0 para YouTube, 1 para Spotify
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [musicError, setMusicError] = useState('');
  const [trackId, setTrackId] = useState(''); // Armazena o ID da faixa do Spotify
  const [musicInfo, setMusicInfo] = useState({
    title: '',
    image: ''
  });
  const [finalUrl, setFinalUrl] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Estado para o e-mail do usuário
  const [userEmail, setUserEmail] = useState('');
  const [supabaseSuccess, setSupabaseSuccess] = useState(true);
  // Estado para mensagem de progresso
  const [progressMessage, setProgressMessage] = useState('Iniciando processamento...');
  // Estado para controlar a porcentagem de progresso
  const [progressPercentage, setProgressPercentage] = useState(0);
  // Estado para o snackbar de cópia
  const [copySnackbar, setCopySnackbar] = useState({
    open: false,
    message: ''
  });
  // Estado para controlar o download do QR code
  const [qrCodeDownloading, setQrCodeDownloading] = useState(false);
  // Adicionar um estado para o tema selecionado
  const [selectedTheme, setSelectedTheme] = useState('default');
  // Estados para o gradiente personalizado
  const [gradientColor1, setGradientColor1] = useState('#ff69b4');
  const [gradientColor2, setGradientColor2] = useState('#4caf50');
  const [showGradientOptions, setShowGradientOptions] = useState(false);

  // Efeito para verificar se existem dados salvos quando o componente montar
  useEffect(() => {
    // Verificar se existem dados no localStorage
    if (hasStoredData()) {
      setShowRecoveryDialog(true);
    }
  }, []);

  // Função para carregar os dados salvos
  const loadSavedData = () => {
    const savedData = getFormData();
    const savedStep = getLastStep();
    
    if (savedData) {
      // Carrega todos os dados do formulário
      if (savedData.title) setTitle(savedData.title);
      if (savedData.titleColor) setTitleColor(savedData.titleColor);
      if (savedData.titleBgColor) setTitleBgColor(savedData.titleBgColor);
      if (savedData.showTitleCard !== undefined) setShowTitleCard(savedData.showTitleCard);
      if (savedData.selectedDate) setSelectedDate(dayjs(savedData.selectedDate));
      if (savedData.complementText) setComplementText(savedData.complementText);
      if (savedData.timeText) setTimeText(savedData.timeText);
      if (savedData.counterColor) setCounterColor(savedData.counterColor);
      if (savedData.counterFont) setCounterFont(savedData.counterFont);
      if (savedData.counterBgColor) setCounterBgColor(savedData.counterBgColor);
      if (savedData.showCounterCard !== undefined) setShowCounterCard(savedData.showCounterCard);
      if (savedData.showAnimation !== undefined) setShowAnimation(savedData.showAnimation);
      if (savedData.selectedEmoji) setSelectedEmoji(savedData.selectedEmoji);
      if (savedData.message) setMessage(savedData.message);
      if (savedData.messageColor) setMessageColor(savedData.messageColor);
      if (savedData.messageFont) setMessageFont(savedData.messageFont);
      if (savedData.messageStyle) setMessageStyle(savedData.messageStyle);
      if (savedData.messageBgColor) setMessageBgColor(savedData.messageBgColor);
      if (savedData.showMessageCard !== undefined) setShowMessageCard(savedData.showMessageCard);
      if (savedData.webBgColor) setWebBgColor(savedData.webBgColor);
      if (savedData.style) setStyle(savedData.style);
      
      // Tratamento especial para as imagens recuperadas
      if (savedData.memories && savedData.memories.length > 0) {
        // Filtra apenas memórias válidas (com URL)
        const validMemories = savedData.memories.filter(memory => 
          memory && (typeof memory === 'string' || (typeof memory === 'object' && memory.url))
        );
        
        // Se houver memórias válidas, atualiza o estado
        if (validMemories.length > 0) {
          console.log('Recuperando memórias salvas:', validMemories.length);
          setMemories(validMemories);
        }
      }
      
      if (savedData.musicUrl) setMusicUrl(savedData.musicUrl);
      if (savedData.processedMusicUrl) setProcessedMusicUrl(savedData.processedMusicUrl);
      if (savedData.musicType !== undefined) setMusicType(savedData.musicType);
      if (savedData.trackId) setTrackId(savedData.trackId);
      if (savedData.musicInfo) setMusicInfo(savedData.musicInfo);
      if (savedData.userEmail) setUserEmail(savedData.userEmail);
      if (savedData.visualEffect) setVisualEffect(savedData.visualEffect);
      if (savedData.selectedTheme) setSelectedTheme(savedData.selectedTheme);
    }
    
    // Navega para o passo correto
    if (savedStep !== null) {
      setActiveStep(Number(savedStep));
    }
    
    // Fecha o diálogo
    setShowRecoveryDialog(false);
  };

  // Função para reiniciar o formulário
  const resetForm = () => {
    // Limpa o localStorage
    clearStoredData();
    
    // Fecha o diálogo
    setShowRecoveryDialog(false);
    
    // Reinicia o estado para o passo inicial
    setActiveStep(0);
  };

  // Efeito para salvar os dados quando qualquer um deles mudar
  useEffect(() => {
    // Só salva se o usuário avançou pelo menos uma vez ou fez alguma entrada significativa
    if (activeStep > 0 || title.trim().length > 0) {
      // Prepara os dados para salvar
      const formData = {
        title,
        titleColor,
        titleBgColor,
        showTitleCard,
        selectedDate: selectedDate ? selectedDate.toString() : null,
        complementText,
        timeText,
        counterColor,
        counterFont,
        counterBgColor,
        showCounterCard,
        showAnimation,
        selectedEmoji,
        message,
        messageColor,
        messageFont,
        messageStyle,
        messageBgColor,
        showMessageCard,
        webBgColor,
        style,
        memories,
        musicUrl,
        processedMusicUrl,
        musicType,
        trackId,
        musicInfo,
        userEmail,
        visualEffect,
        selectedTheme
      };
      
      // Salva no localStorage
      saveFormData(formData);
      saveLastStep(activeStep);
    }
  }, [
    activeStep, title, titleColor, titleBgColor, showTitleCard, 
    selectedDate, complementText, timeText, counterColor, counterFont,
    counterBgColor, showCounterCard, showAnimation, selectedEmoji,
    message, messageColor, messageFont, messageStyle, messageBgColor,
    showMessageCard, webBgColor, style, memories, musicUrl, 
    processedMusicUrl, musicType, trackId, musicInfo, userEmail,
    visualEffect, selectedTheme
  ]);

  // Limpar os dados salvos quando o formulário for finalizado com sucesso
  useEffect(() => {
    if (isFinalized) {
      clearStoredData();
    }
  }, [isFinalized]);

  // Processa URL quando mudar
  useEffect(() => {
    console.log("Processando URL:", musicUrl, "Tipo:", musicType);
    
    // Limpar o @ ou outras marcações que possam ter sido coladas no início da URL
    const cleanUrl = musicUrl.replace(/^[@\s]+/, '').trim();
    
    if (cleanUrl) {
      // Tenta processar independente da validação inicial
      if (musicType === 0) { // YouTube
        if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
          console.log("URL do YouTube válida");
          setProcessedMusicUrl(cleanUrl);
          const id = getVideoId(cleanUrl);
          if (id) {
            setMusicInfo({
              title: 'Música do YouTube',
              image: `https://img.youtube.com/vi/${id}/default.jpg`
            });
            setMusicError('');
            setTrackId(''); // Limpa trackId quando for YouTube
            
            // Iniciar reprodução automaticamente
            console.log("Iniciando reprodução do YouTube automaticamente");
            setIsPlaying(true);
          } else {
            setMusicError('Não conseguimos extrair o ID do vídeo. Verifique se a URL está correta.');
          }
        } else {
          setMusicError('URL do YouTube inválida. Use um link do youtube.com ou youtu.be');
          // Mantém os valores anteriores para evitar limpar a interface
        }
      } else if (musicType === 1) { // Spotify
        console.log("Tentando processar URL do Spotify:", cleanUrl);
        // Converte o link normal do Spotify para URI de incorporação 
        try {
          let validUrl = false;
          
          // Extrai o ID para diferentes formatos de URL do Spotify
          const spotifyTrackRegex = /spotify\.com\/(?:intl-[a-z]+\/)?track\/([a-zA-Z0-9]+)/;
          const spotifyPlaylistRegex = /spotify\.com\/(?:intl-[a-z]+\/)?playlist\/([a-zA-Z0-9]+)/;
          const spotifyAlbumRegex = /spotify\.com\/(?:intl-[a-z]+\/)?album\/([a-zA-Z0-9]+)/;
          
          // Verifica se é um link de faixa do Spotify (incluindo versões internacionais)
          const trackMatch = cleanUrl.match(spotifyTrackRegex);
          if (trackMatch && trackMatch[1]) {
            const extractedTrackId = trackMatch[1].split('?')[0];
            setTrackId(extractedTrackId); // Armazena o ID da faixa para uso no iframe
            
            // Para ReactPlayer, uma URL completa funciona melhor que uma URI
            // para o caso do Spotify, vamos manter o link original limpo
            setProcessedMusicUrl(cleanUrl);
            
            setMusicInfo({
              title: 'Música do Spotify', // Título genérico em vez de "Os Anjos Cantam - Jorge & Mateus"
              image: null
            });
            setMusicError('');
            validUrl = true;
            
            // Iniciar reprodução automaticamente para Spotify
            setIsPlaying(true);
            
            console.log("URL do Spotify processada:", cleanUrl, "ID da faixa:", extractedTrackId);
          }
          // Verifica se é um link de playlist do Spotify (incluindo versões internacionais)
          else if (cleanUrl.match(spotifyPlaylistRegex)) {
            const playlistMatch = cleanUrl.match(spotifyPlaylistRegex);
            if (playlistMatch && playlistMatch[1]) {
              const playlistId = playlistMatch[1].split('?')[0];
              setTrackId(''); // Limpa trackId quando for playlist
              
              // Mantém o URL original para o ReactPlayer
              setProcessedMusicUrl(cleanUrl);
              
              setMusicInfo({
                title: 'Playlist do Spotify',
                image: null
              });
              setMusicError('');
              validUrl = true;
              
              // Iniciar reprodução automaticamente para Spotify
              setIsPlaying(true);
              
              console.log("URL da playlist do Spotify processada:", cleanUrl);
            }
          }
          // Verifica se é um link de álbum do Spotify
          else if (cleanUrl.match(spotifyAlbumRegex)) {
            const albumMatch = cleanUrl.match(spotifyAlbumRegex);
            if (albumMatch && albumMatch[1]) {
              const albumId = albumMatch[1].split('?')[0];
              setTrackId(''); // Limpa trackId quando for álbum
              
              // Mantém o URL original para o ReactPlayer
              setProcessedMusicUrl(cleanUrl);
              
              setMusicInfo({
                title: 'Álbum do Spotify',
                image: null
              });
              setMusicError('');
              validUrl = true;
              
              // Iniciar reprodução automaticamente para Spotify
              setIsPlaying(true);
              
              console.log("URL do álbum do Spotify processada:", cleanUrl);
            }
          }
          // Verifica se é URI do Spotify
          else if (cleanUrl.startsWith('spotify:')) {
            // Convertemos de volta para URL pois o ReactPlayer precisa do formato URL completo
            const parts = cleanUrl.split(':');
            if (parts.length >= 3) {
              const type = parts[1]; // track ou playlist
              const id = parts[2];
              
              if (type === 'track') {
                setTrackId(id); // Armazena o ID da faixa para uso no iframe
              } else {
                setTrackId(''); // Limpa trackId quando não for faixa
              }
              
              setProcessedMusicUrl(`https://open.spotify.com/${type}/${id}`);
              setMusicInfo({
                title: 'Música do Spotify',
                image: null
              });
              setMusicError('');
              validUrl = true;
              
              // Iniciar reprodução automaticamente para Spotify
              setIsPlaying(true);
              
              console.log("URI do Spotify convertida para URL:", `https://open.spotify.com/${type}/${id}`);
            } else {
              setMusicError('Formato de URI do Spotify inválido.');
            }
          } else {
            setMusicError('Link do Spotify não reconhecido. Use um link de compartilhamento oficial do Spotify.');
          }
          
          // Se não foi possível processar, mostra um erro mais detalhado
          if (!validUrl) {
            console.log("URL do Spotify inválida");
            setMusicError('Link do Spotify inválido. Certifique-se de usar um link de compartilhamento oficial (ex: https://open.spotify.com/track/...)');
            setTrackId(''); // Limpa trackId quando URL inválida
          }
        } catch (error) {
          console.error('Erro ao processar URL do Spotify:', error);
          setMusicError('Erro ao processar o link do Spotify. Verifique o formato e tente novamente.');
          setTrackId(''); // Limpa trackId em caso de erro
        }
      }
    } else {
      // Se não houver URL, limpa os campos
      setProcessedMusicUrl('');
      setMusicInfo({
        title: '',
        image: ''
      });
      setTrackId(''); // Limpa trackId quando não houver URL
    }
  }, [musicUrl, musicType]);

  // Efeito para tentar iniciar a reprodução quando o trackId estiver disponível
  useEffect(() => {
    if (musicType === 1 && trackId) {
      console.log("Tentando iniciar reprodução para trackId:", trackId);
      // Tenta iniciar a reprodução imediatamente
      setIsPlaying(true);
      
      // Tenta interagir com o iframe do preview
      setTimeout(() => {
        const iframe = document.getElementById('spotify-preview-iframe');
        if (iframe) {
          console.log("Recarregando iframe do Spotify para forçar reprodução");
          // Recria o iframe para forçar a reprodução
          const currentSrc = iframe.src;
          iframe.src = `${currentSrc.split('?')[0]}?utm_source=generator&theme=0&autoplay=1`;
          
          // Tenta também usar a API postMessage do Spotify para controlar a reprodução
          try {
            setTimeout(() => {
              iframe.contentWindow.postMessage({ command: 'play' }, '*');
            }, 1000);
          } catch (error) {
            console.error("Erro ao tentar controlar o player via postMessage:", error);
          }
        }
      }, 500);
    }
  }, [trackId, musicType]);
  
  // Efeito para manter o estado de reprodução sincronizado
  useEffect(() => {
    if (musicType === 1 && isPlaying && trackId) {
      console.log("Mantendo reprodução ativa para Spotify");
      // Aqui poderia ter lógica adicional para garantir que o Spotify continue tocando
    }
  }, [isPlaying, musicType, trackId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1;
      
      // Se estiver indo para a etapa final a partir da etapa de música, garante que a música esteja tocando
      if (prevActiveStep === 5 && nextStep === 6) {
        // Inicia a reprodução na etapa final
        setIsPlaying(true);
        console.log('Iniciando reprodução automática na etapa final');
      }
      
      return nextStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return selectedTheme !== null; // Etapa do tema
      case 1:
        return title.trim().length > 0; // Etapa do título
      case 2:
        return selectedDate && selectedDate.isValid() && complementText.trim().length > 0;
      case 3:
        return message.trim().length > 0;
      case 4:
        // Agora é obrigatório ter pelo menos uma foto
        return memories && memories.length > 0;
      case 5:
        // Valida se a URL da música foi inserida e é válida
        return isMusicUrlValid;
      case 6:
        // Etapa de finalização - verifica se o email é válido
        return userEmail && userEmail.includes('@') && userEmail.includes('.');
      default:
        return false;
    }
  };

  // Manipuladores para o seletor de música
  const handleMusicTypeChange = (event, newValue) => {
    setMusicType(newValue);
    setMusicUrl('');
    setProcessedMusicUrl('');
    setMusicError('');
    setIsPlaying(false);
  };

  const handleMusicUrlChange = (event) => {
    const url = event.target.value;
    setMusicUrl(url);
    
    // Limpa erro imediatamente para feedback visual mais rápido
    setMusicError('');
    
    // Verifica se a URL está vazia para limpar o processedMusicUrl
    if (!url.trim()) {
      setProcessedMusicUrl('');
      setMusicInfo({
        title: '',
        image: ''
      });
      setIsPlaying(false);
    } else if (url.includes('spotify.com') || url.includes('spotify:')) {
      // Se for um link do Spotify, tenta ativar a reprodução imediatamente
      setIsPlaying(true);
      // Outros processamentos acontecerão no useEffect
    }
  };

  const handlePlayPause = () => {
    // Permite tocar se há uma URL, mesmo que não esteja processada ainda
    if (musicUrl) {
      setIsPlaying(!isPlaying);
    } else {
      setMusicError('Por favor, insira um link válido antes de reproduzir.');
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const validateMusicUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Limpa qualquer @ ou marcações no início da URL
    const cleanUrl = url.replace(/^[@\s]+/, '').trim();
    
    // Se a URL for vazia após limpeza, retorna falso
    if (!cleanUrl) return false;
    
    console.log("Validando URL de música:", cleanUrl, "Tipo:", musicType);
    
    if (musicType === 0) { // YouTube
      const isYoutubeValid = cleanUrl.includes('youtube.com/watch') || 
                             cleanUrl.includes('youtu.be/') ||
                             cleanUrl.includes('youtube.com/embed/');
      console.log("É URL válida do YouTube?", isYoutubeValid);
      return isYoutubeValid;
    } else { // Spotify
      const isSpotifyValid = cleanUrl.includes('spotify.com/track/') || 
                            cleanUrl.includes('spotify.com/playlist/') ||
                            cleanUrl.includes('spotify.com/album/') ||
                            cleanUrl.includes('spotify.com/intl-') ||
                            cleanUrl.startsWith('spotify:');
      console.log("É URL válida do Spotify?", isSpotifyValid);
      return isSpotifyValid;
    }
  };

  // Extrair ID do vídeo para mostrar thumbnail (YouTube)
  const getVideoId = (url) => {
    if (!url) return null;
    if (musicType !== 0) return null;
    
    let videoId = '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return videoId;
    } catch (error) {
      return null;
    }
  };

  const videoId = getVideoId(musicUrl);

  const handlePlayerError = (error) => {
    console.error("Erro no player:", error);
    setMusicError('Erro ao carregar a música. Verifique o link e tente novamente.');
    setIsPlaying(false);
  };

  // Funções para gerenciar as lembranças
  const handleAddMemory = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Permitir apenas imagens
    const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    // Limitar a 8 imagens no total
    const totalImages = [...memories, ...newImages];
    if (totalImages.length > 8) {
      alert('Você pode adicionar no máximo 8 imagens.');
      return;
    }

    // Criar URLs para as imagens selecionadas
    const newMemories = newImages.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setMemories(prevMemories => [...prevMemories, ...newMemories]);
  };

  const handleRemoveMemory = (index) => {
    setMemories(prevMemories => {
      const newMemories = [...prevMemories];
      // Liberar o URL criado para evitar vazamento de memória
      URL.revokeObjectURL(newMemories[index].url);
      newMemories.splice(index, 1);
      return newMemories;
    });
  };

  const handleClickAddFiles = () => {
    if (fileInput) {
      fileInput.click();
    }
  };

  // Função para formatar o título em uma URL válida
  const formatUrl = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/--+/g, '-') // Remove hífens duplicados
      .trim(); // Remove espaços no início e fim
  };

  // Função para gerar um número aleatório
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 1000);
  };

  // Função para finalizar a criação e gerar a URL final
  const handleFinalize = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      alert('Por favor, insira um e-mail válido para continuar.');
      return;
    }

    // Exibir indicador de carregamento
    setIsLoading(true);
    setProgressMessage('Iniciando processamento...');
    setProgressPercentage(5);

    try {
      // Verificação da conectividade com o Supabase antes de prosseguir
      setProgressMessage('Verificando conexão com o servidor...');
      setProgressPercentage(10);
      
      const { connected, error } = await checkSupabaseConnection();
      if (!connected) {
        console.error('Erro de conexão com o servidor:', error);
        setProgressMessage('Falha na conexão com o servidor. Tentando novamente...');
        
        // Verificar se o erro é sobre a tabela não existir
        const isTableNotExistError = error && error.message && 
          error.message.includes('relation') && 
          error.message.includes('memorias') && 
          error.message.includes('does not exist');
        
        if (isTableNotExistError) {
          console.log('Detectado erro de tabela não existente. Tentando criar automaticamente...');
          
          // Importa dinamicamente a função para criar a tabela
          const { createMemoriasTable } = await import('../supabase/supabaseDiagnostic');
          const createResult = await createMemoriasTable();
          
          if (createResult.success) {
            console.log('Tabela criada com sucesso, tentando novamente...');
            // Tenta conectar novamente
            const retryConnect = await checkSupabaseConnection();
            if (retryConnect.connected) {
              console.log('Reconectado com sucesso após criar tabela!');
            } else {
              throw new Error(`Tabela 'memorias' foi criada, mas ainda há problemas de conexão: ${retryConnect.error?.message || 'Erro desconhecido'}`);
            }
          } else {
            if (createResult.requiresManualSetup) {
              throw new Error(`A tabela 'memorias' não existe no Supabase. É necessário acessar o painel do Supabase e criar manualmente a tabela. Acesse a página inicial e clique em "Configurar Supabase" para instruções detalhadas.`);
            } else {
              throw new Error(`Erro ao criar tabela 'memorias': ${createResult.message || createResult.error || 'Erro desconhecido'}`);
            }
          }
        } else {
          // Tentativa de reconexão com o Supabase
          const reconnectResult = await reconnectSupabase();
          
          if (!reconnectResult.success) {
            console.error('Falha na tentativa de reconexão:', reconnectResult.error || 'Razão desconhecida');
            
            // Segunda tentativa com mais informações de erro
            const secondAttempt = await checkSupabaseConnection();
            if (!secondAttempt.connected) {
              console.error('Segunda tentativa falhou:', secondAttempt.error);
              const errorDetails = secondAttempt.error ? 
                `Detalhes: ${secondAttempt.error.message || JSON.stringify(secondAttempt.error)}` : 
                'Sem detalhes adicionais';
              
              throw new Error(`Sem conexão com o servidor Supabase. ${errorDetails}. Verifique sua internet e tente novamente.`);
            }
          } else {
            console.log('Reconexão com o Supabase bem-sucedida:', reconnectResult.message);
          }
        }
      }
      
      console.log('Conexão com servidor estabelecida.');
      setProgressPercentage(20);

      // Formata o título para URL
      let urlPath = formatUrl(title || 'meu-titulo');
      
      // Verifica se o link já existe
      setProgressMessage('Verificando disponibilidade do link...');
      setProgressPercentage(25);
      
      let linkExists = true;
      let attempts = 0;
      const maxAttempts = 10; // Limite máximo de tentativas com números
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      let letterIndex = 0;

      while (linkExists) {
        const { exists } = await checkLinkExists(urlPath);
        
        if (!exists) {
          linkExists = false;
        } else {
          if (attempts < maxAttempts) {
            // Tenta com números primeiro
            const randomNumber = generateRandomNumber();
            urlPath = `${formatUrl(title || 'meu-titulo')}-${randomNumber}`;
            setProgressMessage(`Link anterior já existe. Tentando novo link: ${urlPath}`);
          } else {
            // Após 10 tentativas, adiciona uma letra ao número
            const randomNumber = generateRandomNumber();
            const letter = letters[letterIndex % letters.length];
            urlPath = `${formatUrl(title || 'meu-titulo')}-${randomNumber}${letter}`;
            setProgressMessage(`Link anterior já existe. Tentando novo link com letra: ${urlPath}`);
            letterIndex++;
          }
          attempts++;

          // Se já tentou todas as letras com um número, recomeça com outro número
          if (letterIndex >= letters.length) {
            letterIndex = 0;
          }

          // Proteção contra loop infinito (após tentar todas as combinações possíveis)
          if (attempts > maxAttempts + (letters.length * 3)) {
            throw new Error('Não foi possível gerar um link único após várias tentativas. Por favor, tente novamente com um título diferente.');
          }
        }
      }
      
      const generatedUrl = `http://saymealways.com.br/memory/${urlPath}`;
      setProgressMessage('Preparando imagens...');
      setProgressPercentage(30);

      // Verificar se existem imagens para upload
      if (!memories || memories.length === 0) {
        throw new Error('Por favor, adicione pelo menos uma imagem para criar sua memória');
      }

      console.log(`Iniciando upload de ${memories.length} imagens...`);
      
      // Verifica e cria o bucket se necessário
      setProgressMessage('Verificando armazenamento...');
      setProgressPercentage(40);
      await ensureStorageBucket();
      
      // Faz upload das imagens para o Supabase
      setProgressMessage('Fazendo upload das imagens...');
      setProgressPercentage(50);
      
      const memoryUploads = memories
        .filter(memory => memory && memory.url)
        .map(memory => {
          console.log('Preparando upload de:', memory);
          // Se for um objeto com url, extrair a url para enviar
          const fileToUpload = typeof memory === 'object' ? memory.url : memory;
          return uploadImage(fileToUpload, `memories/${urlPath}`);
        });

      // Aguarda o upload de todas as imagens com um timeout
      const uploadResults = await Promise.race([
        Promise.all(memoryUploads),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout ao fazer upload para o servidor')), 30000)
        )
      ]);

      console.log('Resultados dos uploads:', uploadResults);

      // Verifica se o upload foi bem-sucedido
      if (!uploadResults || uploadResults.filter(url => url !== null).length === 0) {
        throw new Error('Nenhuma imagem foi carregada com sucesso. Verifique sua conexão e tente novamente.');
      }

      // Atualiza as URLs das imagens nos dados
      const memoryData = {
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
        messageColor,
        messageFont,
        messageStyle,
        messageBgColor,
        showMessageCard,
        webBgColor,
        musicUrl: processedMusicUrl || musicUrl,
        musicType,
        videoId,
        musicInfo,
        trackId,
        memories: uploadResults.filter(url => url !== null),
        userEmail,
        createdAt: new Date().toISOString(),
        urlPath,
        visualEffect,
        selectedTheme: selectedTheme?.id || null,
        created_link: generatedUrl // Adicionando o link gerado
      };

      setProgressMessage('Upload concluído. Salvando sua memória...');
      setProgressPercentage(80);
      
      // Salva os dados no Supabase
      const { success, error: saveError } = await saveMemory(memoryData);
      
      if (!success) {
        console.error('Erro ao salvar no servidor:', saveError);
        throw new Error(saveError?.message || 'Erro ao salvar dados no servidor');
      }

      setProgressMessage('Memória salva com sucesso!');
      setProgressPercentage(90);
      console.log('Dados salvos com sucesso no servidor');
      
      // Limpa os dados de preenchimento do formulário
      clearStoredData();

      // Atualiza o estado com a URL final
      setProgressMessage('Gerando link final...');
      setProgressPercentage(100);
      setFinalUrl(generatedUrl);
      setIsFinalized(true);
      setSupabaseSuccess(true);
      
      setProgressMessage('Concluído!');
    } catch (error) {
      console.error('Erro ao finalizar memória:', error);
      setProgressMessage('Erro ao processar sua memória.');
      setProgressPercentage(0);
      
      // Exibe mensagem de erro mais detalhada
      let errorMessage = 'Ocorreu um erro ao finalizar sua memória.';
      
      // Verificar se é erro de tabela não encontrada
      if (error.message && error.message.includes('memorias') && error.message.includes('does not exist')) {
        errorMessage = 'A tabela "memorias" não existe no banco de dados. Por favor, vá para a página inicial e clique em "Configurar Supabase" para resolver este problema.';
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Erro de permissão ao salvar arquivos. Por favor, tente novamente mais tarde.';
      } else {
        errorMessage = `Erro: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Se estiver na etapa final, inicia a reprodução da música automaticamente
    if (activeStep === 5 && musicUrl) {
      console.log('Etapa final - iniciando reprodução automática');
      setIsPlaying(true);
      
      // Para garantir que o YouTube inicie corretamente
      if (musicType === 0 && videoId) {
        // Tenta iniciar a reprodução várias vezes
        const attempts = [0, 1000, 2000];
        attempts.forEach(delay => {
          setTimeout(() => {
            console.log(`Tentativa de iniciar reprodução após ${delay}ms`);
            setIsPlaying(true);
          }, delay);
        });
      }
    }
  }, [activeStep, musicUrl, musicType, videoId]);

  // Referência para o elemento QR Code
  const qrCodeRef = useRef(null);

  // Função para compartilhar no navegador
  const handleShare = async (url, title) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Minha Memória',
          text: 'Acesse esta memória especial que criei:',
          url: url
        });
        handleSnackbarOpen('Conteúdo compartilhado com sucesso!');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        // Fallback para cópia se o compartilhamento falhar
        handleCopyLink(url);
      }
    } else {
      // Fallback para cópia se a API de compartilhamento não estiver disponível
      handleCopyLink(url);
    }
  };

  // Função para copiar link
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => handleSnackbarOpen('Link copiado para a área de transferência!'))
      .catch(() => handleSnackbarOpen('Não foi possível copiar o link. Tente novamente.', 'error'));
  };

  // Função para abrir/fechar snackbar
  const handleSnackbarOpen = (message, severity = 'success') => {
    setCopySnackbar({
      open: true,
      message: message,
      severity: severity
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCopySnackbar({
      ...copySnackbar,
      open: false
    });
  };

  // Função para baixar o QR Code como imagem
  const handleDownloadQRCode = async (url, title) => {
    if (!qrCodeRef.current) {
      handleSnackbarOpen('QR Code não está disponível', 'error');
      return;
    }

    setQrCodeDownloading(true);

    try {
      // Cria um canvas a partir do SVG
      const svgElement = qrCodeRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Define tamanho maior para melhor qualidade
      canvas.width = 1000;
      canvas.height = 1000;
      
      // Preenche o fundo branco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Carrega a imagem SVG em uma imagem
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Desenha a imagem SVG no canvas com margem
      const margin = 100;
      ctx.drawImage(img, margin, margin, canvas.width - (margin * 2), canvas.height - (margin * 2));
      
      // Adiciona título no topo
      ctx.fillStyle = 'black';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title || 'Minha Memória', canvas.width / 2, 60);
      
      // Adiciona URL na parte inferior
      ctx.font = '30px Arial';
      ctx.fillText(url, canvas.width / 2, canvas.height - 40);
      
      // Converte para imagem
      const dataUrl = canvas.toDataURL('image/png');
      
      // Cria link de download
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `qrcode_${title.replace(/\s+/g, '_').toLowerCase() || 'memoria'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      handleSnackbarOpen('QR Code baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      handleSnackbarOpen('Erro ao baixar QR Code', 'error');
    } finally {
      setQrCodeDownloading(false);
    }
  };

  // Função para aplicar o tema selecionado
  const handleThemeChange = (theme) => {
    console.log('Tema selecionado:', theme);
    
    // Validar se recebeu um objeto theme válido
    if (!theme || typeof theme !== 'object') {
      console.error('Tema inválido:', theme);
      return;
    }
    
    // Armazenar o ID do tema
    setSelectedTheme(theme.id);
    
    // Atualizar as cores baseado no tema
    setWebBgColor(theme.webBgColor);
    setTitleBgColor(theme.titleBgColor);
    setMessageBgColor(theme.messageBgColor);
    setCounterBgColor(theme.counterBgColor);
    
    // Para o tema escuro, ajustar as cores do texto para branco
    if (theme.id === 'dark') {
      setTitleColor('#ffffff');
      setMessageColor('#ffffff');
      setCounterColor('#ffffff');
    } 
    // Restaurar cores padrão para outros temas
    else {
      // Se estiver vindo do tema escuro, restaurar para cores padrão
      if (selectedTheme === 'dark') {
        setTitleColor('#000000');
        setMessageColor('#000000');
        setCounterColor('#000000');
      }
    }
    
    // Forçar atualização da visualização
    setTimeout(() => {
      console.log('Tema aplicado. Estado atual:', {
        selectedTheme: theme.id,
        webBgColor: theme.webBgColor,
        titleBgColor: theme.titleBgColor,
        messageBgColor: theme.messageBgColor,
        counterBgColor: theme.counterBgColor,
        titleColor: theme.id === 'dark' ? '#ffffff' : titleColor,
        messageColor: theme.id === 'dark' ? '#ffffff' : messageColor,
        counterColor: theme.id === 'dark' ? '#ffffff' : counterColor
      });
    }, 100);
  };

  // Função para aplicar o gradiente personalizado com as cores selecionadas
  const applyCustomGradient = () => {
    // Atualizar variáveis CSS para o gradiente
    document.documentElement.style.setProperty('--gradient-color-1', gradientColor1);
    document.documentElement.style.setProperty('--gradient-color-2', gradientColor2);
    
    // Criar o objeto de tema com o gradiente personalizado
    const customGradientTheme = {
      id: 'custom-gradient',
      name: 'Gradiente Personalizado',
      webBgColor: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
      titleBgColor: 'rgba(255, 255, 255, 0.85)',
      messageBgColor: 'rgba(255, 255, 255, 0.85)',
      counterBgColor: 'rgba(255, 255, 255, 0.85)',
      description: 'Gradiente personalizado com cores escolhidas por você'
    };
    
    // Fechar o modal
    setShowGradientOptions(false);
    
    // Aplicar o tema
    handleThemeChange(customGradientTheme);
  };

  // Opções para a etapa de música
  const isYoutubeSelected = musicType === 0;
  const isSpotifySelected = musicType === 1;
  const isMusicUrlValid = musicUrl && validateMusicUrl(musicUrl) && (musicType === 1 || !musicError);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#fafafa',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Diálogo de recuperação */}
      <RecoveryDialog 
        open={showRecoveryDialog}
        onClose={() => setShowRecoveryDialog(false)}
        onRestart={resetForm}
        onContinue={loadSavedData}
      />
      
      <Container 
        maxWidth={false}
        sx={{
          px: { xs: 1, sm: 2 },
          py: 2,
          mt: '64px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Stepper 
            activeStep={activeStep}
            alternativeLabel
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              '& .MuiStepLabel-label': {
                fontSize: '1.1rem',
                display: { xs: 'none', md: 'block' }  // Oculta o texto em telas pequenas
              },
              '& .MuiStepper-root': {
                justifyContent: 'center'
              },
              '& .MuiStep-root': {
                padding: { xs: '0 4px', sm: '0 8px', md: '0' }
              },
              '& .MuiStepConnector-root': {
                margin: { xs: '0 -8px', sm: '0 -10px' }
              },
              maxWidth: '750px',
              mx: 'auto',
              width: '100%',
              px: { xs: 0, sm: 1 }
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={(props) => {
                    const icons = {
                      0: <ColorLensIcon fontSize="small" />,
                      1: <TextFieldsIcon fontSize="small" />,
                      2: <FavoriteIcon fontSize="small" />,
                      3: <MessageIcon fontSize="small" />,
                      4: <PhotoIcon fontSize="small" />,
                      5: <MusicNoteIcon fontSize="small" />,
                      6: <CheckCircleIcon fontSize="small" />
                    };
                    return (
                      <Box sx={{ position: 'relative' }}>
                        <Tooltip title={label} placement="top">
                        {props.completed || props.active ? (
                          <Box
                            sx={{
                              bgcolor: props.active ? 'primary.main' : 'primary.light',
                              color: 'white',
                              borderRadius: '50%',
                              width: { xs: 36, sm: 40 },
                              height: { xs: 36, sm: 40 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: props.active ? '0 0 10px rgba(25, 118, 210, 0.5)' : '0 0 6px rgba(25, 118, 210, 0.3)',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {icons[index]}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              bgcolor: 'grey.400',
                              color: 'white',
                              borderRadius: '50%',
                              width: { xs: 36, sm: 40 },
                              height: { xs: 36, sm: 40 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                          >
                            {index + 1}
                          </Box>
                        )}
                        </Tooltip>
                      </Box>
                    );
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              width: '100%',
              maxWidth: '900px',
              mx: 'auto'
            }}
          >
            {activeStep === 0 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3
                    }}
                  >
                    <ThemeSelector 
                      selectedTheme={selectedTheme?.id || selectedTheme} 
                      onSelectTheme={handleThemeChange} 
                    />
                    
                    {/* Opções de gradiente personalizado */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => setShowGradientOptions(!showGradientOptions)}
                        sx={{ mb: 1 }}
                      >
                        {showGradientOptions ? 'Ocultar Opções de Gradiente' : 'Criar Gradiente Personalizado'}
                      </Button>
                      
                      {showGradientOptions && (
                        <Paper elevation={2} sx={{ p: 2, mt: 1, width: '100%' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Selecione as cores para o gradiente:
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Cor inicial:</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Box 
                                sx={{ 
                                  width: 36, 
                                  height: 36, 
                                  borderRadius: '4px', 
                                  mr: 1, 
                                  bgcolor: gradientColor1,
                                  border: '1px solid #ddd'
                                }} 
                              />
                              <input
                                type="color"
                                value={gradientColor1}
                                onChange={(e) => setGradientColor1(e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption">Cor final:</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Box 
                                sx={{ 
                                  width: 36, 
                                  height: 36, 
                                  borderRadius: '4px', 
                                  mr: 1, 
                                  bgcolor: gradientColor2,
                                  border: '1px solid #ddd'
                                }} 
                              />
                              <input
                                type="color"
                                value={gradientColor2}
                                onChange={(e) => setGradientColor2(e.target.value)}
                                style={{ width: '100%' }}
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            width: '100%', 
                            height: 50, 
                            borderRadius: '8px', 
                            mb: 2,
                            background: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
                            border: '1px solid #ddd'
                          }} />
                          
                          <Button 
                            variant="contained" 
                            fullWidth
                            onClick={applyCustomGradient}
                          >
                            Aplicar Gradiente
                          </Button>
                        </Paper>
                      )}
                    </Box>
                  </Paper>
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 }
                  }}
                >
                  <TitlePreview
                    title={title}
                    titleColor={titleColor}
                    titleBgColor={titleBgColor}
                    showTitleCard={showTitleCard}
                    style={style}
                    timeText={timeText}
                    counterColor={counterColor}
                    counterFont={counterFont}
                    counterBgColor={counterBgColor}
                    showCounterCard={showCounterCard}
                    showAnimation={showAnimation}
                    selectedEmoji={selectedEmoji}
                    message={message}
                    messageColor={messageColor}
                    messageFont={messageFont}
                    messageStyle={messageStyle}
                    messageBgColor={messageBgColor}
                    showMessageCard={showMessageCard}
                    webBgColor={webBgColor}
                    visualEffect={visualEffect}
                  />
                </Box>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <TitleForm
                      title={title}
                      onTitleChange={setTitle}
                      titleColor={titleColor}
                      onTitleColorChange={setTitleColor}
                      titleBgColor={titleBgColor}
                      onTitleBgColorChange={setTitleBgColor}
                      showTitleCard={showTitleCard}
                      onShowTitleCardChange={setShowTitleCard}
                      onNext={handleNext}
                      style={style}
                      onStyleChange={setStyle}
                      webBgColor={webBgColor}
                      onWebBgColorChange={setWebBgColor}
                    />
                  </Paper>
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 }
                  }}
                >
                  <TitlePreview
                    title={title}
                    titleColor={titleColor}
                    titleBgColor={titleBgColor}
                    showTitleCard={showTitleCard}
                    style={style}
                    timeText={timeText}
                    counterColor={counterColor}
                    counterFont={counterFont}
                    counterBgColor={counterBgColor}
                    showCounterCard={showCounterCard}
                    showAnimation={showAnimation}
                    selectedEmoji={selectedEmoji}
                    message={message}
                    messageColor={messageColor}
                    messageFont={messageFont}
                    messageStyle={messageStyle}
                    messageBgColor={messageBgColor}
                    showMessageCard={showMessageCard}
                    webBgColor={webBgColor}
                    visualEffect={visualEffect}
                  />
                </Box>
              </>
            )}

            {activeStep === 2 && (
              <>
                <Box
                  sx={{
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                <DateCounter
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  complementText={complementText}
                  onComplementTextChange={setComplementText}
                  textColor={counterColor}
                  fontFamily={counterFont}
                  onTimeTextChange={setTimeText}
                  onTextColorChange={setCounterColor}
                  onFontFamilyChange={setCounterFont}
                  onAnimationChange={setShowAnimation}
                  onEmojiSelect={setSelectedEmoji}
                  counterBgColor={counterBgColor}
                  onCounterBgColorChange={setCounterBgColor}
                  showCounterCard={showCounterCard}
                  onShowCounterCardChange={setShowCounterCard}
                />
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 }
                  }}
                >
                <TitlePreview
                  title={title}
                  titleColor={titleColor}
                  titleBgColor={titleBgColor}
                  showTitleCard={showTitleCard}
                  style={style}
                  timeText={timeText}
                  counterColor={counterColor}
                  counterFont={counterFont}
                  counterBgColor={counterBgColor}
                  showCounterCard={showCounterCard}
                  showAnimation={showAnimation}
                  selectedEmoji={selectedEmoji}
                  message={message}
                  messageColor={messageColor}
                  messageFont={messageFont}
                  messageStyle={messageStyle}
                  messageBgColor={messageBgColor}
                  showMessageCard={showMessageCard}
                  webBgColor={webBgColor}
                  visualEffect={visualEffect}
                />
                </Box>
              </>
            )}

            {activeStep === 3 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                  <MessageEditor
                    message={message}
                    onMessageChange={setMessage}
                    textColor={messageColor}
                    onTextColorChange={setMessageColor}
                    fontFamily={messageFont}
                    onFontFamilyChange={setMessageFont}
                    textStyle={messageStyle}
                    onTextStyleChange={setMessageStyle}
                    messageBgColor={messageBgColor}
                    onMessageBgColorChange={setMessageBgColor}
                    showMessageCard={showMessageCard}
                    onShowMessageCardChange={setShowMessageCard}
                    visualEffect={visualEffect}
                    onVisualEffectChange={setVisualEffect}
                  />
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 }
                  }}
                >
                  <TitlePreview
                    title={title}
                    titleColor={titleColor}
                    titleBgColor={titleBgColor}
                    showTitleCard={showTitleCard}
                    style={style}
                    timeText={timeText}
                    counterColor={counterColor}
                    counterFont={counterFont}
                    counterBgColor={counterBgColor}
                    showCounterCard={showCounterCard}
                    showAnimation={showAnimation}
                    selectedEmoji={selectedEmoji}
                    message={message}
                    messageColor={messageColor}
                    messageFont={messageFont}
                    messageStyle={messageStyle}
                    messageBgColor={messageBgColor}
                    showMessageCard={showMessageCard}
                    webBgColor={webBgColor}
                    visualEffect={visualEffect}
                  />
                </Box>
              </>
            )}

            {activeStep === 4 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                      Suas Lembranças
                    </Typography>

                    <input
                      type="file"
                      ref={(input) => setFileInput(input)}
                      onChange={handleAddMemory}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                    />

                    {memories.length > 0 ? (
                      <>
                        <ImageList
                          sx={{
                            width: '100%',
                            borderRadius: 1,
                            maxHeight: 400,
                            overflow: 'auto'
                          }}
                          cols={2}
                          gap={8}
                        >
                          {memories.map((memory, index) => (
                            <ImageListItem key={index} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                              <img
                                src={memory.url}
                                alt={`Lembrança ${index + 1}`}
                                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                                loading="lazy"
                              />
                              <ImageListItemBar
                                actionIcon={
                                  <IconButton
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                    onClick={() => handleRemoveMemory(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                                sx={{
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                }}
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed #e0e0e0',
                          borderRadius: 2,
                          p: 4,
                          mb: 3
                        }}
                      >
                        <PhotoIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                          Nenhuma foto adicionada
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Clique em "Adicionar Fotos" para começar
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 3
                    }}>
                      {memories.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          {memories.length} de 8 fotos adicionadas
                        </Typography>
                      )}
                      <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={handleClickAddFiles}
                        disabled={memories.length >= 8}
                        sx={{
                          textTransform: 'none',
                          ml: 'auto'
                        }}
                      >
                        Adicionar Fotos
                      </Button>
                    </Box>
                  </Paper>
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 },
                    minHeight: '450px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TitlePreview
                    title={title}
                    titleColor={titleColor}
                    titleBgColor={titleBgColor}
                    showTitleCard={showTitleCard}
                    style={style}
                    timeText={timeText}
                    counterColor={counterColor}
                    counterFont={counterFont}
                    counterBgColor={counterBgColor}
                    showCounterCard={showCounterCard}
                    showAnimation={showAnimation}
                    selectedEmoji={selectedEmoji}
                    message={message}
                    messageColor={messageColor}
                    messageFont={messageFont}
                    messageStyle={messageStyle}
                    messageBgColor={messageBgColor}
                    showMessageCard={showMessageCard}
                    webBgColor={webBgColor}
                    memories={memories}
                    visualEffect={visualEffect}
                  />
                </Box>
              </>
            )}

            {activeStep === 5 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                      Escolha uma música
                    </Typography>
                    
                    {/* Abas para escolher entre YouTube e Spotify */}
                    <Tabs 
                      value={musicType} 
                      onChange={handleMusicTypeChange}
                      sx={{ mb: 3 }}
                    >
                      <Tab icon={<YouTubeIcon />} label="YOUTUBE" />
                      <Tab icon={<MusicNoteIcon />} label="SPOTIFY" />
                    </Tabs>

                    {/* Campo para inserir URL */}
                    <TextField
                      fullWidth
                      label={`Link do ${musicType === 0 ? 'YouTube' : 'Spotify'}`}
                      placeholder={musicType === 0 
                        ? "https://www.youtube.com/watch?v=..." 
                        : "https://open.spotify.com/track/..."}
                      variant="outlined"
                      value={musicUrl}
                      onChange={handleMusicUrlChange}
                      error={!!musicError}
                      helperText={musicError || `Cole o link da sua música do ${musicType === 0 ? 'YouTube' : 'Spotify'}`}
                      sx={{ mb: 3 }}
                    />

                    {/* Feedback de validação */}
                    {isMusicUrlValid && (
                      <Alert 
                        severity="success" 
                        icon={<CheckCircleIcon fontSize="inherit" />}
                        sx={{ mb: 2 }}
                      >
                        Link válido! Clique em "Próximo" para continuar.
                      </Alert>
                    )}

                    {isYoutubeSelected && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Por exemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                      </Typography>
                    )}

                    {isSpotifySelected && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Por exemplo: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
                      </Typography>
                    )}
                  </Paper>
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 }
                  }}
                >
                  <TitlePreview
                    title={title}
                    titleColor={titleColor}
                    titleBgColor={titleBgColor}
                    showTitleCard={showTitleCard}
                    style={style}
                    timeText={timeText}
                    counterColor={counterColor}
                    counterFont={counterFont}
                    counterBgColor={counterBgColor}
                    showCounterCard={showCounterCard}
                    showAnimation={showAnimation}
                    selectedEmoji={selectedEmoji}
                    message={message}
                    messageColor={messageColor}
                    messageFont={messageFont}
                    messageStyle={messageStyle}
                    messageBgColor={messageBgColor}
                    showMessageCard={showMessageCard}
                    webBgColor={webBgColor}
                    musicUrl={musicUrl}
                    musicType={musicType}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    videoId={videoId}
                    musicInfo={musicInfo}
                    trackId={trackId}
                    memories={memories}
                    visualEffect={visualEffect}
                  />
                </Box>
              </>
            )}

            {activeStep === 6 && (
              <>
                <Box
                  sx={{
                    width: { xs: '100%', sm: '400px' },
                    maxWidth: '100%',
                    order: { xs: 1, md: 1 }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 3,
                      position: 'relative'
                    }}
                  >
                    {/* Overlay de carregamento */}
                    {isLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          zIndex: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'inherit'
                        }}
                      >
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
                          {progressMessage}
                        </Typography>
                        <Box sx={{ width: '80%', mt: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={progressPercentage} 
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Box>
                    )}

                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                      Finalizar Criação
                    </Typography>

                    <TextField
                      fullWidth
                      label="Seu e-mail"
                      variant="outlined"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      helperText="Você receberá um link para acessar sua criação"
                      sx={{ mb: 3 }}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleFinalize}
                      disabled={isLoading}
                      sx={{ mb: 2, height: 48 }}
                    >
                      {isLoading ? (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            <Typography variant="button">Processando...</Typography>
                          </Box>
                        </>
                      ) : (
                        'Finalizar e Publicar'
                      )}
                    </Button>

                    {isFinalized && (
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Sua memória foi criada com sucesso!
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Acesse através do link:
                        </Typography>
                        
                        {/* URL completa com https para link e QR Code */}
                        {(() => {
                          const fullUrl = finalUrl;
                          return (
                            <>
                              <Paper 
                                elevation={2}
                                sx={{
                                  p: 2,
                                  mb: 3,
                                  bgcolor: 'primary.light',
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <Link
                                  href={fullUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    wordBreak: 'break-all',
                                    textDecoration: 'none',
                                    flexGrow: 1,
                                    mr: 1,
                                    '&:hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  {finalUrl}
                                </Link>
                                <Tooltip title="Copiar link">
                                  <IconButton 
                                    onClick={() => handleCopyLink(fullUrl)}
                                    size="small"
                                    sx={{ 
                                      color: 'white',
                                      bgcolor: 'rgba(255,255,255,0.1)',
                                      '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.2)'
                                      }
                                    }}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Paper>
                              
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                Ou escaneie o QR Code abaixo:
                              </Typography>
                              
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  mb: 2
                                }}
                              >
                                <Paper
                                  elevation={3}
                                  sx={{
                                    p: 3,
                                    bgcolor: 'white',
                                    borderRadius: 2
                                  }}
                                >
                                  <Box ref={qrCodeRef}>
                                    <QRCodeSVG 
                                      value={fullUrl} 
                                      size={200} 
                                      bgColor={"#ffffff"} 
                                      fgColor={"#000000"} 
                                      level={"H"} 
                                      includeMargin={true}
                                    />
                                  </Box>
                                </Paper>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<OpenInNewIcon />}
                                  component="a"
                                  href={fullUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ textTransform: 'none', px: 3 }}
                                >
                                  Acessar Memória
                                </Button>
                                
                                <Button
                                  id="share-button"
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<ShareIcon />}
                                  onClick={() => handleShare(fullUrl, title)}
                                  sx={{ textTransform: 'none', px: 3 }}
                                >
                                  Compartilhar
                                </Button>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  startIcon={qrCodeDownloading ? <CircularProgress size={18} color="inherit" /> : <SaveAltIcon />}
                                  onClick={() => handleDownloadQRCode(fullUrl, title)}
                                  disabled={qrCodeDownloading}
                                  sx={{ textTransform: 'none', px: 3 }}
                                >
                                  {qrCodeDownloading ? 'Salvando...' : 'Salvar QR Code'}
                                </Button>
                              </Box>

                              <Divider sx={{ my: 3 }} />
                            </>
                          );
                        })()}
                      </Box>
                    )}
                  </Paper>
                </Box>

                <Box
                  sx={{
                    order: { xs: 2, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                    mt: { xs: 2, md: 0 },
                    minHeight: '450px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TitlePreview
                    title={title}
                    titleColor={titleColor}
                    titleBgColor={titleBgColor}
                    showTitleCard={showTitleCard}
                    style={style}
                    timeText={timeText}
                    counterColor={counterColor}
                    counterFont={counterFont}
                    counterBgColor={counterBgColor}
                    showCounterCard={showCounterCard}
                    showAnimation={showAnimation}
                    selectedEmoji={selectedEmoji}
                    message={message}
                    messageColor={messageColor}
                    messageFont={messageFont}
                    messageStyle={messageStyle}
                    messageBgColor={messageBgColor}
                    showMessageCard={showMessageCard}
                    webBgColor={webBgColor}
                    musicUrl={processedMusicUrl || musicUrl}
                    musicType={musicType}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    videoId={videoId}
                    musicInfo={musicInfo}
                    trackId={trackId}
                    memories={memories}
                    visualEffect={visualEffect}
                  />
                </Box>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: { xs: 2, sm: 3 },
              mb: { xs: 1, sm: 2 },
              maxWidth: '800px',
              mx: 'auto',
              width: '100%',
              px: { xs: 1, sm: 0 },
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: 2
            }}
          >
            {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<NavigateBeforeIcon />}
              sx={{
                textTransform: 'none',
                order: { xs: 2, sm: 1 },
                flex: { xs: '1 0 100%', sm: 'initial' } 
              }}
            >
              Voltar
            </Button>
            )}

            {activeStep < 6 && (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNextIcon />}
              disabled={!isStepComplete(activeStep)}
              sx={{
                textTransform: 'none',
                order: { xs: 1, sm: 2 },
                flex: { xs: '1 0 100%', sm: 'initial' },
                ml: { xs: 0, sm: 'auto' }
              }}
            >
                Próximo
            </Button>
            )}
          </Box>
        </Box>
      </Container>

      {/* Snackbar para notificação de cópia */}
      <Snackbar
        open={copySnackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={copySnackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

