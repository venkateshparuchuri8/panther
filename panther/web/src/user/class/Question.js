import React,{Component} from 'react';
import Isvg from 'react-inlinesvg';
import {Button} from 'reactstrap';
import $ from 'jquery';
import cookie from 'react-cookie';
let _ = require('underscore');

class Question extends Component{
  constructor(props){
    super(props);
    this.state = {
        activeQuestionIndex: 0,
        tryCount: 0,
        score:0,
        materialflag:true,
        currentQuestion: null,
        questions: props.quizdata,
        nextButtonText: 'Answer',
        currentAnswerRight: false
    }
    this.renderOptions = this.renderOptions.bind(this);
    this.optionClick = this.optionClick.bind(this);
    this.renderQuestions =this.renderQuestions.bind(this);
    // this.nextAnswer = this.nextAnswer.bind(this);
    this.buildQuestion = this.buildQuestion.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.setState({
      questions: this.props.quizdata
    })
    this.setActiveQuestion(this.state.activeQuestionIndex, this.props.quizdata);
  }

  componentWillReceiveProps(newProps) {
    if(this.props === newProps) return;
    this.setState({
      questions: newProps.quizdata
    })
    this.setActiveQuestion(this.state.activeQuestionIndex, newProps.quizdata);
  }

  optionClick(option){
    // const key = e.target.getAttribute('data-key');
    // const option = JSON.parse(e.target.getAttribute('data-obj'));
    // $('li').each(function(){
    //   if($(this).hasClass('is-selected')){
    //     $(this).removeClass('is-selected');
    //   }else{
    //     $(`.${key}`).addClass('is-selected');
    //     console.log($(`.${key}`))
    //   }
    // });
    // console.log(option);
    if(!this.state.currentAnswerRight) this.setState({optionObj:option});
  }

  renderMessage() {
    let config = {
      correct: this.state.tryCount == 0 ? true : this.state.currentAnswerRight,
      message: 'Wrong answer. You only have 1 try left for this question.'
    }
    if (this.state.tryCount == 0) config.message = 'Only 2 tries per question are allowed. XP gets halved on the second try.';
    if (this.state.tryCount == 2) config.message = 'Wrong answer.';
    if (this.state.currentAnswerRight) config.message = 'Correct answer!';
    return (
      <div className={config.correct ? "actions-wrapper-note correct" : "actions-wrapper-note wrong"}>
        <p>{config.message}</p>
      </div>
    );
  }

  renderOptions(options,answer){
    let optionData = options.map((obj,index) =>{  
      return(
      <li key={index} className={(this.state.optionObj && this.state.optionObj.id == obj.id) ? 'is-selected' : ''} disabled={this.state.tryCount == 2 || this.state.currentAnswerRight == true} data-key={index} data-answer={answer} data-obj={JSON.stringify(obj)} onClick={() => this.optionClick(obj)}>{obj.option}</li>
      )
    });
    return optionData;
  }

  renderQuestions(obj, tryCount){
    return (
      <div key={tryCount}>
        <div className="actions-wrapper-question">
          {obj.question}
        </div>
        <div className="actions-wrapper-answer">
          <ul className="actions-wrapper-answer-list">

          {this.renderOptions(obj.options,obj.answer)}
          </ul>
        </div>
      </div>
    );
  }

  setActiveQuestion(index, questions) {
    this.setState({
      activeQuestion: (questions && questions.length && questions.length != 0) ? this.buildQuestion(questions[index]): undefined
    });
  }

  buildQuestion(q) {
    return _.extend(q, {
      options: typeof q.options == 'string' ? JSON.parse(q.options) : q.options
    })
  }

  completeQuestion() {
    this.setState({
      activeQuestionIndex: this.state.activeQuestionIndex+1,
      tryCount: 0,
      currentAnswerRight: false,
      optionObj: undefined,
      nextButtonText: 'Answer'
    });
    this.setActiveQuestion(this.state.activeQuestionIndex, this.state.questions);
  }

  validateAnswer() {
    //check which option is selected
    //check if option is right
    //if right, then award XP, disable question, set message, move to next question
    //if wrong, check if have another try
    //if have another try, then set the message, set the tryCount=1
    //if have no other try, set 0 XP, disable question, set message, move to next question

    //check if quiz is being Submitted

    let selectedOptionId = this.state.optionObj.id,
        selectedOption = _.find(this.state.activeQuestion.options, (opt) => opt.id == selectedOptionId);

    if(selectedOption.correctanswer) {
      debugger;
      this.setState({
        score: this.state.score + (this.state.tryCount == 0 ? 10 : 5),
        currentAnswerRight: true,
        nextButtonText: this.state.questions[this.state.activeQuestionIndex + 1] ? 'Next Question' : 'Submit Quiz',
        tryCount: 2
      });
      if(!this.state.questions[this.state.activeQuestionIndex + 1]) {
        setTimeout(function() {
          this.submit();
        }.bind(this), 300);
      } else {
        setTimeout(function() { 
          this.setState({
            activeQuestionIndex: this.state.activeQuestionIndex + 1,
            currentAnswerRight: false,
            tryCount: 0,
            optionObj: undefined,
            nextButtonText: 'Answer'
          }); 
          this.setActiveQuestion(this.state.activeQuestionIndex, this.props.quizdata);
        }.bind(this), 1000);
      }
    } else {
      if(this.state.tryCount == 1) {
        this.setState({
          tryCount: this.state.tryCount + 1,
          optionObj: undefined,
          nextButtonText: this.state.questions[this.state.activeQuestionIndex + 1] ? 'Next Question' : 'Submit Quiz'
        })
        if(!this.state.questions[this.state.activeQuestionIndex + 1]) {
          setTimeout(function() {
            this.submit();
          }.bind(this), 300);
        } else {
          setTimeout(function() { 
            this.setState({
              activeQuestionIndex: this.state.activeQuestionIndex + 1,
              currentAnswerRight: false,
              tryCount: 0,
              optionObj: undefined,
              nextButtonText: 'Answer'
            }); 
            this.setActiveQuestion(this.state.activeQuestionIndex, this.props.quizdata);
          }.bind(this), 1000);
        }
      } else {
        //got another try
        this.setState({
          tryCount: this.state.tryCount + 1,
          currentAnswerRight: false,
          nextButtonText: 'Try again',
          optionObj: undefined
        })
      }
    }
  }

  submit(){
    debugger;
    const obj={};
    obj.score = this.state.score;
    obj.user_id =cookie.load('user_obj').user_id;
    obj.quiz_id = this.props.quizdata[0].quiz_id;
    console.log(obj);
    let data = this;

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: ' /api/quiz/savequizscores',
        dataType: "json",
        data : JSON.stringify(obj),
        success: function(response) {
          if(response){
            console.log(response.result);
            data.setState({materialflag:false});
            data.props.materialFlag(true);
          }
        }
    });
  }

  render(){
    const questions = this.props.quizdata || [];
     return(
        <div>
            {this.state.materialflag ?
                <div>
                  
                  {this.renderMessage()}

                  {questions.length > 0 ?
                    <div className="actions-wrapper-content">

                        {this.renderQuestions(this.state.activeQuestion, this.state.tryCount)}

                        <div className="actions-wrapper-submit d-flex justify-content-between align-items-center">
                            <span>XP <b>{this.state.score}</b></span>
                            <div className="d-inline-block">
                                <span className="mr-3">{this.state.activeQuestionIndex + 1}/{questions.length}</span>
                                <Button size="sm" color="primary" className="d-inline-block btn-start" disabled={!this.state.optionObj} onClick={(e) => this.state.currentAnswerRight ? this.completeQuestion(e) : this.validateAnswer(e)}>
                                  <Isvg src="/assets/icon-answer-next.svg" />{this.state.nextButtonText}
                                </Button>
                            </div>
                        </div>
                    </div>
                   : ''}
                </div>
                :
                <div>
                    <div className="actions-wrapper-note">
                      <h3>Congratulations!</h3>
                      <p className="text-muted">You've Successfully Submitted this task. Your rewards is:</p>
                      <h2>{this.state.score} XP</h2>
                    </div>
                </div>
             }
        </div>
    );
  }
}
export default Question;
