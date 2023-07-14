import { useState, useEffect } from "react";
import { ReferralDataService } from "../../services/referrals";
import { organisationType, referralType } from "../../types";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import OrgCard from "../LandingPage/OrgCard";
// import MainReferralCard from "../LandingPage/MainReferralCard";
import MainReferralCard from "../LandingPage/MainReferralCard";
const Organisation = ({
  org,
  Logout,
  user,
  retrieveReferrals,
}: {
  org: organisationType[] | never[];
  Logout: () => void;
  user: string;
  retrieveReferrals: () => void;
}) => {
  const [cardOpen, setCardOpen] = useState(false);
  const [viewReferralImg, setViewReferralImg] = useState("");
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
  const [localLikes, setLocalLikes] = useState<string[]>([]);

  const [load, setLoad] = useState<string[]>([]);
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
        if (status === "success") {
          retrieveReferrals();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const openCard = (referral: referralType): void => {
    const matchedItem = org.find(
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
  const [referrals, setReferrals] = useState<referralType[] | never[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [height, setHeight] = useState(0);
  const [orgDetails, setOrgDetails] = useState<organisationType>({
    _id: "",
    name: "Not Found",
    imgUrl:
      "https://miro.medium.com/v2/resize:fit:800/1*hFwwQAW45673VGKrMPE2qQ.png",
  });

  const { name } = useParams();

  const findOrg = org.find((organisation) => {
    return organisation.name === name;
  });

  const navHeight = (height: number) => {
    setHeight(height);
  };

  const referralDataService = new ReferralDataService();
  const findReferrals = (name: string | undefined) => {
    console.log(name);
    if (name) {
      referralDataService
        .findExact(name, "organisation")
        .then((response) => {
          setReferrals(response.data.referrals);
          setReferralCount(response.data.total_results);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setReferrals([]);
    }
  };

  useEffect(() => {
    if (findOrg) {
      setOrgDetails(findOrg);
    }
  }, [findOrg]);

  useEffect(() => {
    findReferrals(name);
  }, []);

  return (
    <>
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
      )}{" "}
      <Navbar navHeight={navHeight} Logout={Logout} />
      <div
        className="container d-flex flex-column"
        style={{ height: `${height}` }}
      >
        <div className="d-flex flex-row align-items-center gap-4">
          <img
            src={orgDetails.imgUrl}
            style={{ width: "40px", height: "40px" }}
            className="mb-2"
          />
          <p style={{ fontSize: "40px" }}>{orgDetails.name}</p>
        </div>
        <div>
          <div className="container-fluid">
            <p className="container text-black">
              {referralCount
                ? `${referralCount} results found.`
                : "No results found, please refine your search query!"}
            </p>
            <div
              className="row row-cols-1 row-cols-md-3 row-cols-lg-4 mx-auto mb-4"
              style={{ width: "80vw" }}
            >
              {referralCount !== 0 &&
                referrals.map((referral: referralType) => {
                  const matchedItem = org.find(
                    (organisation) =>
                      organisation.name === referral.organisation
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
    </>
  );
};

export default Organisation;
