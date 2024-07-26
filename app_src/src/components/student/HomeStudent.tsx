import React from "react";

const HomeStudent = () => {
  return (
    <div className="container">
      <h3 className="pt-4">Stwórz swoją edukacyjną przyszłość</h3>
      <div className="d-flex justify-content-center">
        <div className="w-50 py-3">
          <div className="row">
            <div className="col-sm-10">
              <p className="text-start">
                Witaj na naszej platformie! Tutaj masz możliwość przeglądania i
                zapisywania się na swoje wymarzone studia. Nasz scentralizowany system
                umożliwia zapisy na wszystkie kierunki na wszystkich uczelniach. Bez
                względu na to, gdzie chcesz studiować i jakie są Twoje preferencje,
                znajdziesz tutaj wszystko, czego potrzebujesz!
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <p className="text-end">
                Jako kandydat możesz dodawać swoje wyniki matur, przeglądać interesujące
                Cię kierunki i zapisywać się na nie. Możesz ustalać swoje preferencje, aby
                zwiększyć swoje szanse na dostanie się na wymarzone studia. Na naszej
                stronie masz również dostęp do bogatej bazy danych kierunków studiów na
                różnych uczelniach, dzięki czemu możesz poznać szczegóły każdego kierunku,
                sprawdzić jego wymagania i zdecydować, który z nich będzie dla Ciebie
                najlepszy.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-10">
              <p className="text-start">
                Zapisy na studia są dla wielu maturzystów stresującym doświadczeniem.
                Dlatego nasza strona stworzona jest z myślą o Tobie i Twoim komforcie.
              </p>
            </div>
          </div>
          <p className="lead text-centered p-2">
            Nie trać czasu i zapisz się na studia już dziś!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeStudent;
