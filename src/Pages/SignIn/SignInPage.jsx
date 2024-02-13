import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";
import img1 from "../../assets/SignIn.jpg";
import Footer from "../../Components/Footer/Footer";
import { Row, Col, Container, Form, Button, Image } from "react-bootstrap";

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

  return authenticated ? children : null;
}

function SignInPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <Container fluid>
        <Row className="justify-content-center align-items-center">
          <Col sm={12} md={4} className="signInForm">
            <SignInForm />
          </Col>
          <Col md={1}></Col>
          <Col sm={12} md={4}>
            <Image src={img1} alt="SignIn" className="image_sign" fluid />
          </Col>
        </Row>
      </Container>
      <div className="footer_div">
        <Footer />
      </div>
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
    <Form className="signin-form">
      <h2 className="signIn_text">Sign In!</h2>
      {error && <p className="error">{error}</p>}
      <Form.Group controlId="formBasicUsername">
        <Form.Label className="form-label">Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label className="form-label" >Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <div className="checkbox-forgot">
        <Form.Check type="checkbox" label="Remember me" className="form-label"/>
        <div>
          <a href="#" className="form-label">Forgot Password?</a>
        </div>
      </div>
      <Button className="sign_btn" onClick={handleSignIn}>
        Sign In
      </Button>
    </Form>
  );
}

export default SignInPage;
