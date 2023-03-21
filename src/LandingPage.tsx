import { useState, useEffect } from "react";
import { useAuth } from "./auth/Auth";
import { supabase } from "./supabase/supabaseClient";


export default function LandingPage( {userData} ): JSX.Element {

    const {signOut} = useAuth()

    function handleLogOut(): void {
        signOut();
    }

    const [username, setUsername] = useState("");
    const [prefix, setPrefix] = useState("");
    const [plusPoints, setPlusPoints] = useState(0);
    const [minusPoints, setMinusPoints] = useState(0);

    const [userResponse, setUserResponse] = useState();
    const [allUsersResponse, setUsersResponse] = useState();
    const [pointsList, setPointsList] = useState();    
    const [questList, setQuestList] = useState();    



    //** Fetching data **/
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
                setPrefix(data[0].prefix);
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
                console.log(data);
            }
        }         
        




    //** Other functions **/

    function WriteLastPoints({actionID}) {

        return(

            <div className="w-full flex inline-block pb-2">
                <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-xl">{pointsList[actionID-1].action_name}</a>
                </div>
                <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-2xl text-green-600">+{pointsList[actionID-1].points}</a>
                </div>
            </div> 
            
        )}    

    function WriteBestHelpers({userNumber}) {
        
        return(
            <div className="w-full flex inline-block pb-2">
                <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-xl">{allUsersResponse[userNumber].username}</a>
                </div>
                <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                <a className="text-2xl text-green-600">+{allUsersResponse[userNumber].plus}</a>
                </div>
            </div>
        )}

        
    function WriteQuests() {

        return(
            <div>
            {
                questList.map((quest, index) => 

                <div className="w-full flex inline-block pb-5">
                    <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                        <a className="text-2xl">{++index}.</a> 
                    </div>
                    <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                        <div>
                            <a className="text-2xl text-white">{quest.quest_name}</a>
                        </div>
                    </div>
                    <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                        <div>
                            <a className="text-green-600 text-2xl">+{quest.points}</a>
                        </div>
                    </div>
                </div>
            )}
            </div>
        )}    
    
    function ATListButton(){
        function popup() {
            alert('u clicked me');
        }
            return (
                <button className="absolute right-5" onClick={popup}>
                    Celý zoznam členov AT
                </button>
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
                        <a className="text-4xl text-cyan-600">{prefix}</a>
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

                    {pointsList && userResponse ? <WriteLastPoints actionID = {userResponse[0].last_point1}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionID = {userResponse[0].last_point2}/> : null}
                    {pointsList && userResponse ? <WriteLastPoints actionID = {userResponse[0].last_point3}/> : null}                    

                </div>



                <div className="box-content bg-zinc-700/80 rounded-lg mb-10 p-2 pb-7">

                    <div className="justify-center flex pb-2 pt-2 bg-amber-500/40 rounded-lg mb-2">
                        <a className="text-2xl text-white">Najlepší helperi</a>
                        <hr/>
                    </div>

                    {allUsersResponse ? <WriteBestHelpers userNumber = {0}/> : null}
                    {allUsersResponse ? <WriteBestHelpers userNumber = {1}/> : null}
                    {allUsersResponse ? <WriteBestHelpers userNumber = {2}/> : null}  
                    <ATListButton />
                </div>
            </div>




            <div className="flex items-center pl-5 mt-8">
                <div className="box-content h-1/2 w-3/6 bg-zinc-700/80 rounded-lg">

                    <div className="justify-center flex pb-3 pt-2">
                        <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">Zoznam úloh</a>
                        <hr/>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>

                    {questList ? <WriteQuests /> : null}

                </div>
            </div>
        </div>
    )
}
