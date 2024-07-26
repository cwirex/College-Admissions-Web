import College, { Course } from "./college";
import Student, { Pref } from "./student";
import fs from "fs";
const readline = require("readline");
import GSAlgorithm from "algorithm";

/**Class with static methods, for importing data */
class Helper {
  private static fData: any;

  /** Loads file to Helper context */
  static getFileContents(filename: string): any {
    Helper.fData = require(`./data/${filename}`);
  }

  /**Imports colleges in a predifined format.
   * File path name is static (can be changed in helper.ts)
   */
  static importColleges(): Map<string, College> {
    const colleges = new Map<string, College>();
    try {
      const colls = Helper.fData.colleges;
      // Loop over colleges
      Object.keys(colls).forEach((id) => {
        const cs_data = colls[id].Courses;
        if (!cs_data) return;
        // Map course_id => course_data
        const courses_map = new Map<string, Course>();
        // Loop over each course (in given college)
        Object.keys(cs_data).forEach((cs_id) => {
          // Save course capacity
          const cap_val = cs_data[cs_id].capacity || 0;

          // Look for candidates' data
          const cd_data = cs_data[cs_id].candidates;
          if (!cd_data) return;
          // Map candidate_id => candidate_score
          const cd_map = new Map<string, number>();
          // Loop over candidates (in given course)
          Object.keys(cd_data).forEach((cd_id) => {
            cd_map.set(cd_id, cd_data[cd_id]);
          });
          // Update courses map (with new course)
          courses_map.set(cs_id, new Course(cs_id, cap_val, cd_map));
        });
        // Update colleges map (with new college)
        colleges.set(id, new College(id, courses_map));
      });
    } catch (error) {
      // In case of error while importing data (eg. invalid data format)
      console.error("Error on import: ", error);
    } finally {
      return colleges;
    }
  }

  /**Imports students in a predifined format.
   * File path name is static (can be changed in helper.ts)
   */
  static importStudents(): Map<string, Student> {
    const students = new Map<string, Student>();
    try {
      const sts_data = Helper.fData.students;
      // Loop over students
      Object.keys(sts_data).forEach((id) => {
        const prefs_data = sts_data[id].Preferences;
        if (!prefs_data) return;
        // Map pref: priority => pref_data
        const prefs_map = new Map<number, Pref>();
        Object.keys(prefs_data).forEach((p_id) => {
          // Save pref priority (position)
          const p_data = prefs_data[p_id];
          const prio = p_data.pos;

          // Update preference map (with new preference)
          prefs_map.set(prio, new Pref(p_data.coll, p_data.cour));
        });
        // Convert map to sorted array (by priority keys)
        const prefsArr: Pref[] = Array.from(
          new Map([...prefs_map.entries()].sort((a, b) => a[0] - b[0])).values()
        );
        // Update students map (with new student)
        students.set(id, new Student(id, prefsArr));
      });
    } catch (error) {
      // In case of error while importing data (eg. invalid data format)
      console.error("Error on import: ", error);
    } finally {
      return students;
    }
  }

  static mergeResults(algorithm: GSAlgorithm, filename: string) {
    const colleges = new Map<string, any>();
    const students = new Map<string, any>();
    algorithm.colleges.forEach((c) => {
      // link result to college:
      colleges.set(c.getId(), c.serialize());
      c.getCourses().forEach((cs) => {
        while (cs.countEnrolled() > 0) {
          // link result to student:
          const studentID = cs.getLastEnrolled();
          students.set(studentID, {
            coll: c.getId(),
            cour: cs.getId(),
            rank: cs.countEnrolled(),
          });
          cs.removeLastEnrolled();
        }
      });
    });

    const results = {
      ready: true,
      colleges: Object.fromEntries(
        Array.from(colleges).map(([collegeID, collegeDATA]) => [collegeID, collegeDATA])
      ),
      students: Object.fromEntries(
        Array.from(students).map(([studentID, studentDATA]) => [studentID, studentDATA])
      ),
    };

    const results_json = JSON.parse(JSON.stringify({ results: results }));
    const data_json = JSON.parse(JSON.stringify(Helper.fData));
    const merged_json = {
      ...data_json,
      ...results_json,
    };
    this.export2Json(JSON.stringify(merged_json), `./data/${filename}`);
  }

  /** Exports data into a json file */
  static export2Json(data: string, path: string) {
    fs.writeFile(path, data, (err: any) => {
      if (!!err) console.log(err);
      else console.log("File written successfully");
    });
  }
}

export default Helper;
