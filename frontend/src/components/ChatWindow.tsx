import React, { useState, useRef, useEffect } from 'react';
import { chatWithAi } from '../api/apiClient';

interface ChatWindowProps {
  isPdfUploaded: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isPdfUploaded }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'start', role: 'ai', text: 'Hello! Please upload a PDF in the sidebar to begin asking questions.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isPdfUploaded) {
      setMessages(prev => [...prev.filter(m => m.id !== 'start'), { 
        id: Date.now().toString(), 
        role: 'ai', 
        text: 'PDF successfully processed! What would you like to know about it?' 
      }]);
    }
  }, [isPdfUploaded]);

  const handleSend = async () => {
    if (!inputValue.trim() || !isPdfUploaded || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatWithAi(userMessage.text);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: response.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: `Error: ${err.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '75%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', marginLeft: '0.25rem' }}>
              {msg.role === 'user' ? 'You' : 'AI'}
            </span>
            <div className="glass" style={{
              padding: '1rem',
              borderRadius: '12px',
              borderTopRightRadius: msg.role === 'user' ? '0px' : '12px',
              borderTopLeftRadius: msg.role === 'ai' ? '0px' : '12px',
              backgroundColor: msg.role === 'user' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.7)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)' }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
        <form 
          style={{ display: 'flex', gap: '1rem' }} 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input 
            className="input" 
            style={{ flex: 1 }} 
            placeholder={isPdfUploaded ? "Type your message..." : "Upload a PDF first..."} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isPdfUploaded || isLoading}
          />
          <button className="button" type="submit" disabled={!isPdfUploaded || !inputValue.trim() || isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
