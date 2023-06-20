import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import LandingPage from "./components/LandingPage/LandingPage";
import Organisation from "./components/OrgPage/Organisation";
import Register from "./components/Registration/Register";
import CustomPage from "./components/YourOwnPage/CustomPage";

import {
  OrganisationDataService,
  ReferralDataService,
} from "./services/referrals";
import { referralType, organisationType } from "./types";
import { useCookies } from "react-cookie";
const organisationDataService = new OrganisationDataService();
const referralDataService = new ReferralDataService();

function App() {
  const [referrals, setReferrals] = useState<referralType[] | never[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [userReferrals, setUserReferrals] = useState<referralType[] | never[]>(
    []
  );
  const [userReferralCount, setUserReferralCount] = useState(0);
  const [organisations, setOrganisations] = useState<
    organisationType[] | never[]
  >([]);
  const [user, setUser] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const Logout = () => {
    removeCookie("token");
    console.log("hi");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const checkAuth = async () => {
    console.log("Starting auth...");
    if (!cookies.token) {
      console.log("No cookies.token found.");
      return;
    }
    console.log("Trying auth service...");
    referralDataService
      .auth()
      .then((response) => {
        console.log(response.data);
        const { status, user } = response.data;
        if (status) {
          setUser(user);
        } else {
          Logout();
        }
      })
      .catch((e) => {
        console.log(e);
        Logout();
      });
  };

  useEffect(() => {
    setTimeout(checkAuth, 1000);
  }, [cookies.token]);

  const retrieveReferrals = () => {
    setTimeout(() => {
      referralDataService.getAll().then((response) => {
        setReferrals(response.data.referrals);
        setReferralCount(response.data.total_results);
      });
    }, 1000); // Delayed by 1 second
  };
  useEffect(() => {
    const retrieveOrganisations = () => {
      setTimeout(() => {
        organisationDataService.getAll().then((response) => {
          setOrganisations(response.data.organisations);
        });
      }, 500); // Delayed by 0.5 second
    };

    retrieveOrganisations();
    retrieveReferrals();
  }, []);

  useEffect(() => {
    const retrieveReferrals = () => {
      if (user) {
        referralDataService.find(user, "userId").then((response) => {
          setUserReferrals(response.data.referrals);
          setUserReferralCount(response.data.total_results);
        });
      } else {
        setUserReferrals([]);
      }
    };

    retrieveReferrals();
  }, [user]);

  return (
    <div className="App">
      <head>
        <title>referr</title>
        <link rel="icon" type="image/png" href="/referrals_logo_final.png" />
      </head>
      <Router>
        {/* React Router */}
        <Routes>
          <Route
            path={"/"}
            element={
              <LandingPage
                refer={referrals}
                org={organisations}
                refCount={referralCount}
                user={user}
                Logout={Logout}
                retrieveReferrals={retrieveReferrals}
              />
            }
          />
          <Route
            path="/login"
            element={<Login user={user} Logout={Logout} setUser={setUser} />}
          />
          <Route
            path="organisation/:name"
            element={
              <Organisation
                user={user}
                org={organisations}
                Logout={Logout}
                retrieveReferrals={retrieveReferrals}
              />
            }
          />
          <Route path="register/:name" element={<Register Logout={Logout} />} />
          <Route
            path="user/:name"
            element={
              <CustomPage
                org={organisations}
                userReferral={userReferrals}
                userReferralCount={userReferralCount}
                user={user}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
