import { Button, Form } from "react-bootstrap";
import { organisationType } from "../../types";
import { useState } from "react";
interface ReferralFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userId: string | undefined;
  organisation: string;
  description: string;
  url: string;
  org: organisationType[] | never[];
  code: string;
  expiryDate: Date | null;
  showInput: boolean;
  setShowInput: () => void;
  setOrgIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleClosePanel: () => void;
}
const ReferralForm = ({
  handleSubmit,
  handleOnChange,
  userId,
  organisation,
  description,
  url,
  org,
  code,
  expiryDate,
  showInput,
  setShowInput,
  setOrgIsOpen,
  handleSelectChange,
  handleClosePanel,
}: ReferralFormProps) => {
  return (
    <div className="panel-container">
      <div className="panel-content">
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
          <Form.Group controlId="formName">
            <Form.Label className="mb-1">User ID</Form.Label>
            <Form.Control type="text" disabled value={userId} />
          </Form.Group>
          <Form.Group controlId="formOrg">
            <Form.Label className="mb-1">
              Organisation{" "}
              <span>
                (Can't find your shop? Create one{" "}
                <button
                  className="btn p-0 mb-1 "
                  onClick={() => setOrgIsOpen(true)}
                >
                  <u>here</u> ){" "}
                </button>
              </span>
            </Form.Label>
            <Form.Select
              placeholder="Enter discount code"
              name="organisation"
              value={organisation}
              required
              onChange={handleSelectChange}
            >
              {" "}
              <option value="" disabled>
                Select an option
              </option>
              {org.map((o) => {
                return (
                  <option key={o._id} value={o.name}>
                    {o.name}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formCode">
            <Form.Label className="mb-1">Code</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter discount code"
              name="code"
              value={code}
              onChange={handleOnChange}
            />
          </Form.Group>
          <Form.Group controlId="formURL">
            <Form.Label className="mb-1">URL</Form.Label>
            <Form.Control
              required
              type="url"
              placeholder="Enter url to the website"
              name="url"
              value={url}
              onChange={handleOnChange}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label className="mb-1">Description</Form.Label>
            <Form.Control
              required
              as="textarea"
              placeholder="Enter description of the code"
              name="description"
              value={description}
              onChange={handleOnChange}
            />
          </Form.Group>
          <Form.Group controlId="expiryDate">
            <Form.Label className="mb-1">
              Expiry Date{" "}
              <input
                type="checkbox"
                checked={showInput}
                onChange={setShowInput}
              />
            </Form.Label>
            {(showInput || expiryDate !== null) && (
              <Form.Control
                type="date"
                required
                name="expiryDate"
                value={
                  expiryDate instanceof Date
                    ? expiryDate.toISOString().split("T")[0]
                    : expiryDate === null
                    ? new Date().toISOString().split("T")[0]
                    : expiryDate
                }
                min={new Date().toISOString().split("T")[0]}
                onChange={handleOnChange}
              />
            )}
          </Form.Group>
          {/* Add more input fields for your database entry */}
          <div className="d-flex flex-row justify-content-between mt-auto">
            {" "}
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleClosePanel}>
              Close
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default ReferralForm;
