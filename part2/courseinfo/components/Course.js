import React from "react"

const Header = ({ course }) => {
  return <h1>{course}</h1>
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part, i) => (
        <Part key={i} name={part.name} exercises={part.exercises}></Part>
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((prev, cur) => prev + cur.exercises, 0)

  return <h3>total of {total} exercises</h3>
}

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course, i) => {
        return (
          <div key={i}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        )
      })}
    </>
  )
}

export default Course
