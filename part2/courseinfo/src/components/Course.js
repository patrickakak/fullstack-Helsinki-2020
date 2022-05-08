const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ parts }) => (
  <>
    {parts.map(({ name, exercises, id }) => (
      <Part key={id} name={name} exercises={exercises}></Part>
    ))}
  </>
)

const Total = ({ parts }) => {
  const total = parts.reduce(
    (acc, current) => acc + current.exercises,
    0
  )
  return <h3>total of {total} exercises</h3>
}

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
)

export default Course
