import { useState, useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { supabase } from "../supabase/supabaseClient";

import WriteUserRank from "./UserRank";
import WriteLastPoints from "./LastPoints";
import WriteBestHelpers from "./BestHelpers";
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
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .order('plus', { ascending: false })
            
            if (data) {
                setUsersResponse(data);
            }
        }
        
    const fetchPointsList = async () => {
        const { data, error } = await supabase
            .from('points_list')
            .select()
            .order('id', { ascending: true })
            
            if (data) {
                setPointsList(data);
            }
        }  
        
    const fetchQuestList = async () => {
        const { data, error } = await supabase
            .from('quest_list')
            .select()
            
            if (data) {
                setQuestList(data);
            }
        }         
        



    //** Other functions **/

    function ATListButton(){
        const [isOpen, setIsOpen] = useState(false);
            return (
                <div>
                <button className="absolute right-5" onClick={() => setIsOpen(true)}>
                    Celý zoznam členov AT
                </button>

            {isOpen && (
                <div className="h-full w-full bg-white">
                    <div>
                        Content of the popup.
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                    Close popup
                    </button>
                </div>
            )}
            </div>
            );
    }

    //** HTML **/

    return (
        <div className="h-full w-full bg-[url('/src/assets/bg.png')]">

            <div className="flex items-center">
                
                <div className="flex items-center w-8/12 ">
                    <img src="src/assets/logo.svg" width="150" height="150" className="rounded-full" alt="obrazok"></img>
                    <a className="text-4xl text-white">PowaCraft</a>
                    <div className="h-14 flex items-end">
                        <a className="text-xl text-amber-400">Admin</a>
                    </div>
                </div>

                <div className=" place-content-end flex h-20 items-center space-x-6 mr-12">
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
                    <div className="place-content-end flex justify-end items-stretch right-10 pr-10">
                        <button className="text-2xl text-white text-center pr-3"flex-end onClick={handleLogOut}>Odhlásiť</button>
                        <div className="flex w-5"></div>
                        <img src="src/assets/steve.png" className="w-20 h-20 rounded-full"></img>
                    </div>

                    <div className="place-content-end flex justify-end pr-10 pt-2">
                        <WriteUserRank rank={rank} />
                    </div>
                </div>

            </div>



            <div className="pl-5">
                <a className="text-7xl text-white">Vitaj, {username}</a>
            </div>


            <div className="flex-col absolute right-10 w-1/4">

                <div className="box-content bg-zinc-700/80 rounded-lg mb-6 p-2">

                    <div className="justify-center flex pb-2 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2">
                        <a className="text-2xl text-white">Tvoje posledné body</a>
                        <hr/>
                    </div>

                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point1].action_name} points={pointsList[userResponse[0].last_point1].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point2].action_name} points={pointsList[userResponse[0].last_point2].points}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionName={pointsList[userResponse[0].last_point3].action_name} points={pointsList[userResponse[0].last_point3].points}/> : null}                 

                </div>



                <div className="box-content bg-zinc-700/80 rounded-lg mb-10 p-2 pb-7">

                    <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-lg mb-2">
                        <a className="text-2xl text-white">Najlepší helperi</a>
                        <hr/>
                    </div>

                    {allUsersResponse ? <WriteBestHelpers username = {allUsersResponse[0].username} plus = {allUsersResponse[0].plus}/> : null}
                    {allUsersResponse ? <WriteBestHelpers username = {allUsersResponse[1].username} plus = {allUsersResponse[1].plus}/> : null}
                    {allUsersResponse ? <WriteBestHelpers username = {allUsersResponse[2].username} plus = {allUsersResponse[2].plus}/> : null}
                    <ATListButton />
                </div>
            </div>




            <div className="pl-5 mt-8">
                <div className="h-1/2 w-3/6 bg-zinc-700/80 rounded-lg">

                    <div className="inline-block flex items-center justify-between p-2">
                        <div>
                            <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center  flex">
                                Zmazať úlohu
                            </div>
                        </div>

                        <div>
                            <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">Zoznam úloh</a>
                        </div>

                        <div>
                            <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center  flex">
                                Pridať úlohu
                            </div>
                        </div>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>

                    {questList ? <WriteQuests questList = {questList} /> : null}

                </div>
            </div>
        </div>
    )
}
