import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ScoresTableRow from "../shared/ScoresTableRow";
import { ICourse, IMultiScore } from "../../interfaces";

const Major = ({ major, onAddAsPref }: { major: ICourse; onAddAsPref: any }) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onAddAsPref({ courseId: major.id });
  };
  return (
    <div className="border rounded mb-5 mt-3">
      <div className="p-3 mx-5 text-start">
        <h4>{major.name}</h4>
        <p>{major.desc}</p>
      </div>
      <h5>Mnożniki</h5>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Przedmiot</th>
            <th>Podstawa</th>
            <th>Rozszerzenie</th>
          </tr>
        </thead>
        <tbody>
          {major.multipliers &&
            major.multipliers.map((mult: IMultiScore, index: number) => (
              <ScoresTableRow
                key={index}
                id={index + 1}
                score={mult}
                onRemove={undefined}
              />
            ))}
        </tbody>
      </Table>
      <h5>Maksymalna liczba osób: {major.capacity}</h5>
      <Button className="m-3" onClick={handleClick}>
        Zapisz na kierunek
      </Button>
    </div>
  );
};

export default Major;
