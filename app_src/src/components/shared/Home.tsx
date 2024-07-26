import React from "react";

const Home = () => {
  return (
    <div className="container">
      <h3 className="pt-4">
        Skuteczne rekrutacje z <span className="text-primary">EnrollApp</span>
      </h3>
      <div className="d-flex justify-content-center">
        <div className="w-50 py-3">
          <div className="row">
            <div className="col-sm-10">
              <p className="text-start">
                Witaj na naszej platformie rekrutacyjnej dla uczelni! Nasza strona to
                scentralizowany system, który umożliwia kandydatom z całej Polski
                przeglądanie kierunków studiów oferowanych przez uczelnie i zapisanie się
                na nie. Platforma korzysta z algorytmu Gale'a Shapleya, który pozwala na
                skuteczne i sprawiedliwe przypisanie kandydatów do uczelni na podstawie
                ich preferencji i wyników maturalnych.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <p className="text-end">
                Dzięki naszej platformie, kandydaci mogą dodawać swoje wyniki matur,
                przeglądać interesujące ich kierunki oraz zapisywać się na nie. Mogą
                również ustalać swoje preferencje w kolejce priorytetowej, aby jak
                najlepiej dopasować się do wymagań uczelni.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-10">
              <p className="text-start">
                Wszystkie profile uczelni na naszej platformie są zweryfikowane, aby
                zapewnić uczciwość rekrutacji. Nasza strona to idealne miejsce dla
                kandydatów, którzy chcą znaleźć swoją wymarzoną uczelnię oraz dla uczelni,
                które chcą przyciągnąć jak najwięcej utalentowanych studentów.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <p className="text-end">
                Moderatorzy uczelni, którzy zarządzają profilem swojej uczelni, mają
                możliwość dodawania kierunków studiów, modyfikowania informacji oraz
                edytowania opisów kierunków, aby przyciągnąć jak najwięcej studentów na
                swoją uczelnię.
              </p>
            </div>
          </div>
          <p className="lead text-centered p-2">Odkryj swój potencjał edukacyjny!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
