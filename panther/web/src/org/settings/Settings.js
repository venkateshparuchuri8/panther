import React, {Component} from 'react';
import {Tab,Tabs,TabPanel,TabList} from 'react-tabs';
import {Row, Col, Button, Modal, ModalHeader, ModalFooter} from 'reactstrap';
import Page from '../common/components/Page';
import UserSettings from './UserSettings';
import SiteSettings from './SiteSettings';
import NewFieldForm from './NewFieldForm';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

	render(){
		return(
			<Page pageTitle="Settings" pageAction={<Button size ="sm" color="primary" onClick={this.toggle}>New Field</Button>}>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Add New Field</ModalHeader>
          <NewFieldForm/>
          <ModalFooter>
            <Button size="lg" color="primary">Save</Button>
            <Button size="lg" className="btn-cancel" color="cancel">Cancel</Button>
          </ModalFooter>
        </Modal>
        <Row>
        <Col xs="11">
          <Tabs>
            <TabList>
              <Tab className="settings-tab">User Profile Fields </Tab>
              <Tab className="settings-tab">Site Settings</Tab>
            </TabList>
            <TabPanel>
              <UserSettings />
            </TabPanel>
            <TabPanel>
              <SiteSettings />
            </TabPanel>
          </Tabs>
        </Col>
        </Row>
			</Page>
		);
	}

}
export default Settings;
