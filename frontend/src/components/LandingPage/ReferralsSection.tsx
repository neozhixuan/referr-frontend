import {
  OrganisationDataService,
  ReferralDataService,
} from "../../services/referrals";
import { useState, useEffect } from "react";
import { customStyles } from "../CustomPage/utils";
import { referralType, organisationType } from "../../types";
import { Link } from "react-router-dom";
import { PropType } from "../../types";
import { handleError } from "../../utils";
import OrgCard from "./OrgCard";
import { leftArrow, rightArrow } from "../../utils";
import MainReferralCard from "./MainReferralCard";
import { Button } from "react-bootstrap";
import Select, { ActionMeta } from "react-select";
import { mapOptions } from "../CustomPage/utils";

const ReferralsSection = ({
  refer,
  org,
  orgCount,
  refCount,
  user,
  retrieveReferrals,
}: PropType) => {
  const [referralPage, setReferralPage] = useState<number>(0);
  const [orgPage, setOrgPage] = useState<number>(0);

  const ORGANISATIONSPERPAGE = 6;
  const REFERRALSPERPAGE = 6;
  const [input, setInput] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState("");
  const [referrals, setReferrals] = useState<referralType[] | never[]>([]);
  const [referralCount, setReferralCount] = useState(refCount);
  // const [allOrgs, setAllOrgs] = useState<organisationType[] | never[]>(org);
  const [organisations, setOrganisations] = useState<organisationType[]>([
    { _id: "0", imgUrl: "www.google.com", name: "Loading" },
  ]);

  let options = mapOptions(org);
  options = [...options, { label: "Placeholder", value: "" }];
  // const [orgsCount, setOrgsCount] = useState(orgCount);

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
    setReferralCount(refCount);
  }, [refer, refCount]);

  const referralDataService = new ReferralDataService();
  const organisationDataService = new OrganisationDataService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await organisationDataService.getPage(orgPage);
        const data = response.data.organisations;
        setOrganisations(data);
      } catch (error) {
        // Handle error here
        console.error(error);
      }
    };

    fetchData();
  }, [orgPage]); // useEffect will re-run whenever pageNo changes

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await referralDataService.getAll(referralPage);
        const data = response.data.referrals;
        console.log(data);
        setReferrals(data);
      } catch (error) {
        // Handle error here
        console.error(error);
      }
    };

    fetchReferrals();
  }, [referralPage]); // useEffect will re-run whenever pageNo changes

  // Filter through organisations on select
  const filterOrganisationsSelect = (
    selectedOption: { value: string; label: string } | null,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (!selectedOption) {
      setReferrals(refer);
      setReferralCount(refCount);
    } else {
      setSelectedOption(selectedOption.value);

      referralDataService
        .find(selectedOption.value, "organisation")
        .then((response) => {
          setReferrals(response.data.referrals);
          setReferralCount(response.data.total_results);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const filterOrganisations = (query: string) => {
    setSelectedOption(query);

    if (query === "") {
      setReferrals(refer);
      setReferralCount(refCount);
    } else {
      referralDataService
        .find(query, "organisation")
        .then((response) => {
          setReferrals(response.data.referrals);
          setReferralCount(response.data.total_results);
        })
        .catch((e) => {
          console.log(e);
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

    // If the user already liked it, set like to false
    (localLikes.includes(id) || incl) && (like = false);

    // If the user has not liked it, add his name to likes array
    // If the user already liked it, remove his name from likes array
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

  const decreaseReferralPage = () => {
    const newpage = referralPage - 1;
    if (referralPage !== 0) {
      setReferralPage(newpage);
    }
  };

  const increaseReferralPage = () => {
    const newpage = referralPage + 1;
    if (newpage * REFERRALSPERPAGE <= referralCount) {
      setReferralPage(newpage);
    }
  };

  const decreaseOrgPage = () => {
    const newpage = orgPage - 1;
    if (orgPage !== 0) {
      setOrgPage(newpage);
    }
  };

  const increaseOrgPage = () => {
    const newpage = orgPage + 1;
    if (newpage * ORGANISATIONSPERPAGE <= orgCount) {
      setOrgPage(newpage);
    }
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
          <div className="container text-white mt-4 results-text">
            {orgCount === 0 ? (
              <>
                Searching for results...{"  "}
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              </>
            ) : (
              <p>{orgCount} results found.</p>
            )}
          </div>
          <div
            className="row row-cols-2 row-cols-md-4 row-cols-lg-6 mx-auto"
            style={{ width: "90vw" }}
          >
            {organisations.map((organisation: organisationType) => {
              return (
                <div
                  key={organisation._id}
                  className="col mb-2 d-flex justify-content-center"
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
          <div className="d-flex justify-content-center gap-3">
            <Button
              onClick={decreaseOrgPage}
              className="btn btn-dark"
              disabled={orgPage === 0}
            >
              {leftArrow}
            </Button>
            <Button
              onClick={increaseOrgPage}
              className="btn btn-dark"
              disabled={(orgPage + 1) * ORGANISATIONSPERPAGE > orgCount}
            >
              {rightArrow}
            </Button>
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
                <Select
                  options={options}
                  onChange={filterOrganisationsSelect}
                  styles={customStyles}
                />
                {/* <select
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
                </select> */}
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
          <div className="container text-white mt-4 results-text">
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
          </div>
          <div
            className="row row-cols-1 row-cols-md-3 row-cols-lg-6 mx-auto "
            style={{ width: "90vw" }}
          >
            {referralCount !== 0 &&
              referrals.map((referral: referralType, idx: number) => {
                const matchedItem = org.find(
                  (organisation) => organisation.name === referral.organisation
                );
                const imageUrl = matchedItem ? matchedItem.imgUrl : "";
                // console.log(imageUrl);
                return (
                  <MainReferralCard
                    key={idx}
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
          <div className="d-flex justify-content-center gap-3 mb-3">
            <Button
              onClick={decreaseReferralPage}
              className="btn btn-dark"
              disabled={referralPage === 0}
            >
              {leftArrow}
            </Button>
            <Button
              onClick={increaseReferralPage}
              className="btn btn-dark"
              disabled={(referralPage + 1) * REFERRALSPERPAGE > referralCount}
            >
              {rightArrow}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsSection;
