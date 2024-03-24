// @ts-nocheck

export default function ChatMessages({chatHistory, username}) {

    return(
        <div className="py-4 px-3">
        {
            chatHistory.map((message, index) => 
            <div key={index} className={`w-full flex ${username == message.creator ? 'justify-end' : 'justify-start'}`}>
                <div className={`h-20 w-3/4 rounded-lg flex flex-col my-2 ${username == message.creator ? 'bg-zinc-500/80' : 'bg-zinc-700/80'}`}>
                    <a className="text-xl text-white pl-2">{message.creator}</a>
                    <a className="text-base text-white pl-2">{message.text}</a>
                </div>
            </div>
        )}
        </div>
    )
}    