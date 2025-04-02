import React from 'react';
import './VisualEffects.css';

const EffectsSelector = ({ selectedEffect, onSelectEffect }) => {
  const effects = [
    { id: null, name: 'Nenhum', icon: '✖️' },
    { id: 'petals', name: 'Pétalas', icon: '🌸' },
    { id: 'hearts', name: 'Corações', icon: '❤️' },
    { id: 'fireworks', name: 'Fogos', icon: '🎆' },
    { id: 'bubbles', name: 'Bolhas', icon: '🫧' },
    { id: 'confetti', name: 'Confetes', icon: '🎉' },
    { id: 'rainbow', name: 'Arco-íris', icon: '🌈' }
  ];

  return (
    <div className="effects-selector-container">
      <h3>Escolha um efeito visual</h3>
      <div className="effects-selector">
        {effects.map(effect => (
          <div
            key={effect.id}
            className={`effect-option ${selectedEffect === effect.id ? 'selected' : ''}`}
            onClick={() => onSelectEffect(effect.id === 'none' ? null : effect.id)}
          >
            <span className="effect-icon">{effect.icon}</span>
            <span className="effect-name">{effect.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectsSelector; 