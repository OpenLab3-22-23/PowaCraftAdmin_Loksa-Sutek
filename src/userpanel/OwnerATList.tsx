import WriteUserRank from "./UserRank";
import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function OwnerATList({response, onRefresh}) {
        
    //const [hasPoints, setHasPoints] = useState(false);    

    const addPoint = async (user) => {
        const { error } = await supabase
        .from('profiles')
        .update({plus: user.plus+1})
        .eq('id', user.id)

        user.plus++;
        onRefresh();
    }

    const removePoint = async (user) => {
        const { error } = await supabase
        .from('profiles')
        .update({minus: user.minus+1})
        .eq('id', user.id)

        user.minus++;
        onRefresh();
    }



    return(
        <div>
        {
            response.map((user) => 

            <div className="w-full flex inline-block pb-5 items-center justify-center">

                {(user.rank == "Akademik" || user.rank == "Helper") &&
                    <button onClick={() => addPoint(user)} className="box-content h-4 w-max p-4 bg-gray-600 border-slate-500 border-2 text-green-600 rounded-lg mx-6 items-center flex ">+1</button>
                }
            
                {(user.rank == "Akademik" || user.rank == "Helper") ? (
                    <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-1/3 mx-2">
                        <div className="mx-6">
                            <a className="text-2xl text-black">{user.username}</a>
                        </div>
                    </div>
                ) : (
                    <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-full mx-2">
                        <div className="mx-6">
                            <a className="text-2xl text-black">{user.username}</a>
                        </div>
                    </div>
                )}


                {(user.rank == "Akademik" || user.rank == "Helper") ? (
                    <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-1/5 mx-2">
                        <div className="mx-6 text-2xl">
                            <WriteUserRank rank={user.rank}/>
                        </div>
                    </div>
                ) : (
                    <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-1/3 mx-2">
                        <div className="mx-6 text-2xl">
                            <WriteUserRank rank={user.rank}/>
                        </div>
                    </div>
                )}


                {(user.rank == "Akademik" || user.rank == "Helper") &&
                    <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-1/12 mx-2">
                        <div className="mx-6">
                            <a className="text-green-600 text-2xl">+{user.plus}</a>
                        </div>
                    </div>
                }

                {(user.rank == "Akademik" || user.rank == "Helper") &&
                    <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-1/12 mx-2">
                        <div className="mx-6">
                            <a className="text-red-600 text-2xl">-{user.minus}</a>
                        </div>
                    </div>
                }

                {(user.rank == "Akademik" || user.rank == "Helper") &&
                    <button onClick={() => removePoint(user)} className="box-content h-4 w-max p-4 bg-gray-600 border-slate-500 border-2 text-red-600 rounded-lg mx-8 items-center flex justify-center">-1</button>
                }

            </div>
        )}
        </div>
    )
}