import openlab from "./assets/openlab.svg";
import { useAuth } from "./auth/Auth";

export default function LandingPage(): JSX.Element {

    const {signOut} = useAuth()

    function handleLogOut(): void {
        signOut();
    }

    return (
        <div className="h-full w-full flex justify-center items-center flex-col">
            <img src={openlab} alt="Logo OpenLab" className="w-80"/>
            <button onClick={handleLogOut}>Odhlásiť sa</button>
        </div>
    )
}