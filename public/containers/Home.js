import React, {Component} from 'react';
import Infomation from '../components/infomation';
import ChangeInfo from '../components/change-info';
import VideoList from '../components/video-list';
import util from '../lib/util';
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			userInfo: {},
		}
		this.closeModal = this.closeModal.bind(this);
		this.showModal = this.showModal.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
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
	render() {
		const changeInfo = this.state.showModal ? (<ChangeInfo isShow={this.state.showModal} closeModal={this.closeModal} getUserInfo={this.getUserInfo} userInfo={this.state.userInfo}/>) : null;
		return(
			<div className="home-container">
				<div id="infomation">
					<Infomation
					showModal={this.showModal}
					userInfo={this.state.userInfo}
					/>
				</div>
				<div id="video-list">
					<VideoList />
				</div>
				<div id="change-info">
					{changeInfo}
				</div>
			</div>
		);
	}
}
export default Home;