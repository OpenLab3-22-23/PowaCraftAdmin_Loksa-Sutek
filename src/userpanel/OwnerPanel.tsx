// @ts-nocheck

import { useState, useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";
import { useTranslation } from 'react-i18next'
import WriteUserRank from "./UserRank";
import OwnerATList from "./OwnerATList";
import ATList from "./ATList";
import WriteQuests from "./Quests";


export default function OwnerPanel( {userData} ): JSX.Element {
    document.body.classList.remove('overflow-hidden');
    const {signOut} = useAuth()
    const { t, i18n } = useTranslation();

    const handleLogOut = () => {
        signOut();
        changeLanguage();
    };

    const [rank, setRank] = useState("");
    const [username, setUsername] = useState("");    
    const [languageIconSource, setLanguageIconSource] = useState("");
    const [userPanelBackgroundImage, setUserPanelBackgroundImage] = useState();
    const [ownerPanelBackgroundImage, setOwnerPanelBackgroundImage] = useState();
    const [logo, setLogo] = useState();
    const [panelName, setPanelName] = useState("");
    const [rankList, setRankList] = useState();   

    const [allUsersResponse, setUsersResponse] = useState();
    const [questList, setQuestList] = useState();   
    const [pointsList, setPointsList] = useState();       

    const [newTaskText, setTaskText] = useState("");    
    const [newTaskPoints, setTaskPoints] = useState("");   
    const [newMailText, setNewMailText] = useState("");    
    const [nickToDelete, setNickToDelete] = useState("");  
    const [newUserRank, setNewUserRank] = useState("");  
    const [shouldResetPoints, setShouldResetPoints] = useState(false);  
    const [generalTask, setGeneralTask] = useState(false);  

    const [addPlusTask, setAddPlusTask] = useState(1);       
    const [addMinusTask, setAddMinusTask] = useState(7);      
    const [activeUserID, setActiveUserID] = useState();           

    const [deleteShown, setDeleteShown] = useState(false);   
    const [addQuestShown, setAddQuestVisibility] = useState(false);
    const [addAccountShown, setAddAccountVisibility] = useState(false);
    const [delAccountShown, setDelAccountVisibility] = useState(false); 
    const [addPlusShown, setAddPlusShown] = useState(false);     
    const [addMinusShown, setAddMinusShown] = useState(false);     
    const [changeRankShown, setChangeRankShown] = useState(false);     
    const [panelSettingsShown, setPanelSettingsShown] = useState(false);
    
    //Panel settings variables
    const [settings_newPanelName, settings_setNewPanelName] = useState("");
    const [settings_newPanelLogo, settings_setNewPanelLogo] = useState();
    const [settings_newUserBackground, settings_setNewUserBackground] = useState();
    const [settings_newOwnerBackground, settings_setNewOwnerBackground] = useState();    
    const [settings_newAction, settings_setNewAction] = useState();
    const [settings_newActionPoints, settings_setNewActionPoints] = useState();
    const [settings_actionToRemove, settings_setActionToRemove] = useState();


    const closeQuestTab = () => {
        setAddQuestVisibility(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddQuest = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addquest.header")}</a>
                    <button onClick={() => closeQuestTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addquest.questdesc")}</a>
                <input 
                    value={newTaskText}
                    onChange={(e) => setTaskText(e.target.value)} 
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    maxlength="35"
                    placeholder={t("ownerpanel.addquest.questplaceholder")}>
                </input>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addquest.points")}</a>
                <input 
                    value={newTaskPoints}
                    onInput={(e) => e.target.value = e.target.value.slice(0, 1)}
                    onChange={(e) => setTaskPoints(e.target.value)}
                    type="number" 
                    className="border border-green-300 rounded-2xl w-1/6 h-11 text-center" 
                    placeholder="0">
                </input>

                <a className="text-white text-xl">{t("ownerpanel.addquest.generaltask")}</a>
                <a className="text-white text-sm pb-2">{t("ownerpanel.addquest.generaltasksubtext")}</a>
                <input 
                    checked={generalTask}
                    type="checkbox" 
                    className="border border-green-300 rounded-2xl h-10 w-10"
                    onChange={(e) => setGeneralTask(e.target.checked)}>
                </input>

                <button onClick={sendNewTask} className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.addquest.create")}</button>
            </div>      
        </div>
        )
    } 

    const closeAddAccountTab = () => {
        setAddAccountVisibility(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddAccount = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addaccount.header")}</a>
                    <button onClick={() => closeAddAccountTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addaccount.useremail")}</a>
                <input 
                    value={newMailText}
                    onChange={(e) => setNewMailText(e.target.value)} 
                    type="email"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    placeholder={t("ownerpanel.addaccount.mailplaceholder")}>
                </input>

                <button onClick={addNewMail} className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.addaccount.add")}</button>
            </div>      
        </div>
        )
    } 

    const closeDeleteAccountTab = () => {
        setDelAccountVisibility(false);
        document.body.classList.remove('overflow-hidden');
    }
    const DeleteAccount = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col w-full h-full bg-black/80">      
            <div className="w-4/5 lg:w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.delaccount.header")}</a>
                    <button onClick={() => closeDeleteAccountTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <div className="flex flex-col h-full justify-center items-center pb-12">
                    {allUsersResponse && rankList ? <ATList response={allUsersResponse} rankList={rankList} /> : null}
                    
                    <a className="text-white text-xl my-2 text-center">{t("ownerpanel.delaccount.nicktodelete")}</a>
                    <input 
                        value={nickToDelete}
                        onChange={(e) => setNickToDelete(e.target.value)} 
                        type="text"
                        className="border border-green-300 rounded-2xl w-4/5 text-center" 
                        maxlength="40"
                        placeholder={t("ownerpanel.delaccount.nickplaceholder")}>
                    </input>

                    <button onClick={delAccount} className="border border-white/50 border-2 bg-red-600 hover:bg-red-500 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.delaccount.delete")}</button>
                </div>
            </div>      
        </div>
        )
    } 

    const AddPlus = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addplus.header")}</a>
                    <button onClick={() => setAddPlusShown(false)} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addplus.questname")}</a>
                <select
                    value={addPlusTask}
                    onChange={(e) => setAddPlusTask(e.target.value)} 
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center truncate" >
                    {pointsList.map((point) => (
                        point.points > 0 ? (
                            <option key={point.id} value={point.id}>
                                {point.action_name} | {point.points}+
                            </option>
                        ) : null
                    ))}
                </select>

                <button onClick={savePlusPoints} className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.addplus.add")}</button>
            </div>      
        </div>
        )
    } 

    const AddMinus = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addminus.header")}</a>
                    <button onClick={() => setAddMinusShown(false)} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addminus.questname")}</a>
                <select
                    value={addMinusTask}
                    onChange={(e) => setAddMinusTask(e.target.value)} 
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center truncate">
                    {pointsList.map((point) => (
                        point.points < 0 ? (
                            <option key={point.id} value={point.id}>
                                {point.action_name} | {Math.abs(point.points)}-
                            </option>
                        ) : null
                    ))}
                </select>

                <button onClick={saveMinusPoints} className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.addminus.add")}</button>
            </div>      
        </div>
        )
    } 
    
    const ChangeRank = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.changerank.header")}</a>
                    <button onClick={() => setChangeRankShown(false)} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.changerank.newrank")}</a>
                <select
                    value={newUserRank}
                    onChange={(e) => setNewUserRank(e.target.value)} 
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center">

                    {rankList.map((rank, index) => (
                        <option key={index} value={rank.rank}>
                            {rank.rank}
                        </option>
                    ))}
                </select>

                <a className="text-white text-xl pb-2">{t("ownerpanel.changerank.resetpoints")}</a>
                <input 
                    checked={shouldResetPoints}
                    type="checkbox" 
                    className="border border-green-300 rounded-2xl h-10 w-10"
                    onChange={(e) => setShouldResetPoints(e.target.checked)}>
                </input>


                <button onClick={changeUserRank} className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.changerank.change")}</button>
            </div>      
        </div>
        )
    } 


    const closePanelSettings = props => {
        setPanelSettingsShown(false);
        document.body.classList.remove('overflow-hidden');
    }
    
    const PanelSettings = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
                <div className="w-full md:w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat border-2 overflow-auto gap-y-3"> 
                    <div className="flex flex-col items-center w-full">
                            <div className="flex w-full justify-center sticky top-0 py-2 bg-[url('/assets/popupbackground.png')] bg-repeat border-b-2 mb-7">
                                <a className="text-4xl text-white">Nastavenia panelu</a>
                            </div> 
                            <div className="absolute w-full md:w-1/2 py-2 mr-3 z-50">
                                <button onClick={() => closePanelSettings()} className="text-white hover:text-gray-300 text-4xl w-full text-end">X</button>                                
                            </div>  
                        
                        
                        <div className="flex flex-col items-center gap-y-2 w-4/6">
                            <a className="text-white text-2xl">Názov serveru</a>
                            <input 
                                value={settings_newPanelName}
                                onChange={(e) => settings_setNewPanelName(e.target.value)} 
                                type="text"
                                className="border-2 border-amber-400 rounded-2xl text-center" 
                                maxlength="30"
                                placeholder={panelName}>
                            </input> 
                            <button onClick={() => setNewPanelName()} className="border-2 border-white/50 bg-green-700 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">ULOŽIŤ</button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>


                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="text-white text-2xl">Logo panelu (png / jpg)</a>
                            <div className="rounded-full h-32 w-32 bg-center bg-contain bg-no-repeat border-4" style={{ backgroundImage: `url(${logo})` }}></div>
                            <input className="text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate mx-2" onChange={(e) => settings_setNewPanelLogo(e.target.files[0])} type="file" accept="image/png, image/jpeg, image/svg"></input>
                            <button onClick={() => setNewLogo()} className="border-2 border-white/50 bg-green-700 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">ULOŽIŤ</button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="text-white text-2xl">Pozadie používateľského panelu (png / jpg)</a>
                            <div className="w-full h-48 lg:h-72 bg-center bg-contain bg-no-repeat rounded" style={{ backgroundImage: `url(${userPanelBackgroundImage})` }}></div>                   
                            <input className="text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate mx-2" type="file" accept="image/png, image/jpeg, image/svg"></input>
                            <button onClick={null} className="border-2 border-white/50 bg-green-700 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">ULOŽIŤ</button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="text-white text-2xl">Pozadie majiteľského panelu (png / jpg)</a>
                            <div className="w-full h-48 lg:h-72 bg-center bg-contain bg-no-repeat rounded" style={{ backgroundImage: `url(${ownerPanelBackgroundImage})` }}></div>                        
                            <input className="text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate mx-2" type="file" accept="image/png, image/jpeg, image/svg"></input>
                            <button onClick={null} className="border-2 border-white/50 bg-green-700 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">ULOŽIŤ</button>   
                        </div> 
                    </div>
                        




                    <div className="w-full gap-y-2 items-center flex flex-col">
                        <div className="flex w-full justify-center sticky top-0 py-2 bg-[url('/assets/popupbackground.png')] bg-repeat border-y-2 mb-7">
                            <a className="text-4xl text-white">Nastavenia rankov</a>
                        </div>

                        <div className="h-min w-4/6 flex flex-col items-center gap-y-2">
                            <a className="text-white text-2xl">Ukážka zoznamu AT rankov</a>
                            <select
                            value={rankList[0].rank}
                            className="border-2 border-amber-400 rounded-2xl w-4/5 h-11 text-center" >
                            {rankList.map((rank) => (
                                <option key={rank.rank} value={rank.rank}>
                                    {rank.rank}
                                </option>
                            ))}
                            </select>  
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>          
                        </div> 
                                
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="text-white text-2xl">Pridanie nového ranku</a>
                            <div className="flex gap-x-2">
                                <input 
                                    value={null}
                                    onChange={null} 
                                    type="text"
                                    className="border-2 border-amber-400 rounded-2xl w-2/3 text-center" 
                                    placeholder="Rank">
                                </input>
                                <input 
                                    value={null}
                                    onChange={null} 
                                    type="text"
                                    className="border-2 border-amber-400 rounded-2xl w-1/3 text-center" 
                                    placeholder="#FF00FF">
                                </input>
                            </div>
                            <select
                                value={null}
                                onChange={null} 
                                className="border-2 border-amber-400 rounded-2xl w-4/5 h-11 text-center truncate" >
                                <option>Permission level 1 (Basic access)</option>
                                <option>Permission level 2 (Basic access with access to task deletion)</option>
                                <option>Permission level 3 (Full access to owner panel)</option>
                            </select>
                            <button className="border-2 border-white/50 border-2 bg-green-700 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">PRIDAŤ</button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="text-white text-2xl">Zmazanie ranku</a>
                            <input 
                                value={null}
                                onChange={null} 
                                type="text"
                                className="border-2 border-amber-400 rounded-2xl w-full text-center" 
                                placeholder="Rank">
                            </input>
                            <button className="border-2 border-white/50 border-2 bg-red-600 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">ZMAZAŤ</button>
                        </div>   
                    </div>    





                    <div className="w-full flex flex-col items-center">
                        <div className="flex w-full justify-center sticky top-0 py-2 bg-[url('/assets/popupbackground.png')] bg-repeat border-y-2 mb-7">
                            <a className="text-4xl text-white">Nastavenia bodovania</a>
                        </div>

                        <div className="h-min w-4/6 flex flex-col items-center gap-y-2">
                            <a className="text-white text-2xl">Ukážka zoznamu akcií</a>
                            <select
                                value={1}
                                className="border-2 border-amber-400 rounded-2xl w-4/5 h-11 text-center truncate">
                                {pointsList.map((point) => (
                                    point.points > 0 ? (
                                        <option key={point.id} value={point.id} className="text-green-700">
                                            {point.id + "."} {point.action_name} | {point.points}+
                                        </option>
                                    ) : null
                                ))}    
                                {pointsList.map((point, index) => (
                                    point.points < 0 ? (
                                        <option key={point.id} value={point.id} className="text-red-600">
                                            {index + ". "} {point.action_name} | {Math.abs(point.points)}-
                                        </option>
                                    ) : null
                                ))}
                            </select>  
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>         
                        </div>
            
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="text-white text-2xl">Pridanie novej akcie</a>
                            <div className="flex gap-2">
                                <input 
                                    value={settings_newAction}
                                    onChange={(e) => settings_setNewAction(e.target.value)} 
                                    type="text"
                                    className="border-2 border-amber-400 rounded-2xl w-2/3 text-center" 
                                    placeholder="Uloha">
                                </input>
                                <input 
                                    value={settings_newActionPoints}
                                    onChange={(e) => settings_setNewActionPoints(e.target.value)} 
                                    type="number"
                                    maxLength="2"
                                    className="border-2 border-amber-400 rounded-2xl w-1/3 text-center" 
                                    placeholder="1,2 / -1,-2..">
                                </input>
                            </div>
                            <button onClick={() => addNewAction()} className="border-white/50 border-2 bg-green-700 rounded-2xl text-white/80 px-2 h-10 w-2/5 lg:w-1/5">PRIDAŤ</button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="text-white text-2xl">Zmazanie akcie</a>
                            <input 
                                value={settings_actionToRemove}
                                onChange={(e) => settings_setActionToRemove(e.target.value)} 
                                type="number"
                                className="border-2 border-amber-400 rounded-2xl w-full text-center" 
                                placeholder="Pozícia úlohy - z ukážky úloh!! (číslo)">
                            </input>
                            <button onClick={() => removeAction()} className="border-white/50 border-2 bg-red-600 rounded-2xl text-white/80 px-2 h-10 mb-3 w-2/5 lg:w-1/5">ZMAZAŤ</button>
                        </div>
                    </div>                        
                </div>      
            </div>
        )
    } 


    //** Data fetching **/

    useEffect(() => {
        fetchOwnerPanelBackground();
        fetchUserPanelBackground();
        fetchLogo();
        fetchPanelData();
        fetchRankList();
        fetchQuestList();
        fetchPointsList();
    }, [])
    useEffect(() => {
        if (rankList != undefined)
        {
            fetchUserProfile();
            fetchAllUsers();
        }   
    }, [rankList]);

    const fetchOwnerPanelBackground = async () => {
        const { data } = await supabase.storage
            .from('backgrounds')
            .getPublicUrl('owner-bg.png');
        setOwnerPanelBackgroundImage(data.publicUrl);
    }
    const fetchUserPanelBackground = async () => {
        const { data } = await supabase.storage
            .from('backgrounds')
            .getPublicUrl('bg.png');
        setUserPanelBackgroundImage(data.publicUrl);
    }
    const fetchLogo = async () => {
        const { data } = await supabase.storage
            .from('images')
            .getPublicUrl('logo.png');
            setLogo(data.publicUrl + "?c=" + Math.random());
    }
    const fetchPanelData = async () => {
        const { data } = await supabase
            .from('paneldata')
            .select()
            setPanelName(data[0].data);
    }
    const fetchRankList = async () => {
        const { data } = await supabase
            .from('ranks')
            .select()
            .order('id', { ascending: true })
            setRankList(data);
    }

    const fetchUserProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .eq('id', userData.user.id)

            if (data) {
                setRank(data[0].rank);
                setUsername(data[0].username);
                i18n.changeLanguage(data[0].language)
                if (i18n.language == "sk")
                {
                  setLanguageIconSource("/assets/en.png")
                }
                else
                {
                  setLanguageIconSource("/assets/sk.png")
                }
            }
        }


    const fetchAllUsers = async () => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .order('plus', { ascending: false })

            if (data)
            {
                let accounts = [];
                for (let i = 0; i < rankList.length; i++)
                {
                    for (let x = 0; x < data.length; x++)
                    {
                        if (data[x].rank == rankList[i].rank)
                        {
                            accounts.push(data[x]); 
                        }
                    }
                }   
                setUsersResponse(accounts);
            }
        }
        
    const fetchQuestList = async () => {
        const { data } = await supabase
            .from('quest_list')
            .select()
            
            if (data) {
                setQuestList(data);
            }
        }       

    const fetchPointsList = async () => {
        const { data } = await supabase
            .from('points_list')
            .select()
            .order('id', { ascending: true })
            
            if (data) {
                setPointsList(data);
            }
        }      
        

    //** Other functions **/
    function RefreshQuests()
    {
        setDeleteShown(!deleteShown);
        fetchQuestList();
    }

    const getIDByUsername = (username) => {
        const user = allUsersResponse.find((user) => user.username === username);
        return user ? user.id : null;
    };

    function openAddPlusPoint(id)
    {
        setActiveUserID(id);
        setAddPlusShown(true);
    }
    function openAddMinusPoint(id)
    {
        setActiveUserID(id);
        setAddMinusShown(true);
    }
    function openChangeRank(id)
    {
        setActiveUserID(id);
        setChangeRankShown(true);
        setNewUserRank(rankList[rankList.length - 1].rank);
        setShouldResetPoints(true);
    }

    const savePlusPoints = async () => {

        let partialData;

        const { data } = await supabase
        .from('profiles')
        .select('plus, last_point1, last_point2, last_point3')
        .eq('id', activeUserID)
            
            if (data) {
                partialData = data;
            }

            const { error } = await supabase
            .from('profiles')
            .update({plus: partialData[0].plus + pointsList[addPlusTask].points, last_point1: addPlusTask, last_point2: partialData[0].last_point1, last_point3: partialData[0].last_point2})
            .eq('id', activeUserID)
            if (error) {
                console.log(error);
            }
            setAddPlusShown(false);

        fetchAllUsers();
    } 

    const saveMinusPoints = async () => {

        let partialData;

        const { data } = await supabase
        .from('profiles')
        .select('minus, last_point1, last_point2, last_point3')
        .eq('id', activeUserID)
            
            if (data) {
                partialData = data;
            }

            const { error } = await supabase
            .from('profiles')
            .update({minus: partialData[0].minus - pointsList[addMinusTask].points, last_point1: addMinusTask, last_point2: partialData[0].last_point1, last_point3: partialData[0].last_point2})
            .eq('id', activeUserID)
            if (error) {
                console.log(error);
            }
            setAddMinusShown(false);

        fetchAllUsers();
    } 

    const changeUserRank = async () => {
   
        setChangeRankShown(false);
        const { error } = await supabase
        .from('profiles')
        .update({rank: newUserRank})
        .eq('id', activeUserID)
        if (error) {
            console.log(error);
        }

        if (shouldResetPoints)
        {
            const { error } = await supabase
            .from('profiles')
            .update({plus: 0, minus : 0})
            .eq('id', activeUserID)
            if (error) {
                console.log(error);
            }
        }
        fetchAllUsers();
        setAddMinusShown(false);
    } 

    function changeLanguage()
    {
      if (i18n.language == "sk")
      {
        i18n.changeLanguage("en")
        setLanguageIconSource("/assets/sk.png")
      }
      else
      {
        i18n.changeLanguage("sk")
        setLanguageIconSource("/assets/en.png")
      }
    }
        
    


    //** Data push functions **/
        
    const sendNewTask = async () => {
        
        let taskType = null;
        if (generalTask) { taskType = "general_task"}

        const { error } = await supabase
            .from('quest_list')
            .insert({quest_name: newTaskText, points: newTaskPoints, assigned: taskType, creator: username})

            if (error) {
                console.log("ERROR");
            }
            setAddQuestVisibility(false);
            fetchQuestList();
            setTaskText("");
            setTaskPoints("");
            setGeneralTask(false);
            document.body.classList.remove('overflow-hidden');
        }

    const addNewMail = async () => {
        const { error } = await supabase
            .from('allowed_mails')
            .insert({mail: newMailText })

            if (error) {
                console.log("ERROR");
            }
            setAddAccountVisibility(false);
            document.body.classList.remove('overflow-hidden');
        }

    const delAccount = async () => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', getIDByUsername(nickToDelete))
            if (error) {
                console.log("ERROR");
            }

            setDelAccountVisibility(false);
            fetchAllUsers();
            document.body.classList.remove('overflow-hidden');
        }   

    //** Settings data push functions **/

    const setNewPanelName = async () => {
        const { } = await supabase
            .from('paneldata')
            .update({data: settings_newPanelName})
            .eq('id', 0)
            fetchPanelData();
        }

    const setNewLogo = async () => {
        const { } = await supabase.storage
        .from('images')
        .upload('logo.png', settings_newPanelLogo, {
            upsert: true
          })
        fetchLogo();
    }
    const setNewUserBackground = async () => {
        const { } = await supabase.storage
        .from('backgrounds')
        .upload('bg.png', settings_newPanelLogo, {
            upsert: true
          })
        fetchLogo();
    }
    const setNewOwnerBackground = async () => {
        const { } = await supabase.storage
        .from('backgrounds')
        .upload('owner-bg.png', settings_newPanelLogo, {
            upsert: true
          })
        fetchLogo();
    }

    const addNewAction = async () => {
        const { } = await supabase
            .from('points_list')
            .insert({action_name: settings_newAction, points: settings_newActionPoints })
            fetchPointsList();
            settings_setNewAction("");
            settings_setNewActionPoints();
        }

    const removeAction = async () => {
        const { } = await supabase
            .from('points_list')
            .delete()
            .eq('id', settings_actionToRemove)
            fetchPointsList();
            settings_setActionToRemove();
        }

    

//** HTML **/

    return (
// PC HTML
        <div className=" h-max lg:h-screen w-screen bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${ownerPanelBackgroundImage})` }}>

            {addQuestShown && <div className="z-10 w-full h-full absolute">
                <AddQuest show={addQuestShown}/>
            </div>}
            
            {addAccountShown && <div className="z-10 w-full h-full absolute">
                <AddAccount show={addAccountShown}/>
            </div>}

            {delAccountShown && <div className="z-10 w-full h-full absolute">
                <DeleteAccount show={delAccountShown}/>
            </div>}

            {addPlusShown && <div className="z-10 w-full h-full absolute">
                <AddPlus show={addPlusShown}/>
            </div>}

            {addMinusShown && <div className="z-10 w-full h-full absolute">
                <AddMinus show={addMinusShown}/>
            </div>}

            {changeRankShown && <div className="z-10 w-full h-full absolute">
                <ChangeRank show={changeRankShown}/>
            </div>}

            {panelSettingsShown && <div className="z-10 w-full h-full absolute">
                <PanelSettings show={panelSettingsShown}/>
            </div>}


            <div className="invisible absolute lg:visible lg:static flex items-center pb-2">
                
                <div className="flex items-center w-full">
                <div className="rounded-full h-32 w-32 bg-center bg-contain m-2 bg-no-repeat" style={{ backgroundImage: `url(${logo})` }}></div>
                    <a className="text-4xl text-white">{panelName}</a>
                    <div className="h-14 flex items-end absolute lg:static">
                        <a className="text-xl text-amber-400 ">Admin</a>
                    </div>
                    <img src={languageIconSource} className="w-14 h-14 inset-1/2 cursor-pointer ml-6 absolute lg:static" onClick={changeLanguage}></img>
                </div>

                

                <div className="absolute lg:static">
                    <div className="flex justify-end items-stretch right-10 pr-10">
                        <button className="text-2xl text-white hover:text-gray-300 text-center pr-3" onClick={handleLogOut}>{t("ownerpanel.logout")}</button>
                        <img src={`https://mineskin.eu/helm/${username}`} className="w-20 h-20 rounded-full" onClick={() => setPanelSettingsShown(true)}></img>
                    </div>

                    <div className="flex justify-end pr-10 pt-2">
                        <a className="text-4xl w-48 border-4 border-amber-500 rounded-full px-2 bg-white text-center"><WriteUserRank rank={rank} rankList={rankList} /></a>
                    </div>
                </div>
            </div>
        
            <div className="invisible absolute lg:visible lg:static flex md:w-full h-3/4 gap-7 justify-center w-0">
                <div className="bg-zinc-700/80 rounded-lg flex flex-col w-4/12">

                    <div className="inline-block flex items-center justify-between p-4 flex">
                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-full justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setAddQuestVisibility(true)} className="box-content w-full h-full">
                                {t("ownerpanel.questlist.addquest")}
                            </button>
                        </div>                     

                        <div className="flex justify-center">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">{t("ownerpanel.questlist.header")}</a>
                        </div>

                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-full justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content w-full h-full">
                            {t("ownerpanel.questlist.remquest")}
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="h-full overflow-auto mb-4">
                        {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()} /> : null}
                    </div>
                </div>

                <div className="bg-zinc-700/80 rounded-lg flex flex-col justify-center w-3/5 justify-self-end absolute lg:static">
                    <div>
                        <div className="flex justify-center p-4">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">{t("ownerpanel.memberslist.header")}</a>
                        </div>
                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    </div>
                    <div className=" w-full overflow-auto">
                        {allUsersResponse ? <OwnerATList response={allUsersResponse} addPlusPoint={openAddPlusPoint} addMinusPoint={openAddMinusPoint} changeRank={openChangeRank} rankList={rankList} /> : null}
                    </div>
                    <div className="flex inline-block pb-5 mt-5 w-full px-4 gap-4">
                        <button onClick={() => setAddAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">{t("ownerpanel.memberslist.addaccount")}</button>
                        <button onClick={() => setDelAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">{t("ownerpanel.memberslist.delaccount")}</button>
                    </div>
                </div>
                </div>
{/* MOBILE HTML */}
            <div className="lg:invisible lg:fixed">
                <div className="flex content-center items-stretch p-2 w-full">
                    <div className="flex w-screen">
                        <img src={`https://mineskin.eu/helm/${username}`} className="w-16 h-16 rounded-full" onClick={() => setPanelSettingsShown(true)}></img>
                        <div className="self-center ml-1 border-4 border-gray-400 rounded-full px-2 bg-gray-100"><WriteUserRank rank={rank} rankList={rankList} /></div>
                    </div>
                        <button className="text-2xl text-white hover:text-gray-300 text-center pr-1"onClick={handleLogOut}>{t("userpanel.logout")}</button>
                </div>

                <div className="flex justify-center">
                    <img src={languageIconSource} className="w-14 h-14 cursor-pointer m-2" onClick={changeLanguage}></img>
                </div>

                <div className="bg-zinc-700/80 rounded-lg mx-2">
                    <div className="inline-block flex items-center justify-between p-4 ">
                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-12 justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setAddQuestVisibility(true)} className="box-content w-full h-full">
                                {t("ownerpanel.questlist.addquest")}
                            </button>
                        </div>                     

                        <div className="flex justify-center">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">{t("ownerpanel.questlist.header")}</a>
                        </div>

                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-12 justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content w-full h-full">
                            {t("ownerpanel.questlist.remquest")}
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="h-full overflow-auto mb-4">
                        {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()}/> : null}
                    </div>
                </div>

                <div className="bg-zinc-700/80 rounded-lg flex flex-col h-3/4 mx-2">
                    <div>
                        <div className="flex justify-center p-4">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">{t("ownerpanel.memberslist.header")}</a>
                        </div>
                        <div className="h-0.5 bg-cyan-400 mb-4 "></div>
                    </div>
                    <div className="w-full overflow-auto">
                        {allUsersResponse ? <OwnerATList response={allUsersResponse}  addMinusPoint={openAddMinusPoint} changeRank={openChangeRank} addPlusPoint={openAddPlusPoint} rankList={rankList}/> : null}
                    </div>
                    <div className="flex inline-block pb-5 mt-5 w-full px-4 gap-4">
                        <button onClick={() => setAddAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">{t("ownerpanel.memberslist.addaccount")}</button>
                        <button onClick={() => setDelAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">{t("ownerpanel.memberslist.delaccount")}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
