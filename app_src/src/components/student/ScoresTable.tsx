import Table from "react-bootstrap/Table";
import { IMultiScore } from "../../interfaces";
import ScoresTableRow from "../shared/ScoresTableRow";

const ScoresTable = ({
  scores,
  onRemove,
}: {
  scores: Array<IMultiScore>;
  onRemove: any;
}) => {
  if (scores.length == 0) {
    return <p className="text-secondary">Dodaj swoje wyniki</p>;
  }
  return (
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
        {scores.map((score: IMultiScore, index: number) => (
          <ScoresTableRow score={score} onRemove={onRemove} key={index} id={index + 1} />
        ))}
      </tbody>
    </Table>
  );
};

export default ScoresTable;
