// @ts-nocheck

export default function WriteUserRank({rank})
{
    switch (rank)
    {
        case "Majiteľ":
            return <a className="text-blue-700">{rank}</a>
        case "Developer":
            return <a className="text-red-700">{rank}</a>            
        case "Hl.Admin":
            return <a className="text-lime-600">{rank}</a>           
        case "Hl.Builder":
            return <a className="text-violet-700">{rank}</a>         
        case "Admin":
            return <a className="text-lime-600">{rank}</a>               
        case "Builder":
            return <a className="text-violet-700">{rank}</a>       
        case "Hl.Helper":
            return <a className="text-yellow-600">{rank}</a>            
        case "Helper":
            return <a className="text-yellow-600">{rank}</a>            
        case "Akademik":
            return <a className="text-cyan-600">{rank}</a>                                                                     
    }
}