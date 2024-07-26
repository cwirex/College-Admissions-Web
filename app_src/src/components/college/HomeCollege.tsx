import React from "react";

const HomeCollege = () => {
  return (
    <div className="container">
      <h3 className="pt-4">Zarządzaj swoją uczelnią i kierunkami edukacyjnymi</h3>
      <div className="d-flex justify-content-center">
        <div className="w-50 py-3">
          <div className="row">
            <div className="col-sm-10">
              <p className="text-start">
                Witaj, drogi Moderatorze Uczelni! Cieszymy się, że jesteś z nami i chcesz
                przyciągnąć do swojej uczelni jak najwięcej studentów. Nasza platforma
                umożliwia Ci zarządzanie profilem Twojej uczelni w łatwy i przyjazny
                sposób.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <p className="text-end">
                W pierwszej kolejności możesz ustawić nazwę Twojej uczelni i dodać
                informacje o niej, które pomogą przyciągnąć studentów. Następnie, możesz
                dodawać kierunki studiów, które są oferowane. Pamiętaj, że opis kierunku
                jest bardzo ważny, aby zachęcić studentów. W panelu zarządzania
                kierunkami, masz również możliwość edycji wszystkich informacji, w tym
                liczby miejsc, wymaganych dokumentów oraz mnożników matur. Dzięki temu,
                możesz łatwo aktualizować i modyfikować informacje, aby zawsze mieć na
                bieżąco informacje dla studentów.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-10">
              <p className="text-start">
                Zapisy na studia są dla wielu maturzystów stresującym doświadczeniem.
                Dlatego nasza strona stworzona jest z myślą wygodnej komunikacji miedzy
                nimi a Waszą uczelnią.
              </p>
            </div>
          </div>
          <p className="lead text-centered p-2">
            Nasz zespół jest zawsze gotowy, aby Ci pomóc!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeCollege;
