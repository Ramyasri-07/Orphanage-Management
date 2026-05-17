import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import DonorAuth from "./pages/DonorAuth";
import OrphanageAuth from "./pages/OrphanageAuth";
import NGOAuth from "./pages/NGOAuth";

import WelcomeDonor from "./pages/WelcomeDonor";
import WelcomeOrphanage from "./pages/WelcomeOrphanage";
import WelcomeNGO from "./pages/WelcomeNGO";

import "./App.css";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/donor-auth"
          element={<DonorAuth />}
        />

        <Route
          path="/orphanage-auth"
          element={<OrphanageAuth />}
        />

        <Route
          path="/ngo-auth"
          element={<NGOAuth />}
        />

        <Route
          path="/welcome-donor"
          element={<WelcomeDonor />}
        />

        <Route
          path="/welcome-orphanage"
          element={<WelcomeOrphanage />}
        />

        <Route
          path="/welcome-ngo"
          element={<WelcomeNGO />}
        />
       

      </Routes>

    </BrowserRouter>
  );
}

export default App;