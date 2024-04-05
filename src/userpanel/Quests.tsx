// @ts-nocheck
import { supabase } from "../supabase/supabaseClient";
import { useTranslation } from 'react-i18next'

export default function WriteQuests({questList, deleteShown, onDelete, username, fetchQuests}) {

    const { t } = useTranslation();

    const deleteQuest = async (quest_id) => {
        const { } = await supabase
        .from('quest_list')
        .delete()
        .eq('id', quest_id)
        
        onDelete();
    }

    const assignQuest = async (quest_id) => {
        const { } = await supabase
        .from('quest_list')
        .update({ assigned: username })
        .eq('id', quest_id)

        fetchQuests();
    }

    function getQuestObject(quest)
    {
        switch(quest.assigned)
        {
            case "general_task": 
                return (
                <div className="box-content w-9/12 px-4 py-1 bg-zinc-500/40 rounded-lg flex flex-col overflow-auto">
                    <a className="text-2xl text-white text-clip">{quest.quest_name}</a>
                    <a className="text-base text-white truncate">{t("questcomponent.generaltask")}</a>
                </div>)
            case null:
                return (
                <div 
                    className="box-content click shadow shadowT transition duration-1000 w-9/12 px-4 py-1 bg-zinc-500/40 rounded-lg flex flex-col overflow-auto  hover:bg-zinc-400/60 hover:cursor-pointer" 
                    onClick={() => assignQuest(quest.id)}>
                    <a className="text-2xl text-white text-clip">{quest.quest_name}</a>
                    <a className="text-base text-green-500 truncate">{t("questcomponent.freetask")}</a>
                </div>)
            case username:
                return (
                <div className="box-content w-9/12 px-4 py-1 bg-zinc-500/40 rounded-lg flex flex-col overflow-auto  outline outline-3 outline-green-600">
                    <a className="text-2xl text-white text-clip">{quest.quest_name}</a>
                    <a className="text-base text-white truncate">{t("questcomponent.assignedtask")} {quest.assigned}</a>
                </div>)
            default:
                return (
                <div className="box-content w-9/12 px-4 py-1 bg-zinc-500/40 rounded-lg flex flex-col overflow-auto">
                    <a className="text-2xl text-white text-clip">{quest.quest_name}</a>
                    <a className="text-base text-white truncate">{t("questcomponent.assignedtask")} {quest.assigned}</a>
                </div>)
        }
    }

    return(
        <div className="">
        {
            questList.map((quest, index) => 
            <div key={index} className="w-full flex inline-block pb-5 items-center">
                <div className="box-content border-2 border-gray-400 h-8 w-1/12 p-4 bg-white rounded-lg mx-4 items-center justify-center flex">
                    <a className="text-2xl">{++index}.</a> 
                </div>
                {getQuestObject(quest)}
                <div className="box-content border-2 border-yellow-600 h-8 w-1/12 p-4 bg-white rounded-lg mx-4 items-center justify-center flex">
                    <a className="text-green-600 text-2xl">+{quest.points}</a>
                </div>
                <button 
                
                    onClick={() => deleteQuest(quest.id) } 
                    style={{ display: deleteShown ? "block" : "none" }} 
                    className="deletebtn click shadow shadowT bg-red-700 hover:bg-red-800 w-12 h-12 rounded-lg text-white mr-4 text-2xl hidden">X</button>
            </div>
        )}
        </div>
    )
}    