import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { referralType } from "../../types";
import ReferralCards from "./ReferralCards";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import "./CustomPage.css"; // Import the CSS file with the styles
import { organisationType } from "../../types";
import { saveToClipboard } from "../../utils";
import LoadingScreen from "../Common/LoadingScreen";
import ReferralForm from "./ReferralForm";
import { Spinner } from "react-bootstrap";
import {
  OrganisationDataService,
  ReferralDataService,
} from "../../services/referrals";
import CustomPageHeader from "./CustomPageHeader";
import { handleSuccess, handleError } from "../../utils";
import OrgCard from "../LandingPage/OrgCard";
import { ActionMeta } from "react-select";
interface CustomPageProps {
  org: organisationType[] | never[];
  userReferral: referralType[] | never[];
  userReferralCount: number;
  user: string;
}

export interface inputValueType {
  userId: string | undefined;
  organisation: string;
  code: string;
  url: string;
  description: string;
  expiryDate: Date | null;
}

const CustomPage = ({
  org,
  userReferral,
  userReferralCount,
  user,
}: CustomPageProps) => {
  const { name } = useParams();
  const currentUrl = "http://localhost:3000/user/" + name;
  const [showInput, setShowInput] = useState(false);

  const [load, setLoad] = useState(false);
  const [authLoad, setAuthLoad] = useState(true);
  const [orgIsOpen, setOrgIsOpen] = useState(false);
  const [deletePanel, setDeletePanel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [referralCount, setReferralCount] = useState(userReferralCount);
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
  const [referrals, setReferrals] = useState<referralType[] | never[]>(
    user === "" || user !== name ? [] : userReferral
  );
  const [deleteID, setDeleteID] = useState({
    userId: "",
    id: "",
  });

  // Values for POST call
  const [inputValue, setInputValue] = useState<inputValueType>({
    userId: name,
    organisation: "",
    code: "",
    url: "",
    description: "",
    expiryDate: null,
  });
  const [orgValue, setOrgValue] = useState<{ orgName: string; imgUrl: string }>(
    {
      orgName: "",
      imgUrl: "",
    }
  );
  const { orgName, imgUrl } = orgValue;
  const { userId, organisation, code, url, description, expiryDate } =
    inputValue;

  useEffect(() => {
    setTimeout(() => setAuthLoad(false), 6000);
  }, []);

  useEffect(() => {
    console.log(user);
    if (name) {
      if (user === "" || user !== name) {
        referralDataService.find(name, "userId").then((response) => {
          setReferrals(response.data.referrals);
          setReferralCount(response.data.total_results);
        });
      }
    }
  }, []);

  const [localLikes, setLocalLikes] = useState<string[]>([]);

  const [cardLoad, setCardLoad] = useState<string[]>([]);
  const handleLike = async (id: string, incl: boolean) => {
    let like = true;
    setCardLoad((prevArray) => [...prevArray, id]);
    setTimeout(
      () =>
        setCardLoad((prevArray) => prevArray.filter((entry) => entry !== id)),
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
  // Inputs on change
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "expiryDate") {
      if (showInput) {
        setInputValue({
          ...inputValue,
          [name]: new Date(value),
        });
      } else if (!showInput) {
        setInputValue({
          ...inputValue,
          [name]: null,
        });
      }
    } else {
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    }
  };
  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (selectedOption) {
      const value = selectedOption.value;
      const label = selectedOption?.label;
      setInputValue({
        ...inputValue,
        [value]: label,
      });
    }
  };
  const handleOrgOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "imgUrl") {
      convertToBase64(e);
    } else {
      setOrgValue({
        ...orgValue,
        [name]: value,
      });
    }
  };

  // Handle image submission to MongoDB
  const convertToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        setOrgValue({
          ...orgValue,
          imgUrl: reader.result as string,
        });
        // setImage(reader.result as string);
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    }
  };

  // Create a new org
  const handleOrgProcess = async (e: React.FormEvent) => {
    handleOrgSubmit(e);
    setIsOpen(true);
    setLoad(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const organisationDataService = new OrganisationDataService();
  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgIsOpen(false);
    organisationDataService
      .createOrg({ ...orgValue, userId: name })
      .then((response) => {
        const { success, message } = response.data;

        if (success) {
          handleSuccess(message);
        } else {
          handleError(message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setOrgValue({
      ...orgValue,
      orgName: "",
      imgUrl: "",
    });
  };

  // Create a new referral
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(inputValue);
    referralDataService
      .createReferral(inputValue)
      .then((response) => {
        const { success, message } = response.data;
        if (success) {
          handleSuccess(message);
        } else {
          handleError(message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setInputValue({
      ...inputValue,
      organisation: "",
      code: "",
      url: "",
      description: "",
      expiryDate: null,
    });
    setIsOpen(false);
    setLoad(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Delete referral
  const deleteProcess = (id: string) => {
    setDeletePanel(true);
    setDeleteID({ userId: user, id: id });
  };
  const handleDelete = async () => {
    console.log(deleteID);
    referralDataService
      .deleteReferral({ userId: deleteID["userId"], _id: deleteID["id"] })
      .then((response) => {
        const { status } = response.data;
        if (status === "success") {
          setLoad(true);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.log("error");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setDeleteID({ userId: "", id: "" });
    setDeletePanel(false);
  };

  // Check authentication + pre-load data
  const auth = user === name;
  const referralDataService = new ReferralDataService();
  const retrieveReferrals = () => {
    if (name) {
      referralDataService.find(name, "userId").then((response) => {
        setReferrals(response.data.referrals);
        setReferralCount(response.data.total_results);
      });
    } else {
      setReferrals([]);
    }
  };
  // Pre loading checks for user
  useEffect(() => {
    if (referrals.length === 0) {
      retrieveReferrals();
    }
  }, []);

  // Edits
  const editProcess = (referral: referralType) => {
    setInputValue({
      ...inputValue,
      organisation: referral.organisation,
      code: referral.code,
      url: referral.url,
      description: referral.description,
      expiryDate: referral.expiryDate,
    });
    setIsEdit(true);
  };
  const closeEditProcess = () => {
    setInputValue({
      ...inputValue,
      userId: name,
      organisation: "",
      code: "",
      url: "",
      description: "",
      expiryDate: null,
    });
    setIsEdit(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(inputValue);
    referralDataService
      .updateReferral(inputValue)
      .then((response) => {
        setIsEdit(false);
        setLoad(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
  return (
    <div className="custom-page container d-flex flex-column align-items-center gap-3">
      {cardOpen && (
        <OrgCard
          viewReferralImg={viewReferralImg}
          viewReferral={viewReferral}
          setCardOpen={() => setCardOpen(false)}
          load={cardLoad}
          user={user}
          handleLikes={handleLike}
          localLikes={localLikes}
        />
      )}
      {/* Header */}
      <CustomPageHeader
        name={name}
        saveToClipboard={saveToClipboard}
        currentUrl={currentUrl}
      />
      {/* Referral Cards */}

      {authLoad || referralCount > 0 ? (
        <div className="scrollbar vh-90 overflow-auto">
          {referrals.map((referral: referralType) => {
            const matchedItem = org.find(
              (organisation) => organisation.name === referral.organisation
            );
            const imageUrl = matchedItem ? matchedItem.imgUrl : "";
            return (
              <ReferralCards
                openCard={() => openCard(referral)}
                auth={auth}
                handleEdit={() => editProcess(referral)}
                handleDelete={() => deleteProcess(referral._id)}
                key={referral._id}
                imageUrl={imageUrl}
                referral={referral}
              />
            );
          })}
        </div>
      ) : authLoad && referralCount === 0 ? (
        <div>
          Searching for results...{" "}
          <div className="spinner-border spinner-border-sm" role="status" />
        </div>
      ) : (
        <p>No results found</p>
      )}

      {/* Button depending on auth */}
      {authLoad && !auth ? (
        <div className="d-flex align-items-center gap-2">
          Authenticating... <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <>
          {auth ? (
            user === name ? (
              <button onClick={() => setIsOpen(true)} className="btn btn-light">
                Create a new referral to share!
              </button>
            ) : (
              <Link className="btn btn-dark" to={`/user/${user}`}>
                Return to your page!
              </Link>
            )
          ) : (
            <Link
              to={"/register/example"}
              className="w-full btn btn-dark text-center d-flex flex-column"
            >
              {/* <span>Haven't created an account?</span>{" "} */}
              <span className="text-white">
                Make your own referr.site link here!
              </span>
            </Link>
          )}
        </>
      )}
      <Link to={"/"} className="btn btn-dark mt-auto">
        Back to refer.site...
      </Link>
      {/* Referral Creation Form */}
      {isOpen && (
        <ReferralForm
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          setOrgIsOpen={setOrgIsOpen}
          handleSelectChange={handleSelectChange}
          handleClosePanel={() => setIsOpen(false)}
          url={url}
          description={description}
          org={org}
          code={code}
          organisation={organisation}
          userId={userId}
          expiryDate={expiryDate}
          showInput={showInput}
          setShowInput={() => setShowInput(!showInput)}
        />
      )}
      {/* Referral Update Form */}
      {isEdit && (
        <ReferralForm
          handleSubmit={handleEditSubmit}
          handleOnChange={handleOnChange}
          setOrgIsOpen={setOrgIsOpen}
          handleSelectChange={handleSelectChange}
          handleClosePanel={closeEditProcess}
          url={url}
          description={description}
          org={org}
          code={code}
          organisation={organisation}
          userId={userId}
          expiryDate={expiryDate}
          showInput={showInput}
          setShowInput={() => setShowInput(!showInput)}
        />
      )}
      {orgIsOpen && (
        <div className="org-container">
          <div className="org-content">
            <Form
              onSubmit={handleOrgProcess}
              className="d-flex flex-column gap-2"
            >
              <Form.Group controlId="formCode">
                <Form.Label className="mb-1">Organisation Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter name of shop"
                  name="orgName"
                  value={orgName}
                  onChange={handleOrgOnChange}
                />
              </Form.Group>
              <Form.Group controlId="formURL">
                <Form.Label className="mb-1">Shop Logo</Form.Label>
                <Form.Control
                  required
                  type="file"
                  placeholder="Enter a URL of the image"
                  name="imgUrl"
                  // value={imgUrl}
                  onChange={handleOrgOnChange}
                />
              </Form.Group>
              <div className="d-flex flex-column">
                <span>Preview</span>
                <img className="w-50 h-50" src={imgUrl} />
              </div>
              {/* Add more input fields for your database entry */}
              <div className="d-flex flex-row justify-content-between mt-auto">
                {" "}
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button variant="secondary" onClick={() => setOrgIsOpen(false)}>
                  Close
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
      {deletePanel && (
        <div className="org-container">
          <div className="org-content">
            <p>Are you sure you want to delete this referral entry?</p>
            <div className="d-flex flex-row justify-content-between">
              <button className="btn btn-primary" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeletePanel(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {load && <LoadingScreen />}
      <ToastContainer />
    </div>
  );
};

export default CustomPage;
