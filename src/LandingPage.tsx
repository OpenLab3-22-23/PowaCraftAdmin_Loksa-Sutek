import { useState, useEffect } from "react";
import { useAuth } from "./auth/Auth";
import { supabase } from "./supabase/supabaseClient";


export default function LandingPage( userData ): JSX.Element {

    const {signOut} = useAuth()

    function handleLogOut(): void {
        signOut();
    }

    const [username, setUsername] = useState("");
    const [prefix, setPrefix] = useState("");    


    useEffect(() => {
        fetchProfile();
        //changeUsername();
    }, [])
    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', userData.userData.user.id)

            if (error) {
                console.log("ERROR");
            }
            if (data) {
                console.log(data);
                setUsername(data[0].username);
                setPrefix(data[0].prefix);
            }
        }
        
    // const changeUsername= async () => {
    //     const { error } = await supabase
    //         .from('profiles')
    //         .update({username: setNick})
    //         .eq('id', userData.userData.user.id)

    //         if (error) {
    //             console.log("ERROR");
    //         }
    //     }
        



    return (
        <div className="h-full w-full bg-[url('/src/assets/bg.png')]">
            <div className="flex items-center pl-5">
                <img src="src/assets/logo.svg" width="150" height="150" className="rounded-full" alt="obrazok"></img>
                <a className="text-4xl text-white">PowaCraft</a>
                <a className="text-xl align-bottom text-amber-400">Admin</a>
                <div className="place-content-end flex absolute right-10 w-52 h-20 items-stretch">
                <button className="text-2xl text-white text-center"flex-end onClick={handleLogOut}>Odhlásiť</button>
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
                        <a className="text-2xl text-white">Tvoje posledné body</a>
                        <hr/>
                    </div>

                    <div className="w-full flex inline-block pb-2">
                        <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-xl">Pomoc hráčovi</a>
                        </div>
                        <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-2xl text-green-600">+1</a>
                        </div>
                    </div>

                    <div className="w-full flex inline-block pb-2">
                        <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-xl">Nahlásenie hráča</a>
                        </div>
                        <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-2xl text-green-600">+2</a>
                        </div>
                    </div>

                    <div className="w-full flex inline-block">
                        <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-xl">Porušenie pravidiel</a>
                        </div>
                        <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-2xl text-red-600">-1</a>
                        </div>
                    </div>
                </div>     


                <div className="box-content bg-zinc-700/80 rounded-lg mb-10 p-2 pb-7">

                    <div className="justify-center flex pb-3 pt-2 bg-amber-500/40 rounded-lg mb-2">
                        <a className="text-2xl text-white">Najlepší helperi</a>
                        <hr/>
                    </div>

                    <div className="w-full flex inline-block pb-2">
                        <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-xl">Hrac1</a>
                        </div>
                        <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-2xl text-green-600">+23</a>
                        </div>
                    </div>

                    <div className="w-full flex inline-block pb-2">
                        <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-xl">Hrac2</a>
                        </div>
                        <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-2xl text-green-600">+16</a>
                        </div>
                    </div>

                    <div className="w-full flex inline-block">
                        <div className="box-content h-4 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-xl">Hrac3</a>
                        </div>
                        <div className="box-content h-4 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                            <a className="text-2xl text-green-600">+9</a>
                        </div>
                    </div>
                </div>       
            </div>   
















            <div className="flex items-center pl-5">
                <div className="box-content h-1/2 w-3/6 bg-zinc-700/80 rounded-lg">

                    <div className="justify-center flex pb-3 pt-2">
                        <a className="text-4xl text-white">Zoznam úloh</a>
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
                                    <a className="text-2xl text-white">Testovacia úloha1</a>
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
                                    <a className="text-2xl text-white">Testovacia úloha2</a>
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
                                    <a className="text-2xl text-white">Testovacia úloha3</a>
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
                                    <a className="text-2xl text-white">Testovacia úloha4</a>
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
                                    <a className="text-2xl text-white">Testovacia úloha5</a>
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
