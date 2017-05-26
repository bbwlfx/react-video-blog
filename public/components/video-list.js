import React, { Component } from 'react';
import Modal from './modal';
import moment from 'moment';
import util from '../lib/util';

class VideoList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false
		};
		util.bindMethods(['showModal', 'closeModal', 'uploadHandle', 'uploadVideo', 'videoChange'], this);
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
	uploadVideo() {
		this.video.click();
	}
	uploadHandle() {
		const getUserInfo = this.props.getUserInfo;
		const url = this.inputURL.value;
		if(/http:\/\/www.bilibili.com\/video\/av/.test(url)) {
			const av = /\d+/g.exec(url)[0];
			const data = {
				av,
				source: 'bilibili'
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
	videoChange() {
		const getUserInfo = this.props.getUserInfo;
		if(!this.video.files[0]) {
			return;
		};
		const file = this.video.files[0];
		if(file.type !== 'video/mp4' && file.type !== 'video/flv') {
			alert('视频类型错误');
			return;
		};
		if(file.size > 200 * 1024 * 1024) {
			alert('视频应不大于200MB');
			return;
		};
		const formData = new FormData();
		formData.append('file', file);
		util.fetch('/upload/video', {
			method: 'POST',
			data: formData
		}).then(res => {
			getUserInfo();
		}, (err) => {
			console.log(err);
		})
	}
	render() {
		const data = this.props.data || [];
		const format = util.formatNumber;
		const { openVideoPlayer } = this.props;
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
							data.map((obj, index) => {
								if(obj.source === 'bilibili') {
									return (<li className="item" key={index}>
											<div className="item-content">
												<a href={`http://www.bilibili.com/video/av${obj.av}`} target="_blank" className="img-a">
													<img src={obj.img} />
													<span className="video-time">{moment(obj.time*1000).format('mm:ss')}</span>
													<div className="meta-mask">
														<div className="meta-info">
															<p className="view">{`播放: ${format(obj.view)}`}</p>
															<p className="favorite">{`收藏: ${format(obj.favorite)}`}</p>
															<p className="author">{`up主: ${obj.up}`}</p>
															<p className="share">{`分享: ${format(obj.share)}`}</p>
														</div>
													</div>
												</a>
												<a className="title-a" href={`http://www.bilibili.com/video/av${obj.av}`}>{obj.title}</a>
											</div>
										</li>
									)
								} else {
									return (
										<li className="item" key={index}>
											<div className="item-content">
												<a href="javascript:void(0)" className="img-a" onClick={() => { openVideoPlayer(obj.src); }}>
													<video src={obj.src}></video>
												</a>
												<a className="title-a" href="javascript:void(0)" onClick={() => { openVideoPlayer(obj.src); }}>{decodeURIComponent(obj.name)}</a>
											</div>
										</li>
									);
								}
							})
						}
					</ul>
					<div className="upload-container">
						<button className="btn btn-primary" onClick={this.uploadVideo}>上传本地视频</button>
						<input
							style={{ display: 'none' }}
							type="file" accept=".mp4, .flv"
							ref={(ref) => { this.video = ref }}
							onChange={this.videoChange}
							/>
						<button className="btn btn-primary" onClick={this.showModal}>添加视频链接</button>
					</div>
				</div>
			</div>
		);
	}
}

export default VideoList;