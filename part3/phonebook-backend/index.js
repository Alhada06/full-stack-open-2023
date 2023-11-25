require("dotenv").config();

const express = require("express");

const cors = require("cors");
var morgan = require("morgan");
const app = express();
morgan.token("body", function (req, res) {
  return Object.keys(req.body).length === 0 ? "" : JSON.stringify(req.body);
});
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("static_dist"));

const Person = require("./models/person");

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  let personsObj;
  Person.find({}).then((persons) => {
    personsObj = persons;
  });

  response.send(
    `<p>The Phonebook has info for ${
      personsObj.length
    } people</p><p>${new Date()}</p>`
  );
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "person's id does not exist";
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

// const generateId = () => {
//   return Math.floor(Math.random() * 100);
// };

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  // if (persons.find((p) => p.name === body.name)) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`http://localhost:${PORT}`);
});
