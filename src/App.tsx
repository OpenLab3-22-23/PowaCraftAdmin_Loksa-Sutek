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

  useEffect(() => {
    if (session) getUser();
  }, [session]);

  const getUser = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', session?.user.id);

      if (data) {
        if (data.length === 0) {
          setPageToRender('banned');
        } else if (session.user.id == 'd6be1352-f1d8-4ab8-9993-3a62d5431637') {
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

  function renderPage(pageName: string) {
    if (pageName === 'banned') {
      return <AccountDeletedPage />;
    } else {
      if (pageName === 'admin') {
        return <OwnerPanel userData={session} />;
      } else if (pageName === 'user') {
        return <OwnerPanel userData={session} />;
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