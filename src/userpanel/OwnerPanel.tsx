// @ts-nocheck

import { useState, useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";

import WriteUserRank from "./UserRank";
import OwnerATList from "./OwnerATList";
import ATList from "./ATList";
import WriteQuests from "./Quests";


export default function OwnerPanel( {userData} ): JSX.Element {

    const {signOut} = useAuth()

    const handleLogOut = () => {
        signOut();
    };

    const [rank, setRank] = useState("");

    const [allUsersResponse, setUsersResponse] = useState();
    const [questList, setQuestList] = useState();   

    const [newTaskText, setTaskText] = useState("");    
    const [newTaskPoints, setTaskPoints] = useState("");   
    const [newMailText, setNewMailText] = useState("");    
    const [nickToDelete, setNickToDelete] = useState("");         

    const [deleteShown, setDeleteShown] = useState(false);   
    const [addQuestShown, setAddQuestVisibility] = useState(false);
    const [addAccountShown, setAddAccountVisibility] = useState(false);
    const [delAccountShown, setDelAccountVisibility] = useState(false); 


    const AddQuest = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/public/assets/popup_background.png')] p-2 border"> 

                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">Pridanie úlohy</a><br/>
                    <button onClick={() => setAddQuestVisibility(false)} className="absolute right-1 text-white text-4xl">X</button>
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

    const AddAccount = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col absolute w-full h-full bg-black/80">      
            <div className="w-1/3 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/public/assets/popup_background.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">Pridanie účtu</a><br/>
                    <button onClick={() => setAddAccountVisibility(false)} className="absolute right-1 text-white text-4xl">X</button>
                </div>

                <a className="text-white text-xl pb-2">E-Mail používateľa</a>
                <input 
                    value={newMailText}
                    onChange={(e) => setNewMailText(e.target.value)} 
                    type="email"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    maxlength="40"
                    placeholder="email@gmail.com"
                    autoFocus>
                </input><br/>

                <button onClick={addNewMail} className="border border-white/50 border-2 bg-green-700 p-4 rounded-2xl text-white/80 m-3">PRIDAŤ</button>
            </div>      
        </div>
        )
    } 

    const DeleteAccount = props => {
        if (!props.show) {
            return null;
        }
        return (
        <div className="box-content items-center justify-center flex flex-col w-full h-full bg-black/80">      
            <div className="w-1/2 h-5/6 rounded-2xl flex flex-col items-center bg-repeat bg-[url('/public/assets/popup_background.png')] p-2 border"> 
                <div className="inline-block flex relative w-full justify-center pb-5">
                    <a className="text-3xl text-white">Zmazanie účtu</a><br/>
                    <button onClick={() => setDelAccountVisibility(false)} className="absolute right-1 text-white text-4xl">X</button>
                </div>

                <div className="flex h-3/5">
                    {allUsersResponse ? <ATList response={allUsersResponse}/> : null}
                </div>

                <a className="text-white text-xl pb-2 pt-8">Meno používateľa, ktorého chceš vymazať</a>
                <input 
                    value={nickToDelete}
                    onChange={(e) => setNickToDelete(e.target.value)} 
                    type="text"
                    className="border border-green-300 rounded-2xl w-4/5 h-11 text-center" 
                    maxlength="40"
                    placeholder="Nick"
                    autoFocus>
                </input><br/>

                <button onClick={delAccount} className="border border-white/50 border-2 bg-red-600 p-4 rounded-2xl text-white/80 m-3">ZMAZAŤ</button>
            </div>      
        </div>
        )
    } 


    //** Data fetching **/

    useEffect(() => {
        fetchUserProfile();
        fetchAllUsers();
        fetchQuestList();
    }, [])

    const fetchUserProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .eq('id', userData.user.id)

            if (data) {
                setRank(data[0].rank);
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
    
    function RefreshPoints()
    {
        fetchAllUsers();
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
            setAddQuestVisibility(false);
            fetchQuestList();
            setTaskText("");
            setTaskPoints("");
        }

    const addNewMail = async () => {
        const { error } = await supabase
            .from('allowed_mails')
            .insert({mail: newMailText })

            if (error) {
                console.log("ERROR");
            }
            setAddAccountVisibility(false);
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
        }   

    

    //** HTML **/

    return (
        <div className="h-full w-full bg-[url('/assets/owner-bg.png')] bg-cover bg-no-repeat">

            {addQuestShown && <div className="z-10 w-full h-full absolute">
                <AddQuest show={addQuestShown}/>
            </div>}
            
            {addAccountShown && <div className="z-10 w-full h-full absolute">
                <AddAccount show={addAccountShown}/>
            </div>}

            {delAccountShown && <div className="z-10 w-full h-full absolute">
                <DeleteAccount show={delAccountShown}/>
            </div>}

            <div className="flex items-center">
                
                <div className="flex items-center w-full ">
                    <img src="/assets/logo.svg" width="150" height="150" className="rounded-full" alt="obrazok"></img>
                    <a className="text-4xl text-white">PowaCraft</a>
                    <div className="h-14 flex items-end">
                        <a className="text-xl text-amber-400">Admin</a>
                    </div>
                </div>


                <div>
                    <div className="flex justify-end items-stretch right-10 pr-10">
                        <button className="text-2xl text-white text-center pr-3"flex-end onClick={handleLogOut}>Odhlásiť</button>
                        <div className="flex w-5"></div>
                        <img src="/assets/steve.png" className="w-20 h-20 rounded-full"></img>
                    </div>

                    <div className="flex justify-end pr-10 pt-2">
                        <div className="text-4xl"><WriteUserRank rank={rank} /></div>
                    </div>
                </div>
            </div>
        
        <div className="flex w-full h-3/4 gap-7">
                <div className="bg-zinc-700/80 rounded-lg flex flex-col ml-5 w-full">

                    <div className="inline-block flex items-center justify-between p-2 flex">
                        <div>
                            <button onClick={() => setAddQuestVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 border-slate-500 border-2 text-white rounded-lg mx-2 items-center flex">
                                Pridať úlohu
                            </button>
                        </div>                     

                        <div className="flex justify-center">
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600 text-center">Zoznam úloh</a>
                        </div>

                        <div>
                            <button onClick={() => setDeleteShown(!deleteShown)} className="box-content h-4 w-8/12 p-4 bg-gray-600 border-slate-500 border-2 text-white rounded-lg mx-2 items-center flex">
                                Zmazať úlohu
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>
                    <div className="h-full overflow-auto mb-4">
                        {questList ? <WriteQuests questList={questList} deleteShown={deleteShown} onDelete={RefreshQuests}/> : null}
                    </div>
                </div>

                    <div className="bg-zinc-700/80 rounded-lg flex flex-col justify-self-end mr-5 w-full">
                        <div className="inline-block flex items-center justify-center p-2">
                            <div>
                                <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">Zoznam členov AT</a>
                            </div>
                        </div>

                        <div className="h-0.5 bg-cyan-400 mb-4 "></div>

                        <div className="h-full w-full overflow-auto">
                            {allUsersResponse ? <OwnerATList response={allUsersResponse} onRefresh={RefreshPoints}/> : null}
                        </div>
                        <div className="flex inline-block pb-5 mt-5 w-full px-4 gap-4">
                            <button onClick={() => setAddAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center">Pridať účet</button>
                            <button onClick={() => setDelAccountVisibility(true)} className="box-content h-4 w-8/12 p-4 bg-gray-600 border-slate-500 border-2 text-white rounded-lg items-center flex justify-center">Zmazať účet</button>
                        </div>
                    </div>
                    </div>
                </div>
    )
}
