import { referralType } from "../../types";
import { filledApprove, emptyApprove, heartFilled } from "../../utils";
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
  openCard: (referral: referralType) => void;
  imageUrl: string;
  load: string[];
  user: string;
  handleLikes: (id: string, includes: boolean) => Promise<void>;
  localLikes: string[];
}) => {
  return (
    <div key={referral._id} className="col mb-4 d-flex justify-content-center">
      <div
        className="card bg-black border-white border-2"
        style={{ width: "18rem" }}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex flex-column gap-2 mb-3">
            <Link
              to={`/organisation/${referral.organisation}`}
              className="card-title text-white d-flex flex-row gap-3 text-decoration-none"
            >
              <img
                alt="Shop Logo"
                style={{ width: "30px", height: "30px" }}
                src={imageUrl}
              />
              <h5 className="mt-1">{referral.organisation}</h5>
            </Link>
            <div
              onClick={() => openCard(referral)}
              style={{ width: "175px", height: "100px" }}
            >
              <h6 className="card-subtitle mb-2 text-info text-uppercase">
                {referral.code}
              </h6>
              <p className=" text-white" style={{ color: "white!important" }}>
                {referral.description}
              </p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-white">
              {load.includes(referral._id) ? (
                <>Loading...</>
              ) : (
                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex gap-1">
                    <span>{heartFilled}</span>
                    <span>{referral.approvals.length}</span>
                  </div>
                  <Link
                    className="text-decoration-none"
                    to={`/user/${referral.userId}`}
                  >
                    {referral.userId}
                  </Link>
                </div>
              )}
            </div>
            <div className=" d-flex flex-row gap-2 mt-2">
              <a
                className={`btn btn-dark ${user === "" && "w-100"}`}
                href={referral.url}
              >
                Use code
              </a>
              {user !== "" && (
                <button
                  className={`btn btn-primary ${
                    (user === referral.userId || load.includes(referral._id)) &&
                    `disabled`
                  }`}
                  onClick={() =>
                    handleLikes(referral._id, referral.approvals.includes(user))
                  }
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
    </div>
  );
};

export default MainReferralCard;
