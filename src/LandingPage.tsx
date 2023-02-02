import openlab from "./assets/openlab.svg";
import { useAuth } from "./auth/Auth";

export default function LandingPage(): JSX.Element {

    const {signOut} = useAuth()

    function handleLogOut(): void {
        signOut();
    }

    return (
        <div className="h-full w-full bg-[url('/src/assets/bg.png')]">
            <div class="flex items-center pl-5">
                <img src="src/assets/logo.svg" width="150" height="150" class="rounded-full" alt="obrazok"></img>
                <a class="text-4xl text-white">PowaCraft</a>
                <a class="text-xl align-bottom text-amber-400">Admin</a>
                <button class="text-2xl absolute right-10 text-white"flex-end onClick={handleLogOut}>Odhlásiť sa</button>
            </div>

            <div class="pb-6 pl-5">
                <a class="text-7xl text-white">Vitaj, NejakyHrac!</a>
            </div>
            <div class="pl-5">
                <div class="box-content h-1/2 w-3/6 bg-zinc-700/80 rounded-lg">

                    <div class="justify-center flex pb-3 pt-2">
                        <a class="text-4xl text-white">Zoznam úloh</a>
                        <hr/>
                    </div>

                    <div class="h-0.5 bg-cyan-400 mb-4"></div>

                    <div>
                        <div class="w-full flex inline-block pb-5">
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a class="text-2xl">1.</a>
                            </div>
                            <div class="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a class="text-2xl text-white">Testovacia úloha1</a>
                                </div>
                            </div>
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a class="text-green-600 text-2xl">+2</a>
                                </div>
                            </div>
                        </div>

                        <div class="w-full flex inline-block pb-5">
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a class="text-2xl">2.</a>
                            </div>
                            <div class="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a class="text-2xl text-white">Testovacia úloha2</a>
                                </div>
                            </div>
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a class="text-green-600 text-2xl">+1</a>
                                </div>
                            </div>
                        </div>

                        <div class="w-full flex inline-block pb-5">
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a class="text-2xl">3.</a>
                            </div>
                            <div class="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a class="text-2xl text-white">Testovacia úloha3</a>
                                </div>
                            </div>
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a class="text-green-600 text-2xl">+1</a>
                                </div>
                            </div>
                        </div>

                        <div class="w-full flex inline-block pb-5">
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a class="text-2xl">4.</a>
                            </div>
                            <div class="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a class="text-2xl text-white">Testovacia úloha4</a>
                                </div>
                            </div>
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a class="text-green-600 text-2xl">+3</a>
                                </div>
                            </div>
                        </div>

                        <div class="w-full flex inline-block pb-5">
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <a class="text-2xl">5.</a>
                            </div>
                            <div class="box-content h-4 w-9/12 p-4 bg-zinc-700/60 rounded-lg items-center flex">
                                <div>
                                    <a class="text-2xl text-white">Testovacia úloha5</a>
                                </div>
                            </div>
                            <div class="box-content h-4 w-1/12 p-4 bg-white rounded-lg mx-8 items-center justify-center flex">
                                <div>
                                    <a class="text-green-600 text-2xl">+2</a>
                                </div>
                            </div>
                        </div>



                    </div>

                </div>
            </div>
        </div>
    )
}