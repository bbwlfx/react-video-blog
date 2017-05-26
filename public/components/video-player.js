import React, { Component } from 'react';
import '../../static/src/css/video-player.scss';

class VideoPlayer extends Component {
	constructor(props) {
		super(props);
		this.closeVideoPlayer = props.closeVideoPlayer;
	}
	render() {
		const { src } = this.props;
		return (
			<div className="video-player-container">
				<a className="close-btn" href="javascript:void(0)" onClick={this.closeVideoPlayer}>×</a>
				<div className="video-player-content">
					<video className="video-player" src={src} autoPlay controls></video>
				</div>
			</div>
		) 
	}
}

export default VideoPlayer;