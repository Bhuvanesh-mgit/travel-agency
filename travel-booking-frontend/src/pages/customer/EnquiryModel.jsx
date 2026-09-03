// import React, { useState, useRef, useEffect } from 'react';
// import { FaTimes, FaPaperPlane, FaHeadset, FaRobot, FaUser } from 'react-icons/fa';
// import PackageDetail from './PackageDetail';

// const EnquiryModal = ({ 
//   packageName = "General Tour Enquiry", 
//   packagesList = [PackageDetail] // Pass your actual package list array here
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { 
//       sender: 'ai', 
//       text: `Hello! I'm your TravelGo AI assistant. Are you looking to book or learn more about "${packageName}"? Ask me about our available destinations, prices, or itineraries!` 
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
  
//   const chatEndRef = useRef(null);

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const userText = inputMessage;
//     const newMessages = [...messages, { sender: 'user', text: userText }];
//     setMessages(newMessages);
//     setInputMessage('');
//     setIsTyping(true);

//     // Dynamic AI response generation based on packagesList
//     setTimeout(() => {
//       let aiResponse = "Got it! Our travel experts are reviewing your preference and will email you a custom itinerary shortly.";
//       const lower = userText.toLowerCase();

//       // Check if user is asking about a specific package from the list
//       const matchedPackage = packagesList.find(pkg => 
//         lower.includes(pkg.title.toLowerCase()) || 
//         (pkg.locationName && lower.includes(pkg.locationName.toLowerCase()))
//       );

//       if (matchedPackage) {
//         aiResponse = `Yes! "${matchedPackage.title}" is available. It's located in ${matchedPackage.locationName || 'a prime destination'} and priced at $${matchedPackage.price}. Would you like me to register an enquiry for this?`;
//       } else if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('list')) {
//         if (packagesList.length > 0) {
//           const packageSummaries = packagesList.map(p => `• ${p.title} ($${p.price})`).join('\n');
//           aiResponse = `Here are some of our current packages:\n${packageSummaries}\n\nWould you like details on any of these?`;
//         } else {
//           aiResponse = "Our tour packages feature competitive rates starting from budget-friendly options up to luxury escapes. Let me know what your budget looks like!";
//         }
//       } else if (lower.includes('date') || lower.includes('when') || lower.includes('time')) {
//         aiResponse = "We have departures available year-round with flexible scheduling. What specific month or dates are you planning to travel?";
//       } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort')) {
//         aiResponse = "All our featured packages include handpicked 4-star and 5-star resort accommodations with daily breakfast and guided tours included.";
//       }

//       setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
//       setIsTyping(false);
//     }, 1000);
//   };

//   return (
//     <>
//       {/* 1. Floating "Enquire Now" Button Fixed to the Left Side */}
//       <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
//         <button
//           type="button"
//           onClick={() => setIsOpen(true)}
//           className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-3.5 rounded-r-2xl shadow-xl hover:pl-5 transition-all duration-300 flex items-center gap-2 group border border-l-0 border-white/25"
//           style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
//         >
//           <FaHeadset className="text-sm rotate-10 group-hover:scale-110 transition-transform" />
//           <span>AI Enquire Now</span>
//         </button>
//       </div>

//       {/* Mobile Floating Button (Bottom-Left) */}
//       <div className="fixed left-4 bottom-6 z-40 sm:hidden">
//         <button
//           type="button"
//           onClick={() => setIsOpen(true)}
//           className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all"
//           aria-label="Enquire Now"
//         >
//           <FaHeadset className="text-lg" />
//         </button>
//       </div>

//       {/* 2. AI Chatbot Modal Popup */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
//           <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md h-[550px] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white flex items-center justify-between shrink-0">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg shadow-inner">
//                   <FaRobot />
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-1.5">
//                     <h3 className="text-sm font-extrabold">TravelGo AI Assistant</h3>
//                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
//                   </div>
//                   <p className="text-[11px] text-cyan-100 truncate max-w-[200px]">
//                     Online • Ready to help
//                   </p>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setIsOpen(false)}
//                 aria-label="Close modal"
//                 className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
//               >
//                 <FaTimes className="text-xs" />
//               </button>
//             </div>

//             {/* Chat Messages Body */}
//             <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
//               {messages.map((msg, index) => (
//                 <div 
//                   key={index} 
//                   className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   {msg.sender === 'ai' && (
//                     <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
//                       <FaRobot />
//                     </div>
//                   )}
//                   <div 
//                     className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-line ${
//                       msg.sender === 'user' 
//                         ? 'bg-blue-600 text-white rounded-br-none' 
//                         : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                   {msg.sender === 'user' && (
//                     <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
//                       <FaUser />
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
//                   <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
//                     <FaRobot />
//                   </div>
//                   <div className="bg-white px-3 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1">
//                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
//                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
//                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
//                   </div>
//                 </div>
//               )}
//               <div ref={chatEndRef} />
//             </div>

//             {/* Message Input Footer */}
//             <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 placeholder="Ask about packages, prices, or destinations..."
//                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition"
//               />
//               <button
//                 type="submit"
//                 aria-label="Send message"
//                 className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition-all shrink-0"
//               >
//                 <FaPaperPlane className="text-xs" />
//               </button>
//             </form>

//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EnquiryModal;