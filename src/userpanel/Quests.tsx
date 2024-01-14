// @ts-nocheck

import { supabase } from "../supabase/supabaseClient";

export default function WriteQuests({questList, deleteShown, onDelete}) {

    const deleteQuest = async (quest_id) => {
        const { error } = await supabase
        .from('quest_list')
        .delete()
        .eq('id', quest_id)
        
        onDelete();
    }


    return(
        <div>
        {
            questList.map((quest, index) => 
            <div key={index} className="w-full flex inline-block pb-5 items-center">
                <div className="box-content h-8 w-1/12 p-4 bg-white rounded-lg mx-4 items-center justify-center flex">
                    <a className="text-2xl">{++index}.</a> 
                </div>
                <div className="box-content h-8 w-9/12 px-4 pb-8 bg-zinc-500/40 rounded-lg flex overflow-auto lg:place-content-center">
                        <a className="text-2xl text-white flex">{quest.quest_name}</a>
                </div>
                <div className="box-content h-8 w-1/12 p-4 bg-white rounded-lg mx-4 items-center justify-center flex">
                        <a className="text-green-600 text-2xl">+{quest.points}</a>
                </div>
                <button onClick={() => deleteQuest(quest.id) } style={{ display: deleteShown ? "block" : "none" }} className="bg-red-500 hover:bg-red-500/70 w-12 h-12 rounded-lg text-white mr-8 text-2xl hidden">X</button>
            </div>
        )}
        </div>
    )
}    