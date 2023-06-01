import WriteUserRank from "./UserRank";

export default function ATList({response}) {
        
    return(
        <div className=" overflow-auto h-full">
            
        {
            response.map((user, index) => 

            <div className="w-full flex inline-block pb-5 items-center">
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-full  ">
                    <div className="mx-6">
                    <a className="text-2xl">{++index}.</a> 
                    </div>
                    <div className="mx-6">
                        <a className="text-2xl text-black">{user.username}</a>
                    </div>
                    <div className="mx-6 text-2xl">
                        <WriteUserRank rank={user.rank}/>
                    </div>
                    <div className="mx-6">
                        <a className="text-green-600 text-2xl">+{user.plus}</a>
                    </div>
                    <div className="mx-7">
                        <a className="text-red-600 text-2xl">-{user.minus}</a>
                    </div>
                </div>    
            </div>
        )}
        </div>
    )
}