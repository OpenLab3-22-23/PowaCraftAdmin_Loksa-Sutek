import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";
import { supabase } from "../supabase/supabaseClient";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nick, setNick] = useState("");
  const [correct, setCorrect] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);  
  const [allowedMailResponse, setMailResponse] = useState<{ id: number; mail: string }[] | undefined>();

  const { signUp, session } = useAuth();


  useEffect(() => {
    fetchAllowedMails();
}, [])

  const fetchAllowedMails = async () => {
    const { data, error } = await supabase
        .from('allowed_mails')
        .select()
        
        if (data) {
          setMailResponse(data);
        }
    } 

    const deleteMail = async () => {
      const { error } = await supabase
          .from('allowed_mails')
          .delete()
          .eq('mail', email)
          if (error) {
              console.log("ERROR");
          }
      }   


  function checkEmail(currentMail: string)
  {

    if (allowedMailResponse?.some(item => item.mail === currentMail))
    {
      setEmailEnabled(true);
    }
    else
    {
      setEmailEnabled(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try{
      const { error } = await signUp(email, password, nick);  
      if (error) { throw error; }
      else { deleteMail(); }
    }
    catch(error: any) {
      alert(error.error_description || error.message);
    }
    finally {
    }
  }

  return !session ? (
    <div className="w-screen h-screen flex justify-center bg-[url('/assets/bg.png')] bg-cover bg-no-repeat">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <img src="/assets/logo.svg" width="200" height="200" className="rounded-full border-4 border-amber-400 mt-6"></img>
      <h2 className="text-7xl text-white">Registrácia do panelu</h2>
        <h3 className="text-5xl text-amber-400">pre Admin-Team</h3><br/><br/>
    <div className="grid grid-cols-2 gap-36">
      <div className="">
        <p className="text-2xl">Nickname</p>
        <input
          id="nick"
          type="text"
          placeholder="Nickname"
          value={nick}
          onChange={(e) => setNick(e.target.value) }
          className="w-96 my-2 bg-gray-200 rounded-full"
        />
        <p className="text-2xl">Email</p>
        <input
          id="email"
          type="email"
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); checkEmail(e.target.value); }}
          className="w-96 my-2 bg-gray-200 rounded-full"
        />
        </div>
        <div>
        <p className="text-2xl">Heslo</p>
        <input
          id="password"
          type="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-96 my-2 bg-gray-200 rounded-full "
        />
        <p className="text-2xl">Znovu Heslo</p>
        <input
        id="correct"
        type="password"
        placeholder="*****"
        onChange={(e) => setCorrect(e.target.value)}
        className="w-96 my-2 bg-gray-200 rounded-full"
        />
    </div>
        </div>
        <br/>
        <input
          id="submitbtn"
          type="submit"
          value="Registrovať"
          className="w-52 rounded-full bg-green-600/80 px-2 py-1 my-4 text-2xl hover:bg-green-500 disabled:bg-green-600/40 disabled:text-black/40"
          disabled={password != correct || password == "" || !emailEnabled}
        />
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
}