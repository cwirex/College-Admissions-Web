import { IdName, IMultiScore } from "../../interfaces";
import ScoreForm from "../shared/ScoreForm";
import ScoresTable from "./ScoresTable";

const Scores = ({
  sscores,
  ssubjects,
  onFormSubmit,
  onScoreRemove,
}: {
  sscores: Array<IMultiScore>;
  ssubjects: Array<IdName>;
  onFormSubmit: any;
  onScoreRemove: any;
}) => {
  return (
    <>
      <h2 className="p-3">Moje wyniki matur</h2>
      <ScoresTable scores={sscores} onRemove={onScoreRemove} />

      <div className="mx-5">
        <h4 className="p-3 mt-5 mb-2">Edytuj swoje wyniki</h4>
        <ScoreForm
          subjects={ssubjects.filter((s: any) => {
            return sscores.find((ss: any) => ss.id == s.id) === undefined;
          })}
          onSubmit={onFormSubmit}
        />
      </div>
    </>
  );
};

export default Scores;
