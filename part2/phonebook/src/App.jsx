import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");
  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };
  const addPerson = (event) => {
    event.preventDefault();
    const newPersonObject = {
      name: newName,
    };
    setPersons(persons.concat(newPersonObject));
    setNewName("");
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange={handleNewNameChange} value={newName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>

      {persons.map((person, i) => (
        <p key={i}>{person.name}</p>
      ))}
      <div>debug: {newName}</div>
    </div>
  );
};

export default App;
