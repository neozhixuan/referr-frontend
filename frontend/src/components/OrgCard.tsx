import { Link } from "react-router-dom";
import { referralType } from "../types";

const OrgCard = ({
  viewReferralImg,
  viewReferral,
  setCardOpen,
}: {
  viewReferralImg: string;
  viewReferral: referralType;
  setCardOpen: () => void;
}) => {
  return (
    <div className="referral-panel-container" onClick={setCardOpen}>
      <div
        className="referral-panel-content d-flex flex-column bg-black rounded border border-white"
        style={{ color: "whitesmoke" }}
      >
        <div className="card-title d-flex flex-row gap-3 align-items-center mb-3">
          <img
            alt="Shop Logo"
            style={{ width: "30px", height: "30px" }}
            src={viewReferralImg}
          />
          <Link
            className="view-card-title"
            to={`/organisation/${viewReferral.organisation}`}
          >
            {viewReferral.organisation}
          </Link>{" "}
        </div>

        <p>
          <b>Code:</b> <p>{viewReferral.code}</p>
        </p>
        <p>
          <b>Description:</b> <p>{viewReferral.description}</p>
        </p>
        <p>
          <b>Expiry Date:</b>{" "}
          <p>
            {viewReferral.expiryDate
              ? viewReferral.expiryDate?.toLocaleDateString()
              : `Not specified.`}
          </p>
        </p>
        <p>
          <b>URL:</b>{" "}
          <p>
            <a href={`${viewReferral.url}`}>{viewReferral.url}</a>
          </p>
        </p>
        <p className="mt-auto">
          <b>Created at</b> {viewReferral.date.toLocaleDateString()} by{" "}
          <Link to={`/user/${viewReferral.userId}`}>{viewReferral.userId}</Link>
        </p>

        <button className="mt-auto btn btn-dark" onClick={setCardOpen}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrgCard;
