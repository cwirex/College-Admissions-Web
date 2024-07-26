import { User } from "firebase/auth";
import { Database, ref } from "firebase/database";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import { useObject } from "react-firebase-hooks/database";
import FbHelper from "../../firebase/dao";
import { ERoles, ICourse, IdName } from "../../interfaces";
import CardCourse from "./CardCourse";

const Profile = (props: { user: User; subjects: IdName[]; db: Database }) => {
  const [name, setName] = useState("");
  const [courses, setCourses] = useState<Array<ICourse>>([]);
  const [selCourse, setSelCourse] = useState("");
  const [showCourse, setShowCourse] = useState(false);
  const [courseData, setCourseData] = useState<ICourse>();

  const dbHelper = new FbHelper(props.db);

  const [dbColl, loadingColl, errorColl] = useObject(
    ref(props.db, `data/colleges/${props.user.uid}`)
  );

  useEffect(() => {
    if (dbColl && !loadingColl) {
      const college = FbHelper.transformCollege(dbColl, props.subjects);
      setName(college.name || "unknown");
      if (college.courses) {
        setCourses(college.courses);
      }
    }
  }, [dbColl, loadingColl, props.subjects]);

  const onCourseSelected = (e: any) => {
    setSelCourse(e.target.value);
    const selectedIndex = e.target.options.selectedIndex;
    const optionId = e.target.options[selectedIndex].getAttribute("data-key");
    if (e.target.value !== "" && courses) {
      const cour = courses.filter((course: ICourse) => course.id === optionId)[0];
      setCourseData(cour);
      setShowCourse(true);
    } else {
      setShowCourse(false);
    }
  };

  // const onMultRemove = (course_id: string, mult_id: string) => {
  //   courses.find((c) => c.id === course_id) !== undefined &&
  //     dbHelper.deleteMult(course_id, mult_id, props.user.uid);
  // };

  const onCourseUpdate = (course: ICourse) => {
    console.log("update course", course.id, course);
    dbHelper.updateCollegeCourse(course, props.user.uid);
  };

  const onNameChange = (e: any) => {
    const value = e.target.value || "";
    setName(value);
  };

  const onRename = () => {
    console.log("rename college:", name);
    dbHelper.updateCollegeName(props.user.uid, name);
  };

  const onCancel = () => {
    setSelCourse("");
    setShowCourse(false);
  };

  const handleNewCourse = () => {
    let newId = "cour-0" + Math.floor(Math.random() * 10000);
    while (courses.find((c) => c.id === newId) !== undefined) {
      newId = "cour-0" + Math.floor(Math.random() * 10000);
    }
    const newCourse: ICourse = {
      id: newId,
      name: "",
      capacity: 0,
      enrolled: 0,
      desc: "",
      multipliers: [],
    };
    setCourseData(newCourse);
    setShowCourse(true);
    setSelCourse("");
  };

  return (
    <div className="container p-3">
      <div className="border rounded p-3">
        <div className="form-group row p-2">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            Moderator
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              readOnly
              className="form-control-plaintext"
              id="staticEmail"
              value={props.user.email || "unknown"}
            />
          </div>
        </div>
        <div className="form-group row p-2">
          <label htmlFor="inputText" className="col-sm-2 col-form-label">
            Nazwa uczelni
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              id="inputCollegeName"
              placeholder="Nazwa uczelni"
              value={name}
              onChange={onNameChange}
            />
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-primary px-4"
              id="btnCollegeName"
              onClick={onRename}
            >
              Auktualnij
            </button>
          </div>
        </div>

        <div className="form-group row p-2">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            Lista kierunków
          </label>
          <div className="col-sm-8">
            <Form.Select id="selectCourse" value={selCourse} onChange={onCourseSelected}>
              <option key={0} data-key={0}></option>
              {courses &&
                courses.map((course) => (
                  <option key={course.id} data-key={course.id}>
                    {course.name}
                  </option>
                ))}
            </Form.Select>
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-primary px-4"
              id="btnAddCourse"
              onClick={handleNewCourse}
            >
              Dodaj
            </button>
          </div>
        </div>
        {showCourse && courseData && (
          <CardCourse
            course={courseData}
            subjects={props.subjects}
            onCourseUpdate={onCourseUpdate}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
