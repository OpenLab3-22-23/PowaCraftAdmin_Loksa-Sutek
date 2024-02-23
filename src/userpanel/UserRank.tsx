// @ts-nocheck

export default function WriteUserRank({rank, rankList}) {
    if (rankList != null) {    
        let returnTag = "";
        rankList.map((rankFromRankList, index) => {
            if (rank == rankFromRankList.rank)
            {
                returnTag = <a key={index} className={`text-4xl`} style={{ color: rankFromRankList.colour }}>{rank}</a>
            }
        });

        if (returnTag == "") {
            return <a className="text-gray-500 text-xl truncate">DELETED RANK</a>
        }
        else  {
            return returnTag
        }
    }
}