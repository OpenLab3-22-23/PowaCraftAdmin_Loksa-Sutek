// @ts-nocheck

import { useState, useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";
import { useTranslation } from 'react-i18next'
import WriteUserRank from "./UserRank";
import WriteLastPoints from "./LastPoints";
import WriteBestHelpers from "./BestHelpers";
import ATList from "./ATList";
import WriteQuests from "./Quests";
import { TypeAnimation } from 'react-type-animation';

export default function LandingPage( {userData} ): JSX.Element {
    document.body.classList.remove('overflow-hidden');
    const {signOut} = useAuth()
    const { t, i18n } = useTranslation();

    function handleLogOut(): void {
        signOut();
    }
    

    const [username, setUsername] = useState("");
    const [rank, setRank] = useState("");
    const [languageIconSource, setLanguageIconSource] = useState("");
    const [plusPoints, setPlusPoints] = useState(0);
    const [minusPoints, setMinusPoints] = useState(0);
    const [isHelper, setIsHelper] = useState(false);   
    const [backgroundImage, setBackgroundImage] = useState();
    const [logo, setLogo] = useState();
    const [panelName, setPanelName] = useState("");
    const [rankList, setRankList] = useState();   

    const [userResponse, setUserResponse] = useState();
    const [allUsersResponse, setUsersResponse] = useState();
    const [usersResponseByPlus, setUsersResponseByPlus] = useState();
    const [pointsList, setPointsList] = useState();    
    const [questList, setQuestList] = useState();   
    const [generalTask, setGeneralTask] = useState(false);  


    const [newTaskText, setTaskText] = useState("");    
    const [newTaskPoints, setTaskPoints] = useState("");
    const [newUsername, setNewUsername] = useState("");      

    const [deleteShown, setDeleteShown] = useState(false);   
    const [isAddQuestOpened, setAddQuestOpened] = useState(false);
    const [isMemberListOpened, setMembersListOpened] = useState(false);
    const [isSetUsernameOpened, setSetUsernameOpened] = useState(false);

    const CloseAddQuest = () => {
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
        <div className="items-center justify-center flex w-screen h-screen bg-black/80">      
            <div className="lg:w-1/3 w-full mx-1 lg:mx-0 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] md:p-2 pt-1 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">{t("userpanel.addquest.header")}</a><br/>
                    <button onClick={() => CloseAddQuest()} className="absolute right-1 text-white text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">{t("userpanel.addquest.questdesc")}</a>
                <input 
                    value={newTaskText}
                    onChange={(e) => setTaskText(e.target.value)} 
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    maxlength="35"
                    placeholder={t("userpanel.addquest.questplaceholder")}>
                </input><br/>

                <a className="text-white text-xl pb-2">{t("userpanel.addquest.points")}</a>
                <input 
                    value={newTaskPoints}
                    onInput={(e) => e.target.value = e.target.value.slice(0, 1)}
                    onChange={(e) => setTaskPoints(e.target.value)}
                    type="number" 
                    className="border border-green-300 rounded-2xl w-1/6 h-11 text-center" 
                    placeholder="0">
                </input><br/>

                <a className="text-white text-xl">{t("ownerpanel.addquest.generaltask")}</a>
                <a className="text-white text-sm pb-2">{t("ownerpanel.addquest.generaltasksubtext")}</a>
                <input 
                    checked={generalTask}
                    type="checkbox" 
                    className="border border-green-300 rounded-2xl h-10 w-10"
                    onChange={(e) => setGeneralTask(e.target.checked)}>
                </input>

                <button onClick={sendNewTask} className="border border-white/50 border-2 bg-green-700 p-4 rounded-2xl text-white/80 m-3">{t("userpanel.addquest.create")}</button>
            </div>      
        </div>
        )
    } 

    const CloseMemberList = () => {
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
        <div className="box-content items-center justify-center flex flex-col absolute w-screen h-screen bg-black/80">      
            <div className="lg:w-1/2 w-full h-2/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/assets/popupbackground.png')] md:p-2 pt-1 border">      
                <div className="inline-block flex relative w-full justify-center pb-5">
                        <a className="text-3xl text-white">{t("userpanel.memberslist.header")}</a><br/>
                        <button onClick={() => CloseMemberList()} className="absolute right-1 text-white hover:text-gray-300 text-4xl">X</button>
                </div>
                <div className="pt-5 h-full">
                        {allUsersResponse ? <ATList response={allUsersResponse} rankList={rankList}/> : null}
                </div>
            </div>
        </div>
        )
    }

    const SetUsername = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
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


    //** Data fetching **/

    useEffect(() => {
        fetchBackground();
        fetchLogo();
        fetchPanelData();
        fetchRankList();
        fetchPointsList();
        fetchQuestList();
    }, [])
    useEffect(() => {
        if (rankList != undefined)
        {
            fetchUserProfile();
            fetchAllUsers();
        }   
    }, [rankList]);

    const fetchBackground = async () => {
        const { data } = await supabase.storage
            .from('backgrounds')
            .getPublicUrl('bg.png');
        setBackgroundImage(data.publicUrl);
    }
    const fetchLogo = async () => {
        const { data } = await supabase.storage
            .from('images')
            .getPublicUrl('logo.svg');
        setLogo(data.publicUrl);
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
            setRankList(data);
    }

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
                if (i18n.language == "sk")
                {
                  setLanguageIconSource("/assets/en.png")
                }
                else
                {
                  setLanguageIconSource("/assets/sk.png")
                }

                if (getPermissionLevel(data[0].rank) == 1)
                {
                    setIsHelper(true);
                }

                if(data[0].username === null)
                {
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

            if (data)
            {
                let accounts = [];

                for (let i = 0; i < rankList.length; i++)
                {
                    for (let x = 0; x < data.length; x++)
                    {
                        if (data[x].rank == rankList[i].rank)
                        {
                            accounts[accounts.length] = data[x]; 
                        }
                    }
                }   
                setUsersResponse(accounts);
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
        
    const fetchQuestList = async () => {
        const { data } = await supabase
            .from('quest_list')
            .select()
            
            if (data) {
                setQuestList(data);
            }
        }         


    //** Other functions **/
    function RefreshQuests()
    {
        setDeleteShown(!deleteShown);
        fetchQuestList();
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

    function getPermissionLevel(userRank)
    {
        var rank = rankList.find(obj => obj.rank == userRank);
        return (rank.permissionLevel);
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
            document.body.classList.remove('overflow-hidden');
            setAddQuestOpened(false);
            fetchQuestList();
            setTaskText("");
            setTaskPoints("");
            setGeneralTask(false);
        }

    const saveNewUsername = async () => {

        setSetUsernameOpened(false);
        console.log(userData.user.id);

        const { error } = await supabase
            .from('profiles')
            .update({username: newUsername})
            .eq('id', userData.user.id)

            if (error) {
                console.log("ERROR");
            }
            fetchUserProfile();
        }    
        


    //** HTML **/

    return (
        <div className="h-max lg:h-screen w-screen bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>

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
            <div className="flex justify-between items-center">
                
                <div className="flex items-center w-8/12 ">
                    <div className="rounded-full h-40 w-40 bg-center bg-contain" style={{ backgroundImage: `url(${logo})` }}></div>
                    <a className="text-4xl text-white" href="https://powacraft.sk/">{panelName}</a>
                    <div className="h-14 flex items-end">
                        <a className="text-xl text-amber-400">Admin</a>
                    </div>
                </div>

                <div className="absolute lg:static h-20 items-center space-x-6 mr-12 " style={{ display: isHelper ? "flex" : "none" }}>
                    <div className="bg-white rounded-full flex justify-center items-center w-40 h-14 ">
                        <a className="text-2xl">{t("userpanel.yourpoints")}:</a>
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-green-500 text-2xl">+{plusPoints}</a> 
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-red-500 text-2xl">-{minusPoints}</a>
                    </div> 
                    <img src={languageIconSource} className="w-14 h-14 cursor-pointer" onClick={changeLanguage}></img>   
                </div>

                <div>
                    <div className="flex justify-end items-stretch pr-10 pt-10">
                        <button className="text-2xl text-white hover:text-gray-300 text-center pr-3" onClick={handleLogOut}>{t("userpanel.logout")}</button>
                        <div className="flex w-5"></div>
                        <img id="drobbox" src={`https://mineskin.eu/helm/${username}`} className="w-20 h-20 rounded-full"></img>
                    </div>

                    <div className="flex justify-end pr-10 pt-2">
                        <a className="text-4xl w-48 border-4 border-gray-400 rounded-full px-2 bg-white text-center"><WriteUserRank rank={rank} rankList={rankList} /></a>
                    </div>
                </div>

            </div>

            <div className="pl-5">
                <a className="text-7xl text-white">{t("userpanel.welcome")},{username}</a>
            </div>

            <div className="flex grid grid-cols-2 grid-rows-2 h-4/6 w-full gap-1 px-5 py-5">

                <div className="box-content bg-zinc-700/80 rounded-lg p-2 col-start-2 w-3/5 justify-self-end">

                    <div className="justify-center flex pb-2 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2 h-1/5 items-center flex-col">
                        <a className="text-2xl text-white">{t("userpanel.lastpoints.header")},{username}</a>
                        <hr/>
                    </div>

                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point1].action_name} points={pointsList[userResponse[0].last_point1].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point2].action_name} points={pointsList[userResponse[0].last_point2].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point3].action_name} points={pointsList[userResponse[0].last_point3].points}/> : null}                 

                </div>

                

                <div className="box-content bg-zinc-700/80 rounded-lg p-2 col-start-2 row-start-2 w-3/5 h-full justify-self-end flex flex-col">

                    <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-lg mb-2 h-1/6 items-center">
                        <a className="text-2xl text-white">{t("userpanel.besthelpers.header")}</a>
                        <hr/>
                    </div>
                    {usersResponseByPlus && usersResponseByPlus.length > 0 ? <WriteBestHelpers username={usersResponseByPlus[0].username} plus={usersResponseByPlus[0].plus}/> : null}
                    {usersResponseByPlus && usersResponseByPlus.length > 1 ? <WriteBestHelpers username={usersResponseByPlus[1].username} plus={usersResponseByPlus[1].plus}/> : null}
                    {usersResponseByPlus && usersResponseByPlus.length > 2 ? <WriteBestHelpers username={usersResponseByPlus[2].username} plus={usersResponseByPlus[2].plus}/> : null} 
                    <div className="flex w-full justify-center">
                    <button className="text-white hover:text-gray-300 w-full" onClick={() => setMembersListOpened(true)}>{t("userpanel.besthelpers.memberlist")}</button>     
                    </div>            
                </div>
                



            <div className="row-span-2 col-start-1 row-start-1">
                <div className="h-full w-full bg-zinc-700/80 rounded-lg flex flex-col">

                    <div className="inline-block flex items-center justify-between p-4">
                        <div className="flex bg-white hover:bg-gray-300 rounded-lg w-1/5 h-full justify-center">
                            <button onClick={() => setAddQuestOpened(true)} className="box-content w-full h-full">
                                {t("userpanel.questlist.addquest")}
                            </button>
                        </div>

                        <div>
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 w-full items-center">
                                {t("userpanel.questlist.header")}
                            </a>
                        </div>

                        <div className="flex bg-white hover:bg-gray-300 rounded-lg w-1/5 h-full justify-center">
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content w-full h-full disabled:bg-gray-600/60 disabled:text-white/60" disabled = { isHelper }>
                                {t("userpanel.questlist.remquest")}
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="w-full h-full mb-4 overflow-auto">
                    {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()} /> : null}
                    </div>
                </div>
            </div>
        </div>
        </div>

{/* MOBILE HTML */}
        <div className="visible static lg:invisible lg:fixed pb-10">
                <div className="flex content-center items-stretch pt-1 px-1 w-full">
                    <div className="flex w-screen">
                        <img src={`https://mineskin.eu/helm/${username}`} className="w-16 h-16 rounded-full"></img>
                        <div className="self-center ml-1 border-4 border-gray-400 rounded-full px-2 bg-gray-100"><WriteUserRank rank={rank} rankList={rankList} /></div>
                    </div>
                    <div className="flex">
                        <button className="text-2xl text-white hover:text-gray-300 text-center"onClick={handleLogOut}>{t("userpanel.logout")}</button>
                    </div>
                </div>


                <div className="h-20 items-center justify-center space-x-3 px-1" style={{ display: isHelper ? "flex" : "none" }}>
                    <div className="bg-white rounded-full flex justify-center items-center w-40 h-14 ">
                        <a className="text-2xl">{t("userpanel.yourpoints")}:</a>
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-green-500 text-2xl">+{plusPoints}</a> 
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-red-500 text-2xl">-{minusPoints}</a>
                    </div> 
                    <img src={languageIconSource} className="w-14 h-14 cursor-pointer" onClick={changeLanguage}></img>
   
                </div>
                <div className="pl-2 pb-4">
                    <div className="flex">
                        <a className="text-7xl text-white">{t("userpanel.welcome")},</a>
                    </div>
                    <div>
                        <a className="text-7xl text-white truncate">{username}</a>
                    </div>
                </div>
            

            <div className="pr-3 pl-3 space-y-3">
                <div className="flex">
                    <div className="h-full w-full bg-zinc-700/80 rounded-lg flex flex-col">

                        <div className="inline-block flex items-center justify-between p-4">
                            <div className="flex bg-white hover:bg-gray-300 rounded-lg w-1/5 h-full justify-center">
                                <button onClick={() => setAddQuestOpened(true)} className="box-content w-full h-full">
                                    {t("userpanel.questlist.addquest")}
                                </button>
                            </div>

                            <div className="text-center">
                                <a className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 w-full">
                                    {t("userpanel.questlist.header")}
                                </a>
                            </div>

                            <div className="flex bg-white hover:bg-gray-300 rounded-lg w-1/5 h-full justify-center">
                                <button onClick={() => setDeleteShown(!deleteShown)} className="box-content w-full h-full disabled:bg-gray-600/60 disabled:text-white/60" disabled = { isHelper }>
                                    {t("userpanel.questlist.remquest")}
                                </button>
                            </div>
                        </div>

                        <div className="h-0.5 bg-cyan-400 mb-4"></div>
                        <div className="w-full h-full mb-4 overflow-auto">
                        {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests} username={username} fetchQuests={() => fetchQuestList()} /> : null}
                        </div>
                    </div>
                </div>
                
                <div className="box-content bg-zinc-700/80 rounded-lg h-64">

                    <div className="justify-center flex pb-2 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2 h-1/5 items-center flex-col">
                        <a className="text-2xl text-white">{t("userpanel.lastpoints.header")}</a>
                        <hr/>
                    </div>
                    <div className="h-full pl-5 pr-5">
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point1].action_name} points={pointsList[userResponse[0].last_point1].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point2].action_name} points={pointsList[userResponse[0].last_point2].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point3].action_name} points={pointsList[userResponse[0].last_point3].points}/> : null}                 
                    </div>

                </div>

                

                <div className="box-content bg-zinc-700/80 rounded-lg h-64 pb-5">

                    <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-lg mb-2 h-1/6 items-center">
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
