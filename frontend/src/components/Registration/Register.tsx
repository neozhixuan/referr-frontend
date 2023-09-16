import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils/index";
import { ReferralDataService } from "../../services/referrals";

const Register = ({ Logout }: { Logout: () => void }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [height, setHeight] = useState(0);
  const navHeight = (height: number) => {
    setHeight(height);
  };

  // Details for POST call
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: name,
  });
  const { email, password, username } = inputValue;

  // Handle sign up details
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Interesting way to DRY by destructuring the event
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const referralDataService = new ReferralDataService();
  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    referralDataService
      .register(inputValue)
      .then((response) => {
        const { success, message } = response.data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/user/" + inputValue.username);
          }, 1000);
        } else {
          handleError(message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: name,
    });
  };
  /////////////////////////////////////////////////////////////
  return (
    <div>
      <Navbar navHeight={navHeight} Logout={Logout} />
      <div
        className="container d-flex flex-column"
        style={{ height: `${height}` }}
      >
        {" "}
        <p style={{ fontSize: "40px" }}>Create your account</p>
        <p>Choose a name for your referral link.</p>
        <form
          className="d-flex flex-column gap-2 form-style"
          onSubmit={handleSubmit}
        >
          <input
            className="landing-input"
            type="text"
            autoFocus={true}
            name="username"
            value={username}
            onChange={handleOnChange}
            style={{ width: "90%" }}
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            name="email"
            onChange={handleOnChange}
            style={{ width: "90%" }}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            name="password"
            onChange={handleOnChange}
            style={{ width: "90%" }}
          />
          <button
            type="submit"
            className="btn btn-dark"
            style={{ width: "90%" }}
          >
            Continue
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
