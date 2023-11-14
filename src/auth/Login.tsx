import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "./Auth";
import { useTranslation } from 'react-i18next'


export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [languageIconSource, setLanguageIconSource] = useState("");
  const { signIn, session } = useAuth();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLanguageIcon();
  }, [])

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

  function setLanguageIcon()
  {
    if (i18n.language == "sk")
    {
      setLanguageIconSource("/assets/en.png")
    }
    else
    {
      setLanguageIconSource("/assets/sk.png")
    }
  }

  function changeLanguage()
  {
    if (i18n.language == "sk")
    {
      i18n.changeLanguage("en")
      setLanguageIconSource("/assets/sk.png")
    }
    else
    {
      i18n.changeLanguage("sk")
      setLanguageIconSource("/assets/en.png")
    }
  }
  
  return !session? (
    <div className="w-screen h-screen flex flex-col justify-center bg-[url('/assets/bg.png')] bg-cover bg-no-repeat">
      <div className="absolute top-10 left-10">
        <a className="inline-block flex items-center gap-4" href="https://powacraft.sk/">
          <img src="/assets/arrow.png" className="w-10 h-10"></img>
          <span className="text-white text-4xl">{t("login.back")}</span>
        </a>
      </div>

      <img src={languageIconSource} className="w-14 h-14 absolute top-10 right-10 cursor-pointer" onClick={changeLanguage}></img>

      <form onSubmit={handleLogIn} className="flex flex-col items-center">
      <img src="/assets/logo.svg" width="200" height="200" className="rounded-full border-4 border-amber-400"></img>
        <h2 className="text-5xl lg:text-7xl text-white text-center">{t("login.header")}</h2>
        <h3 className="text-3xl lg:text-5xl text-amber-400">{t("login.subheader")}</h3><br/><br/>
  
        <p className="text-2xl text-white">{t("login.email")}</p>
        <input
          id="email"
          type="email"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-80 lg:w-96 bg-gray-200 rounded-full"
        />
        <p className="text-2xl text-white">{t("login.password")}</p>
        <input
          id="password"
          type="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-80 lg:w-96 my-2 bg-gray-200 rounded-full"   
        />        

       
        <br/>
        <input
          type="submit"
          value={t("login.login")}
          className="w-52 rounded-full bg-green-600/80 px-2 py-1 my-4 text-2xl hover:bg-green-400/80"
        />
        <Link to="/signup" className="text-white hover:text-gray-300 text-xl">{t("login.register")}</Link>
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
}
