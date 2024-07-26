import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { ICourse, IdName, ICollege } from "../../interfaces";
import Major from "./Major";

const Majors = ({
  colleges,
  onAddAsPref,
}: {
  colleges: Array<ICollege>;
  onAddAsPref: any;
}) => {
  const [selCollege, setSelCollege] = useState<IdName>({
    id: "",
    name: "",
  });
  const [selCourse, setSelCourse] = useState("");
  const [courseData, setCourseData] = useState<ICourse>();
  const [scEnabled, setScEnabled] = useState(false);
  const [majorEnabled, setMajorEnabled] = useState(false);
  const [courses, setCourses] = useState<Array<ICourse>>();

  useEffect(() => {
    if (colleges && selCollege.name !== "") {
      const uCourses = colleges.find((c) => c.id === selCollege.id);
      uCourses && setCourses(uCourses.courses);
    }
  }, [colleges, selCollege]);

  const onAddAsPrefHandle = ({ courseId }: { courseId: string }) => {
    onAddAsPref({ courseId, universityId: selCollege.id });
  };

  const onUniversitySelected = (e: any) => {
    const selectedIndex = e.target.options.selectedIndex;
    const optionId = e.target.options[selectedIndex].getAttribute("data-key");
    setSelCollege({ id: optionId, name: e.target.value });
    setScEnabled(e.target.value !== "");
    setMajorEnabled(false);
    setSelCourse("");
  };

  const onCourseSelected = (e: any) => {
    setSelCourse(e.target.value);
    const selectedIndex = e.target.options.selectedIndex;
    const optionId = e.target.options[selectedIndex].getAttribute("data-key");
    if (e.target.value !== "" && courses) {
      console.log(optionId, e.target.value);
      const major = courses.filter((course: ICourse) => course.id == optionId)[0];
      setCourseData(major);
      setMajorEnabled(true);
    } else {
      setMajorEnabled(false);
    }
  };

  return (
    <>
      <h2 className="p-3">Wyszukiwarka kierunków</h2>
      <div className="d-flex justify-content-center">
        <Form className="w-50">
          {/* UNIVERSITY */}
          <Form.Group className="mb-3">
            <Form.Label>Wybierz uczelnię</Form.Label>
            <Form.Select
              id="selectUniversity"
              value={selCollege.name}
              onChange={onUniversitySelected}
            >
              <option key={0} data-key={0}></option>
              {colleges.map((college: ICollege) => (
                <option key={college.id} data-key={college.id}>
                  {college.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* COURSE */}
          {scEnabled && (
            <Form.Group className="mb-3">
              <Form.Label>Wybierz kierunek</Form.Label>
              <Form.Select
                id="selectCourse"
                value={selCourse}
                onChange={onCourseSelected}
              >
                <option key={0} data-key={0}></option>
                {courses &&
                  courses.map(
                    (course: { id: React.Key | null | undefined; name: string }) => (
                      <option key={course.id} data-key={course.id}>
                        {course.name}
                      </option>
                    )
                  )}
              </Form.Select>
            </Form.Group>
          )}
          {/* COURSE INFO */}
          {majorEnabled && courseData && (
            <Major major={courseData} onAddAsPref={onAddAsPrefHandle} />
          )}
        </Form>
      </div>
    </>
  );
};

export default Majors;
