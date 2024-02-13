import { React } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/Header"
import Home from "./Pages/Home/Home";
import Gallery from "./Pages/Gallery/Gallery";
import SignInPage from "./Pages/SignIn/SignInPage";
import AdminPage from "./Pages/Admin/AdminPage";
import NoPage from "./Pages/NoPage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/Gallery" Component={Gallery} />
          <Route path="/SignIn" Component={SignInPage} />
          <Route path="/Admin" Component={AdminPage} />
          <Route path="/*" Component={NoPage} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
