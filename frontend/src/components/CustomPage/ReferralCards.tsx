import { referralType } from "../../types";
import { filledApprove } from "../../utils";
import { deleteButton, editButton } from "./utils";
const ReferralCards = ({
  referral,
  imageUrl,
  handleDelete,
  handleEdit,
  auth,
  openCard,
}: {
  referral: referralType;
  imageUrl: string;
  handleDelete: () => void;
  handleEdit: () => void;
  auth: boolean;
  openCard: () => void;
}) => {
  function limitWords(text: string, maxWords: number) {
    const words = text.split(" "); // Split the text into an array of words
    if (words.length <= maxWords) {
      return text; // If the text has fewer words than the limit, return it as is
    } else {
      const truncatedText = words.slice(0, maxWords).join(" "); // Select and join the first 'maxWords' words
      return `${truncatedText} ...`; // Add an ellipsis to indicate truncation
    }
  }

  return (
    <div
      className="rounded bg-dark p-3 mb-3 text-white"
      style={{ width: "100%" }}
    >
      <div className="d-flex flex-row justify-content-between gap-5">
        {/* Details */}
        <div onClick={openCard} className="d-flex flex-column w-100">
          <div className="d-flex flex-row gap-3">
            <img
              alt="Shop Logo"
              style={{ width: "30px", height: "30px" }}
              src={imageUrl}
            />
            <h5>{referral.organisation}</h5>
          </div>
          <div className="text-info">{referral.code}</div>
          <div className="multiline-ellipsis" style={{ marginRight: "5px" }}>
            {limitWords(referral.description, 25)}
          </div>
          <div
            className="bg-dark d-flex flex-row gap-1 align-items-stretch"
            // style={{ zIndex: 899 }}
          >
            <div>{filledApprove}</div>
            <div style={{ paddingTop: "1px" }}>{referral.approvals.length}</div>
          </div>
        </div>
        {auth && (
          <div
            className="d-flex flex-column p-2 rounded"
            style={{ backgroundColor: "black" }}
          >
            <button onClick={handleEdit} className="btn btn-light mb-2">
              {editButton}
            </button>
            <button onClick={handleDelete} className="btn btn-light">
              {deleteButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCards;
