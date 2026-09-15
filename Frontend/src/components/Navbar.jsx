import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "My Appointments", path: "/appointments" },
    // { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">🏥</div>
            <span className="navbar-logo-text">MediCare AI</span>
          </Link>
          
          <div className="navbar-links">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`navbar-link ${location.pathname === item.path ? 'navbar-link-active' : ''}`}
              >
                {item.name}
                <span className="navbar-link-underline"></span>
              </Link>
            ))}
          </div>
          
          <div className="navbar-actions">
            <Button asChild variant="outline" className="navbar-button">
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button asChild className="navbar-button-primary">
              <Link to="/doctors">Find Doctors</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;