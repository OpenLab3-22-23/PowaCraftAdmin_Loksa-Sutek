
import { useAuth } from "../auth/Auth";

export default function AccountDeletedPage( ): JSX.Element {


    const {signOut} = useAuth()

    function handleLogOut(): void {
        signOut();
    }

    //** HTML **/

    return (
        <div>
            <div>
                <a className="text-2xl">Tvoj účet bol zmazaný, bol si vyhodený z AT!</a>
            </div>
            <br/>
            <button className="text-4xl text-center pr-3" onClick={handleLogOut}>Odhlásiť</button>
        </div>
    )
}
