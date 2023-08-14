// @ts-nocheck

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './auth/Auth';
import { supabase } from './supabase/supabaseClient';
import AccountDeletedPage from './userpanel/AccountDeletedPage';
import LandingPage from './userpanel/LandingPage';
import OwnerPanel from './userpanel/OwnerPanel';

function App() {
  const { session } = useAuth();
  const [pageToRender, setPageToRender] = useState('');
  const [allowedMailResponse, setMailResponse] = useState<{ id: number; mail: string }[] | undefined>();

  useEffect(() => {
    if (session) fetchAllowedMails();
  }, [session]);

  useEffect(() => {
    if (allowedMailResponse) getUserData();
  }, [allowedMailResponse]);
  


  const getUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', session?.user.id);
        

      if (data) {
        if (data.length === 0) {
          if (allowedMailResponse?.some(item => item.mail === session.user.email))
          {
            const { error } = await supabase
            .from('profiles')
            .insert({id: session?.user.id})

            if (error) {
                console.log("ERROR");
            }
            else
            {
              const { error } = await supabase
              .from('allowed_mails')
              .delete()
              .eq('mail', session.user.email)
              if (error) {
                  console.log("ERROR");
              }

              setPageToRender('user');
            }
          }
          else
          {
            setPageToRender('banned');
          }
        } else if (data[0].rank == 'Majiteľ' || data[0].rank == 'Senior Helper') {
          setPageToRender('admin');
        } else {
          setPageToRender('user');
        }
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      console.log('Nastala chyba pri načítaní profilu:', error);
    }
  };

  const fetchAllowedMails = async () => {
    const { data, error } = await supabase
        .from('allowed_mails')
        .select()
        
        if (data) {
          setMailResponse(data);
        }
    } 

  function renderPage(pageName: string) {
    if (pageName === 'banned') {
      return <AccountDeletedPage />;
    } else {
      if (pageName === 'admin') {
        return <OwnerPanel userData={session} />;
      } else if (pageName === 'user') {
        return <LandingPage userData={session} />;
      } else {
        return null;
      }
    }
  }

  return (
    <div className='w-screen h-screen'>
      {session ? renderPage(pageToRender) : <Navigate to='/login' />}
    </div>
  );
}

export default App;