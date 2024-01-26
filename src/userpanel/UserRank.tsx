// @ts-nocheck

export default function WriteUserRank({rank, rankList})
{
    if (rankList != null)
    {
        const result = rankList.map((rankFromRankList, index) => {
            if (rank == rankFromRankList.rank)
            {
                return <a key={index} className={`text-4xl`} style={{ color: rankFromRankList.colour }}>{rank}</a>
            }
        });
        return result.length > 0 ? result : <a className="text-gray-500 text-4xl">UNKNOWN</a>;
    }
}