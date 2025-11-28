// src/pages/Chats.jsx
import React, { useEffect, useState } from "react";
import ChannelList from "../components/chats/ChannelList";
import ChatWindow from "../components/chats/ChatWindow";
import PresenceBar from "../components/chats/PresenceBar";
import { useParams } from "react-router-dom";
import { chatService } from "../services/chat.service";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Chats() {
  const { id } = useParams();
  const [active, setActive] = useState(id || "general");
  const { user } = useAuth() || {};

  useEffect(() => {
    if (user) chatService.setPresence(user.name);
  }, [user]);

  return (
    <div className=" w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-24 pb-12 ">
      <div className="max-w-7xl mx-auto px-15 grid grid-cols-1 md:grid-cols-4 gap-8 animate-fadeIn">
        
        {/* LEFT SIDEBAR */}
        <div className="md:col-span-1 space-y-7 ">
          {/* Channel List */}
          <div className="
            bg-white/70 backdrop-blur-xl 
            rounded-2xl p-1 shadow-lg border border-white/60 
            hover:shadow-2xl transition-all duration-300
          ">
            <h2 className="text-lg font-bold text-slate-700 mb-3 mt-5 flex justify-center">Channels</h2>
            <ChannelList 
              activeChannel={active} 
              onSelect={(id)=>setActive(id)} 
            />
          </div>

          {/* Presence */}
          <div className="
            bg-white/70 backdrop-blur-xl 
            rounded-2xl p-4 shadow-lg border border-white/60 
            hover:shadow-xl transition-all duration-300
          ">
            <PresenceBar />
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="md:col-span-3">
          <div
            className="
              bg-white/80 backdrop-blur-xl 
              rounded-3xl shadow-xl p-6 border border-white/50 
              hover:shadow-2xl transition-all duration-300
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
                  #{active}
                </h3>
                <p className="text-slate-500 text-sm">Chat Channel</p>
              </div>

              <div className="
                px-3 py-1 rounded-lg 
                bg-gradient-to-r from-indigo-500 to-purple-500 
                text-white text-xs font-semibold shadow
              ">
                {user?.name || "Guest"}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300/40 to-transparent mb-4"></div>

            {/* CHAT WINDOW */}
            <div className="animate-slideUp">
              <ChatWindow channelId={active} />
            </div>
          </div>
        </div>

      </div>

      {/* ANIMATIONS */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease forwards; }
        `}
      </style>
    </div>
  );
}
