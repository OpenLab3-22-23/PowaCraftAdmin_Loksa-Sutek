import { useState, useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";

import WriteUserRank from "./UserRank";
import WriteLastPoints from "./LastPoints";
import WriteBestHelpers from "./BestHelpers";
import ATList from "./ATList";
import WriteQuests from "./Quests";


export default function LandingPage( {userData} ): JSX.Element {

    const {signOut} = useAuth()

    function handleLogOut(): void {
        signOut();
    }


    const [username, setUsername] = useState("");
    const [rank, setRank] = useState("");
    const [plusPoints, setPlusPoints] = useState(0);
    const [minusPoints, setMinusPoints] = useState(0);

    const [userResponse, setUserResponse] = useState();
    const [allUsersResponse, setUsersResponse] = useState();
    const [pointsList, setPointsList] = useState();    
    const [questList, setQuestList] = useState();   

    const [newTaskText, setTaskText] = useState("");    
    const [newTaskPoints, setTaskPoints] = useState("");   

    const [deleteShown, setDeleteShown] = useState(false);   
    const [isAddQuestOpened, setAddQuestOpened] = useState(false);
    const [isMemberListOpened, setMembersListOpened] = useState(false);


    const AddQuest = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('src/assets/popup_background.png')] p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">Pridanie úlohy</a><br/>
                    <button onClick={() => setAddQuestOpened(false)} className="absolute right-1 text-white text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">Názov úlohy</a>
                <input 
                    value={newTaskText}
                    onChange={(e) => setTaskText(e.target.value)} 
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    maxlength="40"
                    placeholder="Stručný opis úlohy (max. 40 znakov)"
                    autoFocus>
                </input><br/>

                <a className="text-white text-xl pb-2">Počet bodov</a>
                <input 
                    value={newTaskPoints}
                    onInput={(e) => e.target.value = e.target.value.slice(0, 1)}
                    onChange={(e) => setTaskPoints(e.target.value)}
                    type="number" 
                    className="border border-green-300 rounded-2xl w-1/6 h-11 text-center" 
                    placeholder="0">
                </input><br/>

                <button onClick={sendNewTask} className="border border-white/50 border-2 bg-green-700 p-4 rounded-2xl text-white/80 m-3">VYTVORIŤ</button>
            </div>      
        </div>
        )
    } 

    const MembersList = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-screen h-screen bg-black/80">      
            <div className="w-1/2 h-2/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('src/assets/popup_background.png')] p-2 border">      
                <div className="flex relative justify-center items-center w-full my-2">
                        <a className="text-3xl text-white">Členovia AT</a><br/>
                        <button onClick={() => setMembersListOpened(false)} className="absolute right-1 text-white text-4xl">X</button>
                </div>
                <div className="pt-5 h-full">
                        {allUsersResponse ? <ATList response={allUsersResponse}/> : null}
                </div>
            </div>
        </div>
        )
    }


    //** Data fetching **/

    useEffect(() => {
        fetchUserProfile();
        fetchAllUsers();
        fetchPointsList();
        fetchQuestList();
    }, [])

    const fetchUserProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', userData.user.id)

            if (data) {
                setUserResponse(data);
                setUsername(data[0].username);
                setRank(data[0].rank);
                setPlusPoints(data[0].plus);
                setMinusPoints(data[0].minus);
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

                for (let i = 0; i < data.length; i++)
                {
                    for (let x = 0; x < data.length; x++)
                    {
                        if (data[x].rank == GetRankByNumber(i))
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

    function GetRankByNumber(number)
    {
        switch (number)
        {
            case 0:
                return "Majiteľ";
            case 1:
                return "Developer"
            case 2:
                return "Hl.Admin"
            case 3:
                return "Hl.Builder"    
            case 4:
                return "Admin"
            case 5:
                return "Builder" 
            case 6:
                return "Hl.Helper"    
            case 7:
                return "Helper"       
            case 8:
                return "Akademik"                                                    
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
            setShow(false);
            fetchQuestList();
            setTaskText("");
            setTaskPoints("");
        }
        


    //** HTML **/

    return (
        <div className="h-full w-full bg-[url('/src/assets/bg.png')] bg-cover bg-no-repeat">

            {isAddQuestOpened && <div className="z-10 w-full h-full absolute">
                <AddQuest show={isAddQuestOpened}/>
            </div>}
            {isMemberListOpened && <div className="z-10 w-full h-full absolute">
                <MembersList show={isMemberListOpened}/>
            </div>}

            <div className="flex items-center">
                
                <div className="flex items-center w-8/12 ">
                    <img src="src/assets/logo.svg" width="150" height="150" className="rounded-full" alt="obrazok"></img>
                    <a className="text-4xl text-white" href="https://powacraft.sk/">PowaCraft</a>
                    <div className="h-14 flex items-end">
                        <a className="text-xl text-amber-400">Admin</a>
                    </div>
                </div>

                <div className="flex h-20 items-center space-x-6 mr-12">
                    <div className="bg-white rounded-full flex justify-center items-center w-40 h-14 ">
                        <a className="text-2xl">Tvoje body:</a>
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-green-500 text-2xl">+{plusPoints}</a> 
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-red-500 text-2xl">-{minusPoints}</a>
                    </div>    
                </div>

                <div>
                    <div className="flex justify-end items-stretch right-10 pr-10 pt-11">
                        <button className="text-2xl text-white text-center pr-3"flex-end onClick={handleLogOut}>Odhlásiť</button>
                        <div className="flex w-5"></div>
                        <img src="src/assets/steve.png" className="w-20 h-20 rounded-full"></img>
                    </div>

                    <div className="flex justify-end pr-10 pt-2">
                        <a className="text-4xl"><WriteUserRank rank={rank} /></a>
                    </div>
                </div>

            </div>

            <div className="pl-5">
                <a className="text-7xl text-white">Vitaj, {username}</a>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 h-4/6 w-full gap-1 px-5 py-5">

                <div className="box-content bg-zinc-700/80 rounded-lg p-2 col-start-2 w-3/5 justify-self-end">

                    <div className="justify-center flex pb-2 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2 h-1/5 items-center flex flex-col">
                        <a className="text-2xl text-white">Tvoje posledné body</a>
                        <hr/>
                    </div>

                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point1].action_name} points={pointsList[userResponse[0].last_point1].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point2].action_name} points={pointsList[userResponse[0].last_point2].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point3].action_name} points={pointsList[userResponse[0].last_point3].points}/> : null}                 

                </div>

                

                <div className="box-content bg-zinc-700/80 rounded-lg p-2 col-start-2 row-start-2 w-3/5 h-full justify-self-end flex flex-col">

                    <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-lg mb-2 h-1/6 items-center">
                        <a className="text-2xl text-white">Najlepší helperi</a>
                        <hr/>
                    </div>
                    {allUsersResponse ? <WriteBestHelpers username={allUsersResponse[0].username} plus={allUsersResponse[0].plus}/> : null}
                    {allUsersResponse ? <WriteBestHelpers username={allUsersResponse[1].username} plus={allUsersResponse[1].plus}/> : null}
                    {allUsersResponse ? <WriteBestHelpers username={allUsersResponse[2].username} plus={allUsersResponse[2].plus}/> : null} 
                    <div className="flex w-full justify-center">
                    <button className="text-white/80 w-full" onClick={() => setMembersListOpened(true)}>Celý zoznam členov AT</button>     
                    </div>            
                </div>
                



            <div className="row-span-2 col-start-1 row-start-1">
                <div className="h-full w-full bg-zinc-700/80 rounded-lg flex flex-col">

                    <div className="inline-block flex items-center justify-between p-2">
                        <div>
                            <button onClick={() => setAddQuestOpened(true)} className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center flex">
                                Pridať úlohu
                            </button>
                        </div>

                        <div>
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">Zoznam úloh</a>
                        </div>

                        <div>
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center flex">
                                Zmazať úlohu
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="w-full h-full mb-4 overflow-auto">
                    {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests}/> : null}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
