'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Loader2,
  User,
  Bot,
  Trash2,
  Zap,
  Stars,
  Brain,
  MessageSquare,
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  {
    icon: Brain,
    text: 'How do I create a post?',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: MessageSquare,
    text: 'How to upload documents?',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Stars,
    text: 'How to give recognition?',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    text: 'How to create an event?',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export default function AIAssistantPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '👋 **Welcome to AI Customer Support**\n\nI\'m your intelligent assistant for the 2coms platform. Ask me anything about:\n\n• Creating posts, announcements, and content\n• Managing documents and files\n• Using the knowledge hub and wiki\n• Team directory and recognition\n• Events, calendar, and meetings\n• Admin tools and settings\n\nJust type your question naturally, and I\'ll help you!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare conversation history — exclude the message we just added (it's the current question)
      // and exclude the very first welcome message to keep history clean
      const conversationHistory = messages
        .filter((msg) => msg.id !== '1') // exclude static welcome
        .slice(-6) // last 6 messages (3 pairs)
        .map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

      const response = await apiClient.post('/ai/chat', {
        message: messageText,
        conversationHistory,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          response.data?.data?.response ||
          response.data?.response ||
          'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error?.response?.data?.message ||
          'Sorry, I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          'Chat cleared! 🎉 How can I help you today? Feel free to ask about any feature, process, or issue.',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="relative mx-auto flex h-full max-w-5xl flex-col overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-tl from-cyan-500/10 via-blue-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-border/40 bg-background/80 relative border-b p-6 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-60 blur-xl" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 shadow-2xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </motion.div>
            <div>
              <motion.h1
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-2xl font-black text-transparent"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% auto' }}
              >
                AI Customer Support
              </motion.h1>
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block h-2 w-2 rounded-full bg-green-500"
                />
                Full Application Knowledge & NLP
              </p>
            </div>
          </div>
          <Tooltip content="Clear conversation" side="bottom">
            <Button variant="ghost" size="sm" onClick={clearChat} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </Tooltip>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="relative flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 grid grid-cols-2 gap-3"
          >
            {QUICK_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(prompt.text)}
                className={`border-border/50 relative rounded-2xl border bg-gradient-to-br p-4 ${prompt.gradient} group overflow-hidden bg-opacity-10 text-left transition-all hover:bg-opacity-20`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <prompt.icon className="mb-2 h-5 w-5 opacity-80" />
                <p className="text-sm font-medium">{prompt.text}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {message.role === 'assistant' ? (
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-md"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 shadow-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <Avatar className="ring-primary/20 h-10 w-10 ring-2">
                    <AvatarImage src={user?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-xs font-bold text-white">
                      {user ? getInitials(user.displayName) : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>

              {/* Message */}
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`inline-block max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                      : 'bg-card border-border/50 border backdrop-blur-xl'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`mt-2 text-xs ${
                      message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="bg-card border-border/50 rounded-2xl border px-5 py-4 backdrop-blur-xl">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-border/40 bg-background/80 relative border-t p-4 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-3xl gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything..."
              className="border-border/50 bg-card/50 w-full rounded-2xl border px-5 py-4 text-sm backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isTyping}
            />
          </div>
          <Tooltip content="Send message (Enter)" side="top">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 px-6 transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                {isTyping ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          AI responses may not always be accurate. Please verify important information.
        </p>
      </motion.div>
    </div>
  );
}
