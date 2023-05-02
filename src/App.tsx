import { Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./auth/Auth";
import LandingPage from "./userpanel/LandingPage";
import OwnerPanel from "./userpanel/OwnerPanel";

function App() {
  const { session } = useAuth();

  return (
  <div className="w-screen h-screen">
    {session ? (
      <OwnerPanel userData={session}/> 
    ) : <Navigate to="/login" />}
  </div>

  );
}

export default App;
