// @ts-nocheck

import { useState, useEffect, useRef } from "react";
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

    function showNotification(error) {
        if (error) {
            setNotification("Chyba pri vykonávaní akcie!");
            setNotificationColour("text-red-600")
        }
        else {
            setNotification("Akcia úspešne vykonaná!");
            setNotificationColour("text-green-600")
        }
        setTimeout(() => {
            setNotification(null);
          }, 2000);
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
    const settings_newAction = useRef();
    const settings_newActionPoints = useRef();
    const settings_actionToRemove = useRef();

    /** Other variables **/ 
    const newTaskText = useRef();
    const newTaskPoints = useRef();
    const generalTask = useRef();
    const newMailText = useRef();
    const nickToDelete = useRef();
    const [newUserRank, setNewUserRank] = useState("");  
    const [shouldResetPoints, setShouldResetPoints] = useState(false);    
    const [addPlusTask, setAddPlusTask] = useState();       
    const [addMinusTask, setAddMinusTask] = useState();      
    const [activeUserID, setActiveUserID] = useState();   

/** ### Popup windows ### **/  

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
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="w-4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addquest.header")}</a>
                    <button onClick={() => closeQuestTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addquest.questdesc")}</a>
                <input 
                    ref={newTaskText}
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    maxlength="40"
                    placeholder={t("ownerpanel.addquest.questplaceholder")}>
                </input>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addquest.points")}</a>
                <input 
                    ref={newTaskPoints}
                    type="number" 
                    className="border border-green-300 rounded-2xl w-1/6 h-11 text-center"
                    placeholder="0">
                </input>

                <a className="text-white text-xl">{t("ownerpanel.addquest.generaltask")}</a>
                <a className="text-white text-sm pb-2">{t("ownerpanel.addquest.generaltasksubtext")}</a>
                <input 
                    ref={generalTask}
                    type="checkbox" 
                    className="border border-green-300 rounded-2xl h-10 w-10">
                </input>

                <button 
                    onClick={saveNewTask} 
                    className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">
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
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="w-4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addaccount.header")}</a>
                    <button onClick={() => closeAddAccountTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addaccount.useremail")}</a>
                <input 
                    ref={newMailText}
                    type="email"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    placeholder={t("ownerpanel.addaccount.mailplaceholder")}>
                </input>

                <button 
                    onClick={addNewMail} 
                    className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">
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
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col w-full h-screen bg-black/80">      
            <div className="w-4/5 lg:w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.delaccount.header")}</a>
                    <button onClick={() => closeDeleteAccountTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <div className="flex flex-col h-full justify-center items-center pb-12">
                    {allUsersResponse && rankList ? <ATList response={allUsersResponse} rankList={rankList} /> : null}
                    
                    <a className="text-white text-xl my-2 text-center">{t("ownerpanel.delaccount.nicktodelete")}</a>
                    <input 
                        ref={nickToDelete}
                        type="text"
                        className="border border-green-300 rounded-2xl w-4/5 text-center" 
                        maxlength="40"
                        placeholder={t("ownerpanel.delaccount.nickplaceholder")}>
                    </input>

                    <button 
                        onClick={delAccount} 
                        className="border border-white/50 border-2 bg-red-600 hover:bg-red-500 p-4 rounded-2xl text-white/80 m-3">
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
                    <button onClick={() => closeAddPlusTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
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

                <button 
                    onClick={savePlusPoints} 
                    className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">
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
                    <button onClick={() => closeAddMinusTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
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

                <button 
                    onClick={saveMinusPoints} 
                    className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">
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
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="w-full md:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.changerank.header")}</a>
                    <button onClick={() => closeChangeRankTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
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

                <button 
                    onClick={changeUserRank} 
                    className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">
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
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80 ">      
                <div className="w-full md:w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat border-2 overflow-auto gap-y-3"> 
                    <div className="flex flex-col items-center w-full">
                            <div className="flex w-full justify-center sticky top-0 py-2 bg-[url('/assets/popupbackground.png')] bg-repeat border-b-2 mb-2">
                                <a className="text-4xl text-white">{t("ownerpanel.settings.panel.header")}</a>
                            </div> 
                            <div className="absolute w-full md:w-1/2 py-2 mr-8 z-50">
                                <button onClick={() => closePanelSettings()} className="text-white hover:text-gray-300 text-4xl w-full text-end">X</button>                                
                            </div>  
                            <a className={`mb-6 text-white text-xl ${notificationColour}`}>{notification}</a>
                        
                        
                        <div className="flex flex-col items-center gap-y-2 w-4/6 pt-4">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.panel.servername")}</a>
                            <input 
                                ref={settings_newPanelName}
                                type="text"
                                className="border-2 border-amber-400 rounded-2xl text-center" 
                                maxlength="30"
                                placeholder={panelName}>
                            </input> 
                            <button 
                                onClick={() => setNewPanelName()} 
                                className="border-2 border-white/50 bg-green-700 hover:bg-opacity-80 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5">
                                {t("ownerpanel.settings.save")}
                            </button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.panel.logo")} (png / jpg)</a>
                            <div 
                                className="rounded-full h-32 w-32 bg-center bg-contain bg-no-repeat border-4" 
                                style={{ backgroundImage: `url(${settings_newPanelLogo ? URL.createObjectURL(settings_newPanelLogo) : logo})` }}>
                            </div>
                            <input 
                                id="logoinput" 
                                className="hidden" 
                                onChange={(e) => settings_setNewPanelLogo(e.target.files[0])} 
                                type="file" 
                                accept="image/png, image/jpeg, image/svg">
                            </input>
                            <label 
                                for="logoinput" 
                                className="text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate px-2 cursor-pointer">
                                {t("ownerpanel.settings.selectfile")}
                            </label>
                            <button 
                                onClick={() => setNewLogo()} 
                                className={`border-2 border-white/50 rounded-2xl px-2 h-10 w-2/5 xl:w-1/5 ${settings_newPanelLogo ? 'bg-green-700 hover:bg-opacity-80 text-white/80' : 'bg-green-600/20 text-gray-900'}`}>
                                {t("ownerpanel.settings.upload")}
                            </button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.panel.userpanel")} (png / jpg)</a>
                            <div 
                                className="w-full h-48 lg:h-72 bg-center bg-contain bg-no-repeat" 
                                style={{ backgroundImage: `url(${settings_newUserBackground ? URL.createObjectURL(settings_newUserBackground) : userPanelBackgroundImage})` }}>
                            </div>                   
                            <input 
                                id="userbginput" 
                                className="hidden" 
                                onChange={(e) => settings_setNewUserBackground(e.target.files[0])} 
                                type="file" 
                                accept="image/png, image/jpeg, image/svg">
                            </input>
                            <label 
                                for="userbginput" 
                                className="text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate px-2 cursor-pointer">
                                {t("ownerpanel.settings.selectfile")}
                            </label>
                            <button 
                                onClick={() => setNewUserBackground()} 
                                className={`border-2 border-white/50 rounded-2xl px-2 h-10 w-2/5 xl:w-1/5 ${settings_newUserBackground ? 'bg-green-700 hover:bg-opacity-80 text-white/80' : 'bg-green-600/20 text-gray-900'}`}>
                                {t("ownerpanel.settings.upload")}
                            </button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>

                        <div className="h-min w-4/6 flex flex-col gap-y-2 items-center justify-center">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.panel.ownerpanel")} (png / jpg)</a>
                            <div 
                                className="w-full h-48 lg:h-72 bg-center bg-contain bg-no-repeat" 
                                style={{ backgroundImage: `url(${settings_newOwnerBackground ? URL.createObjectURL(settings_newOwnerBackground) : ownerPanelBackgroundImage})` }}>
                            </div>                        
                            <input 
                                id="ownerbginput" 
                                className="hidden" 
                                onChange={(e) => settings_setNewOwnerBackground(e.target.files[0])} 
                                type="file" 
                                accept="image/png, image/jpeg, image/svg">
                            </input>
                            <label 
                                for="ownerbginput" 
                                className="text-center rounded-lg border-2 border-white text-white bg-gradient-to-r from-amber-400 to-yellow-600 truncate px-2 cursor-pointer">
                                {t("ownerpanel.settings.selectfile")}
                            </label>
                            <button 
                                onClick={() => setNewOwnerBackground()} 
                                className={`border-2 border-white/50 rounded-2xl px-2 h-10 w-2/5 xl:w-1/5 ${settings_newOwnerBackground ? 'bg-green-700 hover:bg-opacity-80 text-white/80' : 'bg-green-600/20 text-gray-900'}`}>
                                {t("ownerpanel.settings.upload")}
                            </button>
                        </div> 
                    </div>
                    
        

                    <div className="w-full gap-y-2 items-center flex flex-col">
                        <div className="flex w-full justify-center sticky top-0 bg-[url('/assets/popupbackground.png')] bg-repeat border-y-2 pt-2">
                            <a className="text-4xl text-white">{t("ownerpanel.settings.ranksettings.header")}</a>
                        </div>

                        <div className="h-min w-4/6 flex flex-col items-center gap-y-2 pt-4">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.ranksettings.ranklist")}</a>
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
                            <a className="text-white text-2xl">{t("ownerpanel.settings.ranksettings.newrank")}</a>
                            <div className="flex gap-x-2">
                                <input 
                                    ref={settings_newRankName}
                                    type="text"
                                    className="border-2 border-amber-400 rounded-2xl w-2/3 text-center" 
                                    placeholder="Rank">
                                </input>
                                <input 
                                    ref={settings_newRankColour}
                                    type="text"
                                    className="border-2 border-amber-400 rounded-2xl w-1/3 text-center" 
                                    placeholder="#FF00FF">
                                </input>
                            </div>
                            <select
                                ref={settings_newRankPermissionLevel}
                                className="border-2 border-amber-400 rounded-2xl w-5/6 h-11 text-center truncate" >
                                <option>{t("ownerpanel.settings.ranksettings.permlvl1")}</option>
                                <option>{t("ownerpanel.settings.ranksettings.permlvl2")}</option>
                                <option>{t("ownerpanel.settings.ranksettings.permlvl3")}</option>
                            </select>
                            <button 
                                onClick={() => addNewRank()} 
                                className="border-2 border-white/50 border-2 bg-green-700 hover:bg-opacity-80 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5">
                                {t("ownerpanel.settings.add")}
                            </button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.ranksettings.delrank")}</a>
                            <input 
                                ref={settings_rankToRemove}
                                type="text"
                                className="border-2 border-amber-400 rounded-2xl w-3/4 text-center" 
                                placeholder={t("ownerpanel.settings.ranksettings.delrank_placeholder")}>
                            </input>
                            <button 
                                onClick={() => removeRank()} 
                                className="border-2 border-white/50 border-2 bg-red-600 hover:bg-opacity-80 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5">
                                {t("ownerpanel.settings.delete")}
                            </button>
                        </div>   
                    </div>    



                    <div className="w-full flex flex-col items-center">
                        <div className="flex w-full justify-center sticky top-0 bg-[url('/assets/popupbackground.png')] bg-repeat border-y-2 pt-2">
                            <a className="text-4xl text-white">{t("ownerpanel.settings.pointsettings.header")}</a>
                        </div>

                        <div className="h-min w-4/6 flex flex-col items-center gap-y-2 pt-4">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.pointsettings.actionlist")}</a>
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
                            <a className="text-white text-2xl">{t("ownerpanel.settings.pointsettings.addaction")}</a>
                            <div className="flex gap-2">
                                <input 
                                    ref={settings_newAction}
                                    type="text"
                                    className="border-2 border-amber-400 rounded-2xl w-2/3 text-center" 
                                    placeholder={t("ownerpanel.settings.pointsettings.addaction_placeholder")}>
                                </input>
                                <input 
                                    ref={settings_newActionPoints}
                                    type="number"
                                    maxLength="2"
                                    className="border-2 border-amber-400 rounded-2xl w-1/3 text-center" 
                                    placeholder="1, 2 / -1, -2..">
                                </input>
                            </div>
                            <button 
                                onClick={() => addNewAction()} 
                                className="border-white/50 border-2 rounded-2xl text-white/80 px-2 h-10 w-2/5 xl:w-1/5 bg-green-700 hover:bg-opacity-80 text-white/80">
                                {t("ownerpanel.settings.add")}
                            </button>
                            <div className="border-2 border-amber-500 w-11/12 mb-2"></div>
                        </div>
                        
                        <div className="flex flex-col items-center w-4/6 gap-y-2">
                            <a className="text-white text-2xl">{t("ownerpanel.settings.pointsettings.delaction")}</a>
                            <input 
                                ref={settings_actionToRemove}
                                type="number"
                                className="border-2 border-amber-400 rounded-2xl w-3/4 text-center" 
                                placeholder={t("ownerpanel.settings.pointsettings.delaction_placeholder")}>
                            </input>
                            <button 
                                onClick={() => removeAction()} 
                                className="border-white/50 border-2 rounded-2xl text-white/80 px-2 h-10 mb-3 w-2/5 xl:w-1/5 bg-red-600 hover:bg-opacity-80 text-white/80 ">
                                {t("ownerpanel.settings.delete")}
                            </button>
                        </div>
                    </div>                        
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
        fetchPointsList();
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
        setUserPanelBackgroundImage(data.publicUrl);
        console.log(data.publicUrl + "?c=" + Math.random());
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

            if (data) {
                console.log(data);
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
            
                //Docasne nezobrazuje nezname ranky, aby si videl bug s tabulkou ked tam je malo hracov
                // for (let i = 0; i < unrankedAccounts.length; i++) {
                //     accounts.push(unrankedAccounts[i]);
                // }
            
                setUsersResponse(accounts);
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
        if (settings_newAction.current.value && settings_newActionPoints.current.value) {
            const { error } = await supabase
            .from('points_list')
            .insert({action_name: settings_newAction.current.value, points: settings_newActionPoints.current.value })
            fetchPointsList();
            settings_setNewAction("");
            settings_setNewActionPoints();

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
            settings_setActionToRemove();

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
        setNewUserRank(rankList[rankList.length - 1].rank);
        setShouldResetPoints(true);
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
        .update({plus: partialData[0].plus + pointsList[addPlusTask].points, last_point1: addPlusTask, last_point2: partialData[0].last_point1, last_point3: partialData[0].last_point2})
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
        .update({minus: partialData[0].minus - pointsList[addMinusTask].points, last_point1: addMinusTask, last_point2: partialData[0].last_point1, last_point3: partialData[0].last_point2})
        .eq('id', activeUserID)
        closeAddMinusTab();
        fetchAllUsers();
    } 

    const changeUserRank = async () => {

        const { } = await supabase
        .from('profiles')
        .update({rank: newUserRank})
        .eq('id', activeUserID)

        if (shouldResetPoints) {
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
    

/** ### PC HTML ### **/ 
    return (
        <div className=" h-max lg:h-screen w-screen bg-no-repeat bg-fixed bg-cover" style={{ backgroundImage: `url(${ownerPanelBackgroundImage})` }}>

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
                        <img src={`https://mineskin.eu/helm/${username}`} className="w-20 h-20 rounded-full cursor-pointer" onClick={() => setPanelSettingsShown(true)}></img>
                    </div>

                    <div className="flex justify-end pr-10 pt-2">
                        <div className="h-12 w-48 border-4 border-amber-500 rounded-full px-2 bg-white flex items-center justify-center">
                            <WriteUserRank rank={rank} rankList={rankList} />
                        </div>
                    </div>
                </div>
            </div>

        
            <div className="invisible absolute lg:visible lg:static flex md:w-full h-3/4 gap-7 justify-center w-0">
                <div className="bg-zinc-700/80 rounded-lg flex flex-col w-4/12">

                    <div className="inline-block flex items-center justify-between p-4 flex">
                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-2/3 justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setAddQuestVisibility(true)} className="box-content w-full h-full">
                                {t("ownerpanel.questlist.addquest")}
                            </button>
                        </div>                     

                        <div className="flex justify-center">
                            <a 
                                className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">
                                {t("ownerpanel.questlist.header")}
                            </a>
                        </div>

                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-2/3 justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content w-full h-full">
                            {t("ownerpanel.questlist.remquest")}
                            </button>
                        </div>
                    </div>
                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="h-full overflow-auto mb-4">
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


                <div className="bg-zinc-700/80 rounded-lg flex flex-col justify-center w-3/5 justify-self-end absolute lg:static">
                    <div>
                        <div className="flex justify-center p-4">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">{t("ownerpanel.memberslist.header")}</a>
                        </div>
                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    </div>
                    <div className=" w-full overflow-auto">
                        {allUsersResponse ? 
                            <OwnerATList 
                            response={allUsersResponse} 
                            addPlusPoint={openAddPlusPoint} 
                            addMinusPoint={openAddMinusPoint} 
                            changeRank={openChangeRank} 
                            rankList={rankList} /> 
                        : null}
                    </div>
                    <div className="flex inline-block pb-5 mt-5 w-full px-4 gap-4">
                        <button 
                            onClick={() => setAddAccountVisibility(true)} 
                            className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">
                            {t("ownerpanel.memberslist.addaccount")}
                        </button>
                        <button 
                            onClick={() => setDelAccountVisibility(true)} 
                            className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">
                            {t("ownerpanel.memberslist.delaccount")}
                        </button>
                    </div>
                </div>
            </div>
            
{/** ### MOBILE HTML ### **/}
            <div className="lg:invisible lg:fixed">
                <div className="flex content-center items-stretch p-2 w-full">
                    <div className="flex w-screen">
                        <img src={`https://mineskin.eu/helm/${username}`} className="w-16 h-16 rounded-full" onClick={() => setPanelSettingsShown(true)}></img>
                        <div className="self-center ml-1 border-4 border-amber-500 rounded-full px-2 bg-gray-100"><WriteUserRank rank={rank} rankList={rankList} /></div>
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
                            <a 
                                className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">
                                {t("ownerpanel.questlist.header")}
                            </a>
                        </div>

                        <div className="flex bg-gray-600 hover:bg-gray-500/60 rounded-lg w-1/5 h-12 justify-center border-slate-500 border-2 text-white">
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content w-full h-full">
                            {t("ownerpanel.questlist.remquest")}
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="h-full overflow-auto mb-4">
                        {questList ? 
                            <WriteQuests 
                            questList={questList} 
                            deleteShown={deleteShown} 
                            onDelete={RefreshQuests} 
                            username={username} 
                            fetchQuests={() => fetchQuestList()}/> 
                        : null}
                    </div>
                </div>


                <div className="bg-zinc-700/80 rounded-lg flex flex-col h-3/4 mx-2">
                    <div>
                        <div className="flex justify-center p-4">
                            <a 
                                className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">
                                {t("ownerpanel.memberslist.header")}
                            </a>
                        </div>
                        <div className="h-0.5 bg-cyan-400 mb-4 "></div>
                    </div>
                    <div className="w-full overflow-auto">
                        {allUsersResponse ? 
                            <OwnerATList 
                            response={allUsersResponse}  
                            addMinusPoint={openAddMinusPoint} 
                            changeRank={openChangeRank} 
                            addPlusPoint={openAddPlusPoint} 
                            rankList={rankList}/> 
                        : null}
                    </div>
                    <div className="flex inline-block pb-5 mt-5 w-full px-4 gap-4">
                        <button 
                            onClick={() => setAddAccountVisibility(true)} 
                            className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">
                            {t("ownerpanel.memberslist.addaccount")}
                        </button>
                        <button 
                            onClick={() => setDelAccountVisibility(true)} 
                            className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">
                            {t("ownerpanel.memberslist.delaccount")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
