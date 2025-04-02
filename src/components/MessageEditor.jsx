import { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Popover, 
  IconButton, 
  Tooltip, 
  TextField,
  InputAdornment,
  Switch,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import EmojiPicker from 'emoji-picker-react';
import { CirclePicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EffectsSelector from './EffectsSelector';

// Configurações das fontes disponíveis
const fontOptions = [
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Dancing Script', value: "'Dancing Script', cursive" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
  { name: 'Quicksand', value: "'Quicksand', sans-serif" },
];

// Paleta de cores expandida com mais opções
const colors = [
  // Vermelhos e rosas
  '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c',
  '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f',
  
  // Roxos
  '#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c',
  '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92',
  
  // Azuis
  '#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e',
  '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1',
  '#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b',
  
  // Cyans e Teals
  '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064',
  '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40',
  
  // Verdes
  '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20',
  '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e',
  
  // Amarelos e Laranjas
  '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17',
  '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00',
  '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100',
  
  // Vermelhos profundos
  '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c',
  
  // Marrons
  '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723',
  
  // Cinzas
  '#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121',
  
  // Azuis acinzentados
  '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#455a64', '#37474f', '#263238',
  
  // Preto e branco
  '#ffffff', '#000000',
];

export default function MessageEditor({
  message,
  onMessageChange,
  fontFamily,
  onFontFamilyChange,
  textStyle,
  onTextStyleChange,
  textColor,
  onTextColorChange,
  messageBgColor,
  onMessageBgColorChange,
  showMessageCard,
  onShowMessageCardChange,
  visualEffect,
  onVisualEffectChange
}) {
  const [text, setText] = useState(message || '');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textFieldRef = useRef(null);
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showEffectsPicker, setShowEffectsPicker] = useState(false);
  
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [textColorAnchorEl, setTextColorAnchorEl] = useState(null);
  const [bgColorAnchorEl, setBgColorAnchorEl] = useState(null);
  const [fontAnchorEl, setFontAnchorEl] = useState(null);
  const [effectsAnchorEl, setEffectsAnchorEl] = useState(null);

  // Manipulador de mudança do texto
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    if (onMessageChange) {
      onMessageChange(newText);
    }
  };

  // Manipulador de seleção de texto
  const handleSelect = (event) => {
    setSelection({
      start: event.target.selectionStart,
      end: event.target.selectionEnd
    });
  };

  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
    setShowEmojiPicker(true);
  };

  const handleTextColorClick = (event) => {
    setTextColorAnchorEl(event.currentTarget);
    setShowTextColorPicker(true);
  };

  const handleBgColorClick = (event) => {
    setBgColorAnchorEl(event.currentTarget);
    setShowBgColorPicker(true);
  };

  const handleFontClick = (event) => {
    setFontAnchorEl(event.currentTarget);
    setShowFontPicker(true);
  };

  const handleEffectsClick = (event) => {
    setEffectsAnchorEl(event.currentTarget);
    setShowEffectsPicker(true);
  };

  const onEmojiClick = (emojiData) => {
    // Inserir emoji na posição do cursor
    const { start, end } = selection;
    const textBeforeCursor = text.substring(0, start);
    const textAfterCursor = text.substring(end);
    
    const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;
    setText(newText);
    if (onMessageChange) {
      onMessageChange(newText);
    }
    
    // Fechar o seletor de emoji
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
    
    // Focar o campo de texto e posicionar o cursor após o emoji
    setTimeout(() => {
      if (textFieldRef.current) {
        const input = textFieldRef.current.querySelector('textarea');
        if (input) {
          input.focus();
          input.selectionStart = start + emojiData.emoji.length;
          input.selectionEnd = start + emojiData.emoji.length;
          // Atualizar a seleção
          setSelection({
            start: start + emojiData.emoji.length,
            end: start + emojiData.emoji.length
          });
        }
      }
    }, 10);
  };

  const handleStyleToggle = (style) => {
    const newStyles = [...(textStyle || [])];
    
    if (newStyles.includes(style)) {
      const index = newStyles.indexOf(style);
      newStyles.splice(index, 1);
    } else {
      newStyles.push(style);
    }
    
    onTextStyleChange(newStyles);
  };

  const handleColorChange = (color) => {
    onTextColorChange(color.hex);
    setShowTextColorPicker(false);
    setTextColorAnchorEl(null);
  };

  const handleBgColorChange = (color) => {
    onMessageBgColorChange(color.hex);
    setShowBgColorPicker(false);
    setBgColorAnchorEl(null);
  };

  const handleFontChange = (font) => {
    onFontFamilyChange(font);
    setShowFontPicker(false);
    setFontAnchorEl(null);
  };

  const handleVisualEffectChange = (effect) => {
    onVisualEffectChange(effect);
    setShowEffectsPicker(false);
    setEffectsAnchorEl(null);
  };

  const handleClosePopovers = () => {
    setShowEmojiPicker(false);
    setShowTextColorPicker(false);
    setShowBgColorPicker(false);
    setShowFontPicker(false);
    setShowEffectsPicker(false);
    setEmojiAnchorEl(null);
    setTextColorAnchorEl(null);
    setBgColorAnchorEl(null);
    setFontAnchorEl(null);
    setEffectsAnchorEl(null);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        width: '400px',
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 'medium'
        }}
      >
        Mensagem
      </Typography>

      {/* Campo de texto usando TextField do Material UI */}
      <Box ref={textFieldRef}>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={15}
          value={text}
          onChange={handleTextChange}
          onSelect={handleSelect}
          placeholder="Digite sua mensagem aqui..."
          variant="outlined"
          InputProps={{
            sx: {
              fontFamily: fontFamily || 'inherit',
              color: textColor || 'inherit',
              fontWeight: textStyle?.includes('bold') ? 'bold' : 'normal',
              fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
              whiteSpace: 'pre-line'
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Inserir emoji">
                  <IconButton onClick={handleEmojiClick} edge="end">
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          }}
          sx={{
            mb: 2
          }}
        />
      </Box>

      {/* Barra de ferramentas */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1,
          mb: 3,
          backgroundColor: '#f5f5f5', 
          borderRadius: 2,
          p: 0.5
        }}
      >
        <Tooltip title="Negrito">
          <IconButton 
            onClick={() => handleStyleToggle('bold')}
            sx={{ 
              bgcolor: textStyle?.includes('bold') ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              '& svg': {
                filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                transition: 'all 0.2s ease'
              },
              '&:hover svg': {
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))',
                transform: 'scale(1.1)'
              }
            }}
          >
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Itálico">
          <IconButton 
            onClick={() => handleStyleToggle('italic')}
            sx={{ 
              bgcolor: textStyle?.includes('italic') ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              '& svg': {
                filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                transition: 'all 0.2s ease'
              },
              '&:hover svg': {
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))',
                transform: 'scale(1.1)'
              }
            }}
          >
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cor do texto">
          <IconButton 
            onClick={handleTextColorClick}
            sx={{ 
              color: textColor,
              '& svg': {
                filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                transition: 'all 0.2s ease'
              },
              '&:hover svg': {
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))',
                transform: 'scale(1.1)'
              }
            }}
          >
            <FormatColorTextIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Cor de fundo da mensagem">
            <IconButton 
              onClick={handleBgColorClick}
              sx={{ 
                color: messageBgColor || '#ffffff',
                '& svg': {
                  filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                  transition: 'all 0.2s ease'
                },
                '&:hover svg': {
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ColorLensIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showMessageCard ? "Ocultar card da mensagem" : "Mostrar card da mensagem"}>
            <Switch
              size="small"
              checked={showMessageCard}
              onChange={(e) => onShowMessageCardChange(e.target.checked)}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: messageBgColor || '#ffffff'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: messageBgColor || '#ffffff'
                }
              }}
            />
          </Tooltip>
        </Box>
        <Tooltip title="Fonte">
          <IconButton onClick={handleFontClick}
            sx={{
              '& svg': {
                filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                transition: 'all 0.2s ease'
              },
              '&:hover svg': {
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))',
                transform: 'scale(1.1)'
              }
            }}
          >
            <TextFormatIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Efeitos visuais">
          <IconButton 
            onClick={handleEffectsClick}
            sx={{ 
              color: visualEffect ? '#e91e63' : 'inherit',
              '& svg': {
                filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                transition: 'all 0.2s ease'
              },
              '&:hover svg': {
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))',
                transform: 'scale(1.1)'
              }
            }}
          >
            <AutoAwesomeIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Popover para Emoji Picker */}
      <Popover
        open={showEmojiPicker}
        anchorEl={emojiAnchorEl}
        onClose={handleClosePopovers}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </Popover>

      {/* Popover para seleção de cor do texto */}
      <Popover
        open={showTextColorPicker}
        anchorEl={textColorAnchorEl}
        onClose={handleClosePopovers}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2, width: 280, maxHeight: 400, overflow: 'auto' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
            Cor do texto
          </Typography>
          <CirclePicker
            colors={colors}
            color={textColor}
            onChange={handleColorChange}
            width="260px"
            circleSize={22}
            circleSpacing={10}
          />
        </Paper>
      </Popover>

      {/* Popover para seleção de cor de fundo */}
      <Popover
        open={showBgColorPicker}
        anchorEl={bgColorAnchorEl}
        onClose={handleClosePopovers}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2, width: 280, maxHeight: 400, overflow: 'auto' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
            Cor de fundo da mensagem
          </Typography>
          <CirclePicker
            colors={colors}
            color={messageBgColor || '#ffffff'}
            onChange={handleBgColorChange}
            width="260px"
            circleSize={22}
            circleSpacing={10}
          />
        </Paper>
      </Popover>

      {/* Popover para seleção de fonte */}
      <Popover
        open={showFontPicker}
        anchorEl={fontAnchorEl}
        onClose={handleClosePopovers}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
            Escolha uma fonte
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {fontOptions.map((option) => (
              <Box
                key={option.value}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  borderRadius: 1,
                  backgroundColor: fontFamily === option.value ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                  }
                }}
                onClick={() => handleFontChange(option.value)}
              >
                <Typography sx={{ fontFamily: option.value }}>
                  {option.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Popover>

      {/* Popover para seleção de efeitos visuais */}
      <Popover
        open={showEffectsPicker}
        anchorEl={effectsAnchorEl}
        onClose={handleClosePopovers}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2, width: 350, maxHeight: 400, overflow: 'auto' }}>
          <EffectsSelector 
            selectedEffect={visualEffect}
            onSelectEffect={handleVisualEffectChange}
          />
        </Paper>
      </Popover>

      {/* Previsualização dos efeitos visuais */}
      {visualEffect && (
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px dashed #ccc'
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon fontSize="small" sx={{ color: '#e91e63' }} />
            Efeito visual selecionado
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              backgroundColor: '#f9f9f9', 
              p: 1.5,
              borderRadius: 1,
              border: '1px solid #eee'
            }}>
            <Box sx={{ 
              width: 36, 
              height: 36, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              fontSize: '20px'
            }}>
              {visualEffect === 'petals' && '🌸'}
              {visualEffect === 'hearts' && '❤️'}
              {visualEffect === 'fireworks' && '🎆'}
              {visualEffect === 'bubbles' && '🫧'}
              {visualEffect === 'confetti' && '🎉'}
              {visualEffect === 'rainbow' && '🌈'}
            </Box>
            <Typography variant="body1">
              {visualEffect === 'petals' && 'Pétalas caindo'}
              {visualEffect === 'hearts' && 'Corações flutuando'}
              {visualEffect === 'fireworks' && 'Fogos de artifício'}
              {visualEffect === 'bubbles' && 'Bolhas flutuantes'}
              {visualEffect === 'confetti' && 'Confetes coloridos'}
              {visualEffect === 'rainbow' && 'Arco-íris saltitantes'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
