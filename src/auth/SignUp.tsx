import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "./Auth";
import { supabase } from "../supabase/supabaseClient";
import { useTranslation } from 'react-i18next'


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nick, setNick] = useState("");
  const [correct, setCorrect] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);  
  const [allowedMailResponse, setMailResponse] = useState<{ id: number; mail: string }[] | undefined>();
  const [language, setLanguage] = useState("")
  const { t, i18n } = useTranslation();
  const { signUp, session } = useAuth();


  useEffect(() => {
    fetchAllowedMails();
    setLanguage("SK")
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

    function changeLanguage()
    {
      if (i18n.language == "sk")
      {
        i18n.changeLanguage("en")
        setLanguage("SK")
      }
      else
      {
        i18n.changeLanguage("sk")
        setLanguage("EN")
      }
    }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try{
      const { error } = await signUp(email, password, nick, i18n.language);  
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
    <div className="w-full h-max lg:h-screen flex justify-center bg-[url('/assets/bg.png')] bg-cover bg-fixed bg-no-repeat pb-3">
      <div className="absolute top-10 left-10">
        <Link to="/login" className="inline-block flex items-center gap-4">
          <img src="/assets/arrow.png" className="w-10 h-10"></img>
          <span className="text-white text-4xl">{t("register.back")}</span>
          </Link>
      </div>

      <a className="w-14 h-14 absolute top-10 right-10 cursor-pointer text-2xl text-white" onClick={changeLanguage}>{language}</a>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <img src="/assets/logo.svg" width="200" height="200" className="rounded-full flex border-4 border-amber-400 invisible mt-9 absolute xl:visible xl:static"></img>
      <h2 className="text-5xl lg:text-7xl text-white text-center xl:mt-0 lg:mt-16 mt-32">{t("register.header")}</h2>
        <h3 className="text-3xl lg:text-5xl text-amber-400">{t("register.subheader")}</h3>
    <div className="lg:grid lg:grid-cols-2 gap-36 text-center mt-6">
      <div>
        <p className="text-2xl text-white">{t("register.nick")}</p>
        <input
          id="nick"
          type="text"
          placeholder="Nickname"
          value={nick}
          onChange={(e) => setNick(e.target.value) }
          className="w-80 lg:w-96 my-2 bg-gray-200 rounded-full"
        />
        <p className="text-2xl text-white">{t("register.email")}</p>
        <input
          id="email"
          type="email"
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); checkEmail(e.target.value); }}
          className="w-80 lg:w-96 my-2 bg-gray-200 rounded-full"
        />
        </div>
        <div>
        <p className="text-2xl text-white">{t("register.password")}</p>
        <input
          id="password"
          type="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-80 lg:w-96 my-2 bg-gray-200 rounded-full "
        />
        <p className="text-2xl text-white">{t("register.passwordrepeat")}</p>
        <input
        id="correct"
        type="password"
        placeholder="*****"
        onChange={(e) => setCorrect(e.target.value)}
        className="w-80 lg:w-96 my-2 bg-gray-200 rounded-full"
        />
    </div>
        </div>
        <br/>
        <input
          id="submitbtn"
          type="submit"
          value={t("register.register")}
          className="w-52 rounded-full bg-green-600/80 px-2 py-1 my-3 text-2xl hover:bg-green-400/80 disabled:bg-green-600/40 disabled:text-black/40"
          disabled={password != correct || password == "" || !emailEnabled}
        />
        <Link to="/login" className="text-white hover:text-gray-300 text-2xl mb-3">{t("register.login")}</Link>

        <a className="text-white text-4xl text-center border-4 border-red-700 pb-1 px-2">{t("register.warning")}</a>
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
}