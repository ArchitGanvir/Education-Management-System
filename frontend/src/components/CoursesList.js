import React, { useState, useEffect } from "react";
import CourseService from "../services/course.service";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import SubService from "../services/subs.service";
import LectService from "../services/lect.service";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [viewAll, setViewAll] = useState(false);
  const [subs, setSubs] = useState([]);
  const [lects, setLects] = useState([]);

  useEffect(() => {
    // retrieveCourses();
    // retrieveSubs();
    refreshList();
  }, []);

  

  const retrieveSubs = () => {
    SubService.getAllSubs()
    .then(response => {
      setSubs(response.data.filter((sub) => sub.user_id === currentUser.username));
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }

  const checkSub = (course) => {
    const list = subs.filter((sub) => sub.course_id === course.title);
    if(list.length === 0){
      return false;
    }
    else return true;
  }
 
  const navigate = useNavigate();

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveCourses = () => {
    CourseService.getAllCourses()
      .then(response => {
        setCourses(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveLects = () => {
    LectService.getAllLects(currentCourse.title)
      .then(response => {
        setLects(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const addLect = () => {
    navigate('/lects/' + currentCourse.title);
  }

  const refreshList = () => {
    retrieveCourses();
    retrieveSubs();
    setCurrentCourse(null);
    setCurrentIndex(-1);
  };

  const setActiveCourse = (course, index) => {
    setCurrentCourse(course);
    setCurrentIndex(index);
    console.log(currentCourse);
    console.log(currentIndex);
    //setCurrentSub(() => subs.find((sub) => {sub.course_id === course.title}))
  };

  const addCourse = () => {
    navigate("/courses/add");
  }

  const getCourseByTitle = () => {
    CourseService.getCourseByTitle(searchTitle)
      .then(response => {
        setCourses(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div >
      {/*This is the search bar*/}
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={getCourseByTitle}
            >
              Search
            </button>
          </div>
        </div>
        <button
          className="m-3 btn btn-sm btn-success"
          onClick={() => setViewAll(true)}
        >
          View All Courses
      </button>
      </div>

      {/* This is the instructor portion */}
      {currentUser.authority === "Instructor" && (<div>
        {!viewAll && (
        <div className="col-md-8 row-mr-5">
        <h4>My Courses</h4>

        <ul className="list-group">
          {courses && 
            courses.filter((course) => course.instructor === currentUser.username).map((course, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveCourse(course, index)}
                key={index}
              >
                {course.title} : {course.description} : {course.instructor}
              </li>
            ))}
        </ul>

        {currentUser.authority === "Instructor" && (<button
          className="m-3 btn btn-sm btn-success"
          onClick={addCourse}
        >
          Add Course
        </button>)}

      </div>
)}
      {!viewAll && (<div className="col-md-8">
        {currentCourse ? (
          <div>
            <h4>Course</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentCourse.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentCourse.description}
            </div>
            <div>
              <label>
                <strong>Instructor:</strong>
              </label>{" "}
              {currentCourse.instructor}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentCourse.published ? "Published" : "Pending"}
            </div>

          {lects.length === 0 && (
            <button className="btn btn-success m-2 mr-3" onClick={retrieveLects}>
              Show Lectures
            </button>
          )}

          {lects.length > 0 &&(<strong>Lectures</strong>)}
          {console.log(lects)}
          <ul className="list-group">
          {lects &&
            (lects.map(lect => (
              <li
                // className={
                //   "list-group-item "
                // }
              >
              {console.log(lect.title)}
                {lect.title} : <a href={lect.link} className="badge badge-info">Watch.</a>
              </li>
            ))
            )}
          </ul>
          {lects.length > 0 && (
            <button className="badge badge-info" onClick={() => setLects([])}>
              Hide lectures
            </button>
          )}
          <button className="badge badge-warning m-2 mr-3" onClick={addLect}>
            Add lecture
          </button>

            <Link
              to={"/courses/" + currentCourse.id}
              className="badge badge-warning m-2 mr-3"
            >
              Show detail
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Course...</p>
          </div>
        )}

      </div>)}
      {viewAll && (<div className="col-md-7">
        <h4>Courses List</h4>

        <ul className="list-group">
          {courses &&
            courses.map((course, index) => (
              <li
                className={
                  "list-group-item "
                }
              >
                {course.title} : {course.description} : {course.instructor}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-success"
          onClick={() => setViewAll(false)}
        >
          My courses
        </button>

      </div>)}
      </div>)
      }

      {/* This is the student portion */}
      {currentUser.authority === "Student" && (<div>
        {!viewAll && (
          <div className="col-md-8">
            <h4>My Courses</h4>

        <ul className="list-group">
          {courses && 
            courses.filter((course) => checkSub(course)).map((course, index) => (
              <li
                className={
                  "list-group-item "
                   + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveCourse(course, index)}
                key={index}
              >
                {course.title} : {course.description} : {course.instructor}
              </li>
            ))
            }
            {/* {courses &&
            courses.map((course, index) => (
              <li
                className={
                  "list-group-item "
                   + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveCourse(course, index)}
                key={index}
              >
                {course.title} : {course.description} : {course.instructor}
              </li>
            ))} */}
        </ul>


      </div>
        )}

        {viewAll && (
      <div className="col-md-7">
        <h4>Courses List</h4>
          
        <ul className="list-group">
          {courses &&
            courses.map((course, index) => (
              <li
                className={
                  "list-group-item "
                   + (index === currentIndex ? "active" : "")
                }
                onClick={() => {setActiveCourse(course, index);
                          console.log(currentIndex);}}
                key={index}
              >
                {course.title} : {course.description} : {course.instructor}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-success"
          onClick={() => setViewAll(false)}
        >
          Show my courses only
        </button>

      </div>)}

      <div className="col-md-6">
        {currentCourse ? (
          <div>
          {console.log("In the inal course.")}
            <h4>Course</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentCourse.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentCourse.description}
            </div>
            <div>
              <label>
                <strong>Instructor:</strong>
              </label>{" "}
              {currentCourse.instructor}
            </div>

            {lects.length === 0 && (
            <button className="btn btn-success m-2 mr-3" onClick={retrieveLects}>
              Show Lectures
            </button>
          )}

          {lects.length > 0 &&(<strong>Lectures</strong>)}
          {console.log(lects)}
          <ul className="list-group">
          {lects &&
            (lects.map(lect => (
              <li
                // className={
                //   "list-group-item "
                // }
              >
              {console.log(lect.title)}
                {lect.title} : <a href={lect.link} className="badge badge-info">Watch.</a>
              </li>
            ))
            )}
          </ul>
          {lects.length > 0 && (
            <button className="badge badge-info" onClick={() => setLects([])}>
              Hide lectures
            </button>
          )}

            <Link
              to={"/courses/" + currentCourse.id}
              className="badge badge-warning"
            >
              Show Detail
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Course...</p>
          </div>
        )}

      </div>


      </div>)
      }

    </div>
  );
};

export default CoursesList;
