import { IPreference } from "../../interfaces";
import Preference from "./Preference";

const Preferences = ({ prefs, onPrefUp, onPrefDown }: any) => {
  return (
    <section className="p-3">
      <h2>Moje kierunki</h2>
      <p>
        Lista kierunków na które kandydat jest zapisany. Możesz uszeregować kierunki od
        najbardziej do najmniej preferowanych.
      </p>
      <div className="container p-3">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-12 col-xl-10">
            <div className="card">
              <div className="card-body">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Uczelnia</th>
                      <th scope="col">Kierunek</th>
                      <th scope="col">Pozycja/Pojemność</th>
                      <th scope="col">Akcja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...prefs]
                      .sort((a, b) => a.pos - b.pos)
                      .map((pref: IPreference) => (
                        <Preference
                          key={pref.id}
                          pref={pref}
                          onPrefUp={onPrefUp}
                          onPrefDown={onPrefDown}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preferences;
