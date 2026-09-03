import React, { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaSearch, FaRobot, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const faqsData = [
  {
    category: "Bookings & Payments",
    questions: [
      {
        q: "How do I know if my tour booking is confirmed?",
        a: "Once your secure payment is processed through Razorpay, an instant confirmation notification is generated, and your booking status updates inside your 'My Bookings' dashboard."
      },
      {
        q: "What payment methods are supported?",
        a: "We support all major credit cards, debit cards, UPI, net banking, and popular digital wallets securely via Razorpay."
      }
    ]
  },
  {
    category: "Account & Access",
    questions: [
      {
        q: "Why is the Contact page restricted to signed-in users?",
        a: "To protect our platform against automated spam and ensure our support team can efficiently link your enquiries to your verified customer profile and active bookings."
      },
      {
        q: "How do I reset my password?",
        a: "Navigate to the Login page, click on 'Forgot Password', enter your registered email address, and follow the reset instructions sent to your inbox."
      }
    ]
  },
  {
    category: "AI Travel Assistant",
    questions: [
      {
        q: "What can the AI Chatbot do on the package pages?",
        a: "Our context-aware AI assistant can answer real-time questions about specific tour itineraries, pricing, inclusions, and best times to visit based on live package data."
      }
    ]
  }
];

const Help_faq = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 relative overflow-hidden">
      
      {/* Ambient Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-10 w-[350px] h-[350px] bg-blue-200/30 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono uppercase tracking-widest mb-4 shadow-sm">
          <FaRobot className="text-sm text-cyan-600 animate-pulse" /> AI Knowledge Base & Help Center
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-3 max-w-xl mx-auto">
          Find instant answers regarding bookings, payments, account security, and our AI travel features.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full bg-white border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 shadow-lg shadow-slate-200/50 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* FAQs Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {faqsData.map((group, catIdx) => {
          // Filter questions if search query is active
          const filteredQuestions = group.questions.filter(
            item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredQuestions.length === 0) return null;

          return (
            <div key={catIdx} className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 px-2 font-mono">
                {group.category}
              </h2>

              <div className="space-y-3">
                {filteredQuestions.map((item, qIdx) => {
                  const isOpen = openIndex === `${catIdx}-${qIdx}`;
                  return (
                    <div
                      key={qIdx}
                      className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:border-cyan-300"
                    >
                      <button
                        onClick={() => toggleAccordion(catIdx, qIdx)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2.5">
                          <FaQuestionCircle className="text-cyan-500 text-sm shrink-0" /> {item.q}
                        </span>
                        <FaChevronDown className={`text-xs text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Support Help Box */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-500/20 relative overflow-hidden mt-12">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-2 text-center sm:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 text-cyan-200 text-[10px] font-mono uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span> 24/7 Assistance
            </div>
            <h3 className="text-lg font-extrabold tracking-tight text-white">Still have questions or need custom help?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md">Reach out directly to our support crew through our secure contact portal.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2.5 relative z-10"
          >
            <FaPhoneAlt /> Contact Support <FaChevronRight className="text-[10px]" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Help_faq;