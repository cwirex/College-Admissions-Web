import { useEffect, useState } from "react";
import { EResults, ERoles, IResults } from "../../interfaces";

const Results = ({ results, role }: { results: IResults; role: ERoles }) => {
  const [showStudentList, setShowStudentList] = useState<boolean[]>([]);
  useEffect(() => {
    setShowStudentList(results.courses?.map(() => false) || []);
  }, [results.courses]);

  if (results.status === EResults.NotReady) {
    return (
      <div className="container p-3">
        <h2>Wyniki rekrutacji</h2>
        <h5 className="text-muted">Proces rekrutacji jeszcze się nie rozpoczął</h5>
      </div>
    );
  }
  if (role === ERoles.Student) {
    if (results.status === EResults.Success) {
      return (
        <div>
          <div className="container p-3">
            <h2>Wyniki rekrutacji</h2>
            <div className="d-flex justify-content-center p-3">
              <div className="p-3 mx-5 text-start  border rounded border-success">
                <h3 className="p-3">Gratulacje! Udało ci się zakwalifikować</h3>
                <h4>Uczelnia: {results.university}</h4>
                <h4>Kierunek: {results.course}</h4>
              </div>
            </div>
          </div>
          <h5 className="text-muted">
            Proces rekrutacji dobiegł końca. Odwiedź stronę uczelni aby dowiedzieć się o
            kolejnych krokach.
          </h5>
        </div>
      );
    } else if (results.status === EResults.Fail) {
      return (
        <div>
          <div className="container p-3">
            <h2>Wyniki rekrutacji</h2>
            <div className="d-flex justify-content-center p-3">
              <div className="w-50 p-3 mx-5 text-center border rounded border-danger">
                <h5>
                  Twoje wyniki matur okazały się niewystarczające, aby zapisać cię na
                  jakikolwiek z wybranych kierunków. Wiele uczelni prowadzi dodatkowe
                  terminy zapisów, odwiedź ich strony aby dowiedzieć się więcej.
                </h5>
              </div>
            </div>
          </div>
          <h5 className="text-muted">Proces rekrutacji dobiegł końca.</h5>
        </div>
      );
    }
  } else if (role === ERoles.College) {
    if (results.status === EResults.Success) {
      return (
        <div className="container py-3">
          <h2 className="mb-3">Wyniki rekrutacji</h2>
          <div className="row justify-content-center">
            {results.courses?.map((c, i) => (
              <div className="col-md-8 mb-4" key={i}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{c.name}</h5>
                    <p className="card-text">
                      Zarejestrowano: {c.enrolled}/{c.capacity}
                    </p>
                    {(c.candidates?.size || 0) > 0 && (
                      <button
                        className={`btn ${
                          showStudentList[i] ? "btn-secondary" : "btn-primary"
                        }`}
                        onClick={() => {
                          setShowStudentList((prev) => {
                            const newShowStudentList = [...prev];
                            newShowStudentList[i] = !newShowStudentList[i];
                            return newShowStudentList;
                          });
                        }}
                      >
                        {showStudentList[i] ? "Schowaj" : "Pokaż"} listę studentów
                      </button>
                    )}
                    {showStudentList[i] && (
                      <ul className="list-group mt-3">
                        <li className="list-group-item" key={0}>
                          <div className="row">
                            <div className="col">
                              <span className="fw-bold">ID</span>
                            </div>
                            <div className="col">
                              <span className="fw-bold">Wynik</span>
                            </div>
                          </div>
                        </li>
                        {Array.from(c.candidates?.entries() || []).map(
                          ([userId, userScore], j) => (
                            <li className="list-group-item" key={j + 1}>
                              <div className="row">
                                <div className="col">{userId}</div>
                                <div className="col">{userScore}</div>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h5 className="text-muted mt-3">Proces rekrutacji dobiegł końca.</h5>
        </div>
      );
    } else if (results.status === EResults.Fail) {
      return (
        <div>
          <div className="container p-3">
            <h2>Wyniki rekrutacji</h2>
            <div className="d-flex justify-content-center p-3">
              <div className="w-50 p-3 mx-5 text-center border rounded border-danger">
                <h5>
                  Brak kandydatów, którzy zakwalifikowali się poprzez proces rekrutacji do
                  tej uczelni. Najprawdopodobniej wystąpił błąd i konieczny będzie kontakt
                  z administratorem strony.
                </h5>
              </div>
            </div>
          </div>
          <h5 className="text-muted">Proces rekrutacji dobiegł końca.</h5>
        </div>
      );
    }
  }
  return <></>;
};

export default Results;
