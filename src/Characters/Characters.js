import React from 'react';
import Character from '../Character';
import Error from '../Error';

import './Characters.scss';

const Characters = ({ characters }) => characters.length ? (
  <ul className="characters">
    {characters.map((character, index) => (
      <li key={index}>
        <Character character={character} />
      </li>
    ))}
  </ul>
) : (
  <Error message="Aucun résultat." />
)

export default Characters;