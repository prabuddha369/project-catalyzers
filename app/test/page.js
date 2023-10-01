import React from "react";
const project = await fetch("http://localhost:3000/api/projects/");
const array = await project.json();
console.log(array);
const page = () => {
  return (
    <div>
      <div>
        <h1>Projects</h1>
        <ul>
          {array.response.map((project) => {
            return <li key={project.id}>{project.name}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default page;
