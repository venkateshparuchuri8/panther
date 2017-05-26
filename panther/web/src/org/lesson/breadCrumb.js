import React from 'react';
//import { Button, Container, Row, Col, Input } from 'reactstrap';
import { Link } from 'react-router';


const BreadCrumb = (props) => {
	const linkVar="/app/course/"+props.courseId+"";
  return (	
    <Link className="bread-crumb" to={linkVar}>◂ Back to Course</Link>
  );
};


export default BreadCrumb;
