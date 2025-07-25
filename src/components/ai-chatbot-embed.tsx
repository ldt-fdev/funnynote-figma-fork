// 'use client';
// import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// import Image from 'next/image';
// import { LuSend } from 'react-icons/lu';
// import { MdOutlineKeyboardVoice } from 'react-icons/md';
// import Message from '../message';
// import { toast } from 'sonner';
// import { RiVoiceprintFill } from 'react-icons/ri';
// import React from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import chatAIapi from '@/lib/api/chatAI';

// interface ChatMessage {
//   sender: 'ai' | 'user';
//   content: string;
// }

// interface ChatAIProps {
//   urlVideo: string;
// }

// export default function ChatAI({ urlVideo }: ChatAIProps) {
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     { sender: 'ai', content: 'Bạn cần hổ trợ gì về bài học thì đừng ngần ngại đặt câu hỏi nhé!' },
//   ]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [input, setInput] = useState('');
//   const [animate, setAnimate] = useState(false);
//   const messageEndRef = useRef<HTMLDivElement>(null);
//   const [captionVideo, setCaptionVideo] = useState<string>('');

//   const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//   };

//   const handleVoiceInput = () => {
//     if (!browserSupportsSpeechRecognition) {
//       toast.error('Ghi âm không được hỗ trợ trên trình duyệt này.');
//       return;
//     }

//     if (listening) {
//       SpeechRecognition.stopListening();
//       if (transcript) {
//         handleSend();
//       }
//     } else {
//       resetTranscript();
//       SpeechRecognition.startListening({ language: 'vi-VN', continuous: false });
//     }
//   };

//   useEffect(() => {
//     const fetchCaptions = async () => {
//       if (!urlVideo) {
//         return;
//       }

//       try {
//         const response = await chatAIapi.getVideoCaptions(urlVideo);
//         setCaptionVideo(response.data.result.caption);
//       } catch (err) {
//         toast.error('Lỗi khi fetch captions:' + err);
//       }
//     };

//     fetchCaptions();
//   }, [urlVideo]);

//   const handleSend = async () => {
//     const question = input.trim();
//     const content = captionVideo?.trim();

//     if (!question || !content) {
//       toast.error('Bạn cần nhập câu hỏi và đảm bảo phụ đề đã được tải.');
//       return;
//     }

//     const userMessage: ChatMessage = { sender: 'user', content: question };
//     const typingMessage: ChatMessage = { sender: 'ai', content: 'Đang trả lời...' };

//     const updatedMessages = [...messages, userMessage, typingMessage];
//     setMessages(updatedMessages);
//     setInput('');
//     resetTranscript();
//     setIsTyping(true);

//     try {
//       const response = await chatAIapi.postVideoAsk({ question, content });
//       const messagesWithoutTyping = updatedMessages.slice(0, -1);
//       const botMessage: ChatMessage = {
//         sender: 'ai',
//         content: response.data.result || 'Không có phản hồi từ máy chủ.',
//       };
//       setMessages([...messagesWithoutTyping, botMessage]);
//     } catch (error) {
//       toast.error('Đã xảy ra lỗi khi gửi yêu cầu đến máy chủ: ' + error);

//       const messagesWithoutTyping = updatedMessages.slice(0, -1);
//       const errorMessage: ChatMessage = {
//         sender: 'ai',
//         content: 'Xin lỗi, đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng thử lại sau.',
//       };
//       setMessages([...messagesWithoutTyping, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   useLayoutEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   useEffect(() => {
//     if (transcript) {
//       setInput(transcript);
//     }
//   }, [transcript]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAnimate(true);
//       setTimeout(() => setAnimate(false), 1000); // remove class after animation ends
//     }, Math.random() * 5000 + 4000); // mỗi 4–9 giây nhảy

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex flex-col w-full px-3 py-2 mx-auto bg-gray-100 rounded-2xl">
//       <div className="flex flex-row items-center justify-center pb-2 mb-2 border-b gap-x-4 border-b-gray-500">
//         <Image
//           src="/common_image/chatBot.jpg"
//           alt="chatbot"
//           width={300}
//           height={300}
//           className={`${animate ? 'animate-bounceWiggle' : ''} transition-all duration-500`}
//         />
//       </div>

//       <div className="flex flex-col gap-4 h-[calc(100vh*6/11)] overflow-y-auto mb-3 pb-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border-b-1 border-b-gray-500 w-full">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${msg.sender === 'ai' ? 'justify-start items-start' : 'justify-end items-end'} w-full`}
//           >
//             <span className="max-w-[70%]">
//               <Message message={msg.content} type={msg.sender === 'ai' ? 'CHATBOT' : 'USER'} />
//             </span>
//           </div>
//         ))}
//         {isTyping && (
//           <div className="flex flex-row items-end gap-x-3">
//             <TypingIndicator />
//           </div>
//         )}
//         <div ref={messageEndRef} />
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSend();
//         }}
//         className="flex items-center justify-between w-full transition-all duration-500 ease-in-out bg-white border rounded-full shadow-sm group h-11 border-light_blue-50 md:mt-2 focus-within:border-blue-primary focus-within:bg-white"
//       >
//         <input
//           type="text"
//           placeholder="Nhập tin nhắn..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="flex-1 w-full ml-5 mr-2 text-sm font-normal text-gray-600 transition-all duration-500 ease-in-out bg-transparent bg-white outline-none placeholder:text-gray-400 group-focus-within:bg-white"
//         />

//         <button
//           type="submit"
//           aria-label="Gửi tin nhắn"
//           className="flex items-center justify-center mr-1 text-blue-primary border-1.5 transition-colors duration-300 ease-in-out rounded-full bg-light_blue-700 hover:bg-blue-active hover:text-white w-9 h-9 shadow-md"
//         >
//           <LuSend className="w-4 h-4" />
//         </button>
//         <button
//           type="button"
//           aria-label="voice input"
//           onClick={handleVoiceInput}
//           className={`flex items-center text-blue-primary border-1.5 hover:bg-utilsPrimaryDark hover:text-white justify-center mr-1 transition-colors duration-300 ease-in-out rounded-full shadow-md w-9 h-9 bg-light_blue-700`}
//         >
//           {!listening ? (
//             <RiVoiceprintFill className="w-5 h-5" />
//           ) : (
//             <MdOutlineKeyboardVoice className="w-5 h-5 text-red-primary" />
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }

// const TypingIndicator = () => {
//   return (
//     <div className="bg-white border border-gray-400 text-black font-paragraph px-4 py-3 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl shadow-md max-w-[332px]">
//       <div className="flex items-center space-x-1">
//         <span className="w-1 h-1 bg-darkContainerPrimary rounded-full animate-bounce [animation-delay:0ms]" />
//         <span className="w-1 h-1 bg-gray-40 rounded-full animate-bounce [animation-delay:200ms]" />
//         <span className="w-1 h-1 bg-gray-20 rounded-full animate-bounce [animation-delay:400ms]" />
//       </div>
//     </div>
//   );
// };
