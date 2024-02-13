import { useNavigate, redirect } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./SignInPage.css"; // Import your CSS file for styling
import img1 from "../../assets/sign.jpg";
import Footer from "../../Components/Footer/Footer";

// Create a context for managing authentication state
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  const authenticate = (username, password) => {
    const dummyUsername = "admin";
    const dummyPassword = "password";

    if (username === dummyUsername && password === dummyPassword) {
      setAuthenticated(true);
      navigate("/admin");
    } else {
      setAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const { authenticated } = React.useContext(AuthContext);

  return authenticated ? children : <redirect to="/signin" />;
}

function SignInPage() {
  useEffect(() => {
    // This code will run when the component is mounted
    window.scrollTo(0, 0); // Reset scroll position to the top
  }, []);
  return (
    <AuthProvider>
      <div className="container">
        <div className="left-section">
          <SignInForm />
        </div>
        <div className="right-section">
          <img src={img1} alt="SignIn" className="image_sign" />
        </div>
      </div>
      <Footer />
    </AuthProvider>
  );
}

function SignInForm() {
  const { authenticate } = React.useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    authenticate(username, password);
  };

  return (
    <div className="signin-form">
      <p className="signIn_label">Sign In!</p>
      {error && <p className="error">{error}</p>}
      <p className="label">Username</p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <p className="label">Password</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "520px",
        }}
      >
        <div>
          <label>
            <input type="checkbox" /> Remember me
          </label>
        </div>
        <div>
          <a href="#">Forgot Password?</a>
        </div>
      </div>
      <button className="sign_btn" onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
}

export default SignInPage;
