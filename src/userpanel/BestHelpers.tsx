// @ts-nocheck

export default function WriteBestHelpers({username, plus}) {
        
    return(
        <div className="w-full flex inline-block pb-2">
            <div className="box-content h-3 w-8/12 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
                <a className="text-xl">{username}</a>
            </div>
            <div className="box-content h-3 w-1/6 p-4 bg-white rounded-lg mx-2 items-center justify-center flex">
            <a className="text-2xl text-green-600">+{plus}</a>
            </div>
        </div>
    )
}