import College, { Course } from "./college";
import Helper from "./helper";
import Student, { Pref } from "./student";

/**Class implemets Gale-Shapley algorithm*/
class GSAlgorithm {
  colleges: Map<string, College>;
  students: Map<string, Student>;
  constructor() {
    this.colleges = new Map();
    this.students = new Map();
  }

  /**Function initializes class with imported data, required step before calling run()*/
  initialize(): void {
    this.colleges = Helper.importColleges();
    this.students = Helper.importStudents();
  }

  /**Runs Gale-Shapley algorithm. Updates property colleges, from which results may be extracted later. */
  run(): void {
    let free_students = [...this.getStudentsList()];
    while (free_students.length > 0) {
      const fs = [...free_students];
      free_students = [];
      fs.forEach((student) => {
        const pref: Pref | undefined = student.currentPref();
        if (typeof pref === undefined) return;
        const coll: College = this.colleges.get(pref.getCollegeId());
        const cour: Course = coll.getCourse(pref.getCourseId());
        if (!cour.isFull()) {
          cour.enrollStudent(student.getId());
        } else {
          const bStudent: Student = this.students.get(cour.getLastEnrolled());
          if (!bStudent) return;
          if (cour.getScore(bStudent.getId()) < cour.getScore(student.getId())) {
            cour.removeLastEnrolled();
            cour.enrollStudent(student.getId());
            student = bStudent;
          }
          student.shiftPrefs();
          if (student.hasPrefsLeft()) {
            free_students.push(student);
          }
        }
      });
    }
  }

  /**Transforms map students into array and returns it*/
  getStudentsList(): Student[] {
    return Array.from(this.students.values());
  }

  /**Serialize & jsonify results */
  getSerializedResults(): string {
    const serial_res = [];
    this.colleges.forEach((c) => {
      serial_res.push(c.serialize());
    });
    return JSON.stringify(serial_res, null, 2);
  }
}

export default GSAlgorithm;
