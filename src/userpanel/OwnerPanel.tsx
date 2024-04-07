// @ts-nocheck

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";
import { useTranslation } from 'react-i18next'
import WriteUserRank from "./UserRank";
import OwnerATList from "./OwnerATList";
import ATList from "./ATList";
import WriteQuests from "./Quests";
import ChatMessages from "./ChatMessages";

export default function OwnerPanel( {userData} ): JSX.Element {
    
    document.body.classList.remove('overflow-hidden');
    const {signOut} = useAuth()
    const { t, i18n } = useTranslation();
    const handleLogOut = () => {
        signOut();
        changeLanguage();
    };

    function showNotification(error) {
        if (error) {
            setNotification("Chyba pri vykonávaní akcie!");
            setNotificationColour("text-red-700")
        }
        else {
            setNotification("Akcia úspešne vykonaná!");
            setNotificationColour("text-green-700")
        }
    }

/** ### Variables ### **/  

    /** User variables **/ 
    const [username, setUsername] = useState("");    
    const [rank, setRank] = useState("");
    const [languageIconSource, setLanguageIconSource] = useState("");

    /** Panel variables **/ 
    const [userPanelBackgroundImage, setUserPanelBackgroundImage] = useState();
    const [ownerPanelBackgroundImage, setOwnerPanelBackgroundImage] = useState();
    const [logo, setLogo] = useState();
    const [panelName, setPanelName] = useState("");
    const [rankList, setRankList] = useState();   
    const [allUsersResponse, setUsersResponse] = useState();
    const [pointsList, setPointsList] = useState();       
    const [questList, setQuestList] = useState();   

    /** Popup variables **/ 
    const [deleteShown, setDeleteShown] = useState(false);   
    const [addQuestShown, setAddQuestVisibility] = useState(false);
    const [addAccountShown, setAddAccountVisibility] = useState(false);
    const [delAccountShown, setDelAccountVisibility] = useState(false); 
    const [addPlusShown, setAddPlusShown] = useState(false);     
    const [addMinusShown, setAddMinusShown] = useState(false);     
    const [changeRankShown, setChangeRankShown] = useState(false);     
    const [panelSettingsShown, setPanelSettingsShown] = useState(false);  
    const [chatOpened, setChatOpened] = useState(false);         
    const [deleteMessageShown, setDeleteMessageShown] = useState(false);

    /** Panel settings variables **/ 
    const [notification, setNotification] = useState("");
    const [notificationColour, setNotificationColour] = useState("");
    const settings_newPanelName = useRef();
    const [settings_newPanelLogo, settings_setNewPanelLogo] = useState();
    const [settings_newUserBackground, settings_setNewUserBackground] = useState();
    const [settings_newOwnerBackground, settings_setNewOwnerBackground] = useState(); 
    const settings_newRankName = useRef();   
    const settings_newRankColour = useRef();   
    const settings_newRankPermissionLevel = useRef();   
    const settings_rankToRemove = useRef();   
    const settings_newAction_sk = useRef();
    const settings_newAction_en = useRef();
    const settings_newActionPoints = useRef();
    const settings_actionToRemove = useRef();

    /** Other variables **/ 
    const newTaskText = useRef();
    const newTaskPoints = useRef();
    const generalTask = useRef();
    const newMailText = useRef();
    const nickToDelete = useRef();
    const newUserRank = useRef();
    const shouldResetPoints = useRef();
    const addPlusTask = useRef();
    const addMinusTask = useRef();
    const [activeUserID, setActiveUserID] = useState();   
    const [chatHistory, setChatHistory] = useState();   
    const newChatMessage = useRef();
    const [messageToDeleteData, setMessageToDeleteData] = useState([]);   
    const isChatOnBottom = useRef(true);


/** ### Popup windows ### **/  

    const closeQuestTab = () => {
        setAddQuestVisibility(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddQuest = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="popup w-full sm:w-4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="shadowT text-3xl text-white">{t("ownerpanel.addquest.header")}</a>
                    <button onClick={() => closeQuestTab()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.addquest.questdesc")}</a>
                <input 
                    ref={newTaskText}
                    type="text"
                    className="shadow border-2 border-green-300 rounded-2xl w-4/5 h-11 text-center mb-4" 
                    maxLength="40"
                    placeholder={t("ownerpanel.addquest.questplaceholder")}>
                </input>

                <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.addquest.points")}</a>
                <input 
                    ref={newTaskPoints}
                    type="number" 
                    className="shadow border-2 border-green-300 rounded-2xl w-1/6 h-11 text-center mb-4"
                    placeholder="0">
                </input>

                <a className="shadowT text-white text-xl">{t("ownerpanel.addquest.generaltask")}</a>
                <a className="shadowT text-white text-sm pb-2">{t("ownerpanel.addquest.generaltasksubtext")}</a>
                <input 
                    ref={generalTask}
                    type="checkbox" 
                    className="shadow border-2 cursor-pointer border-green-300 rounded-2xl h-10 w-10 active:bg-green-300">
                </input>

                <button 
                    onClick={saveNewTask} 
                    className="border click shadow shadowT border-white/50 hover:border-white/60 border-2 bg-green-700 hover:bg-green-800 p-4 rounded-2xl text-white/80 m-3">
                    {t("ownerpanel.addquest.create")}
                </button>
            </div>      
        </div>
        )
    } 

    const closeAddAccountTab = () => {
        setAddAccountVisibility(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddAccount = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="popup w-full sm:4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="shadowT text-3xl text-white">{t("ownerpanel.addaccount.header")}</a>
                    <button onClick={() => closeAddAccountTab()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.addaccount.useremail")}</a>
                <input 
                    ref={newMailText}
                    type="email"
                    className="border shadow border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    placeholder={t("ownerpanel.addaccount.mailplaceholder")}>
                </input>

                <button 
                    onClick={addNewMail} 
                    className="border shadowT shadow click border-white/50 border-2 bg-green-700 hover:bg-green-800 p-4 rounded-2xl text-white/80 m-3">
                    {t("ownerpanel.addaccount.add")}
                </button>
            </div>      
        </div>
        )
    } 

    const closeDeleteAccountTab = () => {
        setDelAccountVisibility(false);
        document.body.classList.remove('overflow-hidden');
    }
    const DeleteAccount = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col w-full h-screen bg-black/80">      
            <div className="popup w-full sm:4/5 xl:w-3/5 2xl:w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="shadowT text-3xl text-white">{t("ownerpanel.delaccount.header")}</a>
                    <button onClick={() => closeDeleteAccountTab()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <div className="flex flex-col h-full justify-center items-center pb-12">
                    {allUsersResponse && rankList ? <ATList response={allUsersResponse} rankList={rankList} /> : null}
                    
                    <a className="shadowT text-white text-xl my-2 text-center">{t("ownerpanel.delaccount.nicktodelete")}</a>
                    <input 
                        ref={nickToDelete}
                        type="text"
                        className="border shadow border-green-300 rounded-2xl w-4/5 text-center" 
                        maxLength="40"
                        placeholder={t("ownerpanel.delaccount.nickplaceholder")}>
                    </input>

                    <button 
                        onClick={delAccount} 
                        className="border shadow shadowT click border-white/50 hover:border-white/60 border-2 bg-red-700 hover:bg-red-800 p-4 rounded-2xl text-white/80 m-3">
                        {t("ownerpanel.delaccount.delete")}
                    </button>
                </div>
            </div>      
        </div>
        )
    } 

    const closeAddPlusTab = () => {
        setAddPlusShown(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddPlus = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="popup w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="shadowT text-3xl text-white text-center w-4/5">{t("ownerpanel.addplus.header")}</a>
                    <button onClick={() => closeAddPlusTab()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.addplus.questname")}</a>
                <select
                    ref={addPlusTask}
                    className="shadow border border-green-300 rounded-2xl w-4/5 h-11 text-center truncate" >
                    {pointsList.map((point) => (
                        point.points > 0 ? (
                            <option key={point.id} value={point.id}>
                                {i18n.language == "sk" ? point.action_name_sk : point.action_name_en} | {point.points}+
                            </option>
                        ) : null
                    ))}
                </select>

                <button 
                    onClick={() => savePlusPoints()} 
                    className="shadow click shadowT border border-white/50 hover:border-white/60 border-2 bg-green-700 hover:bg-green-800 p-4 rounded-2xl text-white/80 m-3">
                    {t("ownerpanel.addplus.add")}
                </button>
            </div>      
        </div>
        )
    } 

    const closeAddMinusTab = () => {
        setAddMinusShown(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddMinus = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
                <div  className="popup w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                    <div className="inline-block flex relative w-full justify-center pb-5">
                        <a className="shadowT text-3xl text-white text-center w-4/5">{t("ownerpanel.addminus.header")}</a>
                        <button  onClick={() => closeAddMinusTab()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                    </div>

                    <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.addminus.questname")}</a>
                    <select
                        ref={addMinusTask}
                        className="shadow border border-green-300 rounded-2xl w-4/5 h-11 text-center truncate">
                        {pointsList.map((point) => (
                            point.points < 0 ? (
                                <option key={point.id} value={point.id}>
                                    {i18n.language == "sk" ? point.action_name_sk : point.action_name_en} | {Math.abs(point.points)}-
                                </option>
                            ) : null
                        ))}
                    </select>

                    <button 
                        onClick={() => saveMinusPoints()} 
                        className="shadow shadowT click border border-white/50 hover:border-white/60 border-2 bg-red-700 hover:bg-red-800 p-4 rounded-2xl text-white/80 m-3">
                        {t("ownerpanel.addminus.add")}
                    </button>
                </div>      
            </div>
        )
    } 
    
    const closeChangeRankTab = () => {
        setChangeRankShown(false);
        document.body.classList.remove('overflow-hidden');
    }
    const ChangeRank = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
                <div className="popup w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                    <div className="inline-block flex relative w-full justify-center pb-5">
                        <a className="shadowT text-3xl text-white">{t("ownerpanel.changerank.header")}</a>
                        <button onClick={() => closeChangeRankTab()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                    </div>

                    <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.changerank.newrank")}</a>
                    <select
                        ref={newUserRank}
                        className="shadow border border-green-300 rounded-2xl w-4/5 h-11 text-center"
                        defaultValue={rankList[rankList.length - 1].rank}>

                        {rankList.map((rank, index) => (
                            <option key={index} value={rank.rank}>
                                {rank.rank}
                            </option>
                        ))}
                    </select>

                    <a className="shadowT text-white text-xl pb-2">{t("ownerpanel.changerank.resetpoints")}</a>
                    <input 
                        type="checkbox" 
                        className="shadow border border-green-300 rounded-2xl h-10 w-10"
                        ref={shouldResetPoints}
                        defaultChecked={true}>
                    </input>

                    <button 
                        onClick={() => changeUserRank()} 
                        className="shadow shadowT click border border-white/50 border-2 bg-red-600 hover:bg-red-500 p-4 rounded-2xl text-white/80 m-3">
                        {t("ownerpanel.changerank.change")}
                    </button>
                </div>      
            </div>
        )
    } 


    const closePanelSettings = () => {
        setPanelSettingsShown(false);
        document.body.classList.remove('overflow-hidden');
    }
    const PanelSettings = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        document.getElementById('settings')?.style.opacity(1);
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
                <div className={`${notification ? "" : "popup"} w-full sm:w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat border-2 overflow-auto gap-y-3`}> 
                    <div className="flex flex-col items-center w-full">
                            <div className="shadow flex w-full justify-center sticky top-0 py-2 bg-[url('/assets/popupbackground.png')] bg-repeat border-b-2 mb-2">
                                <a className="shadowT text-4xl text-white text-center mx-10">{t("ownerpanel.settings.panel.header")}</a>
                            </div> 
                            <div className="absolute w-full sm:w-1/2 py-2 z-50">
                                <div className="flex justify-end transition duration-500 mr-2">
                                    <button onClick={() => closePanelSettings()} className={`${notification ? "" : "closebtn"} text-white hover:text-gray-300 text-4xl text-end`}>X</button>                                
                                </div>
                            </div>  
                            <a className={`shadowT text-white text-xl ${notificationColour}`}>{notification}</a>
                        
                        
                        <div className="flex flex-col items-center gap-y-2 w-4/6 pt-4">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.panel.servername")}</a>
                            <input 
                                ref={settings_newPanelName}
                                type="text"
                                className="shadow border-2 border-amber-400 rounded-2xl text-center" 
                                maxLength="30"
                                placeholder={panelName}>
                            </input> 
                            <button 
                                onClick={() => setNewPanelName()} 
                                className="shadow shadowT click border-2 border-white/50 hover:border-white/60 bg-green-700 hover:bg-green-800 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5 flex items-center justify-center text-xs sm:text-base">
                                {t("ownerpanel.settings.save")}
                            </button>
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.panel.logo")} (png / jpg)</a>
                            <div 
                                className="shadow rounded-full h-32 w-32 bg-center bg-contain bg-no-repeat border-4 border-amber-500" 
                                style={{ backgroundImage: `url(${settings_newPanelLogo ? URL.createObjectURL(settings_newPanelLogo) : logo})` }}>
                            </div>
                            <input 
                                id="logoinput" 
                                className="hidden shadow" 
                                onChange={(e) => settings_setNewPanelLogo(e.target.files[0])} 
                                type="file" 
                                accept="image/png, image/jpeg, image/svg">
                            </input>
                            <label 
                                htmlFor="logoinput" 
                                className="shadowT shadow click text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate px-2 cursor-pointer">
                                {t("ownerpanel.settings.selectfile")}
                            </label>
                            <button 
                                onClick={() => setNewLogo()} 
                                className={`shadow shadowT click border-2 border-white/50 hover:border-white/60 rounded-2xl px-2 h-10 w-2/5 xl:w-1/5 flex items-center justify-center text-xs sm:text-base ${settings_newPanelLogo ? 'bg-green-700 hover:bg-green-800 text-white/80' : 'bg-green-600/20 text-gray-900'}`}>
                                {t("ownerpanel.settings.upload")}
                            </button>
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.panel.userpanel")} (png / jpg)</a>
                            <div 
                                className="shadow w-full h-48 lg:h-72 bg-center bg-contain bg-no-repeat" 
                                style={{ backgroundImage: `url(${settings_newUserBackground ? URL.createObjectURL(settings_newUserBackground) : userPanelBackgroundImage})` }}>
                            </div>                   
                            <input 
                                id="userbginput" 
                                className="hidden shadow " 
                                onChange={(e) => settings_setNewUserBackground(e.target.files[0])} 
                                type="file" 
                                accept="image/png, image/jpeg, image/svg">
                            </input>
                            <label 
                                htmlFor="userbginput" 
                                className="shadowT shadow click text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate px-2 cursor-pointer">
                                {t("ownerpanel.settings.selectfile")}
                            </label>
                            <button 
                                onClick={() => setNewUserBackground()} 
                                className={`shadow shadowT click border-2 border-white/50 hover:border-white/60 rounded-2xl px-2 h-10 w-2/5 xl:w-1/5 flex items-center justify-center text-xs sm:text-base ${settings_newUserBackground ? 'bg-green-700 hover:bg-green-800 text-white/80' : 'bg-green-600/20 text-gray-900'}`}>
                                {t("ownerpanel.settings.upload")}
                            </button>
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.panel.ownerpanel")} (png / jpg)</a>
                            <div 
                                className="shadow w-full h-48 lg:h-72 bg-center bg-contain bg-no-repeat" 
                                style={{ backgroundImage: `url(${settings_newOwnerBackground ? URL.createObjectURL(settings_newOwnerBackground) : ownerPanelBackgroundImage})` }}>
                            </div>                        
                            <input 
                                id="ownerbginput" 
                                className="hidden shadow" 
                                onChange={(e) => settings_setNewOwnerBackground(e.target.files[0])} 
                                type="file" 
                                accept="image/png, image/jpeg, image/svg">
                            </input>
                            <label 
                                htmlFor="ownerbginput" 
                                className="shadowT shadow click text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate px-2 cursor-pointer">
                                {t("ownerpanel.settings.selectfile")}
                            </label>
                            <button 
                                onClick={() => setNewOwnerBackground()} 
                                className={`shadow shadowT click border-2 border-white/50 hover:border-white/60 rounded-2xl px-2 h-10 w-2/5 xl:w-1/5 flex items-center justify-center text-xs sm:text-base ${settings_newOwnerBackground ? 'bg-green-700 hover:bg-green-800 text-white/80' : 'bg-green-600/20 text-gray-900'}`}>
                                {t("ownerpanel.settings.upload")}
                            </button>
                        </div> 
                    </div>
                    
        

                    <div className="w-full gap-y-2 items-center flex flex-col">
                        <div className="shadow flex w-full justify-center sticky top-0 bg-[url('/assets/popupbackground.png')] bg-repeat border-y-2 pt-2">
                            <a className="shadowT text-4xl text-white text-center">{t("ownerpanel.settings.ranksettings.header")}</a>
                        </div>

                        <div className="h-min w-4/6 flex flex-col items-center gap-y-2 pt-4">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.ranksettings.ranklist")}</a>
                            <select
                            defaultValue={rankList[0].rank}
                            className="shadow border-2 border-amber-400 rounded-2xl w-4/5 h-11 text-center" >
                            {rankList.map((rank) => (
                                <option key={rank.rank} value={rank.rank}>
                                    {rank.rank}
                                </option>
                            ))}
                            </select>  
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>          
                        </div>       
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.ranksettings.newrank")}</a>
                            <div className="flex gap-x-2">
                                <input 
                                    ref={settings_newRankName}
                                    type="text"
                                    className="shadow border-2 border-amber-400 rounded-2xl w-2/3 text-center" 
                                    placeholder="Rank">
                                </input>
                                <input
                                    ref={settings_newRankColour}
                                    type="color"
                                    className="shadow border-2 border-amber-400 rounded-2xl p-5 cursor-pointer shadow bg-cyan-500"
                                    onChange={handleNickColorChange}
                                    defaultValue={"#06B6D4"}>   
                                </input>
                            </div>
                            <select
                                ref={settings_newRankPermissionLevel}
                                className="shadow border-2 border-amber-400 rounded-2xl w-5/6 h-11 text-center truncate" >
                                <option>{t("ownerpanel.settings.ranksettings.permlvl1")}</option>
                                <option>{t("ownerpanel.settings.ranksettings.permlvl2")}</option>
                                <option>{t("ownerpanel.settings.ranksettings.permlvl3")}</option>
                            </select>
                            <button 
                                onClick={() => addNewRank()} 
                                className="shadow shadowT click border-2 border-white/50 hover:border-white/60 bg-green-700 hover:bg-green-800 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5 flex items-center justify-center text-xs sm:text-base">
                                {t("ownerpanel.settings.add")}
                            </button>
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.ranksettings.delrank")}</a>
                            <input 
                                ref={settings_rankToRemove}
                                type="text"
                                className="shadow border-2 border-amber-400 rounded-2xl w-3/4 text-center" 
                                placeholder={t("ownerpanel.settings.ranksettings.delrank_placeholder")}>
                            </input>
                            <button 
                                onClick={() => removeRank()} 
                                className="shadow shadowT click border-2 border-white/50 hover:border-white/60 bg-red-700 hover:bg-red-800 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5 flex items-center justify-center text-xs sm:text-base">
                                {t("ownerpanel.settings.delete")}
                            </button>
                        </div>   
                    </div>    



                    <div className="w-full flex flex-col items-center">
                        <div className="shadow flex w-full justify-center sticky top-0 bg-[url('/assets/popupbackground.png')] bg-repeat border-y-2 pt-2">
                            <a className="shadowT text-4xl text-white text-center">{t("ownerpanel.settings.pointsettings.header")}</a>
                        </div>

                        <div className="h-min w-4/6 flex flex-col items-center gap-y-2 pt-4">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.pointsettings.actionlist")}</a>
                            <select
                                defaultValue={1}
                                className="shadow border-2 border-amber-400 rounded-2xl w-4/5 h-11 text-center truncate">
                                {pointsList.map((point) => (
                                    point.points > 0 ? (
                                        <option key={point.id} value={point.id} className="text-green-700">
                                            {point.id + "."} {i18n.language == "sk" ? point.action_name_sk : point.action_name_en} | {point.points}+
                                        </option>
                                    ) : null
                                ))}    
                                {pointsList.map((point) => (
                                    point.points < 0 ? (
                                        <option key={point.id} value={point.id} className="text-red-600">
                                            {point.id + ". "} {i18n.language == "sk" ? point.action_name_sk : point.action_name_en} | {Math.abs(point.points)}-
                                        </option>
                                    ) : null
                                ))}
                            </select>  
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>         
                        </div>
            
                        <div className="flex flex-col w-4/6 items-center gap-y-2">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.pointsettings.addaction")}</a>
                                <input 
                                    ref={settings_newAction_sk}
                                    type="text"
                                    className="shadow border-2 border-amber-400 rounded-2xl text-center w-3/4" 
                                    placeholder={t("ownerpanel.settings.pointsettings.addaction_placeholder_sk")}>
                                </input>
                                <input 
                                    ref={settings_newAction_en}
                                    type="text"
                                    className="shadow border-2 border-amber-400 rounded-2xl text-center w-3/4" 
                                    placeholder={t("ownerpanel.settings.pointsettings.addaction_placeholder_en")}>
                                </input>
                                <input 
                                    ref={settings_newActionPoints}
                                    type="number"
                                    maxLength="2"
                                    className="shadow border-2 border-amber-400 rounded-2xl w-1/3 text-center" 
                                    placeholder="1, 2 / -1, -2..">
                                </input>
                            <button 
                                onClick={() => addNewAction()} 
                                className="shadow shadowT click border-white/50 hover:border-white/60 border-2 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5 bg-green-700 hover:bg-green-800 text-white/80 flex items-center justify-center text-xs sm:text-base">
                                {t("ownerpanel.settings.add")}
                            </button>
                            <div className="shadow border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="shadowT text-white text-2xl text-center">{t("ownerpanel.settings.pointsettings.delaction")}</a>
                            <input 
                                ref={settings_actionToRemove}
                                type="number"
                                className="shadow border-2 border-amber-400 rounded-2xl w-3/4 text-center" 
                                placeholder={t("ownerpanel.settings.pointsettings.delaction_placeholder")}>
                            </input>
                            <button 
                                onClick={() => removeAction()} 
                                className="shadow shadowT click border-white/50 hover:border-white/60 border-2 rounded-2xl text-white/80 px-2 h-10 mb-3 w-2/5 xl:w-1/5 bg-red-700 hover:bg-red-800 text-white/80 flex items-center justify-center text-xs sm:text-base">
                                {t("ownerpanel.settings.delete")}
                            </button>
                        </div>
                    </div>                        
                </div>   
            </div>
        )
    } 

    const handleKeyPress = (event) => {
        if (event.key == 'Enter') {
            sendNewMessage()
        }
    };
    const ChatPopup = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="absolute w-full lg:w-2/5 h-screen bg-gray-900 grid grid-rows-10">
            <div>
                <div className="w-14 absolute right-2 top-2 cursor-pointer transition duration-500 hover:-translate-x-2">
                    <img src="assets/arrow.png" alt="Arrow" onClick={() => setChatOpened(false)}></img>
                </div>
                <div className="flex justify-center flex-grow">
                    <a className="text-5xl text-white pt-2 pb-4">Chat</a>     
                </div> 
                <div className="bg-white h-0.5 w-full mb-2"></div>     
            </div>
            <div className="row-span-8">
                {chatHistory && username ? <ChatMessages chatHistory={chatHistory} username={username} openDeleteMessageTab={openDeleteMessageTab} isAdmin={true} setIsOnBottom={setIsChatOnBottom} /> : null}    
            </div>
            <div className="w-full h-full">
                <div className="bg-white h-0.5 w-full mt-2"></div>  
                <div className="flex items-center justify-center gap-2 p-3">  
                    <input onKeyDown={handleKeyPress} ref={newChatMessage} type="text" className="h-full w-full rounded-lg"></input>
                    <button onClick={() => sendNewMessage()}  className="click h-full w-16 bg-blue-400/80 hover:bg-blue-600/80 rounded-lg items-center justify-center p-1 flex">
                        <img src="assets/send_arrow.png" className="h-3/4 w-3/4"></img>
                    </button>
                </div> 
            </div>
        </div>
        )
    } 


    const openDeleteMessageTab = (messageID, messageText) => {
        messageToDeleteData.push([messageID, messageText])
        setDeleteMessageShown(true);
    }
    const closeDeleteMessageTab = () => {
        setDeleteMessageShown(false);
        setMessageToDeleteData([]);
        document.body.classList.remove('overflow-hidden');
    }
    const DeleteMessage = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
                <div className="w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                    <div className="inline-block flex relative w-full justify-center pb-5">
                        <a className="text-3xl text-white text-center w-4/5">{t("ownerpanel.delmessage.header")}</a>
                        <button onClick={() => closeDeleteMessageTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                    </div>

                    <a className="text-white text-xl text-center">{t("ownerpanel.delmessage.question")}</a>
                    <br/>
                    <div className="w-2/3 h-0.5 bg-white"></div>
                    <a className="text-gray-300 w-2/3 text-center break-words">{messageToDeleteData[0][1]}</a>
                    <div className="w-2/3 h-0.5 bg-white"></div>

                    <button 
                        onClick={() => deleteMessage(messageToDeleteData[0][0])}
                        className="border border-white/50 border-2 bg-red-600 hover:bg-red-500 p-4 rounded-2xl text-white/80 m-3">
                        {t("ownerpanel.delmessage.delete")}
                    </button>
                </div>      
            </div>
        )
    } 



/** ### Data fetching ### **/  

    useEffect(() => {
        fetchOwnerPanelBackground();
        fetchUserPanelBackground();
        fetchLogo();
        fetchPanelData();
        fetchRankList();
        fetchQuestList();
    }, [])
    useEffect(() => {
        if (rankList != undefined)
        {
            fetchUserProfile();
            fetchAllUsers();
        }   
    }, [rankList]);


    /** Panel data **/ 
    const fetchOwnerPanelBackground = async () => {
        const { data } = await supabase.storage
            .from('backgrounds')
            .getPublicUrl('owner-bg.png');
        setOwnerPanelBackgroundImage(data.publicUrl + "?c=" + Math.random());
    }
    const fetchUserPanelBackground = async () => {
        const { data } = await supabase.storage
            .from('backgrounds')
            .getPublicUrl('user-bg.png');
        setUserPanelBackgroundImage(data.publicUrl + "?c=" + Math.random());
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
            .order('permissionLevel', { ascending: false})
            .order('id', { ascending: true })
            setRankList(data);
    }

    /** User data **/ 
    const fetchUserProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .eq('id', userData.user.id)

            if (data) {
                setRank(data[0].rank);
                setUsername(data[0].username);
                i18n.changeLanguage(data[0].language)
                if (i18n.language == "sk") {
                  setLanguageIconSource("/assets/en.png")
                }
                else {
                  setLanguageIconSource("/assets/sk.png")
                }
                fetchPointsList();
            }
    }

    const fetchAllUsers = async () => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .order('plus', { ascending: false })

            if (data) {
                let accounts = [];
                let unrankedAccounts = [];
            
                for (let i = 0; i < rankList.length; i++) {
                    for (let x = 0; x < data.length; x++) {
                        if (data[x].rank == rankList[i].rank) {
                            accounts.push(data[x]); 
                        }
                    }
                }
            
                for (let i = 0; i < data.length; i++) {
                    if (!accounts.includes(data[i])) {
                        unrankedAccounts.push(data[i]);
                    }
                }
            
                for (let i = 0; i < unrankedAccounts.length; i++) {
                    accounts.push(unrankedAccounts[i]);
                }
            
                setUsersResponse(accounts);
            }  
    }

    const fetchChatMessages = async () => {
        const { data } = await supabase
            .from('chat')
            .select()
            .order('created_at', { ascending: true})
            if (data != chatHistory)
            {
                setChatHistory(data);
            }
    }
       
    /** Other data **/ 
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


/** ### Data pushing ### **/  
        
    const saveNewTask = async () => {
        if (newTaskText.current.value && newTaskPoints.current.value && newTaskPoints.current.value.length < 3) {
            let taskType = null;
            if (generalTask.current.checked) { taskType = "general_task" }
    
            const { } = await supabase
                .from('quest_list')
                .insert({
                    quest_name: newTaskText.current.value, 
                    points: newTaskPoints.current.value, 
                    assigned: taskType, 
                    creator: username})
                closeQuestTab();
                fetchQuestList();
                setTaskText("");
                setTaskPoints("");
                setGeneralTask(false);
        }
    }

    const addNewMail = async () => {
        if (newMailText.current.value) {
            const { } = await supabase
            .from('allowed_mails')
            .insert({mail: newMailText.current.value})
            closeAddAccountTab();
            setNewMailText("");
        }
    }

    const delAccount = async () => {
        if (nickToDelete.current.value) {
            const { } = await supabase
            .from('profiles')
            .delete()
            .eq('id', getIDByUsername(nickToDelete.current.value))
            closeDeleteAccountTab();
            fetchAllUsers();
        }
    }   

    const sendNewMessage = async () => {
        if (newChatMessage.current.value) {
            const { } = await supabase
            .from('chat')
            .insert({creator: username, text: newChatMessage.current.value})

            if (chatHistory.length + 1 >= 100)
            {
                const { } = await supabase
                .from('chat')
                .delete()
                .eq('id', chatHistory[0].id)
            }

            fetchChatMessages();
        }
    }    
    


/** ### Settings data pushing ### **/  

    const setNewPanelName = async () => {
        if (settings_newPanelName.current.value) {
            const { error } = await supabase
            .from('paneldata')
            .update({data: settings_newPanelName.current.value})
            .eq('id', 0)
            fetchPanelData();

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
        else {
            showNotification(true);
        }
    }

    const setNewLogo = async () => {
        if (settings_newPanelLogo) {
            const { error } = await supabase.storage
            .from('images')
            .upload('logo.png', settings_newPanelLogo, {
                upsert: true
              })
            fetchLogo();
            settings_setNewPanelLogo(null);

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
    }
    
    const setNewUserBackground = async () => {
        if (settings_newUserBackground) {
            const { error } = await supabase.storage
            .from('backgrounds')
            .upload('user-bg.png', settings_newUserBackground, {
                upsert: true
              })
            fetchUserPanelBackground();
            settings_setNewUserBackground(null);

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
    }

    const setNewOwnerBackground = async () => {
        if (settings_newOwnerBackground) {
            const { error } = await supabase.storage
            .from('backgrounds')
            .upload('owner-bg.png', settings_newOwnerBackground, {
                upsert: true
              })
            fetchOwnerPanelBackground();
            settings_setNewOwnerBackground(null);

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
    }

    const addNewRank = async () => {
        if (settings_newRankName.current.value && settings_newRankColour.current.value) {
            const { error } = await supabase
            .from('ranks')
            .insert({
                rank: settings_newRankName.current.value,
                colour: settings_newRankColour.current.value,
                permissionLevel: settings_newRankPermissionLevel.current.selectedIndex + 1})
            fetchRankList();

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
        else {
            showNotification(true);
        }
    }

    const removeRank = async () => {
        if (settings_rankToRemove.current.value) {
            const { error } = await supabase
            .from('ranks')
            .delete()
            .eq('rank', settings_rankToRemove.current.value)
            fetchRankList();

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
        else {
            showNotification(true);
        }
    }

    const addNewAction = async () => {
        if (settings_newAction_sk.current.value && settings_newAction_en.current.value && settings_newActionPoints.current.value) {
            const { error } = await supabase
            .from('points_list')
            .insert({action_name_sk: settings_newAction_sk.current.value, action_name_en: settings_newAction_en.current.value, points: settings_newActionPoints.current.value })
            fetchPointsList();

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
        else {
            showNotification(true);
        }
    }

    const removeAction = async () => {
        if (settings_actionToRemove.current.value) {
            const { error } = await supabase
            .from('points_list')
            .delete()
            .eq('id', settings_actionToRemove.current.value)
            fetchPointsList();

            if (error) {
                showNotification(true);
            }
            else {
                showNotification(false);
            }
        }
        else {
            showNotification(true);
        }
    }


/** ### Other functions ### **/ 

    function openAddPlusPoint(id) {
        setActiveUserID(id);
        setAddPlusShown(true);
    }
    function openAddMinusPoint(id) {
        setActiveUserID(id);
        setAddMinusShown(true);
    }
    function openChangeRank(id) {
        setActiveUserID(id);
        setChangeRankShown(true);
    }

    const getIDByUsername = (username) => {
        const user = allUsersResponse.find((user) => user.username == username);
        return user ? user.id : null;
    };

    function RefreshQuests() {
        setDeleteShown(!deleteShown);
        fetchQuestList();
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

        const { } = await supabase
        .from('profiles')
        .update({plus: partialData[0].plus + pointsList[pointsList.findIndex(point => point.id == addPlusTask.current.value)].points, last_point1: addPlusTask.current.value, last_point2: partialData[0].last_point1, last_point3: partialData[0].last_point2})
        .eq('id', activeUserID)
        closeAddPlusTab();
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

        const { } = await supabase
        .from('profiles')
        .update({minus: partialData[0].minus + pointsList[pointsList.findIndex(point => point.id == addMinusTask.current.value)].points, last_point1: addMinusTask.current.value, last_point2: partialData[0].last_point1, last_point3: partialData[0].last_point2})
        .eq('id', activeUserID)
        closeAddMinusTab();
        fetchAllUsers();
    } 

    const changeUserRank = async () => {

        const { } = await supabase
        .from('profiles')
        .update({rank: newUserRank.current.value})
        .eq('id', activeUserID)

        if (shouldResetPoints.current.checked == true) {
            const { } = await supabase
            .from('profiles')
            .update({plus: 0, minus : 0})
            .eq('id', activeUserID) 
        }
        closeChangeRankTab();
        fetchAllUsers();
    } 

    function changeLanguage() {
      if (i18n.language == "sk") {
        i18n.changeLanguage("en")
        setLanguageIconSource("/assets/sk.png")
      }
      else {
        i18n.changeLanguage("sk")
        setLanguageIconSource("/assets/en.png")
      }
    }

    const deleteMessage = async (messageID) => {
        const { } = await supabase
        .from('chat')
        .delete()
        .eq('id', messageID)
        fetchChatMessages();
        closeDeleteMessageTab();
    } 

    
    const handleNickColorChange = () => {
        const color = settings_newRankColour.current.value;
        settings_newRankColour.current.style.backgroundColor = color;
    };

    useEffect(() => {
        if (chatOpened)
        {
            chatRefreshTimer()
        }
    }, [chatOpened])
    function chatRefreshTimer() {
        setTimeout(() => {
            if (newChatMessage.current.value == "" && isChatOnBottom.current)
            {
                fetchChatMessages();
            }
            chatRefreshTimer();
        }, 10000);
    } 

    function setIsChatOnBottom(isOnBottom) {
        isChatOnBottom.current = isOnBottom;
    }

    

/** ### HTML ### **/ 
    return (
        <div className="h-fit lg:h-screen w-screen bg-no-repeat bg-center bg-fixed bg-cover overflow-hidden" style={{ backgroundImage: `url(${ownerPanelBackgroundImage})` }}>

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

            {chatOpened && <div className="z-10 w-full h-full absolute bg-black/50">
                <ChatPopup show={chatOpened}/>
            </div>}

            {deleteMessageShown &&  messageToDeleteData.length > 0 && <div className="z-10 w-full h-full absolute">
                <DeleteMessage show={deleteMessageShown}/>
            </div>}

            <div className="slidefromtop flex items-center p-3 w-full justify-between">
                
                <div className="flex items-center w-1/2 hidden md:flex ">
                    <div className="shadowT items-center flex mr-16">
                        <div className="rounded-full h-32 w-32 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${logo})` }}></div>
                        <a className="text-4xl text-white" href="https://powacraft.sk/">{panelName}</a>
                        <div className="h-14 flex items-end">
                            <a className="text-xl text-amber-400 ">Admin</a>
                        </div>
                    </div>
                </div>
                <div className="flex border-2 border-white/40 w-1/2 md:w-1/5 justify-evenly items-center rounded-full bg-white/20">
                    <img id="chat" className="w-20 cursor-pointer transition duration-500 hover:-translate-y-1 drop-shadow-lg" src="/assets/chat.png" alt="CHAT" onClick={() => {fetchChatMessages(); setChatOpened(!chatOpened);}} />
                    <img src={languageIconSource} className="w-14 h-14 transition duration-500 cursor-pointer mr-4 rounded-full shadow hover:-translate-y-1 " onClick={changeLanguage}></img>
                </div>
                <div className="flex sm:flex-col items-center">
                    <div className="flex flex-row-reverse sm:flex-row justify-between items-center gap-2 sm:gap-0">
                        <button className="shadowT text-2xl logout text-white hover:text-gray-400 text-center sm:pr-3" onClick={handleLogOut}>{t("ownerpanel.logout")}</button>
                        <img src="assets/settings_icon.png" className="w-16 h-16 mb-2 rounded-full cursor-pointer transition duration-500 hover:rotate-90 active:rotate-180" onClick={() => {setNotification(null); setPanelSettingsShown(true);}}></img>
                    </div>

                    <div className="flex justify-end hidden sm:flex">
                        <div className="shadow h-12 w-48 border-4 border-amber-500 rounded-full px-2 bg-white flex items-center justify-center">
                            <WriteUserRank rank={rank} rankList={rankList} />
                        </div>
                    </div>
                </div>
            </div>

        
            <div className="flex flex-col lg:flex-row lg:w-full h-3/4 items-center gap-y-5 lg:justify-evenly pb-5 px-3 sm:px-0">
                <div className="shadow slidefromtop bg-zinc-700/80 rounded-lg flex flex-col w-full sm:w-3/4 lg:w-4/12 h-1/6 lg:h-full">

                    <div className="inline-block flex items-center justify-between p-4 flex">
                        <button onClick={() => setAddQuestVisibility(true)} 
                        className="bg-gray-600 shadow click hover:bg-gray-700/60 rounded-lg px-2 justify-center border-slate-500 hover:border-slate-400 border-2 text-white sm:h-12">
                        {t("ownerpanel.questlist.addquest")}
                        </button>                   

                        <div className="flex justify-center">
                            <a 
                                className=" font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">
                                {t("ownerpanel.questlist.header")}
                            </a>
                        </div>

                        <button onClick={() => setDeleteShown(!deleteShown)} className="bg-gray-600 shadow click hover:bg-gray-700/60 hover:border-slate-400 rounded-lg px-2 justify-center border-slate-500 border-2 text-white sm:h-12">
                        {t("ownerpanel.questlist.remquest")}
                        </button>
                    </div>
                    <div className="h-1 bg-cyan-400 mb-4"></div>
                    <div className="slidefrombottom h-full overflow-auto mb-4">
                        {questList ? 
                            <WriteQuests 
                            questList={questList} 
                            deleteShown={deleteShown} 
                            onDelete={RefreshQuests} 
                            username={username} 
                            fetchQuests={() => fetchQuestList()} /> 
                        : null}
                    </div>
                </div>


                <div className="shadow slidefromtop bg-zinc-700/80 rounded-lg flex flex-col w-full sm:w-3/4 lg:w-3/5 h-full">
                    <div className="flex justify-center text-center p-4">
                        <a className=" font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">{t("ownerpanel.memberslist.header")}</a>
                    </div>
                    <div className="h-1 bg-cyan-400 mb-4"></div>
                    <div  className="slidefrombottom w-full overflow-auto h-full">
                        {allUsersResponse ? 
                            <OwnerATList 
                            response={allUsersResponse} 
                            addPlusPoint={openAddPlusPoint} 
                            addMinusPoint={openAddMinusPoint} 
                            changeRank={openChangeRank} 
                            rankList={rankList} /> 
                        : null}
                    </div>
                    <div className="slidefrombottom flex inline-block pb-5 mt-5 w-full px-4 gap-4 ">
                        <button 
                            onClick={() => setAddAccountVisibility(true)} 
                            className="box-content shadow click h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-700/60 border-slate-500 hover:border-slate-400 border-2 text-white rounded-lg items-center flex justify-center">
                            {t("ownerpanel.memberslist.addaccount")}
                        </button>
                        <button 
                            onClick={() => setDelAccountVisibility(true)} 
                            className="box-content shadow click h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-700/60 border-slate-500 hover:border-slate-400 border-2 text-white rounded-lg items-center flex justify-center">
                            {t("ownerpanel.memberslist.delaccount")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
