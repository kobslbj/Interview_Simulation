'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import Sidebar from '@/components/chat/Sidebar';
import ChatInput from '@/components/chat/ChatInput';

export default function Chat() {
  const [selectedRole, setSelectedRole] = useState('前端工程師');
  const [difficulty, setDifficulty] = useState('medium');
  const [key, setKey] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [selectedRole, difficulty]);
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      role: selectedRole,
      difficulty
    },
    id: `chat-${key}`,
    onResponse: async (response) => {
      const data = await response.json();
      if (data.video) {
        const blob = new Blob([data.video], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      }
    }
  });

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-TW';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const {transcript} = event.results[0][0];
        handleInputChange({ target: { value: transcript } } as any);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (!isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    } else {
      alert('您的瀏覽器不支持語音識別功能');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="flex gap-4 max-w-6xl mx-auto">
        <Sidebar
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        <div className="flex-1">
          <div className="flex flex-col w-full bg-white rounded-lg shadow-xl p-6 h-[800px]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[calc(800px-120px)]">
              {messages.map(m => (
                <ChatMessage 
                  key={m.id} 
                  message={m} 
                  selectedRole={selectedRole}
                />
              ))}
              
              {videoUrl && (
                <div className="mt-4">
                  <video 
                    controls 
                    className="w-full max-w-md mx-auto"
                    src={videoUrl}
                  >
                    <track 
                      kind="captions"
                      src="" 
                      srcLang="zh"
                      label="中文字幕"
                      default
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              startListening={startListening}
              isListening={isListening}
            />
          </div>
        </div>
      </div>
    </div>
  );
}