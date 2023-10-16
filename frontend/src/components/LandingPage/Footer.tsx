import "./Footer.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <div className="footer-dark">
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-md-3 item">
              <h3>Links</h3>
              <ul>
                <li>
                  <a href="https://github.com/neozhixuan/referar">GitHub</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/neozhixuan/">LinkedIn</a>
                </li>
              </ul>
            </div>
            <div className="col-md-6 item text">
              <h3>About</h3>
              <p>
                This project is a personal project made to explore the MERN
                stack. I learned a lot about DAOs, services, controllers and
                routes, and how they come together to form an integrated backend
                in the form of a simple API.
              </p>
            </div>
            <div className="col item social">
              <a href="https://github.com/neozhixuan/referr-frontend">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://github.com/neozhixuan/referr-backend">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
          <p className="copyright">neozhixuan © 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
