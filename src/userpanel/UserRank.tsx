// @ts-nocheck

export default function WriteUserRank({rank})
{
    switch (rank)
    {
        case "Majiteľ":
            return <a className="text-blue-700">{rank}</a>
        case "Technik":
            return <a className="text-red-600">{rank}</a>                     
        case "Moderátor":
            return <a className="text-lime-600">{rank}</a>           
        case "Hl. Builder":
            return <a className="text-violet-700">{rank}</a>         
        case "Zákl. Builder":
            return <a className="text-lime-600">{rank}</a>               
        case "Junior Builder":
            return <a className="text-violet-700">{rank}</a>       
        case "Senior Helper":
            return <a className="text-yellow-600">{rank}</a>            
        case "Zákl. Helper":
            return <a className="text-yellow-600">{rank}</a>            
        case "Junior Helper":
            return <a className="text-cyan-600">{rank}</a>                                                                     
    }
}