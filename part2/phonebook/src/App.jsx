/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import personsService from "../services/persons";
const Filter = ({ handleNewSearch, searchParam }) => {
  return (
    <div>
      filter shown with <input onChange={handleNewSearch} value={searchParam} />
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name:{" "}
        <input onChange={props.handleNewNameChange} value={props.newName} />
      </div>
      <div>
        number:{" "}
        <input onChange={props.handleNewNumberChange} value={props.newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, handleDelete }) =>
  persons.map((person, i) => (
    <p key={i}>
      {person.name}:{person.number}
      <button onClick={handleDelete.bind(null, person)}>delete</button>
    </p>
  ));
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    personsService.getAll().then((response) => setPersons(response.data));
  });

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleNewSearch = (event) => {
    setSearchParam(event.target.value);
    if (searchParam) {
      setSearching(true);
    } else {
      setSearching(false);
    }
  };
  const handleDelete = (person) => {
    if (window.confirm(`do you really want to delete ${person.name} ?`)) {
      console.log(person.id);
      personsService.destroy(person.id).then((res) => console.log(res.data));
    }
  };
  const addPerson = (event) => {
    event.preventDefault();
    const newPersonObject = {
      name: newName,
      number: newNumber,
    };

    let existingObjec = persons.filter(
      (person) => person.name === newPersonObject.name
    );
    if (existingObjec.length) {
      if (
        window.confirm(
          `${newPersonObject.name} is already added to the phonebook, replace the old number with the new one ?`
        )
      )
        personsService.update(existingObjec[0].id, newPersonObject);
    } else {
      personsService.create(newPersonObject).then((res) => {
        setPersons(persons.concat(res.data));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const search = () => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(searchParam)
    );
  };
  const phonebook = searching ? search() : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchParam={searchParam} handleNewSearch={handleNewSearch} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={phonebook} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
