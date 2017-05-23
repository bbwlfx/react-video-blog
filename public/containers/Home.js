import React, {Component} from 'react';
import Infomation from '../components/infomation';
import ChangeInfo from '../components/change-info';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		}
		this.closeModal = this.closeModal.bind(this);
		this.showModal = this.showModal.bind(this);
	}
	componentDidMount() {

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
	render() {
		const changeInfo = this.state.showModal ? (<ChangeInfo isShow={this.state.showModal} closeModal={this.closeModal} />) : null;
		return(
			<div className="home-container">
				<div id="infomation">
					<Infomation showModal={this.showModal}/>
				</div>
				<div id="video-list"></div>
				<div id="modal">
					{changeInfo}
				</div>
			</div>
		);
	}
}
export default Home;