// @ts-nocheck

import WriteUserRank from "./UserRank";

export default function OwnerATList({response, addPlusPoint, addMinusPoint, changeRank}) {
        

    return (
        <div>
          {response.map((user, index) => (
            <div key={index} className="w- flex inline-block pb-5 items-center justify-center">
              {(user.rank === "Akademik" || user.rank === "Helper") && (
                <button
                  onClick={() => addPlusPoint(user.id)}
                  className="box-content h-4 w-max p-4 bg-gray-600 border-slate-500 border-2 text-green-600 text-2xl rounded-lg mx-6 items-center flex">+</button>
              )}
      

              {user.rank === "Akademik" || user.rank === "Helper" ? (
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
      
      
              {user.rank === "Akademik" || user.rank === "Helper" ? (
                <button 
                  onClick={() => changeRank(user.id)}
                  className="items-center flex bg-gray-800 border-slate-500 border-2 rounded-2xl box-content h-12 justify-center w-1/5 mx-2">
                  <div className="mx-6 text-2xl">
                    <WriteUserRank rank={user.rank} />
                  </div>
                </button>
              ) : user.rank === "Majiteľ" ? (
              <div className="items-center flex bg-white border-2 border-yellow-600 rounded-2xl box-content h-12 justify-center w-1/3 mx-2">
                <div className="mx-6 text-2xl">
                  <WriteUserRank rank={user.rank} />
                </div>
              </div>  
              ) : (
                <button
                  onClick={() => changeRank(user.id)}
                  className="items-center flex bg-gray-800 border-slate-500 border-2 rounded-2xl box-content h-12 justify-center w-1/3 mx-2">
                  <div className="mx-6 text-2xl">
                    <WriteUserRank rank={user.rank} />
                  </div>
                </button>
              )}
      

              {(user.rank === "Akademik" || user.rank === "Helper") && (
                <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-1/12 mx-2">
                  <div className="mx-6">
                    <a className="text-green-600 text-2xl">+{user.plus}</a>
                  </div>
                </div>
              )}
      
              {(user.rank === "Akademik" || user.rank === "Helper") && (
                <div className="items-center flex bg-white rounded-2xl box-content h-12 justify-center w-1/12 mx-2">
                  <div className="mx-6">
                    <a className="text-red-600 text-2xl">-{user.minus}</a>
                  </div>
                </div>
              )}
      
      
              {(user.rank === "Akademik" || user.rank === "Helper") && (
                <button
                  onClick={() => addMinusPoint(user.id)}
                  className="box-content h-4 w-max p-4 bg-gray-600 border-slate-500 border-2 text-red-600 text-2xl rounded-lg mx-6 items-center flex justify-center">-</button>
              )}
            </div>
          ))}
        </div>
      );
      
}