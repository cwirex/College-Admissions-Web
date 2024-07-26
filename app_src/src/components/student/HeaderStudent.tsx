import { User } from "firebase/auth";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function HeaderStudent({ onLogout, auth }: { onLogout: any; auth: User }) {
  let userName = "user";
  if (auth.email) userName = auth.email.split("@")[0];

  return (
    <Navbar bg="dark" variant="dark p-3" expand="md">
      <Container fluid>
        <Link to="/student" className="navbar-brand">
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
              <Link to="/student/scores" className="nav-link">
                Wyniki matur
              </Link>
              <Link to="/student/majors" className="nav-link">
                Kierunki studiów
              </Link>
              <Link to="/student/preferences" className="nav-link">
                Moje kierunki
              </Link>
              <Link to="/student/results" className="nav-link">
                Wyniki rekrutacji
              </Link>
            </>
          </Nav>
          <>
            <span className="nav-text mx-3 text-light">Witaj, {userName}</span>
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

export default HeaderStudent;
