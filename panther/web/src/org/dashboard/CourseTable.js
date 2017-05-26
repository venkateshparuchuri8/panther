import React, {Component } from 'react';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button } from 'reactstrap';
// import * as actions from '../common/actions/index';
// import cookie from 'react-cookie';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class CourseTable extends Component {
 constructor(props) {
    super(props);
    this.state = {
    };

    this.view=this.view.bind(this);
    this.edit=this.edit.bind(this);

  }

 view(data) {
  // body...
      // const courseId = event.target.id;
      // this.setState({'courseId': courseId});
      // const cookieObj={
      //   'courseId':courseId
      // }
      // cookie.save('cookieObj', cookieObj, { path: '/' });
      // this.props.actions.viewCourse(courseId);
      const path='/app/course/'+data;
      this.context.router.push(path);

}

edit(data) {
  // body...
      //const courseId = event.target.id;
      // this.setState({'courseId': courseId});
      // const cookieObj={
      //   'courseId':courseId
      // };
      // cookie.save('cookieObj', cookieObj, { path: '/' });
      this.props.edit(data);

      //const path='/app/course/'+data;
      //this.context.router.push(path);
}

// componentWillReceiveProps(nextProps){
//     if(nextProps.courseView != undefined && (nextProps.courseView.length > 0 || nextProps.courseView.id)){

//       cookie.save('course_details', nextProps.courseView, { path: '/' });

//       const path='/app/course';
//       this.context.router.push(path);
//     }
//   }


  render() {
    const columns = [
      {
        header: '#',
        accessor: 'id',
        width: 80,
        sortable: false,
        headerClassName: 'text-center',
        style: {justifyContent: 'center'}
      },
      {
        header: 'Name',
        id: 'course_name',
        render: (object) => {
          let button=<span className="tag ml-1">Supplemental</span>;
          return <div>{object.row.name}{' '}{object.row.is_supplemental == 'yes' ? button : ''}</div>;
        },
        style: {textAlign: 'left'},
        width: 350
        //accessor: 'name',
      },
      {
        header: 'Classes',
        accessor: 'class_count',
        headerClassName: 'text-center',
        style: {justifyContent: 'center'}
      },
      {
        header: 'Lessons',
        accessor: 'lesson_count',
        headerClassName: 'text-center',
        style: {justifyContent: 'center'}
      },
      {
        header: 'Tasks',
        accessor: 'task_count',
        headerClassName: 'text-center',
        style: {justifyContent: 'center'}
      },
      {
        header: '',
        id: 'view_action',
        render: (object) => {
          return <Button size="sm" id={object.rowValues.id} onClick={() => this.view(object.rowValues.id)} color="primary">View</Button>;
        },
        style: {textAlign: 'right', justifyContent: 'flex-end'}
      },
      {
        header: '',
        id: 'edit_action',
        render: (object) => {
          return <img className="course-table-edit" id={object.rowValues.id} onClick={() => this.edit(object.rowValues.id)} src="/assets/icon-edit.svg"/>;
        },
        style: {textAlign: 'right', justifyContent: 'flex-end'}
      }
    ];

    return (
      <div>
        <ReactTable className="-highlight" data={this.props.courses} columns={columns} defaultPageSize={9} showPagination={this.props.courses.length > 9 ? true : false}/>
      </div>
    );
  }
}

CourseTable.contextTypes = {
  router: React.PropTypes.object.isRequired
};

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   };
// }

// function mapStateToProps(state) {
//   return {
//     courseView:state.courseView,
//     courses:state.courses
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(CourseTable);


export default CourseTable;

