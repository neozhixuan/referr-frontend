import { Link } from "react-router-dom";
import { referralType } from "../../types";
import { filledApprove, emptyApprove } from "../../utils";
const OrgCard = ({
  viewReferralImg,
  viewReferral,
  setCardOpen,
  handleLikes,
  localLikes,
  user,
  load,
}: {
  viewReferralImg: string;
  viewReferral: referralType;
  setCardOpen: () => void;
  handleLikes: (id: string, includes: boolean) => Promise<void>;
  localLikes: string[];
  load: string[];
  user: string;
}) => {
  return (
    <div className="referral-panel-container">
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
        <div onClick={setCardOpen}>
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
        </div>
        <p className="mt-auto">
          <b>Created at</b> {viewReferral.date.toLocaleDateString()} by{" "}
          <Link to={`/user/${viewReferral.userId}`}>{viewReferral.userId}</Link>
        </p>

        <div className=" d-flex flex-row gap-2 mt-2 w-100">
          <a className={`btn btn-dark w-100`} href={viewReferral.url}>
            Use code
          </a>
          {user !== "" && (
            <button
              className={`btn btn-primary ${
                (user === viewReferral.userId ||
                  load.includes(viewReferral._id)) &&
                `disabled`
              }`}
              onClick={() =>
                handleLikes(
                  viewReferral._id,
                  viewReferral.approvals.includes(user)
                )
              }
            >
              {load.includes(viewReferral._id) ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  {/* <span className="sr-only">Loading...</span> */}
                </div>
              ) : (
                <>
                  {localLikes.includes(viewReferral._id) ||
                  viewReferral.approvals.includes(user) ||
                  user === viewReferral.userId
                    ? filledApprove
                    : emptyApprove}
                </>
              )}
            </button>
          )}
        </div>
        <button className="mt-2 btn btn-secondary" onClick={setCardOpen}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrgCard;
