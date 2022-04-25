const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ parts }) =>
  <>
    {parts.map((part, i) => (
      <Part key={i} name={part.name} exercises={part.exercises}></Part>
    ))}
  </>

const Total = ({ parts }) => {
  const total = parts.reduce((prev, cur) => prev + cur.exercises, 0)

  return <h3>total of {total} exercises</h3>
}

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course, index) =>
        <div key={index}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      )}
    </>
  )
}

export default Course
