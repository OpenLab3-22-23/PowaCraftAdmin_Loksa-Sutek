// @ts-nocheck

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";
import { useTranslation } from 'react-i18next';
import WriteUserRank from "./UserRank";
import WriteLastPoints from "./LastPoints";
import WriteBestHelpers from "./BestHelpers";
import ATList from "./ATList";
import WriteQuests from "./Quests";
import ChatMessages from "./ChatMessages";

export default function LandingPage( {userData} ): JSX.Element {

    document.body.classList.remove('overflow-hidden');
    const {signOut} = useAuth()
    const { t, i18n } = useTranslation();
    function handleLogOut(): void {
        signOut();
    }

/** ### Variables ### **/  

    /** User variables **/ 
    const [username, setUsername] = useState("");
    const [rank, setRank] = useState("");
    const [languageIconSource, setLanguageIconSource] = useState("");
    const [plusPoints, setPlusPoints] = useState(0);
    const [minusPoints, setMinusPoints] = useState(0);
    const [isHelper, setIsHelper] = useState(false);  
     
    /** Panel variables **/ 
    const [backgroundImage, setBackgroundImage] = useState();
    const [logo, setLogo] = useState();
    const [panelName, setPanelName] = useState("");
    const [rankList, setRankList] = useState();   
    const [userResponse, setUserResponse] = useState();
    const [allUsersResponse, setUsersResponse] = useState();
    const [usersResponseByPlus, setUsersResponseByPlus] = useState();
    const [pointsList, setPointsList] = useState();    
    const [questList, setQuestList] = useState();   

    /** Popup variables **/ 
    const [deleteShown, setDeleteShown] = useState(false);   
    const [isAddQuestOpened, setAddQuestOpened] = useState(false);
    const [isMemberListOpened, setMembersListOpened] = useState(false);
    const [isSetUsernameOpened, setSetUsernameOpened] = useState(false);
    const [chatOpened, setChatOpened] = useState(false);      

    /** Other variables **/ 
    const newTaskText = useRef();
    const newTaskPoints = useRef();
    const generalTask = useRef();
    const [newUsername, setNewUsername] = useState("");   
    const [chatHistory, setChatHistory] = useState();   
    const newChatMessage = useRef();  
    const isChatOnBottom = useRef(true);


/** ### Popup windows ### **/  

    const closeAddQuest = () => {
        setAddQuestOpened(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddQuest = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="items-center justify-center flex w-full h-screen bg-black/80">      
            <div  className="popup lg:w-1/3 w-full mx-1 lg:mx-0 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] lg:p-2 pt-1 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="shadowT text-3xl text-white">{t("userpanel.addquest.header")}</a>
                    <button onClick={() => closeAddQuest()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>

                <a className="shadowT text-white text-xl pb-2">{t("userpanel.addquest.questdesc")}</a>
                <input 
                    ref={newTaskText}
                    type="text"
                    className="shadow border border-green-300 rounded-2xl w-4/5 h-11 text-center mb-4" 
                    maxLength="40"
                    placeholder={t("userpanel.addquest.questplaceholder")}>
                </input>

                <a className="shadowT text-white text-xl pb-2">{t("userpanel.addquest.points")}</a>
                <input 
                    ref={newTaskPoints}
                    onChange={(e) => setTaskPoints(e.target.value)}
                    type="number" 
                    className="shadow border border-green-300 rounded-2xl w-1/6 h-11 text-center mb-4" 
                    maxLength="2"
                    placeholder="0">
                </input>

                <a className="shadowT text-white text-xl">{t("ownerpanel.addquest.generaltask")}</a>
                <a className="shadowT text-white text-sm pb-2">{t("ownerpanel.addquest.generaltasksubtext")}</a>
                <input 
                    ref={generalTask}
                    type="checkbox" 
                    className="shadow cursor-pointer border border-green-300 rounded-2xl h-10 w-10">
                </input>

                <button onClick={saveNewTask} className="shadow shadowT click border border-white/50 hover:border-white/50 border-2 bg-green-700 hover:bg-green-800 p-4 rounded-2xl text-white/80 m-3">{t("userpanel.addquest.create")}</button>
            </div>      
        </div>
        )
    } 

    const closeMemberList = () => {
        setMembersListOpened(false);
        document.body.classList.remove('overflow-hidden');
    }
    const MembersList = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="popup xl:w-1/2 h-2/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] lg:p-2 pt-1 border">      
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="shadowT text-3xl text-white">{t("userpanel.memberslist.header")}</a><br/>
                    <button onClick={() => closeMemberList()} className="closebtn absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>
                <div className="pt-5 h-full">
                    {allUsersResponse ? <ATList response={allUsersResponse} rankList={rankList}/> : null}
                </div>
            </div>
        </div>
        )
    }

    const SetUsername = props => {
        window.scrollTo(0, 0);
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="popup w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("userpanel.setusername.header")}</a><br/>
                </div>

                <a className="text-white text-xl pb-2">{t("userpanel.setusername.yournick")}</a>
                <input 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)} 
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    placeholder={t("userpanel.setusername.nick")}>
                </input><br/>

                <button onClick={saveNewUsername} className="border border-white/50 border-2 bg-green-700 p-4 rounded-2xl text-white/80 m-3">{t("userpanel.setusername.set")}</button>
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
        <div className="absolute w-full lg:w-2/6 h-screen bg-gray-900">
            <div>
                <div className="w-14 absolute right-2 top-2 cursor-pointer transition duration-500 hover:-translate-x-2">
                    <img src="assets/arrow.png" alt="Arrow" onClick={() => setChatOpened(false)}></img>
                </div>
                <div className="flex justify-center flex-grow">
                    <a className="text-5xl text-white pt-2 pb-4">Chat</a>     
                </div> 
                <div className="bg-white h-0.5 w-full mb-2"></div> 
            </div>
            <div className="h-3/5 md:h-4/5">
                {chatHistory && username ? <ChatMessages chatHistory={chatHistory} username={username} isAdmin={false} setIsOnBottom={setIsChatOnBottom} /> : null}   
             </div>
            <div className=" w-full h-20">
                <div className="bg-white h-0.5 w-full"></div>  
                <div className="flex items-center justify-center gap-2 p-3">  
                    <input onKeyDown={handleKeyPress}  ref={newChatMessage} type="text" className="shadow h-full w-full rounded-lg"></input>
                    <button onClick={() => sendNewMessage()}  className="shadow click h-full w-16 bg-blue-400/80 hover:bg-blue-600/80 rounded-lg items-center justify-center p-1 flex">
                        <img src="assets/send_arrow.png" className="h-3/4 w-3/4"></img>
                    </button>
                </div> 
            </div>
        </div>
        )
    } 


/** ### Data fetching ### **/  

    useEffect(() => {
        fetchBackground();
        fetchLogo();
        fetchPanelData();
        fetchRankList();
        fetchQuestList();
    }, [])
    useEffect(() => {
        if (rankList != undefined) {
            fetchUserProfile();
            fetchAllUsers();
        }   
    }, [rankList]);

    /** Panel data **/ 
    const fetchBackground = async () => {
        const { data } = await supabase.storage
            .from('backgrounds')
            .getPublicUrl('user-bg.png');
        setBackgroundImage(data.publicUrl + "?c=" + Math.random());
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
                setUserResponse(data);
                setUsername(data[0].username);
                setRank(data[0].rank);
                setPlusPoints(data[0].plus);
                setMinusPoints(data[0].minus);
                i18n.changeLanguage(data[0].language)
                if (i18n.language == "sk") {
                  setLanguageIconSource("/assets/en.png")
                }
                else {
                  setLanguageIconSource("/assets/sk.png")
                }

                if (getPermissionLevel(data[0].rank) == 1) {
                    setIsHelper(true);
                }

                if(data[0].username == null) {
                    setSetUsernameOpened(true);
                }
                fetchPointsList();
            }
    }

    const fetchAllUsers = async () => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .order('plus', { ascending: false })
            
            setUsersResponseByPlus(data);

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
    const fetchPointsList = async () => {
        const { data } = await supabase
            .from('points_list')
            .select()
            .order('id', { ascending: true })
            
            if (data) {
                setPointsList(data);
            }
    }  
        
    const fetchQuestList = async () => {
        const { data } = await supabase
            .from('quest_list')
            .select()
            .order('id', { ascending: true })
            
            if (data) {
                setQuestList(data);
            }
    }         

    
/** ### Data pushing ### **/  
        
    const saveNewTask = async () => {
        
        if (newTaskText.current.value && newTaskPoints.current.value && newTaskPoints.current.value.length < 3)
        {
            let taskType = null;
            if (generalTask.current.checked) { taskType = "general_task" }
    
            const { } = await supabase
                .from('quest_list')
                .insert({
                    quest_name: newTaskText.current.value, 
                    points: newTaskPoints.current.value, 
                    assigned: taskType, 
                    creator: username})
    
                closeAddQuest();
                fetchQuestList();
                setTaskText("");
                setTaskPoints("");
                setGeneralTask(false);
        }
    }

    const saveNewUsername = async () => {

        setSetUsernameOpened(false);
        document.body.classList.remove('overflow-hidden');
        const { } = await supabase
            .from('profiles')
            .update({username: newUsername})
            .eq('id', userData.user.id)
            fetchUserProfile();
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
        
        
/** ### Other functions ### **/  

    function RefreshQuests() {
        setDeleteShown(!deleteShown);
        fetchQuestList();
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

    function getPermissionLevel(userRank) {
        var rank = rankList.find(obj => obj.rank == userRank);
        if (rank) {
            return (rank.permissionLevel);
        }
        else {
            return (0)
        }
    }

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
        <div className="h-fit lg:h-screen w-screen bg-no-repeat bg-center bg-fixed bg-cover md:overflow-hidden pb-44 sm:pb-2" style={{ backgroundImage: `url(${backgroundImage})` }}>

            {isAddQuestOpened && <div className="z-10 w-full h-full absolute">
                <AddQuest show={isAddQuestOpened}/>
            </div>}

            {isMemberListOpened && <div className="z-10 w-full h-full absolute">
                <MembersList show={isMemberListOpened}/>
            </div>}

            {isSetUsernameOpened && <div className="z-10 w-full h-full absolute">
                <SetUsername show={isSetUsernameOpened}/>
            </div>}

            {chatOpened && <div className="z-10 w-full h-full absolute bg-black/50">
                <ChatPopup show={chatOpened}/>
            </div>}

            <div className="slidefromtop static w-full">
                
                <div className="flex items-center sm:max-md:items-start justify-evenly sm:justify-between py-2 w-full h-fit"> 
                    <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between lg:w-3/5">
                        <div className="shadowT flex items-center gap-2">
                            <img src={`https://mineskin.eu/helm/${username}`} className="w-20 h-20 rounded-full hidden "></img>
                            <div className="shadow h-12 w-full border-4 border-gray-400 rounded-full bg-white flex items-center hidden sm:relative lg:hidden text-center px-5">
                                <WriteUserRank rank={rank} rankList={rankList} />
                            </div>
                            <div className="rounded-full h-32 w-32 bg-center bg-contain bg-no-repeat hidden lg:block" style={{ backgroundImage: `url(${logo})` }}></div>
                            <a className="text-4xl text-white hidden lg:block" href="https://powacraft.eu/">{panelName}</a>
                            <div className="h-14 flex items-end hidden lg:block">
                                <a className="text-xl text-amber-400">Admin</a>
                            </div>    
                        </div>
                        
                        <div className="h-20 items-center space-x-4 absolute sm:relative" style={{ display: isHelper ? "flex" : "none" }}>
                            <div className="shadow bg-white rounded-full flex justify-center items-center w-44 h-12 border-4 border-gray-400 hidden sm:flex">
                                <a className="text-2xl">{t("userpanel.yourpoints")}:</a>
                            </div>
                            <div className="shadow bg-white rounded-full flex justify-center items-center w-16 h-12 border-4 border-gray-400 hidden sm:flex">
                                <a className="text-green-500 text-2xl">+{plusPoints}</a> 
                            </div>
                            <div className="shadow bg-white rounded-full flex justify-center items-center w-16 h-12 border-4 border-gray-400 hidden sm:flex">
                                <a className="text-red-500 text-2xl">{minusPoints}</a>
                            </div> 
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-5 px-2 sm:pr-8 w-full sm:w-1/2">
                        <div className="flex px-5 items-center border-2 border-white/40 justify-evenly w-full md:w-1/2 rounded-full bg-white/20">
                            <img id="chat" className="w-20 cursor-pointer transition duration-500 hover:-translate-y-1 drop-shadow-lg" src="/assets/chat.png" alt="CHAT" onClick={() => {fetchChatMessages(); setChatOpened(!chatOpened);}} />
                            <img src={languageIconSource} className="w-14 h-14 cursor-pointer rounded-full shadow transition duration-500 hover:-translate-y-1" onClick={changeLanguage}></img>
                        </div>
                        <div className="flex lg:flex-col items-center">
                            <div className="flex gap-5">
                                <img src={`https://mineskin.eu/helm/${username}`} className="shadow w-16 h-16 rounded-full hidden lg:block mb-2"></img>
                                <button className="shadowT text-2xl text-white hover:text-gray-300 text-center hidden lg:block" onClick={handleLogOut}>{t("userpanel.logout")}</button>
                            </div>
                            <div className="flex lg:flex-row-reverse w-full">
                                <div className="shadow h-12 w-full border-4 border-gray-400 rounded-full bg-white flex items-center hidden lg:block text-center">
                                    <WriteUserRank rank={rank} rankList={rankList} />
                                </div>
                                <button className="shadowT text-2xl text-white hover:text-gray-300 text-center lg:hidden" onClick={handleLogOut}>{t("userpanel.logout")}</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="h-20 items-center justify-center space-x-4 sm:absolute" style={{ display: isHelper ? "flex" : "none" }}>
                            <div className="shadow bg-white rounded-full flex justify-center items-center w-44 h-12 border-4 border-gray-400 sm:hidden">
                                <a className="text-2xl">{t("userpanel.yourpoints")}:</a>
                            </div>
                            <div className="shadow bg-white rounded-full flex justify-center items-center w-16 h-12 border-4 border-gray-400 sm:hidden">
                                <a className="text-green-500 text-2xl">+{plusPoints}</a> 
                            </div>
                            <div className="shadow bg-white rounded-full flex justify-center items-center w-16 h-12 border-4 border-gray-400 sm:hidden">
                                <a className="text-red-500 text-2xl">{minusPoints}</a>
                            </div> 
                        </div>
                <div className="pl-5">
                    <a className="shadowT text-6xl text-white">{t("userpanel.welcome")}, {username}</a>
                </div>
                <div className="flex h-screen flex-col lg:flex-row pt-5">
                    {/** Task list **/}
                        <div className="shadow lg:w-full h-1/2 lg:h-4/6 bg-zinc-700/80 rounded-lg flex flex-col mx-2 lg:ml-5">
                            <div className="inline-block flex items-center justify-between p-4">
                                    <button onClick={() => setAddQuestOpened(true)} className="shadow click flex bg-white hover:bg-gray-300 rounded-lg w-28 sm:w-1/5 h-2/3 sm:h-full justify-center items-center px-2">
                                        {t("userpanel.questlist.addquest")}
                                    </button>
                                <div className="text-center px-1">
                                    <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 w-full items-center">
                                        {t("userpanel.questlist.header")}
                                    </a>
                                </div>
                                    <button 
                                        onClick={() => setDeleteShown(!deleteShown)} 
                                        className="shadow click disabled:bg-gray-600/60 disabled:text-white/60 px-2 flex bg-white hover:bg-gray-300 rounded-lg w-28 sm:w-1/5 h-2/3 sm:h-full justify-center items-center" 
                                        disabled = { isHelper }>
                                        {t("userpanel.questlist.remquest")}
                                    </button>
                            </div>
                            <div className="h-0.5 bg-cyan-400 mb-4"></div>
                            <div className="slidefrombottom overflow-auto mb-4">
                                {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()} /> : null}
                            </div>
                        </div>
                        {/** Right side tabs **/}
                    <div className="flex flex-col lg:w-3/4 gap-1 lg:items-end p-2">
                        <div className="shadow flex flex-col bg-zinc-700/80 rounded-lg w-full lg:w-3/5 h-64 lg:h-1/3">
                            <div className="shadow shadowT  justify-center flex bg-lime-800/70 rounded-tl-lg rounded-lg m-2 h-1/4 items-center flex-col">
                                <a className="text-2xl text-white">{t("userpanel.lastpoints.header")}</a>
                                <hr/>
                            </div>
                            {userResponse && pointsList && pointsList[userResponse[0].last_point1] ? 
                                <WriteLastPoints 
                                actionName={i18n.language == "sk" ? pointsList[userResponse[0].last_point1].action_name_sk : pointsList[userResponse[0].last_point1].action_name_en} 
                                points={pointsList[userResponse[0].last_point1].points}/> 
                            : null}

                            {userResponse && pointsList && pointsList[userResponse[0].last_point2] ? 
                                <WriteLastPoints 
                                actionName={i18n.language == "sk" ? pointsList[userResponse[0].last_point2].action_name_sk : pointsList[userResponse[0].last_point2].action_name_en} 
                                points={pointsList[userResponse[0].last_point2].points}/> 
                            : null}

                            {userResponse && pointsList && pointsList[userResponse[0].last_point3] ? 
                                <WriteLastPoints 
                                actionName={i18n.language == "sk" ? pointsList[userResponse[0].last_point3].action_name_sk : pointsList[userResponse[0].last_point3].action_name_en} 
                                points={pointsList[userResponse[0].last_point3].points}/> 
                            : null}                 
                        </div>



                        <div className="shadow flex flex-col bg-zinc-700/80 rounded-lg w-full lg:w-3/5 h-64 lg:h-1/3">
                            <div className="mb-2 h-full">
                                <div className="shadow shadowT justify-center flex lg:pb-2 lg:pt-2 bg-amber-500/40 rounded-lg mb-2 items-center m-2 h-1/4">
                                    <a className="text-2xl text-white">{t("userpanel.besthelpers.header")}</a>
                                    <hr/>
                                </div>
                                {usersResponseByPlus && usersResponseByPlus.length > 0 ? 
                                    <WriteBestHelpers 
                                    username={usersResponseByPlus[0].username} 
                                    plus={usersResponseByPlus[0].plus}/> 
                                : null}

                                {usersResponseByPlus && usersResponseByPlus.length > 1 ? 
                                    <WriteBestHelpers 
                                    username={usersResponseByPlus[1].username} 
                                    plus={usersResponseByPlus[1].plus}/> 
                                : null}

                                {usersResponseByPlus && usersResponseByPlus.length > 2 ? 
                                    <WriteBestHelpers 
                                    username={usersResponseByPlus[2].username} 
                                    plus={usersResponseByPlus[2].plus}/> 
                                : null}     
                            </div>
                            <button className="shadowT text-white hover:text-gray-300 w-full" onClick={() => setMembersListOpened(true)}>{t("userpanel.besthelpers.memberlist")}</button>         
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
