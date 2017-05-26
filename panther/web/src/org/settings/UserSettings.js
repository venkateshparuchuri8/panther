import React, {Component } from 'react';
import ReactTable from 'react-table';

class UserSettings extends Component {
	render(){
	const data = [
	{
		filedsname:"Bio",
		status:"Active",
		type:"TextBox",
		actions:""

	},
	{
		filedsname:"Twitter",
		status:"Active",
		type:"TextField",
		actions:""

	}
	];
	const columns = [
      {
        header: 'Fileds Name',
        accessor: 'filedsname',
        sortable:false
       },
      {
        header: 'Status',
        accessor: 'status',
        sortable:false
      },
      {
        header: 'Type',
        accessor: 'type',
        sortable:false

      },
      {
        header: 'Actions',
        accessor: 'actions',
        sortable:false

      }

    ];
	return (
		<div>
		<ReactTable className="-highlight" data={data} columns={columns} defaultPageSize={5}/>
		</div>
		);

	}

}
export default UserSettings;
