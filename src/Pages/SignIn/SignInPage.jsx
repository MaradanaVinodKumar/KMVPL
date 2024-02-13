import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SignInPage.css";
import img1 from "../../assets/SignIn.jpg";
import Footer from "../../Components/Footer/Footer";
import { Row, Col, Container } from "react-bootstrap";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  const authenticate = (username, password) => {
    const dummyUsername = "admin";
    const dummyPassword = "password";

    if (username === dummyUsername && password === dummyPassword) {
      setAuthenticated(true);
      navigate("/admin"); // Navigate to admin page
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

  return authenticated ? children : null; // Render children only if authenticated
}

function SignInPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <Row>
        <Col style={{ marginLeft: "6vh", marginTop: "10vh" }} className="signInForm">
          <SignInForm />
        </Col>
        <Col>
          <img src={img1} alt="SignIn" className="image_sign" />
        </Col>
      </Row>

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
      <div className="checkbox-forgot">
        <label>
          <input type="checkbox" /> Remember me
        </label>
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
