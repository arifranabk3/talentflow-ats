'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MOCK_CANDIDATES } from '@/data/mockData';
import {
  MessageSquare,
  Search,
  Send,
  User,
  Paperclip,
  CheckCheck,
  Clock,
  Sparkles,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'recruiter' | 'candidate';
  text: string;
  timestamp: string;
}

export const RecruiterMessagesPage: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES[0]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'candidate',
      text: "Hello! Thank you for reviewing my application for the Lead Frontend Architect position.",
      timestamp: '10:14 AM'
    },
    {
      id: 'm2',
      sender: 'recruiter',
      text: "Hi Elena! Your profile and architecture portfolio are stellar. We'd love to schedule a 45-minute technical discussion this week.",
      timestamp: '10:18 AM'
    },
    {
      id: 'm3',
      sender: 'candidate',
      text: "That sounds great! I am free this Thursday after 2:00 PM EST or Friday morning.",
      timestamp: '10:22 AM'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: 'recruiter',
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  return (
    <DashboardShell role="recruiter">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-orange text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Candidate Communications
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Messages & Inquiries
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time chat, automated candidate email threads, and interview confirmations.
          </p>
        </div>

        {/* Messaging Box */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[680px]">
          {/* Candidates Sidebar List */}
          <div className="border-r border-navy-800 flex flex-col h-full bg-navy-950/40">
            <div className="p-3 border-b border-navy-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter conversations..."
                  className="w-full bg-navy-900 border border-navy-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-navy-800/50">
              {MOCK_CANDIDATES.map((c) => {
                const isSelected = selectedCandidate.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-navy-800/80 border-l-2 border-brand-orange' : 'hover:bg-navy-900/50'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border border-navy-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-navy-950" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white text-xs truncate">{c.name}</p>
                        <span className="text-[10px] text-slate-500">10:22 AM</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.role}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-1">That sounds great! I am free...</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Chat Window */}
          <div className="md:col-span-2 flex flex-col h-full bg-navy-900/60">
            {/* Chat Topbar */}
            <div className="p-3.5 border-b border-navy-800 flex items-center justify-between bg-navy-900">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-9 h-9 rounded-full object-cover border border-navy-700"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedCandidate.name}</h3>
                  <p className="text-[11px] text-slate-400">{selectedCandidate.role} • {selectedCandidate.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300">
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.sender === 'recruiter';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl p-3.5 text-xs ${
                        isMe
                          ? 'bg-brand-orange text-white rounded-br-xs'
                          : 'bg-navy-800 text-slate-200 border border-navy-700 rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                      {m.timestamp}
                      {isMe && <CheckCheck className="w-3 h-3 text-brand-orange" />}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-navy-800 bg-navy-900 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message or press '/' for ATS template..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-navy-950 border border-navy-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
              />
              <button
                type="submit"
                className="p-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-hover shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

