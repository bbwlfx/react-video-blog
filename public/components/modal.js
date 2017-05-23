import React, { Component } from 'react';

class Modal extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { isOpen, children, uploadHandle, closeHandle } = this.props;
		return(
			<div className="modal-container">
				{isOpen && <div className="modal-content">
					<div className="modal-body">
						{children}
					</div>
					<div className="button">
						<button className="btn btn-default" onClick={closeHandle}>取消</button>
						<button className="btn btn-primary" onClick={uploadHandle}>确认</button>
					</div>
				</div>}
			</div>
		);
	}
}
export default Modal;