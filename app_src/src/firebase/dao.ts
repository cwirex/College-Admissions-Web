import {
  child,
  Database,
  DatabaseReference,
  DataSnapshot,
  push,
  ref,
  set,
  update,
  remove,
} from "firebase/database";
import {
  EResults,
  ERoles,
  ICollege,
  ICourse,
  IdName,
  IMultiScore,
  IPreference,
  IResults,
} from "../interfaces";

import { IDbCourse, IDbMult, IDbPreference, IDbScore } from "./dto";

class FbHelper {
  db: Database;
  dbRef: DatabaseReference;
  constructor(db: Database) {
    this.db = db;
    this.dbRef = ref(db);
  }

  getStudentRef(uid: string) {
    return ref(this.db, `data/students/${uid}`);
  }

  getStudentPath(uid: string) {
    return `data/students/${uid}`;
  }

  writeNewScore(id: string, bas: number, adv: number, uid: string) {
    const scoreData: IDbScore = { adv, bas, sub: id };
    // const newKey = push(child(this.getStudentRef(uid), "Scores")).key || "";
    const updates: any = {};
    updates[this.getStudentPath(uid) + "/Scores/" + id] = scoreData;
    return update(this.dbRef, updates);
  }

  writeNewPreference(
    id: string,
    collId: string,
    courId: string,
    pos: number,
    uid: string
  ) {
    const data: IDbPreference = { coll: collId, cour: courId, pos };
    const updates: any = {};
    updates[this.getStudentPath(uid) + "/Preferences/" + id] = data;
    return update(this.dbRef, updates);
  }

  updatePrefPos(db: Database, id: string, newPos: number, uid: string) {
    set(ref(db, `${this.getStudentPath(uid)}/Preferences/${id}/pos`), newPos);
  }

  updateCollegeName(id: string, name: string) {
    set(ref(this.db, `data/colleges/${id}/name`), name);
  }

  updateCollegeCourse(course: ICourse, uid: string) {
    const multipliers: Map<string, IDbMult> = new Map();
    course.multipliers &&
      course.multipliers.forEach((c) => {
        multipliers.set(c.id, { adv: c.advanced, bas: c.basic });
      });
    const data: any = {
      name: course.name,
      desc: course.desc || "",
      capacity: course.capacity || 0,
      enrolled: course.enrolled || 0,
    };

    set(ref(this.db, `data/colleges/${uid}/Courses/${course.id}`), data).then(() => {
      const updates: any = {};
      course.multipliers &&
        course.multipliers.forEach((c) => {
          updates[`data/colleges/${uid}/Courses/${course.id}/Multipliers/${c.id}`] = {
            adv: c.advanced,
            bas: c.basic,
          };
        });
      update(this.dbRef, updates)
        .then(() => window.alert("Success! Course updated."))
        .catch((e) => console.error(e));
    });
  }

  deleteScore(sid: string, uid: string) {
    const path = `data/students/${uid}/Scores/${sid}`;
    remove(ref(this.db, path)).catch((e) => {
      console.error(`dao.deleteScore(${sid}, ${uid})`, e.messege);
    });
  }

  deleteMult(cid: string, mid: string, uid: string) {
    const path = `data/colleges/${uid}/Courses/${cid}/Multipliers/${mid}`;
    remove(ref(this.db, path)).catch((e) => {
      console.error(`dao.deleteMult(${cid}, ${mid}, ${uid})`, e.messege);
    });
  }

  static transformModerators(
    snapshot: DataSnapshot
  ): import("react").SetStateAction<string[]> {
    const result: string[] = [];
    snapshot &&
      snapshot.forEach((el) => {
        result.push(el.val());
      });
    console.log(result);
    return result;
  }

  static transformScores(snapshot: any, subjects: any) {
    const result: Array<IMultiScore> = [];
    if (snapshot && snapshot.Scores) {
      const scores = snapshot.Scores;
      const sKeys = Object.keys(scores);
      sKeys.forEach((k) => {
        result.push({
          id: scores[k].sub,
          basic: scores[k].bas,
          advanced: scores[k].adv,
          name: subjects.find((s: IdName) => s.id === scores[k].sub).name || "",
        });
      });
    }
    return result;
  }

  static transformSubjects(snapshot: any) {
    const data: Array<IdName> = [];
    if (snapshot) {
      snapshot.forEach((element: any) => {
        const key = element.key;
        const val = element.val();
        const subj = { id: key, name: val };
        data.push(subj);
      });
    }
    return data;
  }

  static extractCourseData(course: any, subjects: any, CID: any): ICourse {
    const multArr: Array<IMultiScore> = [];
    const mults = course.Multipliers;

    // Iterate over each multiplier in course (if it exists)
    if (mults) {
      Object.keys(mults).forEach((mk: string) => {
        const sname = subjects.find((s: IdName) => s.id === mk).name;
        multArr.push({
          id: mk,
          name: sname,
          basic: mults[mk].bas,
          advanced: mults[mk].adv,
        });
      });
    }

    const cddsMap: Map<string, number> = new Map();
    const cdds = course.candidates;
    // Iterate over each cdd in cdds (if it exists)
    if (cdds) {
      Object.keys(cdds).forEach((id: string) => {
        cddsMap.set(id, cdds[id]);
      });
    }

    // Return extracted data for this course
    return {
      id: CID,
      name: course.name,
      capacity: course.capacity,
      enrolled: course.enrolled,
      desc: course.desc,
      multipliers: multArr,
      candidates: cddsMap,
    };
  }

  static transformCourses(data: any, collegeId: string, subjects: any) {
    const coursesArr: Array<ICourse> = [];
    if (data) {
      data.forEach((element: any) => {
        if (element.key === collegeId) {
          const courses = element.val().Courses;
          // Iterate over courses:
          const keys = Object.keys(courses);
          keys.forEach((k: string) => {
            // Insert collected data for this course into coursesArr:
            const course = this.extractCourseData(courses[k], subjects, k);
            coursesArr.push(course);
          });
        }
      });
    }
    return coursesArr;
  }

  static transformResults(
    dbResults: DataSnapshot | undefined,
    uid: string,
    role: ERoles
  ) {
    let result: IResults = {
      status: EResults.NotReady,
    };
    if (dbResults && dbResults.val().ready === true) {
      // Process results since they are ready:
      if (role === ERoles.Student) {
        try {
          const students = dbResults.val().students;
          const ids = Object.keys(students);
          if (ids.includes(uid)) {
            result.courseId = students[uid].cour;
            result.universityId = students[uid].coll;
            result.status = EResults.Success;
          } else {
            result.status = EResults.Fail;
          }
        } catch {
          console.warn("Caught exception on transformResults().student");
        }
      } else if (role === ERoles.College) {
        try {
          const colleges = dbResults.val().colleges;
          console.log(colleges["coll-01"].courses);
          const ids = Object.keys(colleges);
          if (ids.includes(uid) && colleges[uid].courses) {
            const courses = colleges[uid].courses;
            const courses_res: Array<ICourse> = [];
            courses.forEach((course: any) => {
              const candidates = new Map<string, number>(); // uid, priority
              if (!!course.enrolled) {
                course.enrolled.forEach((candidate: any) => {
                  candidates.set(candidate.element, candidate.priority);
                });
              }
              const course_res: ICourse = {
                id: course.id,
                name: "",
                candidates: candidates,
                enrolled: candidates.size,
                capacity: course.capacity,
              };
              courses_res.push(course_res);
            });
            result.courses = courses_res;
            result.status = EResults.Success;
          } else {
            result.status = EResults.Fail;
          }
        } catch {
          console.error("Caught exception on transformResults().college");
        }
      }
    }
    console.log("Result info", result);
    return result;
  }

  static transformColleges(data: any, subjects: any): ICollege[] {
    const collegesArr: Array<ICollege> = [];
    if (data) {
      data.forEach((element: any) => {
        const coursesArr: Array<ICourse> = [];
        const courses = element.val().Courses;

        // Iterate over courses:
        const keys = Object.keys(courses);
        keys.forEach((k: string) => {
          // Insert collected data for this course into coursesArr:
          const course = this.extractCourseData(courses[k], subjects, k);
          coursesArr.push(course);
        });

        // Insert collected data for this college into collegesArr:
        collegesArr.push({
          id: element.key,
          name: element.val().name,
          courses: coursesArr,
        });
      });
    }
    return collegesArr;
  }

  static transformCollege(snapshot: any, subjects: any) {
    if (snapshot && snapshot.val()) {
      const coursesArr: Array<ICourse> = [];
      const courses = snapshot.val().Courses;

      // Iterate over courses:
      const keys = Object.keys(courses);
      keys.forEach((k: string) => {
        // Insert collected data for this course into coursesArr:
        const course = this.extractCourseData(courses[k], subjects, k);
        coursesArr.push(course);
      });

      return {
        id: snapshot.key,
        name: snapshot.val().name,
        courses: coursesArr,
      };
    }
    return {};
  }

  static transformPrefs(snapshot: any, univCourses: Array<ICollege>, uid: string) {
    const result: Array<IPreference> = [];
    if (snapshot && snapshot.Preferences) {
      const prefs = snapshot.Preferences;
      const pKeys = Object.keys(prefs);
      pKeys.forEach((k) => {
        // find matching college:
        const univ = univCourses.find((univ) => univ.id === prefs[k].coll);
        if (!univ) return result;

        // find matching course:
        const cour = univ.courses.find((c) => c.id === prefs[k].cour);
        if (!cour) return result;

        // try to rank user:
        let rank = 0;
        if (cour.candidates) {
          if (cour.candidates.has(uid)) {
            const userScore = cour.candidates.get(uid);
            const cdds = Array.from(cour.candidates.values());
            cdds.sort((a, b) => b - a);
            for (let i = 0; i < cdds.length; i++) {
              if (cdds[i] === userScore) {
                rank = i + 1;
                break;
              }
            }
          }
        }

        result.push({
          id: k,
          pos: prefs[k].pos,
          universityId: univ.id,
          university: univ.name,
          courseId: cour.id,
          course: cour.name,
          enrolled: cour.enrolled || 0,
          capacity: cour.capacity || 0,
          rank: rank,
        });
      });
    }
    return result;
  }
}

export default FbHelper;
