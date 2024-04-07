// @ts-nocheck
import { useRef, useLayoutEffect, useEffect, useState } from 'react';

export default function ChatMessages({ chatHistory, username, openDeleteMessageTab, isAdmin, setIsOnBottom }) {

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = chatContainer;
      setIsOnBottom(scrollHeight - scrollTop <= clientHeight + 10);
    };
    chatContainer.addEventListener('scroll', handleScroll);
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  useLayoutEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);


  return (
    <div ref={chatContainerRef} className="px-3 flex flex-col overflow-y-auto h-5/6">
      {chatHistory.map((message, index) => {
        const creationTime = new Date(message.created_at);
        const formattedCreationTime = `${creationTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${creationTime.toLocaleDateString()}`;

        return (
          <div key={index} className={`shadowT w-full flex ${username == message.creator ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-3/4 p-1 rounded-lg flex flex-col my-2 ${username == message.creator ? 'bg-zinc-500/80' : 'bg-zinc-700/80'}`}>
              <div className='flex flex-row items-center'>
                <a className="text-xl text-white pl-2">{message.creator}</a>
                {isAdmin ? <img onClick={() => openDeleteMessageTab(message.id, message.text)} src='assets/bin.png' className='h-4 w-4 ml-4 cursor-pointer'></img> : null}
              </div>
              <a className="text-base text-white pl-2">{message.text}</a>
              <a className="text-sm text-cyan-600 pl-2">{formattedCreationTime}</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
