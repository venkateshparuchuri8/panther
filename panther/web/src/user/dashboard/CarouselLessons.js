import React, { Component} from 'react';
import {connect} from 'react-redux';
//import { Button } from 'reactstrap';
//import {Tab,Tabs,TabPanel,TabList} from 'react-tabs';

class CarouselLessons extends Component {

  constructor(props) {
    super(props);
    this.goToClassPage=this.goToClassPage.bind(this);
  }

  goToClassPage(event){
    event.preventDefault();
     this.props.goToClassDetailsPage(event.target.getAttribute('data-class_id'));
  }

  render() {
    //const img = 'https://images.unsplash.com/photo-1489769811155-68b5848205ac?dpr=2&auto=format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=';
    const lessonstList = this.props.lessonsList || [];
    return (
    <div>
     <div className="carousel-lessons-container">
     {lessonstList.map((lesson,key) =>(

        <div key={key} className={lesson.lesson_status == 'completed' ?"carousel-lessons-img is-completed": "carousel-lessons-img"} data-class_id={lesson.class_id} onClick={this.goToClassPage} style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' + lesson.lesson_image + ')'}}>
          <div className="carousel-lessons-title">{this.props.classOrder + '.' + lesson.order} {lesson.lesson_name}</div>
        </div>
      ))}
     </div>
    </div>
    );
  }
}


function mapStateToProps(state) {
  console.log(state);
  return {

  };
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(CarouselLessons);
