import React,{Component} from 'react';
import {Container ,Row ,Col } from 'reactstrap';
import Question from './Question';
import $ from 'jquery';


class Quiz extends Component{
  constructor(props){
    super(props);
    this.state = {
      quizdetails : []
    };
    this.materialflag = this.materialflag.bind(this);

  }
  materialflag(flag){
    this.props.materialflag(flag);
  }

  componentWillMount(){
    console.log(this.props);
    let data= this;
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/quiz/task/getquizdetails?task_id=' + this.props.materialobj.task_id,
        dataType: "json",
        success: function(response) {
          if(response){
          data.setState({quizdetails:response.result});
          }
        }
      });
  }
  render(){
    return (
      <div>
        <Container>
          <Row>
            <Col sm="12" md="12">
              <div className="actions-wrapper in-progress">

                <Question quizdata={this.state.quizdetails} materialFlag={this.materialflag}/>


              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Quiz;
