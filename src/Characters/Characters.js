import React, { useLayoutEffect, useRef } from 'react';
import 'marvel-error';
import 'marvel-character';
import './Characters.scss';

const Characters = ({ characters }) => {
  const characterElement = useRef([]);
  
  // Pass data
  useLayoutEffect(() => characterElement.current.forEach((element, i) => {
    element.$set({ character: characters[i] })
  }), [characterElement, characters]);

  // Listen to click event
  useLayoutEffect(() => characterElement.current.forEach(element => element.$on('click', ({ detail : { character } }) => console.log({ character }))), [characterElement]);
  
  return characters.length ? (
  <ul className="characters">
    {characters.map((_, index) => (
      <li key={index}>
        <marvel-character ref={element => characterElement.current[index] = element}  />
      </li>
    ))}
  </ul>
) : (
  <marvel-error message="Aucun résultat." />
)}

export default Characters;