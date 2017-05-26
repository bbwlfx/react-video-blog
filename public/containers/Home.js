import React, {Component} from 'react';
import Infomation from '../components/infomation';
import ChangeInfo from '../components/change-info';
import VideoList from '../components/video-list';
import VideoPlayer from '../components/video-player';
import util from '../lib/util';
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			userInfo: {},
			showVideoPlayer: false,
			localVideoSrc: ''
		}
		util.bindMethods(['closeModal', 'showModal', 'getUserInfo', 'openVideoPlayer', 'closeVideoPlayer'], this);
	}
	componentDidMount() {
		this.getUserInfo();
	}
	closeModal() {
		this.setState({
			showModal: false,
		})
	}
	showModal() {
		this.setState({
			showModal: true,
		})
	}
	getUserInfo() {
		const data = {
			username: window.userInfo.username,
		}
		util.fetch('/get_userinfo', {
			method: 'GET',
			data: data
		}).then(userInfo => {
			this.setState({
				userInfo
			});
		});
	}
	openVideoPlayer(src) {
		this.setState({
			showVideoPlayer: true,
			localVideoSrc: src
		});
	}
	closeVideoPlayer() {
		this.setState({
			showVideoPlayer: false
		});
	}
	render() {
		const { videoList } = this.state.userInfo;
		const { showModal, showVideoPlayer, localVideoSrc, userInfo } = this.state;
		const changeInfo = showModal ? (<ChangeInfo isShow={showModal} closeModal={this.closeModal} getUserInfo={this.getUserInfo} userInfo={userInfo}/>) : null;
		return(
			<div className="home-container">
				<div id="infomation">
					<Infomation
					showModal={this.showModal}
					userInfo={userInfo}
					/>
				</div>
				<div id="video-list">
					<VideoList
						getUserInfo={this.getUserInfo}
						data={videoList}
						openVideoPlayer={this.openVideoPlayer}
						/>
				</div>
				<div id="change-info">
					{changeInfo}
				</div>
				<div id="video-player">
					{showVideoPlayer && 
						<VideoPlayer
							closeVideoPlayer={this.closeVideoPlayer}
							src={localVideoSrc}
						/>}
				</div>
			</div>
		);
	}
}
export default Home;