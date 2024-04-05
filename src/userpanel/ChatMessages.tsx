// @ts-nocheck
import { useEffect, useRef } from 'react';

export default function ChatMessages({chatHistory, username}) {

    const chatContainerRef = useRef(null);

    useEffect(() => {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [chatHistory]);

    return(
        <div ref={chatContainerRef} className="py-4 px-3 flex flex-col overflow-y-auto h-4/5">
        {
            chatHistory.map((message, index) => 
            <div key={index} className={`shadowT w-full flex ${username == message.creator ? 'justify-end' : 'justify-start'}`}>
                <div className={`w-3/4 p-1 rounded-lg flex flex-col my-2 ${username == message.creator ? 'bg-zinc-500/80' : 'bg-zinc-700/80'}`}>
                    <a className="text-xl text-white pl-2">{message.creator}</a>
                    <a className="text-base text-white pl-2">{message.text}</a>
                    <a className="text-sm text-cyan-600 pl-2">{message.created_at}</a>
                </div>
            </div>
        )}
        </div>
    )
}    
