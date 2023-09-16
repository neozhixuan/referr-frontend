import "./LoadingScreen.css";
import { Spinner } from "react-bootstrap";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="blur-background" />
      <div className="spinner-container">
        <Spinner animation="border" variant="light" />
      </div>
    </div>
  );
};

export default LoadingScreen;
