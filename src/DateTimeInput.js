import React, { Component, PropTypes } from 'react';
import Datetime from 'react-datetime';
import './react-datetime.css';
import './DateTimeInput.css';
import moment from 'moment';

class DateTimeInput extends Component {
	constructor() {
		super();
		this.handleToggle = this.handleToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

		this.state = {
			text: ''
		};
	}

	handleToggle() {
		this.refs.picker.openCalendar();
	}

	handleChange(dateMoment) {
		this.props.onChange(dateMoment);
	}

	handleBlur(e) {
		let dateMoment = moment(e.target.value, this.props.format);
		if(this.props.value.isUTC()) {
			let midnight = moment('00:00', this.props.format);
			midnight.utc();
			dateMoment = moment(dateMoment - midnight);

		} 

		if(dateMoment !== null && dateMoment.isValid()) {
			if(this.props.value.isUTC())
				dateMoment.utc();

			this.props.onChange(dateMoment);
		} else {
			this.setState({
				text: this.getFormatedText(this.props)
			});
		}
	}

	handleInput(e) {
		this.setState({
			text: e.target.value
		});
	}

	getFormatedText(props) {
		return props.value.format(props.format);
	}

	componentWillReceiveProps(nextProps) {
	  this.setState({ text: this.getFormatedText(nextProps)});
	}

	render() {
		let mode = this.props.mode;
		let format = this.props.format;

		let dateFormat = mode === 'date' ? format : false;
		let timeFormat = mode === 'time' ? format : false;

		let iconClassName = mode === 'date' ? 'glyphicon glyphicon-calendar' 
											: 'glyphicon glyphicon-time';

		let lockIcon = null;
		if(this.props.lockable) {
			let lockClassName = 'glyphicon glyphicon-lock';
			if(!this.props.locked) {
				lockClassName += ' DateTimeInput-unlocked';
			}
			lockIcon = <span className="input-group-btn">
                		<button type="button" className="btn btn-default" 
                			onClick={this.props.onLock}>
                			<span className={lockClassName}/>
                		</button>
                	</span>;
		}


		return (
			<div className="form-group col-xs-6">
				<label className="control-label">{this.props.label}</label>
				<span className="input-group">
					{lockIcon}
					<input type="text" className="form-control" 
						   value={this.state.text} 
						   placeholder={this.props.format} 
						   onBlur={this.handleBlur} 
                		   onChange={this.handleInput} />
                	<span className="input-group-btn">
                		<button type="button" className="btn btn-default"
                			onClick={this.handleToggle}>
                			<span className={iconClassName}/>
                		</button>
                	</span>
				</span>
				<Datetime input={false} 
				    ref="picker"
				    dateFormat={dateFormat}
				    timeFormat={timeFormat}
				    value={this.props.value}
				    onChange={this.handleChange}/>
			</div>

		);
	}
}

DateTimeInput.propTypes = {
	value: PropTypes.instanceOf(moment).isRequired,
	mode: PropTypes.oneOf(['time', 'date']).isRequired,
	label: PropTypes.string.isRequired,
	format: PropTypes.string.isRequired,
	lockable: PropTypes.bool,
	locked: PropTypes.bool,
	onLock: PropTypes.func
};


export default DateTimeInput;