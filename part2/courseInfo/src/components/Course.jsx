/* eslint-disable react/prop-types */
const Header = ({ course }) => <h1>{course.name}</h1>;

const Total = ({ sum }) => <p>Number of exercises {sum}</p>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part part={part} key={part.id} />
    ))}
  </>
);

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total sum={sum(course.parts)} />
  </div>
);
const sum = (parts) => {
  return parts.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);
};
export default Course;
