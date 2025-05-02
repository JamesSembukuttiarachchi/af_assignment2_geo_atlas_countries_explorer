import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import CountryDetails from "./pages/country-details";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import { AuthProvider } from "./context/auth-context";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-black">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/country/:countryCode"
                element={<CountryDetails />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
