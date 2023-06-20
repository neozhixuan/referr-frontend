import { useState } from "react";
import { Link } from "react-router-dom";
type propType = {
  height: string;
};
const LandingSection = ({ height }: propType) => {
  const [inputText, setInputText] = useState("");
  return (
    <div
      className="landing-section d-flex flex-column justify-content-start gap-3"
      style={{ height: height }}
    >
      <p className="landing-section-header text-left">
        Share your{" "}
        <span className="highlighted-text">referrals/promo codes</span> and
        start earning
      </p>
      {/* <p className="landing-section-text">
        Create your own link to share all your referrals in one link - you and
        your friends can both earn with ease!
      </p> */}
      <div className="d-flex">
        <input
          className="landing-input"
          type="text"
          autoFocus={true}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Link
          to={"/register/" + inputText}
          className="btn btn-dark rounded-lg create-button "
        >
          {" "}
          Create your referrals link
        </Link>
      </div>
      <a
        className="mt-4 btn"
        style={{ fontFamily: "Gotham Italic", textAlign: "left" }}
        href="#referrals"
      >
        Else, check out all the discount codes created by the community below...
      </a>
    </div>
  );
};

export default LandingSection;
