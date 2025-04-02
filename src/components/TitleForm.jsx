import { Box, TextField, IconButton, Paper, InputAdornment, Tooltip, ButtonGroup, Popover, Slider, Typography, Switch } from '@mui/material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import EmojiPicker from 'emoji-picker-react';
import { CirclePicker } from 'react-color';

export default function TitleForm({ 
  title, 
  onTitleChange, 
  titleColor, 
  onTitleColorChange,
  titleBgColor,
  onTitleBgColorChange,
  showTitleCard,
  onShowTitleCardChange,
  onNext,
  style,
  onStyleChange,
  webBgColor,
  onWebBgColorChange
}) {
  const [textColorAnchorEl, setTextColorAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTitleBgColorPicker, setShowTitleBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [bgColorAnchorEl, setBgColorAnchorEl] = useState(null);
  const [titleBgColorAnchorEl, setTitleBgColorAnchorEl] = useState(null);
  const [fontAnchorEl, setFontAnchorEl] = useState(null);
  const [sizeAnchorEl, setSizeAnchorEl] = useState(null);

  const fonts = [
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

  const handleTitleChange = (event) => {
    const value = event.target.value.slice(0, 100);
    onTitleChange(value);
  };

  const handleColorChange = (color) => {
    onTitleColorChange(color.hex);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && title.trim()) {
      onNext();
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

  const handleTitleBgColorClick = (event) => {
    setTitleBgColorAnchorEl(event.currentTarget);
    setShowTitleBgColorPicker(true);
  };

  const handleFontClick = (event) => {
    setFontAnchorEl(event.currentTarget);
    setShowFontPicker(true);
  };

  const handleSizeClick = (event) => {
    setSizeAnchorEl(event.currentTarget);
    setShowSizeSlider(true);
  };

  const handleEmojiSelect = (emojiData) => {
    onTitleChange(title + emojiData.emoji);
    setShowEmojiPicker(false);
    setEmojiAnchorEl(null);
  };

  const handleBgColorChange = (color) => {
    const newStyle = { ...style, backgroundColor: color.hex };
    onStyleChange(newStyle);
    
    onWebBgColorChange?.(color.hex);
    
    setShowBgColorPicker(false);
    setBgColorAnchorEl(null);
  };

  const handleTitleBgColorChange = (color) => {
    onTitleBgColorChange(color.hex);
    setShowTitleBgColorPicker(false);
    setTitleBgColorAnchorEl(null);
  };

  const handleFontChange = (font) => {
    const newStyle = { ...style, fontFamily: font };
    onStyleChange(newStyle);
    setShowFontPicker(false);
    setFontAnchorEl(null);
  };

  const handleTitleSizeChange = (event, newValue) => {
    const newStyle = { ...style, titleSize: newValue };
    onStyleChange(newStyle);
  };

  const handleClosePopovers = () => {
    setShowEmojiPicker(false);
    setShowBgColorPicker(false);
    setShowTitleBgColorPicker(false);
    setShowTextColorPicker(false);
    setShowFontPicker(false);
    setShowSizeSlider(false);
    setEmojiAnchorEl(null);
    setBgColorAnchorEl(null);
    setTitleBgColorAnchorEl(null);
    setTextColorAnchorEl(null);
    setFontAnchorEl(null);
    setSizeAnchorEl(null);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        width: '400px',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ mb: 3, position: 'relative' }}>
        <TextField
          fullWidth
          label="Título da sua memória"
          value={title}
          onChange={handleTitleChange}
          onKeyPress={handleKeyPress}
          variant="outlined"
          multiline
          rows={4}
          inputProps={{ maxLength: 100 }}
          helperText={`${title.length}/100 caracteres`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleEmojiClick}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton
                  onClick={handleTextColorClick}
                  sx={{
                    color: titleColor,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <FormatColorTextIcon />
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
          backgroundColor: '#f5f5f5', 
          borderRadius: 2,
          p: 0.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Cor de fundo do título">
            <IconButton 
              onClick={handleTitleBgColorClick}
              sx={{ 
                color: titleBgColor || style.backgroundColor,
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
          <Tooltip title={showTitleCard ? "Ocultar card do título" : "Mostrar card do título"}>
            <Switch
              size="small"
              checked={showTitleCard}
              onChange={(e) => onShowTitleCardChange(e.target.checked)}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: titleBgColor || style.backgroundColor
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: titleBgColor || style.backgroundColor
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
        <Tooltip title="Tamanho do título">
          <IconButton onClick={handleSizeClick}
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
            <FormatSizeIcon />
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
        <EmojiPicker onEmojiClick={handleEmojiSelect} />
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
            color={titleColor}
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
            Cor de fundo geral
          </Typography>
          <CirclePicker
            colors={colors}
            color={style?.backgroundColor || '#ffffff'}
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
          {fonts.map((font) => (
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

      {/* Popover para ajuste de tamanho do título */}
      <Popover
        open={showSizeSlider}
        anchorEl={sizeAnchorEl}
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
        <Paper sx={{ p: 2, width: 300 }}>
          <Slider
            value={style?.titleSize || 48}
            onChange={handleTitleSizeChange}
            min={24}
            max={96}
            step={2}
            marks={[
              { value: 24, label: '24px' },
              { value: 48, label: '48px' },
              { value: 72, label: '72px' },
              { value: 96, label: '96px' },
            ]}
          />
        </Paper>
      </Popover>

      {/* Popover para seleção de cor de fundo do título */}
      <Popover
        open={showTitleBgColorPicker}
        anchorEl={titleBgColorAnchorEl}
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
            Cor de fundo do título
          </Typography>
          <CirclePicker
            colors={colors}
            color={titleBgColor || style.backgroundColor}
            onChange={handleTitleBgColorChange}
            width="260px"
            circleSize={22}
            circleSpacing={10}
          />
        </Paper>
      </Popover>
    </Box>
  );
}
