// @ts-nocheck

import WriteUserRank from "./UserRank";

export default function ATList({response}) {
        
    return(
        <div className="overflow-auto h-5/6 w-full md:mr-2">
            
        {
            response.map((user, index) => 

            <div className="w-full flex inline-block pb-5 items-center overflow-hidden space-x-2">

                <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-12">
                    <div>
                        <a className="text-2xl">{++index}.</a> 
                    </div>
                </div>

                <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-56 overflow-hidden">
                    <div>
                        <a className="text-2xl text-black">{user.username}</a>
                    </div>
                </div> 

                <div className="invisible absolute md:visible md:static items-center justify-center flex bg-white rounded-2xl box-content h-12 w-44 overflow-hidden">   
                    <div className="text-2xl">
                        <WriteUserRank rank={user.rank}/>
                    </div>
                </div>

                {(user.rank == "Akademik" || user.rank == "Helper") ? (

                    <div className="inline-block flex space-x-2">
                        <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-14 overflow-hidden">
                            <div className="mx-6">
                                <a className="text-green-600 text-2xl">+{user.plus}</a>
                            </div>
                        </div>

                        <div className="invisible absolute md:visible md:static items-center justify-center flex bg-white rounded-2xl box-content h-12 w-14 overflow-hidden">
                            <div className="mx-7">
                                <a className="text-red-600 text-2xl">-{user.minus}</a>
                            </div>
                        </div>  
                    </div>
                ) : (
                    <div className="invisible absolute md:visible md:static items-center justify-center flex bg-white rounded-2xl box-content h-12 w-32 overflow-hidden">
                        <div>
                            <a className="text-yellow-600 text-2xl">-</a>
                        </div>
                    </div>
                )} 

            </div>
        )}
        </div>
    )
}