import React, { Component} from 'react';
import Page from '../common/components/Page';
//import ReactTable from 'react-table';
import Isvg from 'react-inlinesvg';
import {Row, Col, Button} from 'reactstrap';


class Channel extends Component {

  constructor(props) {
    super(props);
  }

  log() {
    alert('lol');
  }

  render() {
    return (
    <div>
    <Page>
      <Row>
        <Col md="10" className="mx-auto">
          <div className="channel-header">
            <h4>#Empathetic Leadership I</h4>
            <p className="text-muted">Channel description here</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="10" className="mx-auto">
          <div className="channel-msg-list">
        <section className="channel-msg">
          <div className="channel-msg-header">
            <div className="channel-msg-author">
              <div className="forum-avatar mr-2"></div>
              <div className="channel-msg-author-name">Ian Hogan</div>
              <div className="channel-msg-author-role text-muted">General Director@Bunker Labs</div>
            </div>
            <div className="channle-msg-timestamp text-muted">10:01</div>
          </div>
          <div className="channel-msg-content">
            <p>According to the research firm Frost & Sullivan, the estimated size of the North American used test and measurement equipment market was $446.4 million in 2004 and is estimated to grow to $654.5 million by 2011. For over 50 years, companies and governments have procured used test and measurement instruments in order to realize a number of benefits including the need to:</p>
            <p>
              According to the research firm Frost & Sullivan, the estimated size of the North American used test and measurement equipment market was $446.4 million in 2004 and is estimated to grow to $654.5 million by 2011. For over 50 years, companies and governments have procured used test and measurement instruments in order to realize a number of benefits including the need to:
            </p>
            <p>
              Although there are many considerations when purchasing used test and measurement instruments, the quality of the instrument and reliability of the vendor should be at the top of the list. Used test equipment vendors deploy a number of bywords that represent the equipment they sell, including “refurbished”, “remarketed”, “reconditioned”, “rebuilt” and, the obvious, “used”. These marketing adjectives typically imply various quality processes and buyers of used test equipment should execute their due diligence prior to purchasing. These marketing adjectives typically imply various quality processes and buyers of used test equipment.
            </p>
          </div>
          <div className="channel-msg-footer">
            <div className="reply-count">2 Replies <Isvg src="/assets/reply-arrow-down.svg"></Isvg></div>
            <div className="reply-action"><Isvg src="/assets/reply-icon.svg"></Isvg> Reply</div>
          </div>
        </section>
        <section className="channel-msg-reply-list">
          <section className="channel-msg-reply">
            <div className="channel-msg-header">
            <div className="channel-msg-author">
              <div className="forum-avatar mr-2"></div>
              <div className="channel-msg-author-name">Ian Hogan</div>
              <div className="channel-msg-author-role text-muted">General Director@Bunker Labs</div>
            </div>
            <div className="channle-msg-timestamp text-muted">10:01</div>
            </div>
            <div className="channel-msg-content">
            <p>According to the research firm Frost & Sullivan, the estimated size of the North American used test and measurement equipment market was $446.4 million in 2004 and is estimated to grow to $654.5 million by 2011. For over 50 years, companies and governments have procured used test and measurement instruments in order to realize a number of benefits including the need to:</p>
            </div>
          </section>
          <section className="channel-msg-reply">
            <div className="channel-msg-header">
            <div className="channel-msg-author">
              <div className="forum-avatar mr-2"></div>
              <div className="channel-msg-author-name">Clyde Baker</div>
              <div className="channel-msg-author-role text-muted">General Director@Bunker Labs</div>
            </div>
            <div className="channle-msg-timestamp text-muted">10:01</div>
            </div>
            <div className="channel-msg-content">
            <p>According to the research firm Frost & Sullivan, the estimated size of the North American used test and measurement equipment market was $446.4 million in 2004 and is estimated to grow to $654.5 million by 2011. For over 50 years, companies and governments have procured used test and measurement instruments in order to realize a number of benefits including the need to:</p>
            </div>
          </section>
        </section>
        <section className="channel-msg">
          <div className="channel-msg-header">
            <div className="channel-msg-author">
              <div className="forum-avatar mr-2"></div>
              <div className="channel-msg-author-name">Clyde Becker</div>
              <div className="channel-msg-author-role text-muted">Admin@Bunker Labs</div>
            </div>
            <div>
              <div className="channle-msg-timestamp text-muted">10:01</div>
            </div>
          </div>
          <div className="channel-msg-content">
            <p>“The moment you think of buying a Web Hosting Plan, you know one thing – So many choices, which one to choose? Whether you would want to choose Shared Linux Packages or a Unix Package or do you want to go for a shared windows package or packages reseller for hosting? Trust me, a lot of individuals stand confused when they see that there are thousands of plans yet very little resource of comparison.</p>
            <p>
              Click on the link website-hosting-reviews-free and you would know why a lot of people consider this link as top notch hosting reviews or hosting directory site. When you spend some time in this website, you would realize that a lot of information presented in this website is extremely unique only to this site and you would not find this anywhere else.
            </p>
          </div>
          <div className="channel-msg-footer">
            <div className="reply-count">2 Replies <Isvg src="/assets/reply-arrow-down.svg"></Isvg></div>
            <div className="reply-action"><Isvg src="/assets/reply-icon.svg"></Isvg> Reply</div>
          </div>
        </section>
      </div>
      <div className="channel-reply">
        <Button onClick={this.log} size="sm" color="primary start"><Isvg src="/assets/reply-icon-white.svg"></Isvg> Reply</Button>
      </div>
        </Col>
      </Row>

    </Page>
  </div>

    );
  }
}




export default Channel;
