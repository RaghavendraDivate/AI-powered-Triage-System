import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();

  // Track the 404 error
  useEffect(() => {
    // In a production app, you might want to log this to an analytics service
  }, [location.pathname]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Oops! Page not found</p>
        <a href="/" className="not-found-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;