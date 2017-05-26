import React , {Component , PropTypes} from 'react';
import { ModalBody, FormGroup , Input , Row , Col} from 'reactstrap';
import * as actions from '../common/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class SelectImage extends Component{
  constructor(props){
    super(props);
    this.state ={
      imageslist: [],
      image_id:'',
      searchdata:'',
      imagesloader:true,
      count:1,
      length:0

    };
    this.selectedImage = this.selectedImage.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.loadmore = this.loadmore.bind(this);
    //this.images = this.images.bind(this);
  }
  images(start){
    fetch('/api/unsplash', {
        method: 'POST',
        body : JSON.stringify({
          start : start,
          end : 15
        }),
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
      }).then((response) => {
        if (response.status === 200) {
          // Assuming server responds with
          // `{ "url": "http://example-cdn.com/image.jpg"}`
          return response.json().then(data => {
            if (data) {
              console.log(data);
              this.setState({'imagesloader':false,imageslist: this.state.imageslist.concat(data),length:data.length});
           }
            else{
              this.setState({'imagesloader':false});

            }
          });
        }
      });


  }
  imagessearch(start){
      if(this.state.searchdata){
      this.setState({'imagesloader':true});
      const data = {};
      data.start = start;
      data.end = 15;
      data.category = this.state.searchdata;
      fetch('/api/unsplash/search', {
        method: 'POST',
        body : JSON.stringify(data),
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
      }).then((response) => {
        if (response.status === 200) {
          // Assuming server responds with
          // `{ "url": "http://example-cdn.com/image.jpg"}`
          return response.json().then(data => {
            if (data) {
              this.setState({'imagesloader':false,imageslist: this.state.imageslist.concat(data),length:data.length});
            }
          });
        }
      });

    }
  }
  componentDidMount() {
    this.setState({'loadimages':'images'});
    this.images(1);


  }
  selectedImage(e){
    e.preventDefault();
    this.setState({
      image_id:(this.state.image_id ? '' : e.target.id)});
    this.props.image_selected(this.state.image_id ? '' : e.target.id);

  }
  searchImage(e){
    e.preventDefault();
    this.setState({'searchdata':e.target.value,'loadimages':'search',imageslist:[]});
    this.imagessearch(1);

  }

  loadmore(e){
    e.preventDefault();
    if(this.state.loadimages == 'images'){
      const count = this.state.count + 1 ;
      this.setState({count:count+1});
      const start = count * 1;
      this.images(start);
    }
    else {
       const count = this.state.count + 1 ;
      this.setState({count:count+1});
      const start = count * 1;
      this.imagessearch(start);
    }

  }
  render(){
    const imagecheck=<img className="material-thumbnail-check" src="/assets/icon-completed.svg"/>;

    return(

      <div>
      <ModalBody>
      <FormGroup>
        <Row>
          <Col>
          <Input type="text" placeholder="Search" value={this.state.searchdata} onChange={this.searchImage}/>
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
      {this.state.imageslist.map((obj,index) =>
      <div key={index} className='stock-thumbnail' style={{backgroundImage: 'url(' +obj.urls.thumb+ ')'}}>
      <div className={obj.urls.thumb === this.state.image_id ? "stock-thumbnail is-selected" : "stock-thumbnail"} id={obj.urls.thumb} onClick={this.selectedImage}>
      {obj.urls.thumb === this.state.image_id ? imagecheck : ""}
      </div>
      </div>
      )}
      <div id="loading" className={this.state.imagesloader? 'show':'hide'}><img src="/assets/icon-loading.svg" /></div>
      <Row>
        <Col sm={{ size: 6, push: 2, pull: 2, offset: 1 }}>
        {this.state.length ? <div><i><a href="" onClick={this.loadmore}>more..</a></i></div> : ''}
        </Col>
      </Row>
      </FormGroup>
      </ModalBody>
      </div>
    );
  }
}
SelectImage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

SelectImage.propTypes = {
 actions: PropTypes.object.isRequired
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    auth:state.auth
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectImage);
