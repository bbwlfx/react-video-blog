import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import '../../static/src/css/prompt.scss';

class Prompt extends Component {
	static show(msg = '') {
		const event = new CustomEvent('showPrompt', {
			detail: {
				msg
			}
		});
		document.dispatchEvent(event);
		clearTimeout(Prompt.timer);
		Prompt.timer = setTimeout(() => {
			Prompt.hide();
		}, 2500);
	}
	static hide() {
		const event = new CustomEvent('hidePrompt');
		document.dispatchEvent(event);
	}
	constructor(props) {
		super(props);
		this.state = {
			msg: '',
			isOpen: false,
		};
	}
	componentDidMount() {
		document.addEventListener('showPrompt', (e) => {
			this.setState({
				isOpen: true,
				msg: e.detail.msg
			});
		})
		document.addEventListener('hidePrompt', (e) => {
			this.setState({
				isOpen: false
			})
		});
	}
	render() {
		const { isOpen, msg } = this.state;
		return(
			<CSSTransitionGroup
				transitionName="prompt"
				transitionAppear
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={300}
				component="div"
				>
				<div key={isOpen}>
					{isOpen && <div className="prompt"><span className="promptMessage">{msg}</span></div>}
				</div>
			</CSSTransitionGroup>
		);
	}
}

export default Prompt;