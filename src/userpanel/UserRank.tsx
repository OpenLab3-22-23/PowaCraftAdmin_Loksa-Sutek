export default function WriteUserRank({rank})
{
    switch (rank)
    {
        case "Majiteľ":
            return <a className="text-4xl text-blue-700">{rank}</a>
        case "Developer":
            return <a className="text-4xl text-red-700">{rank}</a>            
        case "Hl.Admin":
            return <a className="text-4xl text-lime-600">{rank}</a>           
        case "Hl.Builder":
            return <a className="text-4xl text-violet-700">{rank}</a>         
        case "Admin":
            return <a className="text-4xl text-lime-600">{rank}</a>               
        case "Builder":
            return <a className="text-4xl text-violet-700">{rank}</a>       
        case "Hl.Helper":
            return <a className="text-4xl text-yellow-600">{rank}</a>            
        case "Helper":
            return <a className="text-4xl text-yellow-600">{rank}</a>            
        case "Akademik":
            return <a className="text-4xl text-cyan-600">{rank}</a>                                                                                
    }
}