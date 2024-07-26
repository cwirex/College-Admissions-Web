import { User } from "firebase/auth";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function HeaderCollege({ onLogout, auth }: { onLogout: any; auth: User }) {
  let userName = "user";
  if (auth.email) userName = auth.email.split("@")[0];

  return (
    <Navbar bg="dark" variant="dark p-3" expand="md">
      <Container fluid>
        <Link to="/college" className="navbar-brand">
          EnrollApp
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <>
              <Link to="/college/profile" className="nav-link">
                Profil uczelni
              </Link>
              <Link to="/college/results" className="nav-link">
                Wyniki rekrutacji
              </Link>
            </>
          </Nav>
          <>
            <span className="nav-text mx-3 text-light">
              Zalogowano jako moderator: {userName}
            </span>
            <Link to="/logout" className="nav-link">
              <Button onClick={onLogout} variant="light">
                Wyloguj
              </Button>
            </Link>
          </>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderCollege;
