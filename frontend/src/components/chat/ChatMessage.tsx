interface ChatMessageProps {
  message: { id: string; role: string; content: string };
  selectedRole: string;
}

export default function ChatMessage({ message, selectedRole }: ChatMessageProps) {
  return (
    <div 
      key={message.id} 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        message.role === 'user' 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}>
        <div className="font-medium mb-1">
          {message.role === 'user' ? '面試者' : `${selectedRole}面試官`}
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
} 