// @ts-nocheck

export default function WriteLastPoints({actionName, points}) {

    if (points > 0) {
        return(

            <div className="w-full flex inline-block pb-2 px-2 gap-2 h-1/4 justify-center items-center">
                <div className="flex bg-white rounded-lg w-full h-full justify-center items-center">
                    <a className="text-xl">{actionName}</a>
                </div>
                <div className="flex bg-white rounded-lg w-1/5 h-full justify-center items-center">
                    <a className="text-2xl text-green-600">+{points}</a>
                </div>
            </div> 
        )
    } else {
        return(

            <div className="w-full flex inline-block pb-2 px-2 gap-2 h-1/4 justify-center items-center">
                <div className="flex bg-white rounded-lg w-full h-full justify-center items-center">
                    <a className="text-xl">{actionName}</a>
                </div>
                <div className="flex bg-white rounded-lg w-1/5 h-full justify-center items-center">
                    <a className="text-2xl text-red-600">{points}</a>
                </div>
            </div> 
        )
    }
}    