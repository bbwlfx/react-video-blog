import React, { Component } from 'react';
import util from '../lib/util';

class ChangeInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			avatar: '../../static/src/images/' + (this.props.userInfo.avatar || 'avatar-default.png'),
		}
		this.uploadAvatar = this.uploadAvatar.bind(this);
		this.changeAvatar = this.changeAvatar.bind(this);
		this.closeModal = props.closeModal;
		this.uploadData = this.uploadData.bind(this);
	}
	uploadAvatar() {
		this.upload.click();
	}
	changeAvatar() {
		if(!this.upload.files[0]){
			return false;
		}
		this.file = this.upload.files[0];
		const read = new FileReader();
		read.onload = (e) => {
			this.setState({
				avatar: e.target.result,
			});
		}
		read.readAsDataURL(this.file);
	}
	uploadData() {
		const data = {
			username: window.userInfo.username,
			avatarUrl: this.state.avatar,
			file: this.file ? this.file.name : '',
			sex: this.sex.value,
			email: this.email.value,
			profile: this.profile.value,
			nickname: this.nickname.value,
			age: this.age.value
		};
		util.fetch('/upload', {
			'method': 'POST',
			data,
		}).then(() => {
			this.props.getUserInfo();
			alert('修改成功');
			this.closeModal();
		}, () => {
			alert('修改失败');
		});
	}
	render() {
		const avatar = window.userInfo.avatar;
		return(
			<div className="modal-container">
				<div className="layer"></div>
				<div className="content">
				<a href="javascript:void(0)" className="close" onClick={this.closeModal}><span>×</span></a>
					<div className="form">
						<table>
							<tr>
								<td>上传头像:</td>
								<td>
									<input 
										type="file" 
										name="file"
										accept=".jpg, .png, .jpeg"
										ref={(ref) => { this.upload = ref; }} 
										style={{ display: 'none' }}
										onChange={this.changeAvatar}
										/>
									<input
										value={this.state.avatar}
										name="avatarUrl"
										style={{ display: 'none' }}/>
									<a
										href="javascript:void(0)"
										onClick={this.uploadAvatar}
										><img
										ref={(ref) => { this.avatar = ref }}
										className="avatar"
										src={this.state.avatar}></img></a>
								</td>
							</tr>
							<tr>
								<td>昵称:</td>
								<td><input name="nickname" type="text" ref={(ref) => {this.nickname = ref;}} /></td>
							</tr>
							<tr>
								<td>性别:</td>
								<td>
									<select name="sex"  ref={(ref) => {this.sex = ref;}} >
										<option value="male">男</option>
										<option value="female">女</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>年龄:</td>
								<td><input name="age" type="text"  ref={(ref) => {this.age = ref;}} /></td>
							</tr>
							<tr>
								<td>邮箱:</td>
								<td><input name="email" type="text"  ref={(ref) => {this.email = ref;}} /></td>
							</tr>
							<tr>
								<td>博客:</td>
								<td><input name="profile" type="text"  ref={(ref) => {this.profile = ref;}} /></td>
							</tr>
						</table>
						<p>
							<input type="submit" value="提交" onClick={this.uploadData} />
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangeInfo;