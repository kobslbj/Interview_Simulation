'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import Sidebar from '@/components/chat/Sidebar';
import ChatInput from '@/components/chat/ChatInput';

export default function Chat() {
  const [selectedRole, setSelectedRole] = useState('前端工程師');
  const [difficulty, setDifficulty] = useState('medium');
  const [key, setKey] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [selectedRole, difficulty]);

  useEffect(() => () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    }, [videoUrl]);
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      role: selectedRole,
      difficulty
    },
    id: `chat-${key}`,
    onFinish: async (message) => {
      try {
        const response = await fetch('/api/generateVideo', {
          method: 'POST',
          body: JSON.stringify({ text: message.content }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('視頻生成失敗');
        }
        
        const videoBlob = await response.blob();
        const newVideoUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(newVideoUrl);
        
        if (videoRef.current) {
          videoRef.current.load();
        }
      } catch (error) {
        console.error('Error generating video:', error);
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

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
        >
          {isOpen ? '關閉聊天室' : '開啟聊天室'}
        </button>

        {isOpen && (
          <div className="flex-1">
            <div className="flex flex-col w-full bg-white rounded-lg shadow-xl p-6 h-[800px]">
              {videoUrl && (
                <div className="mb-4">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full max-h-[300px] rounded-lg"
                    src={videoUrl}
                  >
                    <track
                      kind="captions"
                      src=""
                      label="中文字幕"
                      srcLang="zh"
                      default
                    />
                    您的瀏覽器不支持視頻播放。
                  </video>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[calc(800px-120px)]">
                {messages.map(m => (
                  <ChatMessage 
                    key={m.id} 
                    message={m} 
                    selectedRole={selectedRole}
                  />
                ))}
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
        )}
      </div>
    </div>
  );
}