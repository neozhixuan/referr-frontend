import { referralType } from "../../types";
import { filledApprove, emptyApprove } from "../../utils";
import { Link } from "react-router-dom";
const MainReferralCard = ({
  referral,
  openCard,
  imageUrl,
  load,
  user,
  handleLikes,
  localLikes,
}: {
  referral: referralType;
  openCard: () => void;
  imageUrl: string;
  load: string[];
  user: string;
  handleLikes: Promise<void>;
  localLikes: string[];
}) => {
  return (
    <div key={referral._id} className="col mb-4 d-flex justify-content-center">
      <div
        className="card bg-black border-white border-2"
        style={{ width: "18rem" }}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex flex-column" onClick={openCard}>
            <div className="card-title text-white d-flex flex-row gap-3">
              <img
                alt="Shop Logo"
                style={{ width: "30px", height: "30px" }}
                src={imageUrl}
              />
              <h5 className="mt-1">{referral.organisation}</h5>
            </div>
            <h6 className="card-subtitle mb-2 text-muted">{referral.code}</h6>
            <span className="card-text text-white">{referral.description}</span>
            <span className="text-white mb-1">
              {load.includes(referral._id) ? (
                <>Loading...</>
              ) : (
                <>
                  {referral.approvals.length + 1}{" "}
                  {referral.approvals.length > 0 ? `likes` : `like`} to{" "}
                  <Link to={`/user/${referral.userId}`}>{referral.userId}</Link>
                </>
              )}
            </span>
          </div>
          <div className="mt-auto d-flex flex-row gap-2">
            <a
              className={`btn ${user === "" && "w-100"}`}
              href={referral.url}
              style={{ backgroundColor: "gray" }}
            >
              Use code
            </a>
            {user !== "" && (
              <button
                className={`btn btn-primary ${
                  (user === referral.userId || load.includes(referral._id)) &&
                  `disabled`
                }`}
                onClick={() => handleLikes}
              >
                {load.includes(referral._id) ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    {/* <span className="sr-only">Loading...</span> */}
                  </div>
                ) : (
                  <>
                    {localLikes.includes(referral._id) ||
                    referral.approvals.includes(user) ||
                    user === referral.userId
                      ? filledApprove
                      : emptyApprove}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainReferralCard;
