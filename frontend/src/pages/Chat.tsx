import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import { AlertCircle, Loader, MessageCircleHeart, Search, Send, Sparkles, UserRound } from 'lucide-react';

interface Message {
  _id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
  isCompanion: boolean;
}

interface ChatModel {
  _id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatModel | null>(null);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompanions, setShowCompanions] = useState(false);
  const [companions, setCompanions] = useState<User[]>([]);
  const socket = useRef<any>();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const currentChatRef = useRef<ChatModel | null>(null);

  useEffect(() => {
    initializeChat();
    return () => socket.current?.disconnect();
  }, []);

  useEffect(() => {
    currentChatRef.current = currentChat;
    if (currentChat?._id && socket.current) socket.current.emit('join', currentChat._id);
  }, [currentChat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      await fetchCurrentUser();
      await fetchChats();
      initializeSocket();
    } catch (err) {
      setError('Failed to initialize chat. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSocket = () => {
    socket.current = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    socket.current.on('newChat', (chat: ChatModel) => {
      setChats((prevChats) => {
        const exists = prevChats.some((existingChat) => existingChat._id === chat._id);
        if (!exists) return [...prevChats, chat];
        return prevChats.map((existingChat) => (existingChat._id === chat._id ? chat : existingChat));
      });
    });

    socket.current.on('newMessage', ({ chatId, message }: { chatId: string; message: Message }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, messages: [...chat.messages, message], lastMessage: message } : chat
        )
      );

      if (currentChatRef.current?._id === chatId) {
        setCurrentChat((prev) => ({
          ...prev!,
          messages: [...prev!.messages, message],
          lastMessage: message
        }));
      }
    });
  };

  const fetchCurrentUser = async () => {
    const response = await axios.get('http://localhost:5000/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setCurrentUser(response.data.user);
  };

  const fetchChats = async () => {
    const response = await axios.get<ChatModel[]>('http://localhost:5000/chat/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setChats(response.data);
  };

  const fetchCompanions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/companions');
      setCompanions(response.data);
    } catch (error) {
      setError('Failed to fetch companions.');
    }
  };

  const startCompanionChat = async (companionId: string) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/chat/create',
        { participantId: companionId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setCurrentChat(response.data);
      setChats((prevChats) => (prevChats.some((chat) => chat._id === response.data._id) ? prevChats : [...prevChats, response.data]));
      setShowCompanions(false);
    } catch (error) {
      setError('Failed to start chat with companion.');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat || !currentUser) return;

    try {
      await axios.post(
        'http://localhost:5000/chat/send',
        { chatId: currentChat._id, content: message },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again.');
    }
  };

  const getOtherParticipant = (chat: ChatModel) => chat.participants.find((p) => p._id !== currentUser?._id);

  if (isLoading) {
    return (
      <main className="ss-page flex items-center justify-center">
        <div className="ss-panel flex items-center gap-3 rounded-3xl p-8 font-bold text-[#1f5f53]">
          <Loader className="animate-spin" />
          Preparing your chats...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ss-page flex items-center justify-center">
        <div className="ss-panel flex items-center gap-3 rounded-3xl p-8 font-bold text-red-700">
          <AlertCircle />
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="ss-page">
      <div className="ss-container grid min-h-[720px] overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 shadow-2xl backdrop-blur lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-[#dfe9e4] bg-[#f7f3ec]/80 lg:border-b-0 lg:border-r">
          <div className="p-5">
            <span className="ss-badge">
              <MessageCircleHeart size={14} />
              Private support
            </span>
            <h1 className="mt-4 text-3xl font-black text-[#17332e]">Chats</h1>
            <p className="mt-2 text-sm leading-6 text-[#66746f]">Find companions and keep one-to-one support conversations close.</p>

            {currentUser && !currentUser.isCompanion && (
              <button
                onClick={() => {
                  setShowCompanions(true);
                  fetchCompanions();
                }}
                className="ss-button-primary mt-5 w-full"
              >
                <Search size={18} />
                Find companions
              </button>
            )}
          </div>

          <div className="max-h-[520px] overflow-y-auto px-3 pb-4">
            {showCompanions ? (
              <div className="space-y-2">
                <button onClick={() => setShowCompanions(false)} className="mb-2 px-3 text-sm font-bold text-[#1f5f53]">
                  Back to chats
                </button>
                {companions.map((companion) => (
                  <button
                    key={companion._id}
                    onClick={() => startCompanionChat(companion._id)}
                    className="w-full rounded-3xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff1eb] text-[#1f5f53]">
                        <UserRound size={20} />
                      </span>
                      <div>
                        <p className="font-black text-[#17332e]">{companion.username}</p>
                        <p className="text-sm text-[#66746f]">Companion listener</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => {
                  const other = getOtherParticipant(chat);
                  return (
                    <button
                      key={chat._id}
                      onClick={() => setCurrentChat(chat)}
                      className={`w-full rounded-3xl p-4 text-left transition ${
                        currentChat?._id === chat._id ? 'bg-[#17332e] text-white shadow-lg' : 'bg-white text-[#17332e] shadow-sm hover:bg-[#eef5f1]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black">{other?.username || 'SoulSpeak member'}</p>
                        {chat.lastMessage && <span className="text-xs opacity-70">{format(new Date(chat.lastMessage.timestamp || Date.now()), 'HH:mm')}</span>}
                      </div>
                      <p className="mt-1 truncate text-sm opacity-70">{chat.lastMessage?.content || 'No messages yet'}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col bg-white/70">
          {currentChat ? (
            <>
              <header className="border-b border-[#dfe9e4] p-5">
                <p className="text-sm font-black uppercase text-[#1f5f53]">Active conversation</p>
                <h2 className="mt-1 text-2xl font-black text-[#17332e]">{getOtherParticipant(currentChat)?.username}</h2>
                <p className="mt-1 text-xs font-semibold text-[#7a8782]">Chat ID: {currentChat._id}</p>
              </header>

              <div className="flex-1 overflow-y-auto p-5">
                {currentChat.messages.map((msg) => {
                  const mine = msg.sender === currentUser?._id;
                  return (
                    <div key={msg._id} className={`my-3 flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[78%] rounded-[1.4rem] px-4 py-3 shadow-sm ${mine ? 'bg-[#1f5f53] text-white' : 'bg-[#f0f4f1] text-[#243533]'}`}>
                        <p className="leading-6">{msg.content}</p>
                        <p className={`mt-2 text-xs font-semibold ${mine ? 'text-white/65' : 'text-[#7a8782]'}`}>
                          {format(new Date(msg.timestamp || Date.now()), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              <form onSubmit={sendMessage} className="border-t border-[#dfe9e4] p-5">
                <div className="flex gap-3">
                  <input value={message} onChange={(e) => setMessage(e.target.value)} className="ss-input" placeholder="Type a supportive message..." />
                  <button type="submit" disabled={!message.trim()} className="ss-button-primary px-4">
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <Sparkles className="mx-auto text-[#1f5f53]" size={42} />
                <h2 className="mt-5 text-3xl font-black text-[#17332e]">Choose a chat to begin</h2>
                <p className="mx-auto mt-3 max-w-md leading-7 text-[#66746f]">
                  Your companion conversations will appear here. Start with Find companions if you are looking for someone new.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Chat;
