export default function WriteLastPoints({actionName, points}) {

    if (points > 0)
    {
        return(

            <div className="w-full flex inline-block pb-2">
                <div className="box-content h-3 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-xl">{actionName}</a>
                </div>
                <div className="box-content h-3 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-2xl text-green-600">+{points}</a>
                </div>
            </div> 
        )
    }
    else
    {
        return(

            <div className="w-full flex inline-block pb-2">
                <div className="box-content h-3 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-xl">{actionName}</a>
                </div>
                <div className="box-content h-3 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                    <a className="text-2xl text-red-600">{points}</a>
                </div>
            </div> 
        )
    }
}    