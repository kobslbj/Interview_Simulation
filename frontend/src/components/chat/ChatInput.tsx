interface ChatInputProps {
  handleSubmit: (e: React.FormEvent) => void;
  startListening: () => void;
  isListening: boolean;
}

export default function ChatInput({
  handleSubmit,
  startListening,
  isListening
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute right-3 bottom-3 flex gap-2">
        <button
          type="button"
          onClick={startListening}
          aria-label="語音輸入"
          className={`
            p-2.5 rounded-lg flex items-center gap-2 transition-all duration-200
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
          `}
        >
          <span className="text-sm font-medium">
            {isListening ? '錄音中...' : '開始回答'}
          </span>
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
        >
          <p>回答完成</p>
        </button>
      </div>
    </form>
  );
}