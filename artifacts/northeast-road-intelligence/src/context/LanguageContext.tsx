import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Language, type TranslationDict, translations } from '../data/translations';

export type { Language };
export type LanguageCode = Language;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDict) => string;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  isSpeechSupported: boolean;
  isVoiceInputSupported: boolean;
  startVoiceInput: (onResult: (transcript: string) => void, onError?: (err: string) => void) => () => void;
  isListening: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_LANG_KEY = 'nersmart_language_pref_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'as')) {
        return saved as Language;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Persist language selection
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, []);

  // Update HTML lang attribute on mount / change
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Translation lookup helper
  const t = useCallback(
    (key: keyof TranslationDict): string => {
      const currentDict = translations[language] || translations.en;
      if (currentDict && currentDict[key]) {
        return currentDict[key];
      }
      return translations.en[key] || String(key);
    },
    [language]
  );

  // Check browser SpeechSynthesis & SpeechRecognition support
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isVoiceInputSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Text-To-Speech
  const speakText = useCallback(
    (text: string) => {
      if (!isSpeechSupported) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Assign language code
        if (language === 'hi') {
          utterance.lang = 'hi-IN';
        } else if (language === 'as') {
          utterance.lang = 'as-IN';
        } else {
          utterance.lang = 'en-IN';
        }

        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    },
    [language, isSpeechSupported]
  );

  const stopSpeaking = useCallback(() => {
    if (isSpeechSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeechSupported]);

  // Speech-To-Text
  const startVoiceInput = useCallback(
    (onResult: (transcript: string) => void, onError?: (err: string) => void): (() => void) => {
      if (!isVoiceInputSupported) {
        if (onError) onError('Speech recognition is not supported in this browser.');
        return () => {};
      }

      try {
        const SpeechRec = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

        if (!SpeechRec) {
          if (onError) onError('Speech recognition unavailable');
          return () => {};
        }

        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;

        if (language === 'hi') {
          recognition.lang = 'hi-IN';
        } else if (language === 'as') {
          recognition.lang = 'as-IN';
        } else {
          recognition.lang = 'en-IN';
        }

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: { error: string }) => {
          setIsListening(false);
          if (onError) onError(event.error);
        };
        recognition.onresult = (event: { results: { [x: string]: { [x: string]: { transcript: string } } } }) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onResult(transcript);
          }
        };

        recognition.start();

        return () => {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
        };
      } catch (e) {
        setIsListening(false);
        if (onError) onError(String(e));
        return () => {};
      }
    },
    [language, isVoiceInputSupported]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speakText,
        isSpeaking,
        stopSpeaking,
        isSpeechSupported,
        isVoiceInputSupported,
        startVoiceInput,
        isListening,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
