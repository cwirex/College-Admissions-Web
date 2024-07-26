import React, { useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { ICourse, IdName, IMultiScore } from "../../interfaces";
import ScoreForm from "../shared/ScoreForm";
import ScoresTableRow from "../shared/ScoresTableRow";

const CardCourse = ({
  course,
  subjects,
  onCourseUpdate,
  onCancel,
}: {
  course: ICourse;
  subjects: IdName[];
  onCourseUpdate: any;
  onCancel: any;
}) => {
  const [ecourse, seteCourse] = React.useState<ICourse>(course);

  useEffect(() => {
    seteCourse(course);
  }, [course]);
  const onNameChange = (e: any) => {
    const value = e.target.value || "";
    seteCourse({ ...ecourse, name: value });
  };

  const onDescChange = (e: any) => {
    const value = e.target.value || "";
    seteCourse({ ...ecourse, desc: value });
  };

  const onCapacityChange = (e: any) => {
    const value = Number.parseInt(e.target.value) || 0;
    seteCourse({ ...ecourse, capacity: value });
  };

  const onMultAdd = (value: IMultiScore) => {
    if (ecourse.multipliers) {
      seteCourse({ ...ecourse, multipliers: [...ecourse.multipliers, value] });
    } else {
      seteCourse({ ...ecourse, multipliers: [value] });
    }
  };

  const handleOnMultRemove = (mult_id: string) => {
    if (ecourse.multipliers) {
      const mults = ecourse.multipliers.filter((m) => m.id !== mult_id);
      seteCourse({ ...ecourse, multipliers: mults });
    }
  };

  const onSave = () => {
    if (!ecourse.name) {
      window.alert("Course name cannot be empty");
    } else if (!ecourse.multipliers || ecourse.multipliers.length === 0) {
      window.alert("Score multipliers cannot be empty");
    } else if (!ecourse.capacity || ecourse.capacity <= 0) {
      window.alert("Course capacity must be a number greater than 0");
    } else {
      onCourseUpdate(ecourse);
    }
  };

  const onDiscard = () => {
    seteCourse(course);
  };

  const handleCancel = () => {
    seteCourse(course);
    onCancel();
  };
  return (
    <div className="card mt-3 p-3 border-light">
      <div className="card-header">
        <h5 className="mb-0">Edytuj wybrany kierunek</h5>
      </div>
      <div className="card-body text-start">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nazwa kierunku</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nowa nazwa kierunku"
              value={ecourse.name}
              onChange={onNameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Wprowadź opis dla kierunku (opcjonalne, widoczne dla kandydatów)"
              value={ecourse.desc}
              onChange={onDescChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Pojemność (maksymalna liczba osób na kierunku)</Form.Label>
            <Form.Control
              type="text"
              value={ecourse.capacity}
              onChange={onCapacityChange}
            />
          </Form.Group>
        </Form>
        <p>Mnożniki</p>
        {!ecourse.multipliers || ecourse.multipliers.length === 0 ? (
          <p className="text-secondary">Brak mnożników do pokazania</p>
        ) : (
          <Table striped className="text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Przedmiot</th>
                <th>Podstawa</th>
                <th>Rozszerzenie</th>
              </tr>
            </thead>
            <tbody>
              {ecourse.multipliers.map((mult: IMultiScore, index: number) => (
                <ScoresTableRow
                  key={index}
                  id={index + 1}
                  score={mult}
                  onRemove={handleOnMultRemove}
                />
              ))}
            </tbody>
          </Table>
        )}

        <ScoreForm
          subjects={subjects.filter((s: IdName) => {
            return (
              ecourse.multipliers &&
              ecourse.multipliers.find((ss: IMultiScore) => ss.id === s.id) === undefined
            );
          })}
          onSubmit={onMultAdd}
        />
        <div className="mt-5 text-center">
          <Button className="btn btn-primary mx-2 px-4" onClick={onSave}>
            Zapisz
          </Button>
          <Button className="btn btn-secondary mx-2 px-4" onClick={onDiscard}>
            Cofnij zmiany
          </Button>
          <Button className="btn btn-danger mx-2 px-4" onClick={handleCancel}>
            Zamknij
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardCourse;
