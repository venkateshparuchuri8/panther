import React from 'react';
//import { Button, Container, Row, Col, Input } from 'reactstrap';
import { Link } from 'react-router';


const BreadCrumb = (props) => {
	const linkVar="/app/course/"+props.courseId+"/class/"+props.classId+"";
  return (
    <Link className="bread-crumb" to={linkVar}>◂ Back to Lesson</Link>
  );
};


export default BreadCrumb;
