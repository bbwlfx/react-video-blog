import React, {Component} from 'react';

const outputUrl = '../../static/src/images/';

class Infomation extends Component {
	constructor(props) {
		super(props);
		this.showModal = props.showModal;
		this.logout = this.logout.bind(this);
	}
	logout() {
		document.cookie = "has_login=no;path=/";
		window.location.reload();
	}
	render() {
		const { nickname, sex, email, profile, age, avatar } = this.props.userInfo;
		return (
			<div className="infomation-container">
				<div className="avatar-container">
					<img className="avatar" src={`${outputUrl}${avatar ? decodeURIComponent(avatar) : 'avatar-default.png'}`} alt="请刷新页面"/>
				</div>
				<div className="infomation-content">
					<table>
						<tr className="infomation-name">
							<td>昵称:</td>
							<td>{decodeURIComponent(nickname)}</td>
						</tr>
						<tr className="infomation-sex">
							<td>性别:</td>
							<td>{decodeURIComponent(sex)}</td>
						</tr>
						<tr className="infomation-age">
							<td>年龄:</td>
							<td>{decodeURIComponent(age)}</td>
						</tr>
						<tr className="infomation-email">
							<td>邮箱:</td>
							<td>{decodeURIComponent(email)}</td>
						</tr>
						<tr className="infomation-profile">
							<td>博客:</td>
							<td>{decodeURIComponent(profile)}</td>
						</tr>
					</table>
					<p className="infomation-edit">
						<a href="javascript:void(0)" onClick={this.showModal}>[编辑个人资料]</a>
					</p>
					<p className="infomation-edit">
						<a href="javascript:void(0)" onClick={this.logout}>[注销账号]</a>
					</p>
				</div>
			</div>
		);
	}
}

export default Infomation;