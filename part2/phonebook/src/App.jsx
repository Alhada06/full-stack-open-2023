/* eslint-disable react/prop-types */
import { useState } from "react";

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

const Persons = ({ persons }) =>
  persons.map((person, i) => (
    <p key={i}>
      {person.name}:{person.number}
    </p>
  ));
const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [searching, setSearching] = useState(false);

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
  const addPerson = (event) => {
    event.preventDefault();
    const newPersonObject = {
      name: newName,
      number: newNumber,
    };
    if (
      persons.filter((person) => person.name === newPersonObject.name).length
    ) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPersonObject));
      setNewName("");
      setNewNumber("");
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
      <Persons persons={phonebook} />
    </div>
  );
};

export default App;
