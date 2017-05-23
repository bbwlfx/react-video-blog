import React, { Component } from 'react';
import Modal from './modal';

class VideoList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false
		};
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.uploadHandle = this.uploadHandle.bind(this);
	}
	showModal() {
		this.setState({
			isShow: true
		});
	}
	closeModal() {
		this.setState({
			isShow: false
		});
	}
	uploadHandle() {

	}
	render() {
		return(
			<div className="video-list-container">
				<Modal
				isOpen={this.state.isShow}
				openHandle={this.uploadHandle}
				closeHandle={this.closeModal}>
					<input className="input" placeholder="请输入Bilibili视频页的URL" />
				</Modal>
				<div className="video-list-content">
					<ul className="list">
						<li className="item">
							<div className="item-content"></div>
						</li>
						<li className="item">
							<div className="item-content"></div>
						</li>
						<li className="item">
							<div className="item-content"></div>
						</li>
						<li className="item">
							<div className="item-content"></div>
						</li>
					</ul>
					<div className="upload-container">
						<button className="btn btn-primary" onClick={this.showModal}>添加视频链接</button>
					</div>
				</div>
			</div>
		);
	}
}

export default VideoList;