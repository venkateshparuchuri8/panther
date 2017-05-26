import React, { Component,PropTypes } from 'react';
//import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../common/components/Page';
import { Button, Row, Col} from 'reactstrap';
import UsersTable from './UsersTable';
import * as actions from '../common/actions/index';
import cookie from 'react-cookie';
import UserDropdown from './UserDropdown';
let _ = require('lodash');
//import (filter) from lodash;
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Users extends Component {

    constructor(props) {
    super(props);
    this.state = {
       filterFlag : true,
       elements: [],
       filterInputs:[],
       modal: false
    };

    // This binding is necessary to make `this` work in the callback
   // this.handleClick = this.handleClick.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.liveFiltering = this.liveFiltering.bind(this);
    this.toggle = this.toggle.bind(this);
    this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
  }

  componentDidMount(){

   this.props.actions.usersList(cookie.load('org_obj').org_id);
  }

  toggle(){
    this.downloadCSV({ filename: "stock-data.csv" });

  }


/*  handleClick(e) {
    e.preventDefault();
     this.setState({
      modal: !this.state.modal,
      });


  }
*/
  // toggle() {
  //   debugger;
  //   this.setState({
  //     modal: !this.state.modal
  //   });
  //   let val = this;
  //   fetch('/api/user/userlist/exports',{
  //       method:'POST',
  //       headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body:JSON.stringify({"filter_list" : this.state.filteredUserList})


  //     }).then((response)=>{
  //             if(response.status === 200){
  //         return response.json().then(data => {
  //           console.log(data.result);
  //           val.setState({'csvId':data.result});
  //         });
  //       }
  //     });

  //      console.log(this.state.filteredUserList);

  // }
  
       convertArrayOfObjectsToCSV(args) {
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

     downloadCSV(args) {
        let data, filename, link;

        let csv = this.convertArrayOfObjectsToCSV({
            data: this.state.filteredUserList
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }


  removeFilter(id,removeOption){
    let sliceArray = this.state.elements;
    delete sliceArray[id];
    // let total = this.state.filterInputs;
    // total=_.pullAllBy(total,[{'type':removeOption}],'type');
    // total.push(obj[0]);

    // //_.pullAll(array, ['a', 'c']);
    // this.setState({'filterInputs':total});

    this.liveFiltering(removeOption);


  }

  liveFiltering(obj){
    if(obj.length > 0){
    let total = this.state.filterInputs;
    total=_.pullAllBy(total,[{'type':obj[0].type}],'type');
    if(Object.keys(obj[0]).length > 1){
    total.push(obj[0]);
    }

    //_.pullAll(array, ['a', 'c']);
    this.setState({'filterInputs':total});
    let sortedUsers=[];
    let me=this;
    sortedUsers=me.props.usersList;
    let sortedeach=_.each(total, function (val){

      if(val.type == 'gender'){

        sortedUsers=_.filter(sortedUsers,_.matches({gender:parseInt(val.gender)}));
      }
      if(val.type == 'chapter'){
        sortedUsers=_.filter(sortedUsers,_.matches({chapter:val.chapter}));
      }
      if(val.type == 'state'){
        sortedUsers=_.filter(sortedUsers,_.matches({state:val.state}));
      }
      if(val.type == 'city'){
        sortedUsers=_.filter(sortedUsers,_.matches({city:val.state}));
      }
      if(val.type == 'dob' && val.fromYear && val.toYear){

        let years = [parseInt(val.fromYear)];
        let yearNumber = parseInt(val.fromYear);
        const yrLen = val.toYear - val.fromYear ;
        for(var i=0; i<yrLen; i++){
          yearNumber = yearNumber+1;
          years.push(yearNumber);
        }
        //var searchStr= years;

         sortedUsers = _.filter(sortedUsers, function (obj) {
            if(obj.dob!= null){
                  let x = parseInt(obj.dob.substr(obj.dob.length-4));
                  for(var i=0; i<= years.length; i++){
                  if(x == years[i]){
                    return obj
                  }
                  }
                  }
        });
      }

    });
    console.log(sortedeach);

    this.setState({'filteredUserList':sortedUsers});
}
  }

  addFilter(){
    var newState = this.state.elements;
     newState.push(<UserDropdown filterCount= {newState.length} close={this.removeFilter} filteringMethod={this.liveFiltering} existingFilters={this.state.filterInputs}/>);
     //console.log(newState);
     this.setState({'elements':newState});
     //let newStateLen ;
     // {newState.length!=null ?
     //   newStateLen = newState.length
     //   :''}
     this.setState({
        filterFlag:false,
        elementLength:newState.length
     })
  }

  componentWillReceiveProps(props){
     if(props.usersList){
      this.setState({'usersList':props.usersList,
        'filteredUserList':props.usersList});


     }
  }

  render() {

     //console.log(this.state.csvId);
    //let url = '/api/user/list/download/'+ this.state.csvId;
    return (
    <Page pageTitle="Users" pageAction={<Button size ="sm" color="primary" onClick={this.toggle}> Exports </Button>}>

    {/*<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}> this.downloadCSV({ filename: "stock-data.csv" })
        <ModalHeader toggle={this.toggle}>User Export</ModalHeader>
          <ModalBody>
              <a href={url} target="_blank">click here</a>
         </ModalBody>
    
            <ModalFooter>
    
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>*/}


        <div>{this.state.elements}</div>

        <Row className="mb-3">
          <Col sm="4">
            <Button size="lg" color="filter" onClick={this.addFilter}>+ Add Filter</Button>
          </Col>
        </Row>
        <UsersTable usersList={this.state.usersList || []} filretList = {this.state.filteredUserList} />

      </Page>


    );

  }

}
Users.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Users.propTypes = {
  auth: PropTypes.object,
  usersList: PropTypes.array,
  actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    //console.log(state.usersList);
  return {
    auth:state.auth,
    usersList: state.usersList

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Users);
