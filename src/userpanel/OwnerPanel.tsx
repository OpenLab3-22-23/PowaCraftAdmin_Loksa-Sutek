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

    const [allUsersResponse, setUsersResponse] = useState();
    const [questList, setQuestList] = useState();   
    const [pointsList, setPointsList] = useState();       

    const [newTaskText, setTaskText] = useState("");    
    const [newTaskPoints, setTaskPoints] = useState("");   
    const [newMailText, setNewMailText] = useState("");    
    const [nickToDelete, setNickToDelete] = useState("");  
    const [newUserRank, setNewUserRank] = useState("");  
    const [shouldResetPoints, setShouldResetPoints] = useState(false);  

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
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80 ">      
            <div className="w-4/5 lg:w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addquest.header")}</a><br/>
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
                </input><br/>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addquest.points")}</a>
                <input 
                    value={newTaskPoints}
                    onInput={(e) => e.target.value = e.target.value.slice(0, 1)}
                    onChange={(e) => setTaskPoints(e.target.value)}
                    type="number" 
                    className="border border-green-300 rounded-2xl w-1/6 h-11 text-center" 
                    placeholder="0">
                </input><br/>

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
                    <a className="text-3xl text-white">{t("ownerpanel.addaccount.header")}</a><br/>
                    <button onClick={() => closeAddAccountTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addaccount.useremail")}</a>
                <input 
                    value={newMailText}
                    onChange={(e) => setNewMailText(e.target.value)} 
                    type="email"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    placeholder={t("ownerpanel.addaccount.mailplaceholder")}>
                </input><br/>

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
            <div className="w-full lg:w-2/3 h-5/6 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.delaccount.header")}</a><br/>
                    <button onClick={() => closeDeleteAccountTab()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <div className="flex flex-col h-full justify-center items-center pb-12">
                    {allUsersResponse ? <ATList response={allUsersResponse}/> : null}
                <br />
                <a className="text-white text-xl my-2 text-center">{t("ownerpanel.delaccount.nicktodelete")}</a>
                <input 
                    value={nickToDelete}
                    onChange={(e) => setNickToDelete(e.target.value)} 
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 text-center" 
                    maxlength="40"
                    placeholder={t("ownerpanel.delaccount.nickplaceholder")}>
                </input><br/>

                <button onClick={delAccount} className="border border-white/50 border-2 bg-red-600 hover:bg-red-500 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.delaccount.delete")}</button>
                </div>
            </div>      
        </div>
        )
    } 

    const AddPlus = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addplus.header")}</a><br/>
                    <button onClick={() => setAddPlusShown(false)} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addplus.questname")}</a>
                <select
                    value={addPlusTask}
                    onChange={(e) => setAddPlusTask(e.target.value)} 
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" >
                    {pointsList.map((point) => (
                        point.points > 0 ? (
                            <option key={point.id} value={point.id}>
                                {point.action_name} | {point.points}+
                            </option>
                        ) : null
                    ))}
                </select><br/>

                <button onClick={savePlusPoints} className="border border-white/50 border-2 bg-green-700 hover:bg-green-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.addplus.add")}</button>
            </div>      
        </div>
        )
    } 

    const AddMinus = props => {
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.addminus.header")}</a><br/>
                    <button onClick={() => setAddMinusShown(false)} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.addminus.questname")}</a>
                <select
                    value={addMinusTask}
                    onChange={(e) => setAddMinusTask(e.target.value)} 
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" >
                    {pointsList.map((point) => (
                        point.points < 0 ? (
                            <option key={point.id} value={point.id}>
                                {point.action_name} | {Math.abs(point.points)}-
                            </option>
                        ) : null
                    ))}
                </select><br/>

                <button onClick={saveMinusPoints} className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.addminus.add")}</button>
            </div>      
        </div>
        )
    } 


    const ChangeRank = props => {
        if (!props.show) {
            return null;
        }
        return (
            <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-[url('/assets/popupbackground.png')] bg-repeat p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("ownerpanel.changerank.header")}</a><br/>
                    <button onClick={() => setChangeRankShown(false)} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("ownerpanel.changerank.newrank")}</a>
                <select
                    value={newUserRank}
                    onChange={(e) => setNewUserRank(e.target.value)} 
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center">

                    <option value="Akademik">Akademik</option>
                    <option value="Helper">Helper</option>
                    <option value="Hl.Helper">Hl.Helper</option>
                    <option value="Builder">Builder</option>
                    <option value="Admin">Admin</option>
                    <option value="Hl.Builder">Hl.Builder</option>
                    <option value="Hl.Admin">Hl.Admin</option>
                    <option value="Vedenie">Vedenie</option>
                    <option value="Developer">Developer</option>
                    <option value="Majiteľ">Majiteľ</option>
                </select>
                <br/>

                <a className="text-white text-xl pb-2">{t("ownerpanel.changerank.resetpoints")}</a>
                <input 
                    checked={shouldResetPoints}
                    type="checkbox" 
                    className="border border-green-300 rounded-2xl h-10 w-10"
                    onChange={(e) => setShouldResetPoints(e.target.checked)}>
                </input>
                <br />

                <button onClick={changeUserRank} className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">{t("ownerpanel.changerank.change")}</button>
            </div>      
        </div>
        )
    } 


    //** Data fetching **/

    useEffect(() => {
        fetchUserProfile();
        fetchAllUsers();
        fetchQuestList();
        fetchPointsList();
    }, [])

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

                for (let i = 0; i < 10; i++)
                {
                    for (let x = 0; x < data.length; x++)
                    {
                        if (data[x].rank == GetRankByNumber(i))
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

    function GetRankByNumber(number)
    {
        switch (number)
        {
            case 0:
                return "Majiteľ";
            case 1:
                return "Vedenie";                
            case 2:
                return "Developer";
            case 3:
                return "Hl.Admin";
            case 4:
                return "Hl.Builder"; 
            case 5:
                return "Admin";
            case 6:
                return "Builder"; 
            case 7:
                return "Hl.Helper";    
            case 8:
                return "Helper";       
            case 9:
                return "Akademik";                                                     
        }
    }

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
        setNewUserRank("Akademik");
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
        
        const { error } = await supabase
            .from('quest_list')
            .insert({quest_name: newTaskText, points: newTaskPoints})

            if (error) {
                console.log("ERROR");
            }
            setAddQuestVisibility(false);
            fetchQuestList();
            setTaskText("");
            setTaskPoints("");
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

    

//** HTML **/

    return (
// PC HTML
        <div className=" h-max lg:h-screen w-screen bg-[url('/assets/owner-bg.png')] bg-cover bg-no-repeat bg-fixed">

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


            <div className="invisible absolute lg:visible lg:static flex items-center mb-5">
                
                <div className="flex items-center w-full ">
                    <img src="/assets/logo.svg" width="150" height="150" className="rounded-full" alt="obrazok"></img>
                    <a className="text-4xl text-white">PowaCraft</a>
                    <div className="h-14 flex items-end absolute lg:static">
                        <a className="text-xl text-amber-400 ">Admin</a>
                    </div>
                    <img src={languageIconSource} className="w-14 h-14 inset-1/2 cursor-pointer ml-6 absolute lg:static" onClick={changeLanguage}></img>
                </div>

                

                <div className="absolute lg:static">
                    <div className="flex justify-end items-stretch right-10 pr-10">
                        <button className="text-2xl text-white hover:text-gray-300 text-center pr-3"flex-end onClick={handleLogOut}>{t("ownerpanel.logout")}</button>
                        <img src={`https://mineskin.eu/helm/${username}`} className="w-20 h-20 rounded-full"></img>
                    </div>

                    <div className="flex justify-end pr-10 pt-2">
                        <div><WriteUserRank rank={rank} /></div>
                    </div>
                </div>
            </div>
        
            <div className="invisible absolute lg:visible lg:static flex w-full h-3/4 gap-7 justify-center">
                <div className="bg-zinc-700/80 rounded-lg flex flex-col">

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
                        {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests}/> : null}
                    </div>
                </div>

                <div className="bg-zinc-700/80 rounded-lg flex flex-col justify-center w-3/5 justify-self-end absolute lg:static">
                    <div>
                        <div className="flex justify-center p-4">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">{t("ownerpanel.memberslist.header")}</a>
                        </div>
                    <div className="h-0.5 bg-cyan-400 mb-4 "></div>
                    </div>
                    <div className="h-full w-full overflow-auto">
                        {allUsersResponse ? <OwnerATList response={allUsersResponse} addPlusPoint={openAddPlusPoint} addMinusPoint={openAddMinusPoint} changeRank={openChangeRank} /> : null}
                    </div>
                    <div className="flex inline-block pb-5 mt-5 w-full px-4 gap-4">
                        <button onClick={() => setAddAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">{t("ownerpanel.memberslist.addaccount")}</button>
                        <button onClick={() => setDelAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 hover:bg-gray-500/60 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center w-full h-full">{t("ownerpanel.memberslist.delaccount")}</button>
                    </div>
                </div>
                </div>
{/* MOBILE HTML */}
        <div className="lg:invisible lg:fixed">
            <div className="flex content-center items-stretch p-2 w-full ">
                <div className="flex w-screen">
                    <img src={`https://mineskin.eu/helm/${username}`} className="w-16 h-16 rounded-full"></img>
                    <div className="self-center ml-1 border-4 border-gray-400 rounded-full px-2 bg-gray-100"><WriteUserRank rank={rank} /></div>
                </div>
                    <button className="text-2xl text-white hover:text-gray-300 text-center pr-1"onClick={handleLogOut}>{t("userpanel.logout")}</button>
            </div>
            <img src={languageIconSource} className="w-14 h-14 cursor-pointer m-2" onClick={changeLanguage}></img>

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
                    {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests}/> : null}
                </div>
            </div>

            <div className="bg-zinc-700/80 rounded-lg flex flex-col h-3/4 mx-2">
                <div>
                    <div className="flex justify-center p-4">
                        <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">{t("ownerpanel.memberslist.header")}</a>
                    </div>
                    <div className="h-0.5 bg-cyan-400 mb-4 "></div>
                </div>
                <div className="h-full w-full overflow-auto">
                    {allUsersResponse ? <OwnerATList response={allUsersResponse}  addMinusPoint={openAddMinusPoint} changeRank={openChangeRank} addPlusPoint={openAddPlusPoint}/> : null}
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
