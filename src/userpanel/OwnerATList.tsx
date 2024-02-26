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
            <div key={index} className="flex inline-block pb-5 items-center justify-center">
              {(getPermissionLevel(user.rank) == 1) && (
                <button
                  onClick={() => addPlusPoint(user.id)}
                  className="box-content h-4 w-max p-4 bg-gray-600 border-slate-500 border-2 text-green-600 text-2xl rounded-lg mx-2 lg:mx-6 items-center flex">+</button>
              )}
      

              {getPermissionLevel(user.rank) == 1 ? (
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-1/4 lg:justify-center mx-1 lg:mx-2">
                  <div className="truncate">
                    <a className="text-2xl text-black pl-2">{user.username}</a>
                  </div>
                </div>
              ) : (
                <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-full ml-2">
                  <div className="mx-2 truncate">
                    <a className="text-2xl text-black ">{user.username}</a>
                  </div>
                </div>
              )}
      
      
              {getPermissionLevel(user.rank) == 1 ? (
                <button 
                  onClick={() => changeRank(user.id)}
                  className="items-center flex bg-gray-800 border-slate-500 border-2 rounded-2xl box-content h-12 lg:justify-center w-full lg:w-2/3 mx-1 lg:mx-2 truncate md:text-clip invisible absolute lg:visible lg:static">
                  <div className="mx-1 lg:mx-6 text-2xl">
                    <WriteUserRank rank={user.rank} rankList={rankList} />
                  </div>
                </button>
              ) : getPermissionLevel(user.rank) == 4 ? (
              <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-1/3 mx-2">
                <div className="mx-1 lg:mx-6 text-2xl">
                  <WriteUserRank rank={user.rank} rankList={rankList} />
                </div>
              </div>  
              ) : (
                <button
                  onClick={() => changeRank(user.id)}
                  className="items-center flex bg-gray-800 border-slate-500 border-2 rounded-2xl box-content h-12 justify-center w-1/3 mx-2 ">
                  <div className="mx-6 text-2xl truncate">
                    <WriteUserRank rank={user.rank} rankList={rankList} />
                  </div>
                </button>
              )}
      

              {(getPermissionLevel(user.rank) == 1) && (
                <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-16 md:w-20 mx-1 lg:mx-2">
                  <div className="mx-6">
                    <a className="text-green-600 text-2xl">+{user.plus}</a>
                  </div>
                </div>
              )}
      
              {(getPermissionLevel(user.rank) == 1) && (
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-12 md:w-16 justify-center mx-1 lg:mx-2">
                  <div className="mx-6">
                    <a className="text-red-600 text-2xl">-{user.minus}</a>
                  </div>
                </div>
              )}
      
      
              {(getPermissionLevel(user.rank) == 1) && (
                <button
                  onClick={() => addMinusPoint(user.id)}
                  className="box-content h-4 w-max p-4 bg-gray-600 border-slate-500 border-2 text-red-600 text-2xl rounded-lg mx-2 lg:mx-6 items-center flex justify-center">-</button>
              )}
            </div>
          ))}
        </div>
      );   
}