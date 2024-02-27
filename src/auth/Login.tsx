import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "./Auth";
import { useTranslation } from 'react-i18next'


export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [logo, setLogo] = useState("");
  const { signIn, session } = useAuth();
  const { t, i18n } = useTranslation();
  

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

  useEffect(() => {
    changeLanguage()
    fetchBackground()
    fetchLogo()
  }, [])

  const fetchBackground = async () => {
    const { data } = await supabase.storage
        .from('backgrounds')
        .getPublicUrl('user-bg.png');
    setBackgroundImage(data.publicUrl + "?c=" + Math.random());
  }

  const fetchLogo = async () => {
    const { data } = await supabase.storage
        .from('images')
        .getPublicUrl('logo.png');
    setLogo(data.publicUrl + "?c=" + Math.random());
  }

  function changeLanguage()
  {
    if (i18n.language == "sk") {
      i18n.changeLanguage("en")
      setLanguage("SK")
    }
    else {
      i18n.changeLanguage("sk")
      setLanguage("EN")
    }
  }
  
  return !session? (
    <div className="w-full h-screen flex flex-col justify-center bg-fixed bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      
      <div className="absolute top-10 left-10">
        <a className="inline-block flex items-center gap-4" href="https://powacraft.eu/">
          <img src="/assets/arrow.png" className="w-10 h-10"></img>
          <span className="text-white text-4xl">{t("login.back")}</span>
        </a>
      </div>

      <a onClick={changeLanguage} className="w-14 h-14 absolute top-10 right-10 text-2xl text-white cursor-pointer" >{language}</a>

      <form onSubmit={handleLogIn} className="flex flex-col items-center">
      <img className="xl:rounded-full xl:border-4 xl:border-amber-400 invisible xl:visible absolute xl:relative bg-contain bg-no-repeat min-h-56 min-w-56" style={{ backgroundImage: `url(${logo})` }}></img>
        <h2 className="text-5xl lg:text-7xl text-white text-center lg:mt-0 mt-32">{t("login.header")}</h2>
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
          className="w-52 rounded-full bg-green-600/80 px-2 py-1 my-4 text-2xl hover:bg-green-400/80 cursor-pointer"
        />
        <Link to="/signup" className="text-white hover:text-gray-300 text-2xl">{t("login.register")}</Link>
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
}
