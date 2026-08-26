'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Accessibility,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Droplet,
  Contrast,
  ImageOff,
  AlignLeft,
  Brain,
  Type,
  X,
  ChevronRight
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  isVoiceActive: boolean;
  isSaturated: boolean;
  isContrast: boolean;
  isHideImages: boolean;
  isJustified: boolean;
  isDyslexia: boolean;
  lineHeightLevel: number;
}

const LINE_HEIGHTS = [1.5, 1.8, 2.2];
const LINE_HEIGHT_LABELS = ['Normal', 'Sedang', 'Tinggi'];

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    isVoiceActive: false,
    isSaturated: false,
    isContrast: false,
    isHideImages: false,
    isJustified: false,
    isDyslexia: false,
    lineHeightLevel: 0,
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse accessibility settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage and apply CSS changes
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    // Apply filters (combined to avoid conflicts)
    const filters = [];
    if (settings.isSaturated) filters.push('saturate(2)');
    if (settings.isContrast) filters.push('contrast(200%)', 'brightness(110%)');
    document.body.style.filter = filters.length > 0 ? filters.join(' ') : 'none';

    // Apply classes
    const html = document.documentElement;
    if (settings.isHideImages) {
      html.classList.add('hide-images');
    } else {
      html.classList.remove('hide-images');
    }

    if (settings.isJustified) {
      html.classList.add('text-justified');
    } else {
      html.classList.remove('text-justified');
    }

    if (settings.isDyslexia) {
      html.classList.add('dyslexia-mode');
    } else {
      html.classList.remove('dyslexia-mode');
    }

    // Apply line height
    document.body.style.lineHeight = LINE_HEIGHTS[settings.lineHeightLevel].toString();

  }, [settings]);

  // Voice Mode - Web Speech API
  const speakText = useCallback(() => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (settings.isVoiceActive) {
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
      const textToRead = Array.from(textElements)
        .map(el => el.textContent || '')
        .filter(text => text.trim().length > 0)
        .join('. ');

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.isVoiceActive]);

  useEffect(() => {
    speakText();
  }, [speakText]);

  const toggleVoice = () => {
    if (!settings.isVoiceActive) {
      window.speechSynthesis.cancel();
    }
    setSettings(prev => ({ ...prev, isVoiceActive: !prev.isVoiceActive }));
  };

  const stopVoice = () => {
    window.speechSynthesis.cancel();
    setSettings(prev => ({ ...prev, isVoiceActive: false }));
  };

  const zoomIn = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 10, 150)
    }));
  };

  const zoomOut = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 10, 80)
    }));
  };

  const toggleSaturation = () => {
    setSettings(prev => ({ ...prev, isSaturated: !prev.isSaturated }));
  };

  const toggleContrast = () => {
    setSettings(prev => ({ ...prev, isContrast: !prev.isContrast }));
  };

  const toggleHideImages = () => {
    setSettings(prev => ({ ...prev, isHideImages: !prev.isHideImages }));
  };

  const toggleJustified = () => {
    setSettings(prev => ({ ...prev, isJustified: !prev.isJustified }));
  };

  const toggleDyslexia = () => {
    setSettings(prev => ({ ...prev, isDyslexia: !prev.isDyslexia }));
  };

  const cycleLineHeight = () => {
    setSettings(prev => ({
      ...prev,
      lineHeightLevel: (prev.lineHeightLevel + 1) % LINE_HEIGHTS.length
    }));
  };

  // Keyboard shortcut CTRL+U
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
  }, []);

  const features = [
    {
      id: 'voice',
      icon: settings.isVoiceActive ? VolumeX : Volume2,
      label: 'Moda Suara',
      active: settings.isVoiceActive,
      action: settings.isVoiceActive ? stopVoice : toggleVoice,
      badge: null,
    },
    {
      id: 'zoom-in',
      icon: ZoomIn,
      label: 'Perbesar',
      active: settings.fontSize > 100,
      action: zoomIn,
      badge: `${settings.fontSize}%`,
    },
    {
      id: 'zoom-out',
      icon: ZoomOut,
      label: 'Perkecil',
      active: settings.fontSize < 100,
      action: zoomOut,
      badge: null,
    },
    {
      id: 'saturation',
      icon: Droplet,
      label: 'Kejenuhan',
      active: settings.isSaturated,
      action: toggleSaturation,
      badge: null,
    },
    {
      id: 'contrast',
      icon: Contrast,
      label: 'Kontras+',
      active: settings.isContrast,
      action: toggleContrast,
      badge: null,
    },
    {
      id: 'hide-images',
      icon: ImageOff,
      label: 'Sembunyi Gambar',
      active: settings.isHideImages,
      action: toggleHideImages,
      badge: null,
    },
    {
      id: 'justify',
      icon: AlignLeft,
      label: 'Rata Tulisan',
      active: settings.isJustified,
      action: toggleJustified,
      badge: null,
    },
    {
      id: 'dyslexia',
      icon: Brain,
      label: 'Ramah Disleksia',
      active: settings.isDyslexia,
      action: toggleDyslexia,
      badge: null,
    },
    {
      id: 'line-height',
      icon: Type,
      label: 'Tinggi Garis',
      active: settings.lineHeightLevel > 0,
      action: cycleLineHeight,
      badge: LINE_HEIGHT_LABELS[settings.lineHeightLevel],
    },
  ];

  return (
    <>
      {/* Global CSS Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html.hide-images img {
            display: none !important;
          }
          
          html.hide-images picture {
            display: none !important;
          }
          
          html.hide-images svg {
            display: none !important;
          }
          
          html.text-justified body {
            text-align: justify;
            text-justify: inter-word;
          }
          
          html.dyslexia-mode body {
            font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial Rounded MT Bold', Arial, sans-serif;
            letter-spacing: 0.12em;
            word-spacing: 0.2em;
            background-color: #fdf6e3;
            color: #333;
          }
          
          html.dyslexia-mode * {
            font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial Rounded MT Bold', Arial, sans-serif !important;
          }
        `
      }} />

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Buka Menu Aksesibilitas"
      >
        <Accessibility className="w-7 h-7" />
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Menu Aksesibilitas (CTRL+U)
        </span>
      </button>

      {/* Panel/Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Menu Aksesibilitas</h2>
                  <p className="text-sm text-gray-500 mt-1">Profil Aksesibilitas</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Tutup Menu"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded">
                Tekan <kbd className="bg-gray-200 px-1.5 py-0.5 rounded">CTRL</kbd> + <kbd className="bg-gray-200 px-1.5 py-0.5 rounded">U</kbd> untuk membuka/tutup
              </div>
            </div>

            {/* Features Grid */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={feature.action}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      feature.active
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    aria-label={feature.label}
                  >
                    <div
                      className={`mb-2 p-3 rounded-full ${
                        feature.active ? 'bg-green-600 text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 text-center mb-1">
                      {feature.label}
                    </span>
                    {feature.badge && (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                    <div className="mt-2 flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          feature.active ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {feature.active ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSettings({
                    fontSize: 100,
                    isVoiceActive: false,
                    isSaturated: false,
                    isContrast: false,
                    isHideImages: false,
                    isJustified: false,
                    isDyslexia: false,
                    lineHeightLevel: 0,
                  });
                  window.speechSynthesis.cancel();
                }}
                className="mt-6 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Reset Semua Pengaturan
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
