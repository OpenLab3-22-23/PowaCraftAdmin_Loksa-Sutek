import { Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./auth/Auth";
import { useState, useEffect } from 'react';
import { supabase } from "./supabase/supabaseClient";
import LandingPage from "./userpanel/LandingPage";
import OwnerPanel from "./userpanel/OwnerPanel";
import AccountDeletedPage from "./userpanel/AccountDeletedPage";

function App() {
  const { session } = useAuth();
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);
  const [renderedPage, setRenderedPage] = useState(null);

  console.log("SPUSTAM!!");
  console.log(session);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  useEffect(() => {
    if (canRedirect) {
      setRenderedPage(checkSession());
    }
  }, [canRedirect]);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    console.log("fetchujem...");
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', session?.user.id);

      if (data) {
        if (data.length === 0) {
          console.log("DATA X");
          signOut();
          setAccountDeleted(true);
        } else {
          console.log("DATA!");
        }
      }
    } catch (error) {
      console.log('Nastala chyba pri načítaní profilu:', error);
    }
    setCanRedirect(true);
  };

  const signOut = async () => {
    const {} = await supabase.auth.signOut();
  };

  function checkSession() {
    if (!session)
    {
      console.log("LOGIN PAGE REDIRECT");
      return <Navigate to="/login" />;
    }
    else if (accountDeleted)
    {
      console.log("DELETED ACCOUNT REDIRECT");
      return <AccountDeletedPage />;
    }
    else
    {
      console.log("LANDING PAGE REDIRECT");
      if (session.user.id == "d6be1352-f1d8-4ab8-9993-3a62d5431637")
      {
        return <OwnerPanel userData={session} />;
      }
      else
      {
        return <LandingPage userData={session} />;
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canRedirect) {
        setCanRedirect(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [canRedirect]);

  return (
    <div className="w-screen h-screen">
      {renderedPage}
    </div>
  );
}

export default App;
