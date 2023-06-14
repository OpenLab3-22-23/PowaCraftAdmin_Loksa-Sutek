import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, session } = useAuth();

  async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
    }
  }

  
  return !session? (
    <div className="w-screen h-screen flex flex-col justify-center bg-[url('/assets/bg.png')] bg-cover bg-no-repeat">

    <a href="/signup">
      Registrácia
    </a>
      <form onSubmit={handleLogIn} className="flex flex-col items-center">
      <img src="/assets/logo.svg" width="200" height="200" className="rounded-full border-4 border-amber-400"></img>
        <h2 className="text-7xl text-white">Prihlásenie do panelu</h2>
        <h3 className="text-5xl text-amber-400">pre Admin-Team</h3><br/><br/>
        <p className="text-2xl">Email</p>
        <input
          id="email"
          type="email"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-96 my-2 bg-gray-200 rounded-full"
        />
        <p className="text-2xl">Heslo</p>
        <input
          id="password"
          type="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-96 my-2 bg-gray-200 rounded-full"
        />
        <br/>
        <input
          type="submit"
          value="Prihlásiť"
          className="w-52 rounded-full bg-green-600/80 px-2 py-1 my-4 text-2xl"
        />
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
}
