import { ReferralDataService } from "../../services/referrals";
import { useState, useEffect } from "react";
import { referralType, organisationType } from "../../types";
import { Link } from "react-router-dom";
import { PropType } from "../../types";
import { handleError } from "../../utils";
import OrgCard from "./OrgCard";
import { filledApprove, emptyApprove, heartFilled } from "../../utils";
import MainReferralCard from "./MainReferralCard";
const ReferralsSection = ({
  refer,
  org,
  refCount,
  user,
  retrieveReferrals,
}: PropType) => {
  const [input, setInput] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState("");
  const [referrals, setReferrals] = useState<referralType[] | never[]>([]);
  const [referralCount, setReferralCount] = useState(refCount);
  const [organisations, setOrganisations] = useState<
    organisationType[] | never[]
  >(org);
  const [localLikes, setLocalLikes] = useState<string[]>([]);
  const [load, setLoad] = useState<string[]>([]);
  const [viewReferral, setViewReferral] = useState<referralType>({
    _id: "",
    userId: "",
    organisation: "",
    code: "",
    url: "",
    description: "",
    expiryDate: null,
    approvals: [],
    date: new Date(),
  });
  const [viewReferralImg, setViewReferralImg] = useState("");
  const [cardOpen, setCardOpen] = useState(false);
  // Update the details on load
  useEffect(() => {
    setReferrals(refer);
  }, [refer]);
  useEffect(() => {
    setReferralCount(refCount);
  }, [refCount]);
  useEffect(() => {
    setOrganisations(org);
  }, [org]);

  const referralDataService = new ReferralDataService();

  // Filter through organisations on query
  const filterOrganisations = (query: string) => {
    setSelectedOption(query);

    if (query === "") {
      setReferrals(refer);
      setReferralCount(refCount);
    } else {
      referralDataService.find(query, "organisation").then((response) => {
        setReferrals(response.data.referrals);
        setReferralCount(response.data.total_results);
      });
    }
  };

  const handleLike = async (id: string, incl: boolean) => {
    let like = true;
    setLoad((prevArray) => [...prevArray, id]);
    setTimeout(
      () => setLoad((prevArray) => prevArray.filter((entry) => entry !== id)),
      2000
    );
    (localLikes.includes(id) || incl) && (like = false);

    referralDataService
      .like({ userId: user, id: id, like: like })
      .then((response) => {
        const { status } = response.data;
        like
          ? setLocalLikes((prevArray) => [...prevArray, id])
          : setLocalLikes((prevArray) =>
              prevArray.filter((entry) => entry !== id)
            );
        if (status !== "success") {
          handleError("Failed to like");
        } else {
          retrieveReferrals();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openCard = (referral: referralType): void => {
    const matchedItem = organisations.find(
      (organisation) => organisation.name === referral.organisation
    );
    const imageUrl = matchedItem ? matchedItem.imgUrl : "";
    const modifiedReferral: referralType = {
      ...referral,
      date: new Date(referral.date),
      expiryDate: referral.expiryDate ? new Date(referral.expiryDate) : null,
    };

    setViewReferralImg(imageUrl);
    setViewReferral(modifiedReferral);
    setCardOpen(true);
  };

  return (
    <div className="referrals-section d-flex flex-column gap-4">
      {cardOpen && (
        <OrgCard
          viewReferralImg={viewReferralImg}
          viewReferral={viewReferral}
          setCardOpen={() => setCardOpen(false)}
          load={load}
          user={user}
          handleLikes={handleLike}
          localLikes={localLikes}
        />
      )}
      {/* Organisations */}
      <div>
        <div className="container">
          <div className="mb-2 d-flex flex-row organisation-text">
            <a
              id="referrals"
              className=" text-white "
              style={{ fontSize: "30px", textDecoration: "none" }}
            >
              {" "}
              View by organisation
            </a>
          </div>
        </div>
        <div className="container-fluid">
          <p className="container text-white mt-4 results-text">
            {referralCount === 0 && (
              <>
                Searching for results...{"  "}
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              </>
            )}
          </p>
          <div
            className="row row-cols-2 row-cols-md-4 row-cols-lg-6 mx-auto"
            style={{ width: "80vw" }}
          >
            {organisations.map((organisation: organisationType) => {
              return (
                <div
                  key={organisation._id}
                  className="col mb-4 d-flex justify-content-center"
                >
                  <div
                    className="card bg-black border-white border-2"
                    style={{ width: "18rem" }}
                  >
                    <Link
                      to={"/organisation/" + organisation.name}
                      className="card-body btn"
                    >
                      <img
                        alt="Shop Logo"
                        style={{ width: "30px", height: "30px" }}
                        src={organisation.imgUrl}
                      />
                      <h5 className="text-white">{organisation.name}</h5>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Referrals */}
      <div>
        <div className="container">
          <div className="mb-2 d-flex referrals-area  align-items-center">
            <p
              className=" text-white"
              style={{ fontSize: "30px", marginRight: "20px" }}
            >
              {" "}
              View all codes
            </p>
            <div
              className="d-flex gap-3 referral-filter"
              style={{ marginLeft: "20px" }}
            >
              <div className="d-flex flex-column justify-items-center text-white">
                Filter by shop
                <select
                  className="form-select "
                  aria-label="Default select example"
                  value={selectedOption}
                  onChange={(e) => filterOrganisations(e.target.value)}
                >
                  <option value={""}>All shops</option>
                  {organisations.map((org, idx) => (
                    <option key={org._id} value={org.name}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column justify-items-center text-white">
                Search a shop
                <div className="d-flex">
                  <input
                    className="search-input"
                    placeholder={"Enter name..."}
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                  />
                  <button
                    className="btn btn-dark search-button"
                    onClick={() => filterOrganisations(input)}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <p className="container text-white mt-4 results-text">
            {referralCount ? (
              `${referralCount} results found.`
            ) : (
              <>
                Searching for results...{"  "}
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              </>
            )}
          </p>
          <div
            className="row row-cols-1 row-cols-md-3 row-cols-lg-5 mx-auto mb-4"
            style={{ width: "80vw" }}
          >
            {referralCount !== 0 &&
              referrals.map((referral: referralType) => {
                const matchedItem = organisations.find(
                  (organisation) => organisation.name === referral.organisation
                );
                const imageUrl = matchedItem ? matchedItem.imgUrl : "";

                return (
                  <MainReferralCard
                    referral={referral}
                    openCard={openCard}
                    imageUrl={imageUrl}
                    load={load}
                    user={user}
                    handleLikes={handleLike}
                    localLikes={localLikes}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsSection;
