import "./LandingPage.css";
import { useMediaQuery } from "react-responsive";
import Navbar from "../Common/Navbar";
import { useState } from "react";
import LandingSection from "./LandingSection";
import ReferralsSection from "./ReferralsSection";
import { PropType } from "../../types";
import Footer from "./Footer";

// ------------------------------------------------------------------ //
const LandingPage = ({
  refer,
  org,
  orgCount,
  refCount,
  user,
  Logout,
  retrieveReferrals,
}: PropType) => {
  const isSmall = useMediaQuery({ maxWidth: 600 }); // Example breakpoint for mobile devices
  const bigImage = process.env.PUBLIC_URL + "./footerTag.png";
  const mobileImage = process.env.PUBLIC_URL + "./footerTagResponsive.png";
  const [height, setHeight] = useState(0);

  const navHeight = (height: number) => {
    setHeight(height);
  };

  const contentHeight = `calc(100vh - ${height}px)`;

  return (
    <div className="pt-2">
      <div className="landing-page-top">
        <Navbar navHeight={navHeight} Logout={Logout} />

        {/* Tag Image */}
        <img
          src={isSmall ? mobileImage : bigImage}
          alt="Footer Design"
          className="footer-tag"
        />

        <LandingSection height={contentHeight} />
      </div>
      <ReferralsSection
        retrieveReferrals={retrieveReferrals}
        refer={refer}
        org={org}
        orgCount={orgCount}
        refCount={refCount}
        user={user}
        Logout={Logout}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;
