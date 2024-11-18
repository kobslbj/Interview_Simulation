'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import getOpenAIResponse from '@/utils/openai';

export default function SpeechRecognitionComponent() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      setAiResponse('');
    }
  };

  const stopListening = async () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      try {
        const response = await getOpenAIResponse(transcript);
        setAiResponse(response);
      } catch (error) {
        console.error('Error getting AI response:', error);
      }
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex flex-row items-center justify-center gap-4">
        <Button
          type="button"
          className="rounded-md bg-gray-500 p-2 text-white"
          onClick={startListening}
          disabled={isListening}
        >
          開始錄音
        </Button>
        <Button
          type="button"
          className="rounded-md bg-red-500 p-2 text-white"
          onClick={stopListening}
          disabled={!isListening}
        >
          停止錄音
        </Button>
      </div>
      <p className="text-lg">Transcript: {transcript}</p>
      {isListening && <p>Recording...</p>}
      <p className="text-lg">AI Response: {aiResponse}</p>
    </div>
  );
}
