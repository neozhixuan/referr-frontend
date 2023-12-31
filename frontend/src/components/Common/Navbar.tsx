import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ReferralDataService } from "../../services/referrals";

import "./Navbar.css";

type navType = {
  navHeight: (height: number) => void;
  Logout: () => void;
};
const referralDataService = new ReferralDataService();

const Navbar = ({ navHeight, Logout }: navType) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const response = await referralDataService.auth();
      const { status, user } = await response.data;
      console.log({ status, user });

      if (status) {
        setAuth(true);
        setUser(user);
      } else {
        console.log("smth wrong leh");
      }
    };
    setTimeout(authenticate, 1000);
  }, [cookies.token]);

  useEffect(() => {
    if (elementRef.current) {
      const height = elementRef.current.clientHeight;
      console.log(height);
      navHeight(height);
    }

    setTimeout(() => setLoad(true), 1000);
  }, []);

  return (
    <nav
      ref={elementRef}
      className="container navbar navbar-expand rounded p-3 d-flex flex-row justify-content-between"
      style={{ height: "72px" }}
    >
      <a href="/" className="d-flex flex-row align-items-center">
        <img
          src={"/referrals_logo_final.png"}
          width={30}
          height={30}
          style={{ marginRight: "20px" }}
          alt={"Logo"}
        />
        <span
          className="navbar-brand ml-5 page-name"
          style={{ textDecoration: "underline", textDecorationColor: "black" }}
        >
          referr.site
        </span>
      </a>
      <div
        className="navbar-nav w-full d-flex flex-row gap-2"
        style={{ maxWidth: "100vw" }}
      >
        <li className="nav-item">
          <a
            href="https://forms.gle/hG6zi9aRJrPLEb327"
            className="nav-link text-black"
          >
            Feedback
          </a>
        </li>
        {load ? (
          <>
            <li className="nav-item">
              <Link to={"/login"} className="nav-link text-black">
                {!auth ? `Login` : user}
              </Link>
            </li>
            {auth && (
              <li className="nav-item">
                <button onClick={Logout} className="nav-link btn text-black">
                  Logout
                </button>
              </li>
            )}
          </>
        ) : (
          <li className="nav-item d-flex justify-content-start">
            <span>Loading...</span>
          </li>
        )}
      </div>
      <li className="nav-item d-flex justify-content-end position-relative">
        <Link
          to={"/register/mylink"}
          className="btn btn-dark position-relative"
        >
          Register
        </Link>
      </li>
    </nav>
  );
};

export default Navbar;
