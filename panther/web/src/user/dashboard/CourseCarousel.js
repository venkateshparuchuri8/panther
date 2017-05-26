import React, { Component} from 'react';
import Slider from 'react-slick';
//import { Container } from 'reactstrap';
import CarouselRectangle from './CarouselRectangle';
import $ from 'jquery';
let _ = require('lodash');

class NextIcon extends Component {
  render() {
    return <button {...this.props}><img src="/assets/scroll-arrow-right.svg"/></button>;
  }
}

class PrevIcon extends Component {
  render() {
    return <button {...this.props}><img src="/assets/scroll-arrow-left.svg"/></button>;
  }
}

class CourseCarousel extends Component {

  constructor(props) {
    super(props);
    this.state={
      classDetailsId:'',
      classDetails:'',
      courseDetailsId:'',
      classSelected: false,
      topOffset: undefined
    };
    this.classDetails=this.classDetails.bind(this);
    this.closeClassDetails=this.closeClassDetails.bind(this);
    this.renderCourse=this.renderCourse.bind(this);
  }

  componentDidMount() {
    this.detectFlexRow();
  }

  componentDidUpdate() {
    this.detectFlexRow();
  }

  detectFlexRow() {
    let row = 1, prevItem = {}, currItem = {}, items = document.getElementsByClassName('course-box');
    for (var i = 0; i < items.length; i++) {
      currItem = items[i].getBoundingClientRect();
      if (prevItem && prevItem.top < currItem.top) {
        row++;
      }
      $(items[i]).attr('data-row', row);
      prevItem = currItem;
    }
  }

  classDetails(cls, key, classes, event){
    _.each(classes, (c) => {c.active = false;});
    cls.active = true;
    let classTasks=_.find(cls.lessons,{'task_status':'completed'});
    let classStatus='started';
    if(classTasks){
      classStatus="continue";
    }else{
      classStatus="started";
    }

    let courseBox = $(event.currentTarget).closest('.course-box'), 
      topOffset = 71 + (parseInt($(courseBox).attr('data-row')) * ($(courseBox).find('.course-container').height() + 10));

    if(cls.class_id == this.state.classDetailsId){
      this.setState({'topOffset': topOffset,'classDetailsId':'','classDetails':'','courseDetailsId':'','classStatus':'', 'classSelected': true});
    }else{
      this.setState({'topOffset': topOffset,'classDetailsId':cls.class_id,'classDetails':cls,'courseDetailsId':cls.class_course_id,'classStatus':classStatus, 'classSelected': true});
    }
  }

  closeClassDetails(){
    _.each(this.props.courses, (crs) => {_.each(crs.classes, (c) => {c.active = false;})});
    this.setState({'classDetailsId':'','classDetails':'','courseDetailsId':'', 'classSelected': false });
  }

  renderCourse(course, me) {
    return course.classes.map((cls, i)=> { 
      return(
        <div data-key={i} className={cls.active ? "active course-box" : "course-box"} key={i}>
          {cls.class_status == 'locked' || cls.class_published_status != 1 ?
            <div className="carousel-boxes">
              <div className="course-container">
                  <div className="course-container-img is-locked" style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' +cls.class_image+ ')'}}>
                  <div className="course-container-title">{cls.class_name} {cls.class_published_status == 1 ? '' : '- Coming soon'}</div>
                  <div className="course-container-icon"><img src="/assets/icon-lock-white.svg"/></div>
                  </div>
                  <div className="course-container-triangle vhidden"><div className="triangle"></div></div>
              </div>
            </div>
            :
            <div className="carousel-boxes">
              <div className="course-container" data-class_id={cls.class_id} >
                <div data-class_id={cls.class_id} data-course_id={cls.class_course_id} onClick={me.classDetails.bind(me, cls, i, course.classes)} className={cls.class_status == 'locked' ? "course-container-img is-locked" : (cls.class_status == 'completed' ? "course-container-img is-completed" : "course-container-img")} style={{backgroundImage: 'linear-gradient(rgba(4,29,65,0.10) 0%, #041E42 100%), url(' +cls.class_image+ ')'}}>    
                  <div className="course-container-title">
                    <div className="course-container-title-top">
                      {cls.class_name} {cls.class_published_status == 1 ? '' : '- Coming soon'}
                    </div>
                    <div className="course-container-title-bottom">
                      <span>View class</span>
                    </div>
                  </div>

                  {cls.class_status == 'locked' ?
                    <div className="course-container-icon">
                      <img src="/assets/icon-lock-white.svg"/>
                    </div>
                    :(cls.class_status == 'completed' ? <div className="course-container-icon"><img src="/assets/icon-check-white.svg"/></div> : <div className="course-container-icon"><img src="/assets/icon-lockopen-white.svg"/></div>)
                  }
                  
                  {cls.class_status == 'completed' ? <div className="course-container-ribbon"><img src={cls.class_ribbon_url}/></div>:''}

                </div>
                {me.state.classDetailsId == cls.class_id ?
                <div className="course-container-triangle"><div className="triangle"></div></div> :
                <div className="course-container-triangle vhidden"><div className="triangle"></div></div>}
              </div>
            </div>
          }
        </div>
      );
    });
  }

  render() {
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 0,
      variableWidth: true,
      nextArrow: <NextIcon />,
      prevArrow: <PrevIcon />,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 1366,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 1920,
          settings: {
            slidesToShow: 4
          }
        }

      ]
    };
    //const img = 'https://images.unsplash.com/photo-1489769811155-68b5848205ac?dpr=2&auto=format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=';
    let viewType = this.props.courses.length === 1 ? 'vertical-slider' : 'horizontal-slider';
    let me=this;

    this.detectFlexRow();

    return (
      <div>
        {this.props.courses.map((course, i) => (
          <div className="mb-5" style={{position: 'relative'}} key={i}>
            <div>
              <div className="course-container-head">
                <h5 className="main-page-title">{course.course_name}{course.is_supplemental == 'yes' ? <span className="tag ml-2">Supplemental</span> : ''}</h5>
                <p>{course.course_description}</p>
              </div>
              <div className={viewType + " course-container-body"}>
                {viewType == 'horizontal-slider' ?  
                  <Slider {...settings}>
                    {this.renderCourse(course, me)}
                  </Slider>
                  :
                  this.renderCourse(course, me)
                }
              </div>
            </div>
            {this.state.classSelected ? 
              <CarouselRectangle topOffset={this.state.topOffset} viewType={viewType} classStatus={this.state.classStatus} goToClassDetailsPage={this.props.goToClassDetailsPage} closeDetailsPage={this.closeClassDetails} elementClassId={course.course_id} selectedCourseId={me.state.courseDetailsId}  classDetails={me.state.classDetails}/>
            : null
            }
          </div>
        ))}
      </div>
    );
  }
}

export default CourseCarousel;
