import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { MeetUpSelector } from '../components/MeetUpSelector';
import {
  MessageSquare,
  Send,
  MapPin,
  Clock,
  User,
  Tag,
  CheckCheck,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Chat = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMeetUpPicker, setShowMeetUpPicker] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const initialChatId = searchParams.get('chatId');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await axiosInstance.get('/chats');
      setChats(data || []);

      if (initialChatId) {
        const found = data.find((c) => c._id === initialChatId);
        if (found) setSelectedChat(found);
      } else if (data.length > 0) {
        setSelectedChat(data[0]);
      }
    } catch (err) {
      toast.error('Could not load chat conversations.');
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      const interval = setInterval(() => fetchMessages(selectedChat._id, true), 4000); // 4s polling
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const fetchMessages = async (chatId, isSilent = false) => {
    if (!isSilent) setLoadingMessages(true);
    try {
      const { data } = await axiosInstance.get(`/chats/${chatId}/messages`);
      setMessages(data || []);
      scrollToBottom();
    } catch (err) {
      if (!isSilent) toast.error('Failed to load messages.');
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e, customPayload = null) => {
    if (e) e.preventDefault();
    if (!selectedChat) return;

    const otherParticipant = selectedChat.participants.find((p) => p._id !== user._id);
    if (!otherParticipant) return;

    const contentText = customPayload ? '' : newMessage;
    if (!contentText && !customPayload?.meetUpSuggestion?.location) return;

    try {
      const payload = {
        receiverId: otherParticipant._id,
        content: contentText,
        meetUpSuggestion: customPayload?.meetUpSuggestion || null,
      };

      const { data: sentMsg } = await axiosInstance.post(`/chats/${selectedChat._id}/messages`, payload);
      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage('');
      setShowMeetUpPicker(false);
      scrollToBottom();

      // Refresh chat list to update last message preview
      fetchChats();
    } catch (err) {
      toast.error('Could not send message.');
    }
  };

  const getOtherUser = (chat) => {
    return chat.participants?.find((p) => p._id !== user._id) || { name: 'Student', hostel: 'Campus' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 h-[700px] grid grid-cols-1 md:grid-cols-12 shadow-2xl">
        {/* Left Column: Chat List */}
        <div className={`md:col-span-4 border-r border-slate-800 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" /> Messages
            </h2>
            <span className="text-xs bg-slate-900 text-cyan-400 px-2 py-0.5 rounded-full font-bold">
              {chats.length} active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {loadingChats ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded-xl animate-pulse bg-slate-900/60" />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No active conversations yet.</p>
            ) : (
              chats.map((chat) => {
                const other = getOtherUser(chat);
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <button
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      isSelected ? 'bg-cyan-950/40 border-l-4 border-cyan-400' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <img
                      src={other.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={other.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-slate-100 text-sm truncate">{other.name}</h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium truncate mb-1">
                        Hostel: {other.hostel}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {chat.lastMessage || 'Connected'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className={`md:col-span-8 flex flex-col bg-slate-950/40 ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-1 text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <img
                    src={getOtherUser(selectedChat).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/40"
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                      {getOtherUser(selectedChat).name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{getOtherUser(selectedChat).hostel}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span className="text-[10px] text-emerald-400">Active Student</span>
                    </p>
                  </div>
                </div>

                {/* Product context pill */}
                {selectedChat.product && (
                  <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-semibold truncate max-w-[150px]">
                      {selectedChat.product.title}
                    </span>
                    <span className="font-extrabold text-cyan-400">₹{selectedChat.product.price}</span>
                  </div>
                )}
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {loadingMessages ? (
                  <p className="text-xs text-slate-400 text-center py-6">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">Start the conversation!</p>
                    <p className="text-[11px] text-slate-500">Ask about item condition, negotiation, or propose a campus meetup spot.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === user._id || msg.sender === user._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md rounded-2xl p-3.5 text-xs shadow-md space-y-2 ${
                            isMe
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-medium rounded-tr-xs'
                              : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs'
                          }`}
                        >
                          {/* Meet up location suggestion card if attached */}
                          {msg.meetUpSuggestion?.location && (
                            <div className={`p-2.5 rounded-xl text-[11px] space-y-1 ${isMe ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-950 border border-cyan-500/30 text-cyan-400'}`}>
                              <div className="flex items-center gap-1 font-extrabold">
                                <MapPin className="w-3.5 h-3.5" /> Proposed Meet-up Spot: {msg.meetUpSuggestion.location}
                              </div>
                              {msg.meetUpSuggestion.time && (
                                <div className="flex items-center gap-1 opacity-80">
                                  <Clock className="w-3 h-3" /> Time: {msg.meetUpSuggestion.time}
                                </div>
                              )}
                            </div>
                          )}

                          <p className="leading-relaxed">{msg.content}</p>

                          <div className={`flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-slate-950/70' : 'text-slate-500'}`}>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* MeetUp Selector Modal inside chat */}
              {showMeetUpPicker && (
                <div className="p-3 border-t border-slate-800 bg-slate-950">
                  <MeetUpSelector
                    onSelectLocation={(locData) => {
                      handleSendMessage(null, { meetUpSuggestion: locData });
                    }}
                  />
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeetUpPicker(!showMeetUpPicker)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    showMeetUpPicker ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-cyan-400 border-slate-700/80 hover:border-cyan-500'
                  }`}
                  title="Propose Meet-up Location"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Meet-up</span>
                </button>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:opacity-90 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center p-8 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-200">Select a conversation</h3>
              <p className="text-xs text-slate-400">Choose a chat from the left panel to start messaging seller or buyer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
