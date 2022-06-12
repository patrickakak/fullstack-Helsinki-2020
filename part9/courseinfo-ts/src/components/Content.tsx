import React from "react";
import { CoursePart } from "../types";
import { assertNever } from "../utils";
import Part from "./Part";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  const parts = courseParts.map((part) => {
    switch (part.name) {
      case "Fundamentals":
        return <Part key={part.name} coursePart={part} />;
      case "Using props to pass data":
        return <Part key={part.name} coursePart={part} />;
      case "Deeper type usage":
        return <Part key={part.name} coursePart={part} />;
      case "Special newly created course":
        return <Part key={part.name} coursePart={part} />;
      default:
        return assertNever(part);
    }
  });

  return <React.Fragment>{parts}</React.Fragment>;
};

export default Content;
