/**Class representing student, with his ID and list of preferences */
class Student {
  private id: string;
  private prefs: Pref[];

  constructor(id: string, prefs: Pref[]) {
    this.id = id;
    this.prefs = prefs;
  }

  /**Return most-favourite preference from the list. If list is empty return undefined. */
  currentPref(): Pref | undefined {
    if (!this.hasPrefsLeft()) return undefined;
    return this.prefs[0];
  }

  /**Remove most-favourite preference from student's list */
  shiftPrefs() {
    return this.prefs.shift();
  }

  /**True if list of preferences is not empty */
  hasPrefsLeft(): boolean {
    return this.prefs && this.prefs.length > 0;
  }

  getId() {
    return this.id;
  }
}

/** Class representing student's single preference.
 * Holds college & course IDs linked to it.
 */
export class Pref {
  private college: string;
  private course: string;

  constructor(college_id: string, course_id: string) {
    if (!college_id || !course_id) console.error("Empty string on Pref()");
    this.college = college_id;
    this.course = course_id;
  }

  getCollegeId() {
    return this.college;
  }

  getCourseId() {
    return this.course;
  }
}

export default Student;
