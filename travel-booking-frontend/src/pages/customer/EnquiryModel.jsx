import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaHeadset, FaRobot, FaUser, FaMagic, FaMapMarkedAlt } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://travel-agency-kmy6.onrender.com';
const API_BASE_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

// Keyframes & custom Gemini-style animations
const GlobalStyle = () => (
  <style>{`
    @keyframes gemini-fadeScale {
      from { opacity: 0; transform: scale(0.94) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes gemini-msgIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes gemini-shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes gemini-caret {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes gemini-pulseDot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    .gemini-modal-in { animation: gemini-fadeScale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .gemini-msg-in { opacity: 0; animation: gemini-msgIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .gemini-gradient-text {
      background: linear-gradient(135deg, #1a73e8 0%, #9333ea 50%, #db2777 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .gemini-gradient-bg {
      background: linear-gradient(135deg, #1a73e8 0%, #9333ea 50%, #db2777 100%);
    }
    .gemini-caret {
      display: inline-block;
      width: 2px;
      margin-left: 2px;
      background: #9333ea;
      animation: gemini-caret 0.8s step-start infinite;
    }
    .dot-1 { animation: gemini-pulseDot 1.4s infinite ease-in-out both; }
    .dot-2 { animation: gemini-pulseDot 1.4s infinite ease-in-out both 0.2s; }
    .dot-3 { animation: gemini-pulseDot 1.4s infinite ease-in-out both 0.4s; }
  `}</style>
);

const TypewriterText = ({ text, animate, speed = 10 }) => {
  const [shown, setShown] = useState(animate ? '' : text);
  const [done, setDone] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, animate, speed]);

  return (
    <span className="whitespace-pre-line">
      {shown}
      {!done && <span className="gemini-caret">&nbsp;</span>}
    </span>
  );
};

const EnquiryModal = ({
  packageName = "General Tour Enquiry",
  packageId = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your TravelGo AI assistant. Are you looking to book or learn more about "${packageName}"? Ask me about our available destinations, prices, or itineraries!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [packagesList, setPackagesList] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchPackagesForAI = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/packages`);
        const data = await res.json();
        if (res.ok && data.success) {
          setPackagesList(data.data || data.packages || []);
        }
      } catch (err) {
        console.error('Failed to fetch packages for AI context:', err);
      }
    };
    fetchPackagesForAI();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || isTyping) return;

    const userText = queryText.trim();
    const updatedMessages = [...messages, { sender: 'user', text: userText }];

    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          packageTitle: packageName,
          packageId: packageId,
          allPackages: packagesList.map(p => ({
            title: p.title,
            price: p.salePrice || p.price,
            location: p.locationName || '',
            destination: typeof p.destination === 'object' ? (p.destination?.name || p.destination?.title || '') : String(p.destination || ''),
            duration: p.duration,
            itinerary: Array.isArray(p.itinerary) ? p.itinerary.map(i => `Day ${i.day || ''}: ${i.title}`).join('; ') : ''
          }))
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages([...updatedMessages, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages([
          ...updatedMessages,
          { sender: 'ai', text: 'I received your question, but I am having trouble connecting right now. Please feel free to reach out via our contact page!' }
        ]);
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages([
        ...updatedMessages,
        { sender: 'ai', text: 'Network connection error. Please check your internet connection and try again.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendQuery(inputMessage);
  };

  const quickPrompts = [
    "What is the price?",
    "Show itinerary details",
    "Available dates",
    "Top recommendations"
  ];

  const lastAiIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].sender === 'ai') return i;
    }
    return -1;
  })();

  return (
    <>
      <GlobalStyle />

      {/* 1. Floating Trigger Button (Desktop Left) */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-white text-stone-800 font-bold text-[11px] uppercase tracking-wider py-4 px-3.5 rounded-r-2xl shadow-xl hover:pl-6 transition-all duration-300 flex items-center gap-2.5 group border border-l-0 border-stone-200 cursor-pointer"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <div className="p-1 rounded-full gemini-gradient-bg text-white shadow-xs">
            <FaMagic className="text-xs rotate-90 group-hover:scale-110 transition-transform" />
          </div>
          <span className="gemini-gradient-text font-black">Travel & Go AI </span>
        </button>
      </div>

      {/* Mobile Floating Button */}
      <div className="fixed left-4 bottom-6 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="gemini-gradient-bg text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          aria-label="Enquire Now"
        >
          <FaMagic className="text-lg" />
        </button>
      </div>

      {/* 2. Gemini AI Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="gemini-modal-in bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-md h-[620px] overflow-hidden flex flex-col relative font-sans">

            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-stone-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center shadow-2xs">
                  <FaMagic className="gemini-gradient-text text-base" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-stone-900 tracking-tight">Travel & Go ASSISTANT</h3>
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[9px] font-bold uppercase tracking-wider border border-purple-100">Live</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 truncate max-w-[210px] font-medium flex items-center gap-1 mt-0.5">
                    <FaMapMarkedAlt className="text-[10px] text-stone-400" /> {packageName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors text-stone-600 cursor-pointer"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4.5 overflow-y-auto space-y-4 bg-[#f8f9fa]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`gemini-msg-in flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full gemini-gradient-bg text-white flex items-center justify-center text-[11px] shrink-0 shadow-xs mt-0.5">
                      <FaMagic />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-normal ${
                      msg.sender === 'user'
                        ? 'bg-[#1f1f1f] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-stone-800 border border-stone-200/70 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <TypewriterText text={msg.text} animate={index === lastAiIndex && !isTyping} />
                    ) : (
                      <span className="whitespace-pre-line">{msg.text}</span>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                      <FaUser />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="gemini-msg-in flex items-center gap-2 text-stone-400 text-xs p-2">
                  <div className="w-7 h-7 rounded-full gemini-gradient-bg text-white flex items-center justify-center text-[11px] shrink-0 shadow-xs">
                    <FaMagic />
                  </div>
                  <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-stone-200/70 shadow-2xs flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full gemini-gradient-bg dot-1"></div>
                    <div className="w-2 h-2 rounded-full gemini-gradient-bg dot-2"></div>
                    <div className="w-2 h-2 rounded-full gemini-gradient-bg dot-3"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <FaMagic className="gemini-gradient-text text-[10px]" /> Suggestions:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendQuery(prompt)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 hover:border-purple-300 hover:bg-purple-50/50 text-[11px] font-medium text-stone-700 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-100 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Gemini anything about this trip..."
                className="flex-1 bg-stone-100/80 border border-stone-200/80 rounded-full px-4 py-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/15 transition"
              />
              <button
                type="submit"
                disabled={isTyping || !inputMessage.trim()}
                aria-label="Send message"
                className="w-11 h-11 rounded-full gemini-gradient-bg hover:opacity-95 text-white flex items-center justify-center shadow-md shadow-purple-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-40"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default EnquiryModal;