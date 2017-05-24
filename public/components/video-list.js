import React, { Component } from 'react';
import Modal from './modal';
import util from '../lib/util';
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
		const getUserInfo = this.props.getUserInfo;
		const url = this.inputURL.value;
		if(/http:\/\/www.bilibili.com\/video\/av/.test(url)) {
			const av = /\d+/g.exec(url)[0];
			const data = {
				av,
				username: window.userInfo.username
			};
			util.fetch('/upload', {
				method: 'POST',
				data
			}).then(res => {
				if(res.code === 0) {
					alert('上传成功');
					this.closeModal();
					getUserInfo();
				} else {
					alert('上传失败，请稍后重试');
				}
			}, () => {
				alert('上传失败，请稍后重试');
			});
		} else {
			alert('请输出正确的视频url');
		}
	}
	render() {
		const data = this.props.data || [];
		return(
			<div className="video-list-container">
				<Modal
				isOpen={this.state.isShow}
				uploadHandle={this.uploadHandle}
				closeHandle={this.closeModal}>
					<input className="input" placeholder="请输入Bilibili视频页的URL" ref={(ref) => { this.inputURL = ref; }} />
				</Modal>
				<div className="video-list-content">
					<ul className="list">
						{
							data.map(obj => (
								<li className="item">
									<div className="item-content">
										<a href={`http://www.bilibili.com/video/av${obj.av}`} className="img-a">
											<img src={obj.img} />
										</a>
										<a className="title-a" href={`http://www.bilibili.com/video/av${obj.av}`}>{obj.title}</a>
									</div>
								</li>
							))
						}
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