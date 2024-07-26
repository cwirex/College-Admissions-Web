import {
  Auth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { Database, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useObject } from "react-firebase-hooks/database";
import FbHelper from "../../firebase/dao";
import { ERoles, IdName } from "../../interfaces";

const actionCodeSettings = {
  // URL you want to redirect back to:
  url: "http://localhost:3000/auth/signInLink", // local
  // url: "https://collegeadmission-lic.web.app/auth/signInLink", // hosting
  handleCodeInApp: true, // This must be true.
};

const SignIn = ({ auth, setRole, db }: { auth: Auth; setRole: any; db: Database }) => {
  const [dbMods, loadingMods, errorMods] = useObject(ref(db, "admin/moderators"));
  const [mods, setMods] = useState<Array<string>>([]);
  useEffect(() => {
    if (!loadingMods && dbMods) {
      setMods(FbHelper.transformModerators(dbMods));
    }
  }, [dbMods, loadingMods]);

  const sendLink = (email: string) =>
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        window.alert(
          `Wiadomość z linkiem do logowania została wysłana na adres'${email}'. Sprawdź skrzynkę pocztową i folder spam.`
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });

  const signIn = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Wprowadź adres email zautoryzowanej uczelni.");
      }
      email &&
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem("emailForSignIn");
            console.log("Zaloguj na konto uczelni");
            const user: IdName = {
              id: result.user.uid || "",
              name: "college",
            };
            localStorage.setItem("savedUID", result.user.uid || "");
            localStorage.setItem("savedRole", ERoles.College.toString());
            setRole(ERoles.College);
          })
          .catch((error) => {
            window.alert("Nieprawidłowy adres linku");
            console.error(error.message);
          });
    } else {
      window.alert(
        "Sprawdź skrzynkę pocztową. Do zalogowania niezbędny jest najnowszy link."
      );
    }
  };
  const onSendEmail = () => {
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Wprowadź adres email zautoryzowanej uczelni");
    }
    if (email && mods.find((modEmail) => modEmail === email) !== undefined) {
      sendLink(email);
    } else {
      window.alert(
        "Nie rozpoznano adresu email uczelni. Prosimy o kontakt z administratorem strony."
      );
    }
  };
  return (
    <div className="conitaner p-3">
      <h4 className="text-dark">
        Punkt logowania dla zautoryzowanych moderatorów uczelni
      </h4>
      <button className="btn btn-primary m-1" onClick={signIn}>
        Zaloguj
      </button>
      <button className="btn btn-secondary m-1" onClick={onSendEmail}>
        Wygeneruj link
      </button>
    </div>
  );
};

export default SignIn;
