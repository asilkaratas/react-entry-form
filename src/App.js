import React, { Component } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import { Modal } from 'react-bootstrap';
import update from 'react-addons-update';
         
// Storing starting timestamp and duration is enough
let entries = [
  {
    id: 1,
    notes: 'From now 1',
    starts: Date.now(), // this can be a timestamp with minute precision
    duration: 10 // duration in minutes
  }, 
  {
    id: 2,
    notes: 'From now 2',
    starts: Date.now(),
    duration: 61
  }
];         

class App extends Component {
  constructor() {
    super();

    this.state = {
      showModal: false,
      entries: entries,
      entry: null,
      nextId: entries.length + 1
    };

    this.handleNewEntry = this.handleNewEntry.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleNewEntry() {
    let newEntry = {
      id: -1,
      notes: '',
      starts:Date.now(), 
      duration:30
    };

    this.setState({
      entry: newEntry,
      showModal: true
    });
  }

  handleEdit(id) {
    let entry = this.state.entries.find((entry) => entry.id === id);
    let entryToEdit = {...entry};

    this.setState({
      entry: entryToEdit,
      showModal: true
    });
  }

  handleRemove(id) {
    let entryIndex = this.state.entries.findIndex((entry) => entry.id === id);

    let nextEntries = update(this.state.entries, {
      $splice: [[entryIndex, 1]]
    });

    this.setState({
      entries: nextEntries
    });
  }

  handleSave(entry) {
    let isNew = entry.id === -1;
    
    let nextEntries;

    if(isNew) {
      entry.id = this.state.nextId;

      nextEntries = update(this.state.entries, {
        $push:[entry]
      });

      this.setState({
        entries: nextEntries, 
        showModal: false,
        nextId: this.state.nextId + 1
      });
    } else {
      let entryIndex = this.state.entries.findIndex((e) => e.id === entry.id);

      nextEntries = update(this.state.entries, {
        $splice: [[entryIndex, 1, entry]]
      });

      this.setState({
        entries: nextEntries, 
        showModal: false
      });
    }
  }

  handleCancel() {
    this.setState({
      showModal: false
    });
  }

  render() {

    let entry = this.state.entry;
    let modalTitle = entry !== null && entry.id !== -1 ? 'Edit entry' : 'New entry';

    let entryForm;
    if(entry !== null)
      entryForm = <EntryForm 
                    {...this.state.entry}
                    onSave={this.handleSave}
                    onCancel={this.handleCancel} />;


    return (
      <div className="App">
        <EntryList 
          entries={this.state.entries} 
          onNewEntry={this.handleNewEntry}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove} />

        <Modal 
          show={this.state.showModal}
          onHide={this.handleCancel}>
          <Modal.Header>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {entryForm}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default App;
