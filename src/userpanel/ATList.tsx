import WriteUserRank from "./UserRank";

export default function ATList({response}) {
        
    return(
        <div className=" overflow-auto h-full w-full">
            
        {
            response.map((user, index) => 

            <div className="w-full flex inline-block pb-5 items-center w-full overflow-hidden">



                <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-12 mx-2">
                    <div className="mx-6">
                        <a className="text-2xl">{++index}.</a> 
                    </div>
                </div>

                <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-56 mx-2 overflow-hidden">
                    <div className="mx-6">
                        <a className="text-2xl text-black">{user.username}</a>
                    </div>
                </div> 

                <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-44 mx-2 overflow-hidden">   
                    <div className="mx-6 text-2xl">
                        <WriteUserRank rank={user.rank}/>
                    </div>
                </div>

                {(user.rank == "Akademik" || user.rank == "Helper") ? (

                    <div className="inline-block flex">
                        <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-14 mx-2 overflow-hidden">
                            <div className="mx-6">
                                <a className="text-green-600 text-2xl">+{user.plus}</a>
                            </div>
                        </div>

                        <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-14 mx-2 overflow-hidden">
                            <div className="mx-7">
                                <a className="text-red-600 text-2xl">-{user.minus}</a>
                            </div>
                        </div>  
                    </div>
                ) : (
                    <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-32 mx-2 overflow-hidden">
                        <div className="mx-6">
                            <a className="text-yellow-600 text-2xl">-</a>
                        </div>
                    </div>
                )} 

            </div>
        )}
        </div>
    )
}