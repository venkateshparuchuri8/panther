import React, { Component} from 'react';
//import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
import Page from '../common/components/Page';
//import * as actions from './actions/index';
import ReactTable from 'react-table';


class Forums extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    const img = 'http://im.vsco.co/1/54bf275c536301981228/58d5e67a26810e430d033c9b/vsco_032517.jpg?w=302&dpr=2';

    const columns = [
      {
        header: 'Topic',
        accessor: 'topic_name',
        width: 500
      },
      {
        header: 'Users',
        id: 'topic_users',
        render: () => {
          return <div className="forum-avatar" style={{backgroundImage: 'url(' + img + ')'}}></div>;
        }
      },
      {
        header: 'Replies',
        accessor: 'topic_replies'
      },
      {
        header: 'Activity',
        accessor: 'topic_activity'
      }
    ];

    const data = [
      {
        topic_name: '#General',
        topic_users: 'hello',
        topic_replies: '2',
        topic_activity: '20 minutes ago'
      }

    ];

    return (
    <div>
    <Page pageTitle="Forum"
      pageDescription="Short description of the forum">
      <ReactTable className="-highlight" data={data} columns={columns} defaultPageSize={9}/>
    </Page>
  </div>

    );
  }
}




export default Forums;
