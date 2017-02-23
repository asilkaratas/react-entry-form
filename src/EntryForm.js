import React, { Component, PropTypes } from 'react';
import './react-datetime.css';
import DateTimeInput from './DateTimeInput';
import momentsFrom from './momentsFrom';
import moment from 'moment';
import './EntryForm.css';



class EntryForm extends Component {
	constructor(props) {
		super(props);

    let entryMoments = momentsFrom(this.props.starts, this.props.duration);

		this.state = {
			notes: this.props.notes, 
      ...entryMoments,
      fromLocked: true,
      notesHasError: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);

		this.handleStartDate = this.handleStartDate.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.handleFrom = this.handleFrom.bind(this);
    this.handleTo = this.handleTo.bind(this);
    this.handleDuration = this.handleDuration.bind(this);

    this.toggleLock = this.toggleLock.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();

    let notesHasError = !this.state.notes;

    this.setState({
      notesHasError
    });

    if(!notesHasError) {
      let starts = this.state.from.valueOf();
      let duration = this.state.duration.valueOf()/(60*1000);

      this.props.onSave({
        id:this.props.id, 
        notes: this.state.notes,
        starts, duration
      });

    }
	}

	handleCancel() {
		this.props.onCancel();
	}

  handleNotes(e) {
    let notes = e.target.value;
    this.setState({notes, notesHasError:!notes});
  }

  handleStartDate(startDate) {
    this.setState({startDate});
  }

  handleFrom(from) {
    this.setState((oldState) => {
      let diff = oldState.to.diff(from);
      
      if(diff > 0) {
        let duration = moment.duration(diff, 'milliseconds');
        return { from, duration };
      } 

      return oldState;
    });
  }

  handleTo(to) {
    this.setState((oldState) => {
      let diff = to.diff(oldState.from);
      if(diff > 0) {
        let duration = moment.duration(diff, 'milliseconds');
        return {to, duration}
      }
        

      return oldState;
    });
  }

  handleDuration(durationMoment) {
    let duration = moment.duration(durationMoment.valueOf(), 'milliseconds');
    this.setState((oldState) => {
        if(oldState.fromLocked) {
          let to = moment(oldState.from).add(duration);
          let diff = to.diff(oldState.from);
          if(diff > 0 && to.date() === oldState.from.date())
            return {to, duration};
        } else {
          let from = moment(oldState.to).subtract(duration);
          let diff = oldState.to.diff(from);
          if(diff > 0 && oldState.to.date() === from.date())
            return {from, duration};
        }

      return oldState;
    });
    
  }

  toggleLock() {
    this.setState({
      fromLocked: !this.state.fromLocked
    });
  }

	render() {

    // Duration is converted into a moment (utc) because the DateTime component
    // does not work with Duration.
    // Remember handleDuration returns a moment.
    let durationMoment = moment(0).utc().add(this.state.duration);

    let notesClassName = this.state.notesHasError ? 'form-group has-error' : 'form-group';

		return (
			<form onSubmit={this.handleSubmit}>
        <div className={notesClassName}>
          <label className="control-label">Notes:</label>
          <textarea className="form-control" rows={6} value={this.state.notes} onChange={this.handleNotes}/>
        </div>
        
        <div className="row">
        <DateTimeInput mode="date" label="Start Date:" format="MM/DD/YYYY" 
          onChange={this.handleStartDate} 
          value={this.state.startDate} />
        
        <DateTimeInput mode="time" label="From:" format="HH:mm" lockable
          onChange={this.handleFrom} 
          onLock={this.toggleLock}
          locked={this.state.fromLocked}
          value={this.state.from}/>

        <DateTimeInput mode="time" label="Duration:" format="HH:mm"
          onChange={this.handleDuration} 
          value={durationMoment}/>
        
        <DateTimeInput mode="time" label="To:" format="HH:mm" lockable
          onChange={this.handleTo} 
          onLock={this.toggleLock}
          locked={!this.state.fromLocked}
          value={this.state.to}/>
        
        </div>
        <div className="EntryForm-btn-container form-group">
            <input type="submit" className="btn btn-success" value="Save"/>
            <input type="button" className="btn btn-danger" onClick={this.handleCancel} value="Cancel"/>
        </div>
      </form>
		);
	}
}

EntryForm.propTypes = {
  id: PropTypes.number.isRequired,
  starts: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  notes: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default EntryForm;