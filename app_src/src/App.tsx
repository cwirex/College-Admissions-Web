import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/auth/Header";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import Scores from "./components/student/Scores";
import Majors from "./components/student/Majors";
import Preferences from "./components/student/Preferences";
import Results from "./components/student/Results";
import Footer from "./components/shared/Footer";
import { Route, Routes, useNavigate } from "react-router-dom";
import Logout from "./components/auth/Logout";
import PrivateRoute from "./components/auth/PrivateRoute";
import {
  IPreference,
  IdName,
  IRegister,
  ILogin,
  IResults,
  EResults,
  IMultiScore,
  ICollege,
  ERoles,
} from "./interfaces";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useObject } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";
import FbHelper from "./firebase/dao";
import { firebaseConfig } from "./firebase/config";
import { getDatabase, ref, onValue, DataSnapshot } from "firebase/database";
import HeaderStudent from "./components/student/HeaderStudent";
import SignIn from "./components/auth/SignIn";
import HeaderCollege from "./components/college/HeaderCollege";
import Profile from "./components/college/Profile";
import Page404 from "./components/shared/Page404";
import Home from "./components/shared/Home";
import HomeStudent from "./components/student/HomeStudent";
import HomeCollege from "./components/college/HomeCollege";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const dbHelper = new FbHelper(db);

function App() {
  ////  DB LISTENERS  \\\\
  const [dbSubjects, loadingSubjects, errorSubjects] = useObject(
    ref(db, "data/subjects")
  );
  const [dbColleges, loadingColleges, errorColleges] = useObject(
    ref(db, "data/colleges")
  );
  const [dbResults, loadingResults, errorResults] = useObject(ref(db, "data/results"));

  const [dbStudent, setDbStudent] = useState<DataSnapshot>();
  const [loadingStudent, setLoadingStudent] = useState(true);
  function setUserListener(uid: string) {
    setLoadingStudent(true);
    const uRef = dbHelper.getStudentRef(uid);
    onValue(uRef, (snapshot) => {
      const data = snapshot.val();
      setDbStudent(data);
      setLoadingStudent(false);
    });
  }

  ////  APP STATES  \\\\
  const [user] = useAuthState(auth);
  const [role, setRole] = useState<ERoles>(ERoles.None);
  const [subjects, setSubjects] = useState<Array<IdName>>([]);
  const [colleges, setColleges] = useState<Array<ICollege>>([]);
  const [scores, setScores] = useState<Array<IMultiScore>>([]);
  const [prefs, setPrefs] = useState<Array<IPreference>>([]);
  const [results, setResults] = useState<IResults>({
    status: EResults.NotReady,
  });
  const [subjectsReady, setSubjectsReady] = useState(false);
  const [univCoursesReady, setUnivCoursesReady] = useState(false);

  ////  DB-LOCAL SYNC  \\\\
  useEffect(() => {
    if (!loadingStudent && subjectsReady && user) {
      // console.log(dbStudent);
      setScores(FbHelper.transformScores(dbStudent, subjects));
    } // Sync Student
  }, [dbStudent, subjectsReady, user]);

  useEffect(() => {
    if (!loadingSubjects && user) {
      setSubjects(FbHelper.transformSubjects(dbSubjects));
      setSubjectsReady(true);
    } // Sync Subjects
    errorSubjects && console.error(errorSubjects);
  }, [dbSubjects, user]);

  useEffect(() => {
    if (!loadingColleges && subjectsReady && user) {
      setColleges(FbHelper.transformColleges(dbColleges, subjects));
      setUnivCoursesReady(true);
    } // Sync all Colleges and Courses
    errorColleges && console.error(errorColleges);
  }, [dbColleges, subjectsReady, user]);

  useEffect(() => {
    if (univCoursesReady && !loadingStudent && user) {
      setPrefs(FbHelper.transformPrefs(dbStudent, colleges, user.uid));
    } // Sync Student.Prefs
  }, [univCoursesReady, colleges, dbStudent]);

  // Sync results:
  useEffect(() => {
    if (!loadingResults && user) {
      setResults(FbHelper.transformResults(dbResults, user.uid, role));
    }
  }, [dbResults, user, role]);

  // Update results (set names)
  useEffect(() => {
    if (!loadingResults && user && univCoursesReady) {
      if (results && results.status !== EResults.NotReady) {
        fillResults();
      }
    }
  }, [results, user, univCoursesReady]);

  useEffect(() => {
    // Menage saved roles state
    if (user && user.uid) {
      const savedUID = localStorage.getItem("savedUID");
      const savedRole = localStorage.getItem("savedRole") || ERoles.Student.toString();
      if (
        role === ERoles.College ||
        (Number.parseInt(savedRole) == ERoles.College && user.uid === savedUID)
      ) {
        setRole(ERoles.College);
        navigate("/college");
      } else {
        setRole(ERoles.Student);
        localStorage.setItem("savedUID", user.uid);
        localStorage.setItem("savedRole", ERoles.Student.toString());
        setUserListener(user.uid);
        if (!window.location.pathname.startsWith("/student")) navigate("/student");
      }
    } else {
      setRole(ERoles.None);
    }
  }, [user]);

  ////  APP FUNCTIONS  \\\\
  const navigate = useNavigate();

  const onRegisterRequest = ({ email, pesel, password }: IRegister) => {
    console.log("register", email, pesel, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((creds) => {
        setRole(ERoles.Student);
        navigate("/student");
      }) // Registered
      .catch((e) => console.error(e.message));
  };

  const onLoginRequest = ({ email, password }: ILogin) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setRole(ERoles.Student);
        navigate("/student");
      }) // Signed in
      .catch((e) => console.error(e.message));
  };

  const onLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
        localStorage.removeItem("savedUID");
        localStorage.removeItem("savedRole");
        setRole(ERoles.None);
        navigate("/logout");
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  const onScoreAdd = ({ id, name, basic, advanced }: IMultiScore) => {
    const score = { id, name, basic, advanced };
    setScores([...scores, score]);
    console.log(id, name, basic, advanced, "Add score");
    if (user) {
      dbHelper.writeNewScore(id, basic, advanced, user.uid);
    }
  };

  const onScoreRemove = (sid: string) => {
    if (user && scores.find((s) => s.id === sid) !== undefined) {
      dbHelper.deleteScore(sid, user.uid);
    }
  };

  const onAddMajorAsPref = ({
    courseId,
    universityId,
  }: {
    courseId: string;
    universityId: string;
  }) => {
    const univ = colleges.find((u) => u.id === universityId);
    if (!univ) return;
    const cour = univ.courses.find((c) => c.id === courseId);
    if (!cour) return;
    if (prefs.find((p) => p.id === `pref-${universityId}-${courseId}`)) {
      alert("Already in your preferences.");
      return;
    }
    const newPos = prefs.length + 1;
    const pref = {
      id: `pref-${universityId}-${courseId}`,
      pos: newPos,
      university: univ.name || "",
      course: cour.name,
      enrolled: cour.enrolled || 0,
      capacity: cour.capacity || 0,
      universityId,
      courseId,
    };
    setPrefs([...prefs, pref]);
    user &&
      dbHelper.writeNewPreference(pref.id, universityId, courseId, newPos, user.uid);
    navigate("/student/preferences");
  };

  const onPrefUp = (id: string) => {
    const pref = prefs.find((p) => p.id === id);
    if (pref && pref.pos > 1) {
      console.log(pref.id, pref.course, "move up");
      movePref(pref, 1);
    }
  };

  const onPrefDown = (id: string) => {
    const pref = prefs.find((p) => p.id === id);
    if (pref && pref.pos != prefs.length) {
      console.log(pref.id, pref.course, "move down");
      movePref(pref, -1);
    }
  };

  const movePref = (pref: any, d: number) => {
    const pref2 = prefs.find((p) => p.pos + d == pref.pos);
    if (pref2) {
      setPrefs(
        prefs.map((p) => {
          if (p.id == pref.id) {
            p.pos -= d;
            user && dbHelper.updatePrefPos(db, p.id, p.pos, user.uid);
          }
          if (p.id == pref2.id) {
            p.pos += d;
            user && dbHelper.updatePrefPos(db, p.id, p.pos, user.uid);
          }
          return p;
        })
      );
    }
  };

  const fillResults = () => {
    if (role === ERoles.Student) {
      const coll = colleges.find((c) => c.id === results.universityId);
      const cour = coll?.courses.find((c) => c.id === results.courseId);
      setResults({ university: coll?.name || "", course: cour?.name || "", ...results });
    } else if (role === ERoles.College) {
      const college = colleges.find((c) => c.id === user?.uid);
      results.courses?.forEach((c) => {
        c.name = college?.courses.find((course) => course.id === c.id)?.name || "";
      });
      console.log(results);
    }
  };

  ////  RETURN  \\\\
  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* HEADER */}
      {!user ? (
        <Header />
      ) : role === ERoles.Student ? (
        <HeaderStudent auth={user} onLogout={onLogout} />
      ) : (
        role === ERoles.College && <HeaderCollege auth={user} onLogout={onLogout} />
      )}
      {/* BODY */}
      <Routes>
        {/* AUTH */}
        <Route index element={<Home />} />
        <Route path="auth">
          <Route
            path="login"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <LoginForm onLogin={onLoginRequest} />
              </PrivateRoute>
            }
          />
          <Route
            path="register"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <RegisterForm onRegister={onRegisterRequest} />
              </PrivateRoute>
            }
          />
          <Route
            path="signInLink"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <SignIn auth={auth} setRole={setRole} db={db} />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="/logout" element={<Logout />} />

        {/* STUDENT */}
        <Route path="student">
          <Route
            index
            element={
              <PrivateRoute auth={!!user} role={role}>
                <HomeStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="majors"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <Majors colleges={colleges} onAddAsPref={onAddMajorAsPref} />
              </PrivateRoute>
            }
          />
          <Route
            path="scores"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <Scores
                  sscores={scores}
                  ssubjects={subjects}
                  onFormSubmit={onScoreAdd}
                  onScoreRemove={onScoreRemove}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="preferences"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <Preferences prefs={prefs} onPrefUp={onPrefUp} onPrefDown={onPrefDown} />
              </PrivateRoute>
            }
          />
          <Route
            path="results"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <Results results={results} role={role} />
              </PrivateRoute>
            }
          />
        </Route>
        {/* COLLEGE */}
        <Route path="college">
          <Route
            index
            element={
              <PrivateRoute auth={!!user} role={role}>
                <HomeCollege />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute auth={!!user} role={role}>
                {user ? (
                  <Profile user={user} subjects={subjects} db={db} />
                ) : (
                  <p>Missing profile component: user not defined</p>
                )}
              </PrivateRoute>
            }
          />
          <Route
            path="results"
            element={
              <PrivateRoute auth={!!user} role={role}>
                <Results results={results} role={role} />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
