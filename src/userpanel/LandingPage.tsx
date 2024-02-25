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

    /** Other variables **/ 
    const newTaskText = useRef();
    const newTaskPoints = useRef();
    const generalTask = useRef();
    const [newUsername, setNewUsername] = useState("");      


/** ### Popup windows ### **/  

    const closeAddQuest = () => {
        setAddQuestOpened(false);
        document.body.classList.remove('overflow-hidden');
    }
    const AddQuest = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="items-center justify-center flex w-full h-screen bg-black/80">      
            <div className="lg:w-1/3 w-full mx-1 lg:mx-0 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] md:p-2 pt-1 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("userpanel.addquest.header")}</a>
                    <button onClick={() => closeAddQuest()} className="absolute right-1 text-white text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("userpanel.addquest.questdesc")}</a>
                <input 
                    ref={newTaskText}
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center mb-4" 
                    maxLength="40"
                    placeholder={t("userpanel.addquest.questplaceholder")}>
                </input>

                <a className="text-white text-xl pb-2">{t("userpanel.addquest.points")}</a>
                <input 
                    ref={newTaskPoints}
                    onChange={(e) => setTaskPoints(e.target.value)}
                    type="number" 
                    className="border border-green-300 rounded-2xl w-1/6 h-11 text-center mb-4" 
                    maxLength="2"
                    placeholder="0">
                </input>

                <a className="text-white text-xl">{t("ownerpanel.addquest.generaltask")}</a>
                <a className="text-white text-sm pb-2">{t("ownerpanel.addquest.generaltasksubtext")}</a>
                <input 
                    ref={generalTask}
                    type="checkbox" 
                    className="border border-green-300 rounded-2xl h-10 w-10">
                </input>

                <button onClick={saveNewTask} className="border border-white/50 border-2 bg-green-700 p-4 rounded-2xl text-white/80 m-3">{t("userpanel.addquest.create")}</button>
            </div>      
        </div>
        )
    } 

    const closeMemberList = () => {
        setMembersListOpened(false);
        document.body.classList.remove('overflow-hidden');
    }
    const MembersList = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="xl:w-1/2 h-2/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] md:p-2 pt-1 border">      
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("userpanel.memberslist.header")}</a><br/>
                    <button onClick={() => closeMemberList()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>
                <div className="pt-5 h-full">
                    {allUsersResponse ? <ATList response={allUsersResponse} rankList={rankList}/> : null}
                </div>
            </div>
        </div>
        )
    }

    const SetUsername = props => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.classList.add('overflow-hidden');
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-screen bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] p-2 border"> 

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


/** ### Data fetching ### **/  

    useEffect(() => {
        fetchBackground();
        fetchLogo();
        fetchPanelData();
        fetchRankList();
        fetchPointsList();
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


/** ### PC HTML ### **/ 
    return (
        <div className="h-max lg:h-screen w-screen bg-repeat bg-fixed overflow-hidden" style={{ backgroundImage: `url(${backgroundImage})` }}>

            {isAddQuestOpened && <div className="z-10 w-full h-full absolute">
                <AddQuest show={isAddQuestOpened}/>
            </div>}

            {isMemberListOpened && <div className="z-10 w-full h-full absolute">
                <MembersList show={isMemberListOpened}/>
            </div>}

            {isSetUsernameOpened && <div className="z-10 w-full h-full absolute">
                <SetUsername show={isSetUsernameOpened}/>
            </div>}

            <div className="invisible absolute w-0 lg:visible lg:static lg:w-full">
                
                <div className="flex items-center justify-between"> 
                    <div className="flex items-center">
                        <div className="rounded-full h-32 lg:w-32 w-0 bg-center bg-contain m-2 bg-no-repeat" style={{ backgroundImage: `url(${logo})` }}></div>
                        <a className="text-4xl text-white" href="https://powacraft.sk/">{panelName}</a>
                        <div className="h-14 flex items-end">
                            <a className="text-xl text-amber-400">Admin</a>
                        </div>
                    </div>
                <div className="flex items-center absolute lg:static">
                    <div className=" h-20 items-center space-x-6 mr-12 pr-6" style={{ display: isHelper ? "flex" : "none" }}>
                        <div className="bg-white rounded-full flex justify-center items-center w-48 h-12 border-4 border-gray-400">
                            <a className="text-2xl">{t("userpanel.yourpoints")}:</a>
                        </div>
                        <div className="bg-white rounded-full flex justify-center items-center w-16 h-12 border-4 border-gray-400">
                            <a className="text-green-500 text-2xl">+{plusPoints}</a> 
                        </div>
                        <div className="bg-white rounded-full flex justify-center items-center w-16 h-12 border-4 border-gray-400">
                            <a className="text-red-500 text-2xl">-{minusPoints}</a>
                        </div> 
                        <img src={languageIconSource} className="w-14 h-14 cursor-pointer" onClick={changeLanguage}></img>   
                    </div>

                    <div className="inline-block">
                        <div className="flex justify-end items-stretch m-2">
                            <button className="text-2xl text-white hover:text-gray-300 text-center pr-3" onClick={handleLogOut}>{t("userpanel.logout")}</button>
                            <div className="flex w-5"></div>
                            <img src={`https://mineskin.eu/helm/${username}`} className="w-20 h-20 rounded-full truncate"></img>
                        </div>

                        <div className="flex justify-end pr-5 pt-2">
                            <div className="h-12 w-full border-4 border-gray-400 rounded-full px-2 bg-white flex items-center justify-center">
                                <WriteUserRank rank={rank} rankList={rankList} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div className="pl-5">
                    <a className="text-7xl text-white">{t("userpanel.welcome")}, {username}</a>
                </div>
                <div className="flex h-screen">
                    {/** Task list **/}
                        <div className="lg:w-full h-3/5 bg-zinc-700/80 rounded-lg flex flex-col ml-5 mt-5 w-0">
                            <div className="inline-block flex items-center justify-between p-4">
                                <div className="flex bg-white hover:bg-gray-300 rounded-lg w-1/5 h-full justify-center">
                                    <button onClick={() => setAddQuestOpened(true)} className="box-content w-full h-full">
                                        {t("userpanel.questlist.addquest")}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 w-full items-center">
                                        {t("userpanel.questlist.header")}
                                    </a>
                                </div>
                                <div className="flex bg-white hover:bg-gray-300 rounded-lg w-1/5 h-full justify-center">
                                    <button 
                                        onClick={() => setDeleteShown(!deleteShown)} 
                                        className="box-content w-full h-full disabled:bg-gray-600/60 disabled:text-white/60" 
                                        disabled = { isHelper }>
                                        {t("userpanel.questlist.remquest")}
                                    </button>
                                </div>
                            </div>
                            <div className="h-0.5 bg-cyan-400 mb-4"></div>
                            <div className="overflow-auto mb-4">
                                {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()} /> : null}
                            </div>
                        </div>
                <div className="flex grid grid-cols-1 grid-rows-2 h-max w-full gap-1 px-5 py-5">
                    {/** Right side tabs **/}
                    <div className="box-content bg-zinc-700/80 rounded-lg p-2 w-3/5 justify-self-end">
                        <div className="justify-center flex pb-2 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2 items-center flex-col">
                            <a className="text-2xl text-white">{t("userpanel.lastpoints.header")}</a>
                            <hr/>
                        </div>
                        {userResponse && pointsList[userResponse[0].last_point1] ? 
                            <WriteLastPoints 
                            actionName={pointsList[userResponse[0].last_point1].action_name} 
                            points={pointsList[userResponse[0].last_point1].points}/> 
                        : null}

                        {userResponse && pointsList[userResponse[0].last_point2] ? 
                            <WriteLastPoints 
                            actionName={pointsList[userResponse[0].last_point2].action_name} 
                            points={pointsList[userResponse[0].last_point2].points}/> 
                        : null}

                        {userResponse && pointsList[userResponse[0].last_point3] ? 
                            <WriteLastPoints 
                            actionName={pointsList[userResponse[0].last_point3].action_name} 
                            points={pointsList[userResponse[0].last_point3].points}/> 
                        : null}                 
                    </div>
                    <div className="box-content bg-zinc-700/80 rounded-lg p-2 row-start-2 w-3/5 h-full justify-self-end flex flex-col">
                        <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-lg mb-2  items-center">
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
                        <div className="flex w-full justify-center">
                            <button className="text-white hover:text-gray-300 w-full" onClick={() => setMembersListOpened(true)}>{t("userpanel.besthelpers.memberlist")}</button>     
                        </div>     
                    </div>
                    </div>
                </div>
            </div>


{/** ### MOBILE HTML ### **/}
            <div className="visible static lg:invisible lg:fixed pb-10 h-full">
                    <div className="flex content-center justify-between pt-1 px-1 w-full">
                        <div className="flex">
                            <img src={`https://mineskin.eu/helm/${username}`} className="w-16 h-16 rounded-full"></img>
                            <div className="self-center ml-1 border-4 border-gray-400 rounded-full px-5 bg-gray-100"><WriteUserRank rank={rank} rankList={rankList} /></div>
                        </div>
                        <div className="flex">
                            <button className="text-2xl text-white hover:text-gray-300 text-center"onClick={handleLogOut}>{t("userpanel.logout")}</button>
                        </div>
                    </div>

                    <div className="pl-2 pb-4">
                        <div className="flex">
                            <a className="text-6xl text-white">{t("userpanel.welcome")},</a>
                        </div>
                        <div>
                            <a className="text-7xl text-white truncate">{username}</a>
                        </div>
                    </div>
                
                <div className="pr-3 pl-3 space-y-3 ">
                    {/** Task list **/}
                        <div className="w-full h-1/2 bg-zinc-700/80 rounded-lg flex flex-col">
                            <div className="inline-block flex items-center justify-between p-4">
                                <div className="flex bg-white hover:bg-gray-300 rounded-lg w-24 h-full justify-center">
                                    <button onClick={() => setAddQuestOpened(true)} className="box-content w-full h-16">
                                        {t("userpanel.questlist.addquest")}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 w-full">
                                        {t("userpanel.questlist.header")}
                                    </a>
                                </div>
                                <div className="flex bg-white hover:bg-gray-300 rounded-lg w-24 h-full justify-center">
                                    <button 
                                        onClick={() => setDeleteShown(!deleteShown)} 
                                        className="box-content w-full h-16 disabled:bg-gray-600/60 disabled:text-white/60" 
                                        disabled = { isHelper }>
                                        {t("userpanel.questlist.remquest")}
                                    </button>
                                </div>
                            </div>
                            <div className="h-0.5 bg-cyan-400 mb-4"></div>
                            <div className="mb-4 overflow-auto">
                                {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()} /> : null}
                            </div>
                        </div>
                    
                    {/** Right side tabs **/}
                    <div className="box-content bg-zinc-700/80 rounded-lg h-64">
                        <div className="justify-center flex pb-2 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2 h-1/5 items-center flex-col">
                            <a className="text-2xl text-white">{t("userpanel.lastpoints.header")}</a>
                            <hr/>
                        </div>
                        <div className="h-full pl-5 pr-5">       
                        {userResponse && pointsList[userResponse[0].last_point1] ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point1].action_name} points={pointsList[userResponse[0].last_point1].points}/> : null}
                        {userResponse && pointsList[userResponse[0].last_point2] ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point2].action_name} points={pointsList[userResponse[0].last_point2].points}/> : null}
                        {userResponse && pointsList[userResponse[0].last_point3] ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point3].action_name} points={pointsList[userResponse[0].last_point3].points}/> : null}
                        </div>
                    </div>   
                    <div className="box-content bg-zinc-700/80 rounded-lg h-64 pb-5">

                        <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-tl-lg mb-2 h-1/5 items-center">
                            <a className="text-2xl text-white">{t("userpanel.besthelpers.header")}</a>
                            <hr/>
                        </div>
                        <div className="h-full pl-5 pr-5">
                            {usersResponseByPlus && usersResponseByPlus.length > 0 ? <WriteBestHelpers username={usersResponseByPlus[0].username} plus={usersResponseByPlus[0].plus}/> : null}
                            {usersResponseByPlus && usersResponseByPlus.length > 1 ? <WriteBestHelpers username={usersResponseByPlus[1].username} plus={usersResponseByPlus[1].plus}/> : null}
                            {usersResponseByPlus && usersResponseByPlus.length > 2 ? <WriteBestHelpers username={usersResponseByPlus[2].username} plus={usersResponseByPlus[2].plus}/> : null} 
                            <div className="flex w-full justify-center">
                                <button className="text-white hover:text-gray-300 w-full" onClick={() => setMembersListOpened(true)}>{t("userpanel.besthelpers.memberlist")}</button>     
                            </div> 
                        </div>             
                    </div>
                </div>
            </div>
        </div>
    )
}
