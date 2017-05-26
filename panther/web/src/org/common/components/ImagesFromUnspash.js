import React , {Component } from 'react';
import { ModalBody, FormGroup , Input , Row , Col, ModalFooter, Button} from 'reactstrap';
// import Unsplash, { toJson } from 'unsplash-js';


class UnsplashImages extends Component{
  constructor(props){
    super(props);
    this.state ={
      imageslist: [],
      image_id:'',
      searchdata:''
    };
    this.selectedImage = this.selectedImage.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.selectedStockImage=this.selectedStockImage.bind(this);
  }
  componentDidMount() {
    fetch('/api/unsplash', {
        method: 'POST',
        body : JSON.stringify({
          start : 1,
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
              this.setState({imageslist: data});

            }
          });
        }
      });

  }
  selectedImage(e){
    e.preventDefault();
    this.setState({'image_id': e.target.id});
  }
  selectedStockImage(e){
    e.preventDefault();
    this.props.preview_unsplash(this.state.image_id);
  }
  searchImage(e){
    e.preventDefault();
    this.setState({'searchdata':e.target.value});
    if(e.target.value){
      const data = {};
      data.start = 1;
      data.end = 15;
      data.category = e.target.value;
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
              this.setState({imageslist: data});

            }
          });
        }
      });

    }
  }
  render(){
    const imagecheck = <img className="stock-thumbnail-check" src="/assets/icon-green-check.svg"/>;

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
      </FormGroup>
      </ModalBody>
      <ModalFooter>
          <Button size="lg" color="primary" onClick={this.selectedStockImage}>Select</Button>{' '}
          <Button size="lg" color="cancel" className="btn-cancel" onClick={this.props.modelClose}>Cancel</Button>
        </ModalFooter>
      </div>
    );
  }
}



export default UnsplashImages;
