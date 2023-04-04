export default function WriteQuests({questList}) {

    return(
        <div>
        {
            questList.map((quest, index) => 

            <div className="w-full flex inline-block pb-5">
                <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                    <a className="text-2xl">{++index}.</a> 
                </div>
                <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                    <div>
                        <a className="text-2xl text-white">{quest.quest_name}</a>
                    </div>
                </div>
                <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                    <div>
                        <a className="text-green-600 text-2xl">+{quest.points}</a>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}    