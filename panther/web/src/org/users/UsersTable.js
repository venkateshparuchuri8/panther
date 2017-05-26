import React, {Component, PropTypes} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
//import {Container } from 'reactstrap';
//import { Link } from 'react-router';



class UsersTable extends Component {


    constructor(props) {
    super(props);
    // let filteredUserList;
    // if(this.props.filteredUserList){
    //    filteredUserList = this.props.filteredUserList;
    // }else{
    //     filteredUserList = [];

    // }
    // this.state = {
    //   filteredUserList:filteredUserList
    // };
    this.rowClick = this.rowClick.bind(this);

  }
  rowClick(e){
    e.preventDefault();
    const path = "/app/users/" + e.target.parentElement.children[0].textContent;
    debugger;
    this.context.router.push(path);
  }

  render() {
    //debugger;
    let renderingTable;
    console.log(this.props.filretList);
    console.log(this.props.usersList);
    {this.props.filretList ? renderingTable =this.props.filretList.length :renderingTable =this.props.usersList.length}

    const columns = [

      {
        header: '#',
        accessor: 'userid',
        maxWidth: 30,
        sortable: false
      },
      {
        header: 'Name ▾',
        accessor: 'name',
        width: 200
      },
      {
        header: 'XP ▾',
        accessor: 'points',
        width: 200
      },
      {
        header: 'Email',
        accessor: 'email'
      },
      {
        header: 'Date Of Birth',
        accessor: 'dob'
      },
      {
        header: 'Chapter',
        accessor: 'chapter',
        maxWidth: 80
      }
    ];
    return (
      <ReactTable className="-highlight" style={{cursor:'pointer'}}
      data={this.props.filretList ? this.props.filretList:this.props.usersList}
      getTrProps={() => ({
          onClick: e => {this.rowClick(e);}
      })}
      columns={columns} defaultPageSize={9} showPagination={renderingTable > 9 ? true : false}/>
    );

  }

}
UsersTable.contextTypes = {
  router: React.PropTypes.object.isRequired
};
UsersTable.propTypes = {
  usersList: PropTypes.array.isRequired
};

export default UsersTable;
