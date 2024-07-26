import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const RegisterForm = ({ onRegister }: any) => {
  const [email, setEmail] = useState("");
  const [pesel, setPesel] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
    } else if (pesel.length !== 11) {
      alert("Invalid PESEL");
    } else {
      onRegister({ email, pesel, password });
    }
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <Form onSubmit={handleSubmit} className="RegisterForm w-50">
          <Form.Label className="p-3">
            <h2>Utwórz konto kandydata</h2>
          </Form.Label>
          <Form.Group className="mb-3" controlId="RegisterForm_Email">
            <Form.Control
              type="email"
              placeholder="Wprowadź adres email (login)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="RegisterForm_PESEL">
            <Form.Control
              type="text"
              placeholder="Wprowadź PESEL"
              value={pesel}
              onChange={(e) => {
                setPesel(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="RegisterForm_Password">
            <Form.Control
              type="password"
              placeholder="Wprowadź hasło do konta"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="RegisterForm_Label">
            <Form.Text className="text-muted">
              Nie udostępniamy nikomu Twoich danych
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Zarejestruj
          </Button>
        </Form>
      </div>
    </>
  );
};

export default RegisterForm;
