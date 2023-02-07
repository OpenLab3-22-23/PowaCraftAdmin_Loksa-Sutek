import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./Auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [correct, setCorrect] = useState("");
  const [nick, setNick] = useState("");

  const { signUp, session } = useAuth();
// potrebujem trackovat hodnoty hesla a znovuhesla
// pri zmene hesla a znovu hesla obe hodnoty porovnam a ak su odlisne nastavim flag na false
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try{
      const { error } = await signUp(email, password);  
      if (error) throw error;
    }
    catch(error: any) {
      alert(error.error_description || error.message);
    }
    finally {
    }
  }

  return !session ? (
    <div className="w-screen h-screen flex flex-col justify-center bg-[url('/src/assets/bg.png')]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <img src="src/assets/logo.svg" width="200" height="200" class="rounded-full border-4 border-amber-400"></img>
      <h2 class="text-7xl text-white">Prihlásenie do panelu</h2>
        <h3 class="text-5xl text-amber-400">pre Admin-Team</h3><br/><br/>
        <p class="text-2xl">Nickname</p>
        <input
          id="nick"
          type="text"
          placeholder="Nickname"
          className="w-96 my-2 bg-gray-200 rounded-full"
        />
        <p class="text-2xl">Email</p>
        <input
          id="email"
          type="email"
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-96 my-2 bg-gray-200 rounded-full"
        />
        <p class="text-2xl">Heslo</p>
        <input
          id="password"
          type="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-96 my-2 bg-gray-200 rounded-full "
        />
        <p class="text-2xl">Znovu Heslo</p>
        <input
        id="correct"
        type="password"
        placeholder="*****"
        onChange={(e) => setCorrect(e.target.value)}
        className="w-96 my-2 bg-gray-200 rounded-full"
        />
        <br/>
        <input
          id="submitbtn"
          type="submit"
          value="Registrovať"
          className="w-52 rounded-full bg-green-600/80 px-2 py-1 my-4 text-2xl hover:bg-green-500 disabled:bg-green-600/40 disabled:text-black/40"
          disabled={password != correct || password == ""}
        />
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
}