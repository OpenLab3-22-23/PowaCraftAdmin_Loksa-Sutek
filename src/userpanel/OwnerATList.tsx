// @ts-nocheck

import WriteUserRank from "./UserRank";

export default function OwnerATList({response, addPlusPoint, addMinusPoint, changeRank, rankList}) {

    function getPermissionLevel(userRank) {
      var rank = rankList.find(obj => obj.rank == userRank);
      if (rank)
      {
        return (rank.permissionLevel);
      }
      else
      {
        return (0)
      }
    }


    return (
        <div>
          {response.map((user, index) => (
            <div key={index} className="flex inline-block p-2 items-center justify-evenly w-full">
              {(getPermissionLevel(user.rank) == 1) && (
                <button
                  onClick={() => addPlusPoint(user.id)}
                  className="border-2 border-slate-500 shadow click hover:border-slate-400 rounded-lg bg-gray-600 hover:bg-gray-700/60 text-green-600 text-2xl w-16 h-14">+</button>
              )}

              <div className="flex w-full justify-center gap-2 mx-2">

              {getPermissionLevel(user.rank) == 1 ? (
                <div className="items-center flex bg-white border-2 border-gray-400 rounded-2xl box-content h-12 w-full md:w-1/2 justify-center">
                  <div className="truncate">
                    <a className="text-2xl text-black pl-2">{user.username}</a>
                  </div>
                </div>
              ) : (
                <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-full">
                  <div className="truncate">
                    <a className="text-2xl text-black ">{user.username}</a>
                  </div>
                </div>
              )}
      
              {getPermissionLevel(user.rank) == 1 ? (
                <button 
                  onClick={() => changeRank(user.id)}
                  className="border-2 border-slate-500 shadow click hover:border-slate-400 bg-gray-800 hover:bg-gray-900 rounded-2xl px-5 hidden sm:flex">
                  <div className="text-2xl">
                    <WriteUserRank rank={user.rank} rankList={rankList} />
                  </div>
                </button>
              ) : getPermissionLevel(user.rank) == 4 ? (
              <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-1/3">
                <div className="text-2xl">
                  <WriteUserRank rank={user.rank} rankList={rankList} />
                </div>
              </div>  
              ) : (
                <button
                  onClick={() => changeRank(user.id)}
                  className="items-center flex shadow click bg-gray-800 hover:bg-gray-900 border-slate-500 hover:border-slate-400 border-2 rounded-2xl box-content h-12 justify-center w-1/3">
                  <div className="px-2 text-2xl truncate">
                    <WriteUserRank rank={user.rank} rankList={rankList} />
                  </div>
                </button>
              )}
      
              {(getPermissionLevel(user.rank) == 1) && (
                <div className="items-center flex bg-white border-2 border-gray-400 rounded-2xl box-content h-12 justify-center w-fit px-3">
                    <a className="text-green-600 text-2xl">+{user.plus}</a>
                </div>
              )}
      
              {(getPermissionLevel(user.rank) == 1) && (
                <div className="items-center flex bg-white border-2 border-gray-400 rounded-2xl box-content h-12 w-fit justify-center px-4">
                    <a className="text-red-600 text-2xl">{user.minus}</a>
                </div>
              )}
              
              </div>
      
              {(getPermissionLevel(user.rank) == 1) && (
                <button
                  onClick={() => addMinusPoint(user.id)}
                  className="rounded-lg border-2 shadow click border-slate-500 hover:border-slate-400 text-red-600 bg-gray-600 hover:bg-gray-700/60 text-2xl w-16 h-14">-</button>
              )}
            </div>
          ))}
        </div>
      );   
}