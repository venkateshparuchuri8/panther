import React from 'react';
import { Link } from 'react-router';


const BreadCrumb = () => {
  return (
    <Link className="bread-crumb" to="/user/leaderboard">◂ Back to Leaderboard</Link>
  );
};


export default BreadCrumb;
