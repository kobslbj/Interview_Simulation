'use client';

import { useState, useEffect } from 'react';

export default function SpeechRecognitionComponent() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('你的瀏覽器不支援語音識別');
      return;
    }
    const newRecognition = new SpeechRecognition();
    newRecognition.lang = 'en';
    newRecognition.interimResults = true;
    newRecognition.continuous = true;

    newRecognition.addEventListener('result', (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptText);
        } else {
          interimTranscript += transcriptText;
        }
      }
      console.log('語音識別結果:', interimTranscript);
    });

    newRecognition.addEventListener('end', () => {
      if (isListening) {
        newRecognition.start();
      } else {
        console.log('語音識別已停止');
      }
    });

    // 處理識別錯誤
    newRecognition.addEventListener('error', (event) => {
      console.error('語音識別錯誤:', event.error);
      setIsListening(false);
      if (event.error === 'network') {
        alert('網絡錯誤，請檢查網絡連接');
      } else if (event.error === 'not-allowed') {
        alert('請允許語音識別權限');
      }
    });

    setRecognition(newRecognition);

    return () => {
      newRecognition.stop();
      newRecognition.removeEventListener('result', () => {});
      newRecognition.removeEventListener('end', () => {});
      newRecognition.removeEventListener('error', () => {});
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex flex-row items-center justify-center gap-4">
        <button
          type="button"
          className="rounded-md bg-gray-500 p-2 text-white"
          onClick={startListening}
          disabled={isListening}
        >
          Start Recording
        </button>
        <button
          type="button"
          className="rounded-md bg-red-500 p-2 text-white"
          onClick={stopListening}
          disabled={!isListening}
        >
          Stop Recording
        </button>
      </div>
      <p className="text-lg">Transcript: {transcript}</p>
      {isListening && <p>Recording...</p>}
    </div>
  );
}
