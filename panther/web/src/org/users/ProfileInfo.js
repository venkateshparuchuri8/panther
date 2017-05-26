import React, { Component } from 'react';


class ProfileInfo extends Component {
  render() {
   return (
    <div>
      <div className="user-info-item">
        <div className="user-info-item-label">ID</div>
        <div className="user-info-item-text">{this.props.profileData.user_id}</div>
      </div>
      <div className="user-info-item">
        <div className="user-info-item-label">Email</div>
        <div className="user-info-item-text">{this.props.profileData.email}</div>
      </div>
      <div className="user-info-item">
        <div className="user-info-item-label">Name</div>
        <div className="user-info-item-text">{this.props.profileData.name}</div>
      </div>
      <div className="user-info-item">
        <div className="user-info-item-label">Bio</div>
        <div className="user-info-item-text">{this.props.profileData.profile_bio}</div>
      </div>
    </div>

    );
  }
}



export default ProfileInfo;
