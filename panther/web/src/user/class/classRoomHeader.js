import React, { Component} from 'react';
import Isvg from 'react-inlinesvg';


class ClassRoomHeader extends Component {

  constructor(props) {
    super(props);
    this.state={
    };
  } 
  
  render() {
    return (
    <div>
    {this.props.lessonCompleted == 'completed' ?
      <div className="classroom-header is-completed" >
      {this.props.completedLessonScreenId == 'completed' ?
       <div>
         <Isvg src="/assets/icon-check-white.svg"></Isvg>
         <h6 className="mt-2">{this.props.activeLesson.lesson_total_points} XP earned</h6></div>
      :
      <div>
        <label>Lesson</label>
        <h1>{this.props.activeLesson.lesson_order}. {this.props.activeLesson.lesson_name}</h1>
        <Isvg src="/assets/icon-check-white.svg"></Isvg>
        </div>
        }
      </div>
      :
      <div className="classroom-header">
        <label>Lesson</label>
        <h1>{this.props.activeLesson.lesson_order}. {this.props.activeLesson.lesson_name}</h1>
        <p>{this.props.activeLesson.lesson_description}</p>
        {this.props.classDetails.class_status == 'completed' ?
        <div className="classroom-header-completed">
          <span>COMPLETED •</span>
          <span>{this.props.classDetails.class_total_points} XP earned</span>
        </div>
        : ''}
      </div>
    }
    </div>
    );
  }
}

export default ClassRoomHeader;