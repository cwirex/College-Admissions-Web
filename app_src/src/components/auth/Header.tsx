import { User } from "firebase/auth";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Navbar bg="dark" variant="dark p-3" expand="md">
      <Container fluid>
        <Link to="/" className="navbar-brand">
          EnrollApp
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>
          <>
            <Link to="/auth/signInLink" className="nav-link mx-3">
              <Button variant="dark">Logowanie uczelni</Button>
            </Link>
            <Link to="/auth/login" className="nav-link mx-2">
              <Button variant="light">Logowanie</Button>
            </Link>
            <Link to="/auth/register" className="nav-link mx-2">
              <Button variant="light">Rejestracja</Button>
            </Link>
          </>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
