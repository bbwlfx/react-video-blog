import React, { Component } from 'react';
class ChangeInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			avatar: '../../static/src/images/' + (window.userInfo.avatar || 'avatar-default.png'),
		}
		this.uploadAvatar = this.uploadAvatar.bind(this);
		this.changeAvatar = this.changeAvatar.bind(this);
		this.closeModal = props.closeModal;
	}
	uploadAvatar() {
		this.upload.click();
	}
	changeAvatar() {
		if(!this.upload.files[0]){
			return false;
		}
		const file = this.upload.files[0];
		const createUrl = window.createObjectURL || window.URL.createObjectURL || window.webkitURL.createObjectURL;
		const read = new FileReader();
		read.onload = (e) => {
			console.log(e.target.result);
			this.setState({
				avatar: e.target.result,
			});
		}
		read.readAsDataURL(file);
		
	}
	render() {
		const avatar = window.userInfo.avatar;
		return(
			<div className="modal-container">
				<div className="layer"></div>
				<div className="content">
				<a href="javascript:void(0)" className="close" onClick={this.closeModal}><span>×</span></a>
					<form method="post" action="/upload">
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
								<td><input name="nickname" type="text" /></td>
							</tr>
							<tr>
								<td>性别:</td>
								<td>
									<select name="sex">
										<option value="male">男</option>
										<option value="female">女</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>年龄:</td>
								<td><input name="age" type="text" /></td>
							</tr>
							<tr>
								<td>邮箱:</td>
								<td><input name="email" type="text" /></td>
							</tr>
							<tr>
								<td>博客:</td>
								<td><input name="profile" type="text" /></td>
							</tr>
						</table>
						<p>
							<input type="submit" value="提交" />
						</p>
					</form>
				</div>
			</div>
		);
	}
}

export default ChangeInfo;