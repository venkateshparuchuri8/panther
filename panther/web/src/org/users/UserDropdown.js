import React, {Component} from 'react';
import {Row, Col,Input, Label} from 'reactstrap';

let fromYr,toYr ;
class UserDropdown extends Component {
constructor(props) {
  //console.log(props.filterCount);
    super(props);
    this.state = {
        searchArray:[],
        genderObj:'',
        chapterObj:'',
        stateObj:'',
        fromYr:'',
        toYr:'',
        years:["Select",1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeYear = this.handleChangeYear.bind(this);
    this.closeAction = this.closeAction.bind(this);
    this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
    this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
    this.onRadioBtnChange1 = this.onRadioBtnChange1.bind(this);
    this.dataBacktoParent = this.dataBacktoParent.bind(this);
    this.handleChangeChapter=this.handleChangeChapter.bind(this);
    this.handleChangeState=this.handleChangeState.bind(this);
  }

     onRadioBtnChange(e) {
      //debugger;
       const searchObj={};
      let genderType;
      if(e.target.value == "male"){
        genderType = '1';
      } else if(e.target.value == "female"){
          genderType = '0';
      }
      searchObj.type='gender';
      searchObj.gender=genderType;
      this.setState({'genderObj':searchObj},this.dataBacktoParent);
        
        //this.dataBacktoParent();

    }

     onRadioBtnChange1(e) {
      const cityObj = {};
      let contais, isKnown, isUnknown ;
      if(e.target.value == "contains"){
        contais = 1;
        isKnown = 0;
        isUnknown = 0;
      } else if(e.target.value == "isKnown"){
        contais = 0;
        isKnown = 1;
        isUnknown = 0;
      } else if (e.target.value == "isUnKnown") {
        contais = 0;
        isKnown = 0;
        isUnknown = 1;
      }

        cityObj.contais=contais;
        cityObj.isKnown=isKnown;
        cityObj.isUnknown=isUnknown;
        this.setState({
            city:cityObj
        },this.dataBacktoParent);
        //this.dataBacktoParent();
    }
 handleChangeDropdown(e) {
        e.target.setAttribute('disabled','disabled');
        this.setState({
            "selectedValue": e.target.value });
    }
   handleChangeChapter(e){
      let searchObj={};
      searchObj.type='chapter';
      searchObj.chapter=e.target.value;
      this.setState({'chapterObj':searchObj},this.dataBacktoParent);
      //this.dataBacktoParent();
   }
   handleChangeState(e){
    let searchObj={};
      searchObj.type='state';
      searchObj.state=e.target.value;
      this.setState({'stateObj':searchObj},this.dataBacktoParent);
   }
  handleChangeYear(e){
    
    let searchObj={};
    
    searchObj.type='dob';
    if(e.target.name =="from_year"){
      fromYr = e.target.value;
    }else if(e.target.name=="to_year"){
      toYr = e.target.value;
      }
  
    if(fromYr && toYr){
    searchObj.fromYear = fromYr;
    searchObj.toYear = toYr;
    this.setState({'yearObj':searchObj},this.dataBacktoParent);
     //console.log(searchObj);
    //this.dataBacktoParent();
    }
  
}
    handleChange(e){
    this.setState({[e.target.name] : e.target.value},this.dataBacktoParent);
    //this.dataBacktoParent();
  }
  closeAction(event){
    //debugger;
    
    const cancelObj = {};
    cancelObj.type=event.target.name;
    let searchingFilters=[];
    searchingFilters.push(cancelObj);
    this.props.close(event.target.id,searchingFilters);
  }

  dataBacktoParent(){
    let searchingFilters=[];
    if(this.state.genderObj.gender){
      searchingFilters.push(this.state.genderObj);
    }
    if(this.state.chapterObj.chapter){
      searchingFilters.push(this.state.chapterObj);
    }
    if(this.state.stateObj.state){
      searchingFilters.push(this.state.stateObj);
    }
    if(this.state.yearObj && this.state.yearObj.fromYear && this.state.yearObj.toYear){
      searchingFilters.push(this.state.yearObj);
    }
    this.props.filteringMethod(searchingFilters);
  }
  componentWillReceiveProps(props){
    if(props.existingFilters){
      this.setState({'searchArray':props.existingFilters});
    }
  }

    render() {
      //console.log(this.state);
      let options = [];
      const yearsLengthState = this.state.years;
        options.push(<option value={this.state.years[0]} disabled selected>{this.state.years[0]}</option>);
        for (var i=1; i < yearsLengthState.length ; i++) {
        options.push(<option value={this.state.years[i]}>{this.state.years[i]}</option>);
        }
      
    return (
  <div>

  <Row>
          <Col className="mb-4 mr-2" sm="3">
            <Input type="select" name="select" id={this.props.filterCount} size="sm" value={this.state.selectedValue} onChange = {this.handleChangeDropdown}>
              <option disabled selected>Filter Users By</option>
              <option value="dob">DOB</option>
              <option value="gender">Gender</option>
              <option value="city">City</option>
              <option value="state">State</option>
              <option value="chapter">Chapter</option>
            </Input>
          </Col>



       <Col>
  {this.state.selectedValue =="dob" ?
    <Col sm={10}>
    <div className="filter-form-group">
            <Label for="fromYear">Year From</Label>
            <Col sm={4}>
              <Input type="select"  name="from_year" value={this.state.from_year} onChange={this.handleChangeYear}>
              {options}
              </Input>
            </Col>
            <Label for="toYear">To</Label>
            <Col sm={4}>
              <Input type="select" name="to_year" value={this.state.to_year} onChange={this.handleChangeYear}>
              {options}
              </Input>
            </Col>
            <Col sm={1}>
              <img className="icon-close" id={this.props.filterCount} name="dob" src="/assets/icon-close.svg" alt="close" title="close" onClick={this.closeAction}/>
            </Col>
    </div>
  </Col>
          :null
          }


          {this.state.selectedValue =="gender" ?

               <Col sm={8}>
          <div className="filter-form-group">
            <Col sm={4}>
             <Label check>
                      <Input type="radio" name="gender" value ='male' onClick = {this.onRadioBtnChange}/>
                       <span>Male</span>
              </Label>
            </Col>
            <Col sm={4}>
              <Label check>
                      <Input type="radio" name="gender" value ='female' onClick = {this.onRadioBtnChange}/>
                       <span>Female</span>
             </Label>
            </Col>
            <Col sm={1}>
              <img className="icon-close" id={this.props.filterCount} name="gender" src="/assets/icon-close.svg" alt="close" title="close" onClick={this.closeAction}/>
            </Col>
          </div>
          </Col>

          :null
          }

          {this.state.selectedValue =="city" ?
            <Col sm={8}>
          <div className="filter-form-group">
          <Label check> <Input type="radio" name="radio2" value='contains' onClick={this.onRadioBtnChange1}/><span></span></Label>
            <Label for="Contains">Contains</Label>
            <Col sm={3}>
              <Input type="text" name="contains" value={this.state.contains} onBlur={this.handleChange}/>
            </Col>
            <Col sm={3}>

              <Label check>
                      <Input type="radio" name="radio2" value ='isKnown' onClick={this.onRadioBtnChange1}/>
                       <span>Is Known</span>
              </Label>

            </Col>
            <Col sm={4}>

              <Label check>
                      <Input type="radio" name="radio2" value ='isUnKnown' onClick={this.onRadioBtnChange1}/>
                       <span>Is UnKnown</span>
              </Label>

            </Col>

            <Label for="exampleEmail"></Label>

            <Col sm={1}>
              <img className="icon-close" id={this.props.filterCount} name="city" src="/assets/icon-close.svg" alt="close" title="close" onClick={this.closeAction}/>
            </Col>
          </div>
          </Col>

          :null
          }
          {this.state.selectedValue =="state" ?
           <div className="filter-form-group">
            <Label for="area">State</Label>
            <Col sm={2}>
              <Input type="text" name="area" value={this.state.area} onBlur={this.handleChangeState}/>
            </Col>
            <Col sm={1}>
              <img className="icon-close" id={this.props.filterCount} name="state" src="/assets/icon-close.svg" alt="close" title="close" onClick={this.closeAction}/>
            </Col>
            </div>
          :null
          }
          {this.state.selectedValue =="chapter" ?
          <div className="filter-form-group">
            <Label for="chapterName">ChapterName</Label>
            <Col sm={2}>
              <Input type="text" name="chapter_name" value={this.state.chapter_name} onBlur={this.handleChangeChapter}/>
            </Col>
            <Col sm={1}>
              <img className="icon-close" id={this.props.filterCount} name="chapter" src="/assets/icon-close.svg" alt="close" title="close"  onClick={this.closeAction}/>
            </Col>
            </div>
          :null
          }
          {this.state.selectedValue =="xp" ?
          <Col sm={8}>
          <div className="filter-form-group">
            <Label for="fromXp">XP From</Label>
            <Col sm={2}>
              <Input type="text" name= "from_xp" value={this.state.from_xp} onBlur={this.handleChange}/>
            </Col>
            <Label for="toXp">To</Label>
            <Col sm={2}>
              <Input type="text" placeholder="" />
            </Col>
            <Col sm={1}>
              <img className="icon-close" id={this.props.filterCount} name="xp" src="/assets/icon-close.svg" alt="close" title="close" onClick={this.closeAction}/>
            </Col>
          </div>
          </Col>
          :null
          }
        </Col>
      </Row>
</div>
 );
 }
}

export default UserDropdown;
