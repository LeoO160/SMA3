import { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Tooltip, Paper, Popover } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import EmojiPicker from 'emoji-picker-react';
import { CirclePicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

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

const animatedEmojis = [
  '❤️', '✨', '🌟', '💫', '💕', '💝', '🎵', '🎶', '🌈', '🦋'
];

export default function DateCounter({ 
  selectedDate, 
  onDateChange,
  complementText,
  onComplementTextChange,
  textColor,
  fontFamily,
  onTimeTextChange,
  onTextColorChange,
  onFontFamilyChange,
  onAnimationChange,
  onEmojiSelect,
  counterBgColor,
  onCounterBgColorChange,
  showCounterCard,
  onShowCounterCardChange
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [textColorAnchorEl, setTextColorAnchorEl] = useState(null);
  const [bgColorAnchorEl, setBgColorAnchorEl] = useState(null);
  const [fontAnchorEl, setFontAnchorEl] = useState(null);

  const handleDateChange = (newDate) => {
    onDateChange(newDate);
  };

  const handleComplementTextChange = (event) => {
    const newText = event.target.value;
    // Limita em 100 caracteres, que é um bom limite para 3 linhas
    if (newText.length <= 100) {
      onComplementTextChange(newText);
    }
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

  const onEmojiClick = (emojiData) => {
    const newText = complementText + emojiData.emoji;
    if (newText.length <= 100) {
      onComplementTextChange(newText);
    }
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
  };

  const handleColorChange = (color) => {
    onTextColorChange(color.hex);
  };

  const handleBgColorChange = (color) => {
    onCounterBgColorChange(color.hex);
    setShowBgColorPicker(false);
    setBgColorAnchorEl(null);
  };

  const handleFontChange = (font) => {
    onFontFamilyChange(font);
    setShowFontPicker(false);
    setFontAnchorEl(null);
  };

  const handleAnimationToggle = (event) => {
    const isChecked = event.target.checked;
    setShowAnimation(isChecked);
    onAnimationChange?.(isChecked);
  };

  const handleEmojiSelect = (event) => {
    const emoji = event.target.value;
    setSelectedEmoji(emoji);
    onEmojiSelect?.(emoji);
  };

  const handleClosePopovers = () => {
    setShowEmojiPicker(false);
    setShowTextColorPicker(false);
    setShowBgColorPicker(false);
    setShowFontPicker(false);
    setEmojiAnchorEl(null);
    setTextColorAnchorEl(null);
    setBgColorAnchorEl(null);
    setFontAnchorEl(null);
  };

  const getTimeDifference = () => {
    // Normaliza as datas para o início do dia (00:00:00) para evitar diferenças por horário
    const now = dayjs().startOf('day');
    const target = dayjs(selectedDate).startOf('day');
    
    // Calcula a diferença em dias totais entre as datas
    const diffDays = Math.abs(target.diff(now, 'day'));
    
    // Calcula anos, meses e dias
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);

    if (parts.length === 0) return 'hoje';
    
    const timeText = parts.join(', ');
    let prefix = '';
    
    if (target.isBefore(now)) {
      prefix = 'Fazem ';
    } else if (target.isAfter(now)) {
      prefix = 'Faltam ';
    }

    return `${prefix}${timeText}${complementText ? ` ${complementText}` : ''}`;
  };

  useEffect(() => {
    const text = getTimeDifference();
    onTimeTextChange?.(text);
  }, [selectedDate, complementText]);

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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DatePicker
          label="Data"
          value={selectedDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          sx={{ 
            width: '100%', 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main'
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark'
              }
            }
          }}
          slotProps={{
            textField: {
              variant: 'outlined',
              size: 'medium'
            }
          }}
        />
      </LocalizationProvider>

      <Box sx={{ position: 'relative', mb: 3 }}>
        <TextField
          fullWidth
          label="Complemento"
          value={complementText}
          onChange={handleComplementTextChange}
          variant="outlined"
          multiline
          rows={2}
          placeholder="que te amo"
          helperText={`${complementText.length}/100 caracteres`}
          error={complementText.length >= 100}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleEmojiClick}
                  edge="end"
                  disabled={complementText.length >= 100}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Barra de ferramentas minimalista */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 2, 
          mb: 3,
          backgroundColor: '#f5f5f5', 
          borderRadius: 2,
          p: 0.5
        }}
      >
        <Tooltip title="Cor do texto">
          <IconButton onClick={handleTextColorClick} 
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
          <Tooltip title="Cor de fundo do contador">
            <IconButton 
              onClick={handleBgColorClick} 
              sx={{ 
                color: counterBgColor || '#ffffff',
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
          <Tooltip title={showCounterCard ? "Ocultar card do contador" : "Mostrar card do contador"}>
            <Switch
              size="small"
              checked={showCounterCard}
              onChange={(e) => onShowCounterCardChange(e.target.checked)}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: counterBgColor || '#ffffff'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: counterBgColor || '#ffffff'
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
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showAnimation}
              onChange={handleAnimationToggle}
              color="primary"
            />
          }
          label="Ativar Animação"
        />
      </Box>

      {showAnimation && (
        <FormControl fullWidth>
          <InputLabel>Emoji Animado</InputLabel>
          <Select
            value={selectedEmoji}
            onChange={handleEmojiSelect}
            label="Emoji Animado"
          >
            {animatedEmojis.map((emoji) => (
              <MenuItem 
                key={emoji} 
                value={emoji}
                sx={{ 
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {emoji}
                <Typography variant="body2">
                  {emoji === '❤️' ? 'Coração' : 
                   emoji === '✨' ? 'Brilhos' :
                   emoji === '🌟' ? 'Estrela' :
                   emoji === '💫' ? 'Estrela Cadente' :
                   emoji === '💕' ? 'Corações' :
                   emoji === '💝' ? 'Coração com Laço' :
                   emoji === '🎵' ? 'Nota Musical' :
                   emoji === '🎶' ? 'Notas Musicais' :
                   emoji === '🌈' ? 'Arco-íris' :
                   'Borboleta'}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

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
            Cor de fundo do contador
          </Typography>
          <CirclePicker
            colors={colors}
            color={counterBgColor || '#ffffff'}
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
        <Paper sx={{ p: 2, width: 200 }}>
          {fontOptions.map((font) => (
            <Box 
              key={font.value}
              sx={{ 
                p: 1, 
                cursor: 'pointer', 
                fontFamily: font.value,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
              onClick={() => handleFontChange(font.value)}
            >
              {font.name}
            </Box>
          ))}
        </Paper>
      </Popover>
    </Box>
  );
}
