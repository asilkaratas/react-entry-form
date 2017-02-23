import React, { Component, PropTypes } from 'react';
import EntryListItem from './EntryListItem';

import './EntryList.css';

class EntryList extends Component {

	render() {
		let entries = this.props.entries.map((entry) => {
			return <EntryListItem 
						key={entry.id} 
						{...entry}
						onEdit={this.props.onEdit}
						onRemove={this.props.onRemove} />;
		});

		return (
			<div className="EntryList">
				<div className="EntryList-header">
					<button className="btn btn-primary" onClick={this.props.onNewEntry}>
			          New Entry
			        </button>
		        </div>
				<ul>
					{entries}
				</ul>
				
			</div>
		);
	}
}

EntryList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNewEntry: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default EntryList;