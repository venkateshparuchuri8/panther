import React, { Component } from 'react';
import { Link } from 'react-router';


class BreadCrumb extends Component {

  render() {
    return (
      <div>
        <Link className="bread-crumb" to={this.props.backLink}>◂ {this.props.backText}</Link>
      </div>
    );
  }

}


export default BreadCrumb;
