import React, { useEffect, useState } from 'react';
import './VisualEffects.css';

// Componente de Pétalas caindo
export const FallingPetals = () => {
  useEffect(() => {
    const container = document.querySelector('.petals-container');
    if (!container) return;

    const createPetal = () => {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
      petal.style.opacity = Math.random() * 0.5 + 0.5;
      petal.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      container.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, 10000);
    };

    // Criar pétalas periodicamente
    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createPetal();
      }
    }, 500);

    // Inicialmente criar algumas pétalas
    for (let i = 0; i < 15; i++) {
      createPetal();
    }

    return () => {
      clearInterval(interval);
      // Limpar todas as pétalas ao desmontar
      const petals = document.querySelectorAll('.petal');
      petals.forEach(petal => petal.remove());
    };
  }, []);

  return <div className="petals-container"></div>;
};

// Componente de Corações flutuando
export const FloatingHearts = () => {
  useEffect(() => {
    const container = document.querySelector('.hearts-container');
    if (!container) return;

    const createHeart = () => {
      const heart = document.createElement('div');
      heart.classList.add('heart');
      heart.innerHTML = '❤️';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${Math.random() * 3 + 3}s`;
      heart.style.opacity = Math.random() * 0.5 + 0.5;
      heart.style.fontSize = `${Math.random() * 10 + 15}px`;
      
      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 6000);
    };

    // Criar corações periodicamente
    const interval = setInterval(() => {
      for (let i = 0; i < 2; i++) {
        createHeart();
      }
    }, 400);

    // Inicialmente criar alguns corações
    for (let i = 0; i < 10; i++) {
      createHeart();
    }

    return () => {
      clearInterval(interval);
      // Limpar todos os corações ao desmontar
      const hearts = document.querySelectorAll('.heart');
      hearts.forEach(heart => heart.remove());
    };
  }, []);

  return <div className="hearts-container"></div>;
};

// Componente de Fogos de artifício
export const Fireworks = () => {
  useEffect(() => {
    const container = document.querySelector('.fireworks-container');
    if (!container) return;

    const createParticle = (x, y, color) => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = color;
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      container.appendChild(particle);

      // Animar a partícula
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 50 + 50;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      let opacity = 1;
      const animateParticle = () => {
        const currentLeft = parseFloat(particle.style.left);
        const currentTop = parseFloat(particle.style.top);
        
        particle.style.left = `${currentLeft + vx * 0.1}px`;
        particle.style.top = `${currentTop + vy * 0.1}px`;
        
        opacity -= 0.02;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animateParticle);
    };

    // Função para criar som de explosão usando Web Audio API
    const createExplosionSound = () => {
      try {
        // Criar um contexto de áudio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Criar oscilador e gain node
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configurar o oscilador
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220 + Math.random() * 440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.3);
        
        // Configurar o ganho (volume)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        // Conectar os nós
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Iniciar e parar
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.log('Navegador não suporta Web Audio API:', e);
      }
    };

    const createFirework = () => {
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight * 0.6;
      const colors = ['#FF0000', '#FFD700', '#00FF00', '#00FFFF', '#FF00FF', '#FFFFFF'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      for (let i = 0; i < 50; i++) {
        createParticle(x, y, color);
      }
      
      // Gerar som de explosão
      createExplosionSound();
    };

    // Criar fogos periodicamente
    const interval = setInterval(() => {
      createFirework();
    }, 2000);

    // Inicialmente criar um fogo
    createFirework();

    return () => {
      clearInterval(interval);
      // Limpar todas as partículas ao desmontar
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return <div className="fireworks-container"></div>;
};

// Componente de Bolhas flutuantes
export const Bubbles = () => {
  useEffect(() => {
    const container = document.querySelector('.bubbles-container');
    if (!container) return;

    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${Math.random() * 4 + 6}s`;
      bubble.style.width = `${Math.random() * 30 + 10}px`;
      bubble.style.height = bubble.style.width;
      
      container.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 10000);
    };

    // Criar bolhas periodicamente
    const interval = setInterval(() => {
      for (let i = 0; i < 2; i++) {
        createBubble();
      }
    }, 600);

    // Inicialmente criar algumas bolhas
    for (let i = 0; i < 10; i++) {
      createBubble();
    }

    return () => {
      clearInterval(interval);
      // Limpar todas as bolhas ao desmontar
      const bubbles = document.querySelectorAll('.bubble');
      bubbles.forEach(bubble => bubble.remove());
    };
  }, []);

  return <div className="bubbles-container"></div>;
};

// Componente de Confetes caindo
export const Confetti = () => {
  useEffect(() => {
    const container = document.querySelector('.confetti-container');
    if (!container) return;

    const createConfetti = () => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Definir posição, rotação e escala aleatórias
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDuration = `${Math.random() * 3 + 3}s`;
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Definir tamanho aleatório
      const size = Math.random() * 8 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Definir cor aleatória
      const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#ff99c8', '#a9def9'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      
      // Definir formato aleatório
      const shapes = ['circle', 'square', 'triangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      confetti.classList.add(`confetti-${shape}`);
      
      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 6000);
    };

    // Criar confetes periodicamente
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createConfetti();
      }
    }, 300);

    // Inicialmente criar alguns confetes
    for (let i = 0; i < 30; i++) {
      createConfetti();
    }

    return () => {
      clearInterval(interval);
      // Limpar todos os confetes ao desmontar
      const confetti = document.querySelectorAll('.confetti');
      confetti.forEach(item => item.remove());
    };
  }, []);

  return <div className="confetti-container"></div>;
};

// Componente Rainbow (Arco-íris) - versão com emojis flutuantes
function Rainbow() {
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'rainbow-emoji-container';
    document.body.appendChild(container);

    // Criar arco-íris iniciais
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createRainbowEmoji(), i * 100);
    }

    // Criar novos emojis periodicamente
    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createRainbowEmoji();
      }
    }, 400);

    function createRainbowEmoji() {
      const emoji = document.createElement('div');
      emoji.className = 'rainbow-emoji';
      
      // Usar emoji de arco-íris
      emoji.textContent = '🌈';
      
      // Tamanho aleatório
      const size = Math.random() * 30 + 20;
      emoji.style.fontSize = `${size}px`;
      
      // Posição inicial aleatória (na parte inferior da tela)
      const posX = Math.random() * 90 + 5; // entre 5% e 95% da largura
      emoji.style.left = `${posX}%`;
      emoji.style.bottom = '-20px';
      
      // Adicionar uma rotação aleatória
      emoji.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
      
      // Duração da animação aleatória
      const duration = Math.random() * 3 + 4;
      emoji.style.animationDuration = `${duration}s`;
      
      container.appendChild(emoji);
      
      // Remover o emoji após a animação
      setTimeout(() => {
        if (emoji && emoji.parentNode) {
          emoji.parentNode.removeChild(emoji);
        }
      }, duration * 1000);
    }

    return () => {
      clearInterval(interval);
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return null;
}

// Componente principal que agrupa todos os efeitos
const VisualEffects = ({ effect }) => {
  if (!effect) return null;

  return (
    <>
      {effect === 'petals' && <FallingPetals />}
      {effect === 'hearts' && <FloatingHearts />}
      {effect === 'fireworks' && <Fireworks />}
      {effect === 'bubbles' && <Bubbles />}
      {effect === 'confetti' && <Confetti />}
      {effect === 'rainbow' && <Rainbow />}
    </>
  );
};

export default VisualEffects; 