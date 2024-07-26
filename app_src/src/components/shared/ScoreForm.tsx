import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { IdName } from "../../interfaces";

const ScoreForm = ({ subjects, onSubmit }: any) => {
  const [name, setSubject] = useState("");
  const [id, setSubjectId] = useState(0);
  const [basic, setBasic] = useState(0);
  const [advanced, setAdvanced] = useState(0);

  const handleBasicChange = (event: { target: { value: string | number } }) => {
    const value = Math.max(0, Math.min(100, Number(event.target.value)));
    setBasic(value);
  };
  const handleAdvancedChange = (event: { target: { value: string | number } }) => {
    const value = Math.max(0, Math.min(100, Number(event.target.value)));
    setAdvanced(value);
  };

  const onSubjectSelected = (e: any) => {
    setSubject(e.target.value);
    const selectedIndex = e.target.options.selectedIndex;
    const optionId = e.target.options[selectedIndex].getAttribute("data-key");
    setSubjectId(optionId);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === "") {
      alert("Nie wybrano przedmiotu");
    } else if (Number.isNaN(basic) || Number.isNaN(advanced)) {
      alert("Wynik musi być liczbą");
    } else {
      onSubmit({ id, name, basic, advanced });
      setSubject("");
      setSubjectId(0);
      setBasic(0);
      setAdvanced(0);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="px-3 text-center">
      <Row>
        <Col xs={6}>
          <Form.Select value={name} onChange={onSubjectSelected}>
            <option key={0} data-key={0}></option>
            {subjects.map((s: IdName) => (
              <option key={s.id} data-key={s.id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={2}>
          <Form.Control
            placeholder="Podstawa"
            type="number"
            value={basic}
            onChange={handleBasicChange}
          />
        </Col>
        <Col xs={2}>
          <Form.Control
            placeholder="Rozszerzenie"
            type="number"
            value={advanced}
            onChange={handleAdvancedChange}
          />
        </Col>
        <Col xs={2}>
          <Button className="px-5" variant="primary" type="submit">
            Aktualizuj
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ScoreForm;
