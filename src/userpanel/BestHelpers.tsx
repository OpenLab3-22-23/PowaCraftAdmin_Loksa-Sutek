// @ts-nocheck

export default function WriteBestHelpers({username, plus}) {
        
    return(
        <div className="w-full flex inline-block pb-2 px-2 gap-2 h-1/4 justify-center items-center">
            <div className="flex bg-white rounded-lg w-full h-full justify-center items-center">
                <a className="text-xl">{username}</a>
            </div>
            <div className="flex bg-white rounded-lg px-2 w-1/5 h-full justify-center items-center">
            <a className="text-2xl text-green-600">+{plus}</a>
            </div>
        </div>
    )
}