import { useState } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import { ReferralDataService } from "../../services/referrals";

const Login = ({
  user,
  Logout,
  setUser,
}: {
  user: string;
  Logout: () => void;
  setUser: (user: string) => void;
}) => {
  const [height, setHeight] = useState(0);
  const navHeight = (height: number) => {
    setHeight(height);
  };
  const [load, setLoad] = useState(false);

  // Details for POST call
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  if (user !== "") {
    navigate("/user/" + user);
  }

  const { email, password } = inputValue;
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Interesting way to DRY by destructuring the event
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const referralDataService = new ReferralDataService();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoad(true);
    referralDataService
      .login(inputValue)
      .then((response) => {
        console.log(response.data);
        const { success, message, user } = response.data;
        if (success) {
          handleSuccess(message);
          setUser(user);
          setTimeout(() => {
            navigate("/user/" + user);
          }, 1000);
        } else {
          handleError(message);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoad(false);
      });
    setLoad(false);
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
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
        <p style={{ fontSize: "40px" }}>Login to your account</p>
        <p>Have an account? Login with your credentials.</p>
        <form
          className="d-flex flex-column gap-2 form-style"
          onSubmit={handleSubmit}
        >
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
            {load ? `Loading...` : `Login`}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
