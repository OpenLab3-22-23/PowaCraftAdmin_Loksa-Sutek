import WriteUserRank from "./UserRank";

export default function ATList({response}) {
        
    return(
        <div className=" overflow-auto h-full w-full">
            
        {
            response.map((user, index) => 

            <div className="flex inline-block pb-5 items-center gap-2">
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-16 justify-center">
                    <div className="mx-6">
                    <a className="text-2xl">{++index}.</a> 
                    </div>
                </div>
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-64 justify-center">
                    <div className="mx-6">
                        <a className="text-2xl text-black">{user.username}</a>
                    </div>
                </div>
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-36 justify-center">
                    <div className="mx-6 text-2xl">
                        <WriteUserRank rank={user.rank}/>
                    </div>
                </div>
                <div className="items-center flex bg-white rounded-2xl box-content h-12 w-16 justify-center">
                    <div className="mx-6">
                        <a className="text-green-600 text-2xl">+{user.plus}</a>
                    </div>
                </div>
                <div className="items-center justify-center flex bg-white rounded-2xl box-content h-12 w-16">
                    <div className="mx-7">
                        <a className="text-red-600 text-2xl">-{user.minus}</a>
                    </div>
                </div>
                 
            </div>
        )}
        </div>
    )
}