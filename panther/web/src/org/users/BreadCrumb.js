import React from 'react';
import { Link } from 'react-router';


const BreadCrumb = () => {
  return (
    <Link style={{top: '', left: '120px'}} className="bread-crumb" to="/app/users">◂ Back to Users</Link>
  );
};
export default BreadCrumb;
