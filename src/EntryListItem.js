import React, { Component, PropTypes } from 'react';
import momentsFrom from './momentsFrom';
import moment from 'moment';
import './EntryListItem.css';

class EntryListItem extends Component {
	constructor() {
		super();

		this.handleEdit = this.handleEdit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleEdit() {
		this.props.onEdit(this.props.id);
	}

	handleRemove() {
		this.props.onRemove(this.props.id);
	}

	render() {

		let entryMoments = momentsFrom(this.props.starts, this.props.duration);
		let startDateText = entryMoments.startDate.format('MM-DD-YYYY');
		let fromText = entryMoments.from.format('HH:mm');
		let toText = entryMoments.to.format('HH:mm');
		let durationMoment = moment(0).utc().add(entryMoments.duration);
		let durationText = durationMoment.format('HH:mm');

		return (
			<li>
				<p>Notes: {this.props.notes}</p>
				<p>StartDate: {startDateText}</p>
				<p>From: {fromText}</p>
				<p>To: {toText}</p>
				<p>Duration: {durationText}</p>

				<div className="EntryListItem-btn-container">
					<button className="btn btn-success" onClick={this.handleEdit}>
						<span className="glyphicon glyphicon-edit"/>
					</button>
					<button className="btn btn-danger" onClick={this.handleRemove}>
						<span className="glyphicon glyphicon-remove"/>
					</button>
				</div>
			</li>
		);
	}
}

EntryListItem.propTypes = {
	id: PropTypes.number.isRequired,
	notes: PropTypes.string.isRequired,
	starts: PropTypes.number.isRequired,
	duration: PropTypes.number.isRequired,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired
};

export default EntryListItem;