// @ts-nocheck

import WriteUserRank from "./UserRank";

export default function ATList({response, rankList}) {

    function getPermissionLevel(userRank) {
        var rank = rankList.find(obj => obj.rank == userRank);
        if (rank) {
          return (rank.permissionLevel);
        }
        else {
          return (0)
        }
    }

    return(
        <div className="overflow-auto h-5/6 w-full mr-2">         
        {
            response.map((user, index) => 

            <div key={index} className="w-full flex inline-block pb-5 items-center justify-center overflow-hidden space-x-2">

                <div className="items-center border-2 border-gray-600 justify-center flex bg-white rounded-2xl box-content h-12 w-12">
                        <a className="text-2xl">{++index}.</a> 
                </div>

                <div className="items-center lg:justify-center border-2 border-gray-600 flex bg-white rounded-2xl box-content h-12 lg:w-56 w-32 truncate overflow-hidden pl-2 pr-8">
                        <a className="text-2xl text-black">{user.username}</a>
                </div> 

                <div className="invisible absolute border-2 border-gray-600 lg:visible lg:static items-center justify-center flex bg-white rounded-2xl box-content h-12 w-44 overflow-hidden">   
                    <WriteUserRank rank={user.rank} rankList={rankList} />
                </div>

                {(getPermissionLevel(user.rank) == 1) ? (

                    <div className="inline-block flex">
                        <div className="items-center justify-center border-2 border-gray-600 flex bg-white rounded-2xl box-content h-12 w-14 overflow-hidden">
                                <a className="text-green-600 text-2xl">+{user.plus}</a>
                        </div>

                        <div className="invisible absolute border-2 border-gray-600 lg:visible lg:static items-center justify-center flex bg-white rounded-2xl box-content h-12 w-14 overflow-hidden ml-2">
                                <a className="text-red-600 text-2xl">{user.minus}</a>
                        </div>  
                    </div>
                ) : (
                    <div className="items-center justify-center border-2 border-gray-600 flex bg-white rounded-2xl box-content h-12 md:w-32 w-14 overflow-hidden">
                            <a className="text-yellow-600 text-2xl">-</a>
                    </div>
                )} 

            </div>
        )}
        </div>
    )
}
