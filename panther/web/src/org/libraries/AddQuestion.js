import React, { Component } from 'react';
import { Input, Label, Button, FormGroup, FormFeedback, Form, Row, Col } from 'reactstrap';
import toastr from 'toastr';
import _ from 'underscore';
import { validate } from '../../validators';



class AddQuestion extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            questions: [{
                'question': '',
                'answer': '',
                'id': 1,
                'isShow': true,
                'options': [
                    { 'option': '', 'id': 1, 'correctanswer': true },
                    { 'option': '', 'id': 2, 'correctanswer': false },
                    { 'option': '', 'id': 3, 'correctanswer': false },
                    { 'option': '', 'id': 4, 'correctanswer': false }
                ]
            }],
            buttonDisable: true,
            'errors': {}
        };
        this.viewquestion = this.viewquestion.bind(this);
        this.onQuestionChange = this.onQuestionChange.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.onAnswerChange = this.onAnswerChange.bind(this);
        this.checkTheFields = this.checkTheFields.bind(this);
        //this.onCorrectAnswerChange = this.onCorrectAnswerChange.bind(this);
    }

    componentWillMount() {
        if (this.props.questionfrom == 'edit') {
            let questions = _.each(this.props.questions, function(obj, index) {
                obj.options = obj.options.length ? obj.options: JSON.parse(obj.options);
                obj.id = index + 1;
                return questions;
            });
            this.setState({
              questions: questions
            });
        }
    }

    componentWillReceiveProps(newProps) {
      if(this.props === newProps) return;
      if (newProps.questionfrom == 'edit') {
        let questions = _.each(newProps.questions, function(obj, index) {
          obj.options = obj.options.length ? obj.options: JSON.parse(obj.options);
          obj.id = index + 1;
          return questions;
        });
        this.setState({
          questions: questions
        });
      }
    }

    viewquestion(e, obj) {
      debugger;
        e.preventDefault();
        const object = this.state.questions.map((question) => {
            if (question.id == obj.id) {
                question.isShow = true;
            } else {
                question.isShow = false;
            }
            return question;
        });
        this.setState({ questions: object });

    }
    addQuestion(e) {
        e.preventDefault();
        const ques = this.state.questions;
        const obj = ques.map((question) => {
            question.isShow = false;
            return question;
        });
        console.log(obj);
        if (this.state.questions.length >= 5) {
            toastr.warning("Questions Should Not more than 5", "warning");

        } else {
            this.setState({
                questions: [...ques, {
                    'question': '',
                    'answer': '',
                    'isShow': true,
                    'id': ques.length + 1,
                    'options': [
                        { 'option': '', 'id': 1, 'correctanswer': true },
                        { 'option': '', 'id': 2, 'correctanswer': false },
                        { 'option': '', 'id': 3, 'correctanswer': false },
                        { 'option': '', 'id': 4, 'correctanswer': false }
                    ]
                }],
                buttonDisable: true,
                'errors': {}
            });
        }


    }
    onQuestionChange(e, val, id, validators = []) {
            let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
            this.setState({ errors, [e.target.name]: e.target.value });
            const object = this.state.questions.map((question) => {
                if (question.id == id) {
                    question.question = val;
                }
                /* if(question.question){
                   this.setState({})
                 }*/
                return question;
            });
            console.log(errors);
            this.setState({ questions: object });
        }
        /*onCorrectAnswerChange(val,questionid){
          const object = this.state.questions.map((question)=>{
            if(question.id == questionid){
              question.answer = val;
            }
            return question;
          });
          this.setState({questions:object});


        }*/
    onAnswerChange(e, val, answerobj, questionid, validators = []) {
        let errors = validate(e.target.name, e.target.value, validators, this.state.errors);
        this.setState({ errors, [e.target.name]: e.target.value });
        let answerdata = [];
        const object = this.state.questions.map((question) => {
            if (question.id == questionid) {
                answerdata = question.options.map((option) => {
                    if (option.id == answerobj.id) {
                        option.option = val;
                    }
                    return option;
                });
                console.log(answerdata);
            }
            return question;
        });
        this.setState({
            questions: object

        });
        this.props.addquestion(this.state.questions);
    }
    checkTheFields() {
        /*const questions = this.state.questions.length;
        let buttondisable = this.state.buttonDisable;
        for(var i = questions.length;i<= 0;i--){
          buttondisable = questions[i].question ? true : false;
          for(var j=questions.options.length;j<=0;j--){
            buttondisable = questions[i].options[j].option ? true : false;

          }
          console.log(buttondisable);
        }*/
        this.props.buttondisable(Object.keys(this.state.errors).length == 0 ? false : true);
    }
    render() {
        // let questions = [];
        // if (this.state.questions[0].answer == '' && this.props.questions && this.props.questions.length > 0) {
        //     questions = this.props.questions || [];
        // } else {
        //     questions = this.state.questions;
        // }
        let { errors } = this.state;
        console.log(errors);

        return (
          <div>
            <Form onChange={this.checkTheFields}>
             {this.state.questions.map((question,i) =><FormGroup key={i}>
              <FormGroup color={errors['question'+i] ? "danger" : ""}>
              <Label>Question #{question.id}</Label>
                  <Row>
                    <Col md="11">
                      <Input type="text" name={"question"+i} value={question.question} onChange={(e)=>this.onQuestionChange(e,e.target.value,question.id,['required'])}/>
                      {errors['question'+i] ? <FormFeedback>{errors['question'+i]}</FormFeedback> : "" }
                    </Col>
                    <Col md="1">
                      <img className="d-inline-block align-bottom" style={{'cursor':'pointer'}} onClick={(e)=>this.viewquestion(e,question)} id={question.id} src={question.isShow ? "/assets/arrow-up.svg" : "/assets/arrow-down.svg"}/>
                    </Col>
                  </Row>
              </FormGroup>
              <div className={question.isShow ? 'show': 'hide'}>
              {/*<FormGroup>
                <Label> Correct Answer</Label>
                <Input type="text" name="correctanswer" value={question.answer} onChange={(e) => this.onCorrectAnswerChange(e.target.value,question.id)}/>
              </FormGroup>*/}
              {question.options.map((obj,index) =><FormGroup key={index} color={errors['option'+i+index] ? "danger" : ""}>
                <Label>{obj.correctanswer ? 'Correct Answer':'Option #'+obj.id}</Label>
                  <Input type="text" name={"option"+i+index} value={obj.option} onChange={(e)=> this.onAnswerChange(e,e.target.value,obj,question.id,['required'] )}/>
                {errors['option'+i+index] ? <FormFeedback>{errors['option'+i+index]}</FormFeedback> : "" }
               </FormGroup>)}
              </div>
              </FormGroup>)}
              <FormGroup className="text-right">
                 <Button size="lg" color="filter" onClick={this.addQuestion}>Add New Question</Button>
              </FormGroup>
            </Form>
          </div>
        )
    }
}
export default AddQuestion;
