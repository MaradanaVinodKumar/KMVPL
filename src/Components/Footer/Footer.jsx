import React from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/footer.png";

function Footer() {
  return (
    <div className="footer_container">
      <Container fluid>
        <div className="stylingCon">
          <div className="fir_div">
            <div className="get_touch_cont">
              <img src={logo} alt="logo" />
            </div>
            <div style={{ marginTop: "74px" }}>
              <p id="p1">@2024 All Rights Reserved</p>
            </div>
          </div>
          <div className="sec_div">
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  <p id="pHead" style={{ fontSize: "34px" }}>
                    Pages
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <NavLink to="/" className="navlink">
                  {" "}
                  <p id="p1">Home</p>
                </NavLink>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <NavLink to="/Gallery" className="navlink">
                  {" "}
                  <p id="p1">Gallery</p>
                </NavLink>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <NavLink to="/SignIn" className="navlink">
                  {" "}
                  <p id="p1">SignIn</p>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="third_div">
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  <p id="pHead" style={{ fontSize: "34px" }}>
                    Legal
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <p id="p1">Terms of Services</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <p id="p1">Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Footer;
