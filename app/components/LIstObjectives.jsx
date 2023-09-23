import React from "react";

const LIstObjectives = ({ paragraph }) => {
  const sentences = paragraph.split(/(?<=\.)\s+/);

  // Create an array of list items
  const listItems = sentences.map((sentence, index) => (
    <li key={index}>{sentence}</li>
  ));

  return <ul className="list-disc">{listItems}</ul>;
};

export default LIstObjectives;
