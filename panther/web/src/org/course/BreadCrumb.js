import React from 'react';
import { Link } from 'react-router';


const BreadCrumb = () => {
  return (
    <Link className="bread-crumb" to="/app/dashboard">◂ Back to Dashboard</Link>
  );
};


export default BreadCrumb;
