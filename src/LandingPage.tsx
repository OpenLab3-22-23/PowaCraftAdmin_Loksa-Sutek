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
    let [response, setResponse] = useState();



    //** Fetching data **/
    useEffect(() => {
        fetchUserProfile();
        fetchAllUsers();
    }, [])

    const fetchUserProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', userData.user.id)

            if (data) {
                setUsername(data[0].username);
                if (data[0].prefix == null)
                {
                    createDefaultData();
                }
                else
                {
                    setPrefix(data[0].prefix);
                    setPlusPoints(data[0].plus);
                    setMinusPoints(data[0].minus);
                }
            }
        }

    const fetchAllUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .order('plus', { ascending: false })
            
            if (data) {
                setResponse(data);
            }
        }



    const createDefaultData = async () => {
        const { error } = await supabase
            .from('profiles')
            .update({prefix: "Akademik", plus: 0, minus: 0})
            .eq('id', userData.user.id)

            if (error) {
                console.log("ERROR");
            }
        }




    //** Other functions **/
    function WriteBestHelpers({userNumber}) {

        return(
                <div className="w-full flex inline-block pb-2">
                    <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                        <a className="text-xl">{response[userNumber].username}</a>
                    </div>
                    <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-2xl text-green-600">+{response[userNumber].plus}</a>
                    </div>
                </div>
        )}
    
    function MyButton(){
        function popup() {
            alert('u clicked me');
        }
            return (
                <button className="absolute right-5" onClick={popup}>
                    Click me
                </button>
            );
    }


    //** HTML **/
    return (
        <div className="h-full w-full bg-[url('/src/assets/bg.png')]">
            <div className="flex items-center pl-5 w-full ">
                <div className="flex items-center w-8/12 ">
                    <img src="src/assets/logo.svg" width="150" height="150" className="rounded-full" alt="obrazok"></img>
                    <a className="text-4xl text-white">PowaCraft</a>
                    <div className="h-14 flex items-end">
                        <a className="text-xl text-amber-400">Admin</a>
                    </div>
                </div>
                <div className=" place-content-end flex w-2/12 h-20 items-center space-x-6">
                    <div className="bg-white rounded-full flex justify-center items-center w-52 h-14 ">
                        <a className="text-2xl">Tvoje body:</a>
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-green-500 text-2xl">{plusPoints}</a> 
                    </div>
                    <div className="bg-white rounded-full flex justify-center items-center w-16 h-14">
                        <a className="text-red-500 text-2xl">{minusPoints}</a>
                    </div>    
                </div>
                <div className="place-content-end flex justify-end w-2/12 h-20 items-stretch right-10 pr-10">
                    <button className="text-2xl text-white text-center"flex-end onClick={handleLogOut}>Odhl??si??</button>
                    <div className="flex w-5"></div>
                    <img src="src/assets/steve.png" className="w-20 h-20 rounded-full"></img>
                </div>
            </div>

            <div className="flex-col absolute right-20">
                <a className="text-4xl text-cyan-600">{prefix}</a>
            </div>



            <div className="pb-6 pl-5">
                <a className="text-7xl text-white">Vitaj, {username}</a>
            </div>


            <div className="flex-col absolute right-10 w-96">

                <div className="box-content bg-zinc-700/80 rounded-lg mb-10 p-2 pb-7">

                    <div className="justify-center flex pb-3 pt-2 bg-lime-800/70 rounded-tl-lg rounded-tr-lg mb-2">
                        <a className="text-2xl text-white">Tvoje posledn?? body</a>
                        <hr/>
                    </div>
                    <div className="sticky">
                        <div className="w-full flex items-center pb-2">
                            <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                                <a className="text-xl">Pomoc hr????ovi</a>
                            </div>
                            <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                                <a className="text-2xl text-green-600">+1</a>
                            </div>
                        </div>

                        <div className="w-full flex items-center pb-2">
                            <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                                <a className="text-xl">Nahl??senie hr????a</a>
                            </div>
                            <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                                <a className="text-2xl text-green-600">+2</a>
                            </div>
                        </div>

                        <div className="w-full flex items-center">
                            <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                                <a className="text-xl">Poru??enie pravidiel</a>
                            </div>
                            <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                                <a className="text-2xl text-red-600">-1</a>
                            </div>
                        </div>

                        </div>
                    </div>



                <div className="box-content bg-zinc-700/80 rounded-lg mb-10 p-2 pb-7" id="leaderboard">

                        <div className="justify-center flex pb-3 pt-2 bg-amber-500/40 rounded-lg mb-2">
                            <a className="text-2xl text-white">Najlep???? helperi</a>
                            <hr/>
                        </div>

                    {response ? <WriteBestHelpers userNumber = {0}/> : null}
                    {response ? <WriteBestHelpers userNumber = {1}/> : null}
                    {response ? <WriteBestHelpers userNumber = {2}/> : null}  
                    <MyButton></MyButton>
                </div>
            </div>
















            <div className="flex items-center pl-5">
                <div className="box-content h-1/2 w-3/6 bg-zinc-700/80 rounded-lg">

                    <div className="justify-center flex pb-3 pt-2">
                        <a className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-600">Zoznam ??loh</a>
                        <hr/>
                    </div>

                    <div className="h-0.5 bg-cyan-400 mb-4"></div>

                    <div>
                        <div className="w-full flex inline-block pb-5">
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a className="text-2xl">1.</a>
                            </div>
                            <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a className="text-2xl text-white">Testovacia ??loha1</a>
                                </div>
                            </div>
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a className="text-green-600 text-2xl">+2</a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex inline-block pb-5">
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a className="text-2xl">2.</a>
                            </div>
                            <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a className="text-2xl text-white">Testovacia ??loha2</a>
                                </div>
                            </div>
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a className="text-green-600 text-2xl">+1</a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex inline-block pb-5">
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a className="text-2xl">3.</a>
                            </div>
                            <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a className="text-2xl text-white">Testovacia ??loha3</a>
                                </div>
                            </div>
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a className="text-green-600 text-2xl">+1</a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex inline-block pb-5">
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a className="text-2xl">4.</a>
                            </div>
                            <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a className="text-2xl text-white">Testovacia ??loha4</a>
                                </div>
                            </div>
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a className="text-green-600 text-2xl">+3</a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex inline-block pb-5">
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a className="text-2xl">5.</a>
                            </div>
                            <div className="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a className="text-2xl text-white">Testovacia ??loha5</a>
                                </div>
                            </div>
                            <div className="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a className="text-green-600 text-2xl">+2</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
