import { MdCancel } from "react-icons/md";
import { IMultiScore } from "../../interfaces";

const ScoresTableRow = ({
  score,
  onRemove,
  id,
}: {
  score: IMultiScore;
  onRemove: any;
  id: number;
}) => {
  const onDelete = () => {
    console.log("DELETE", score.id);
    onRemove !== undefined && onRemove(score.id);
  };
  return (
    <tr>
      <td>{id}</td>
      <td>{score.name}</td>
      <td>{score.basic}</td>
      <td>{score.advanced}</td>
      {onRemove !== undefined && (
        <td>
          <span className="text-danger p-1" onClick={onDelete}>
            <MdCancel size={21} />
          </span>
        </td>
      )}
    </tr>
  );
};

export default ScoresTableRow;
