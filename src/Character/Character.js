import React, { useCallback, useContext } from 'react';
import { Details } from '../contexts';
import './Character.scss';

const getSrc = ({ thumbnail }) => `${thumbnail.path}/standard_medium.${thumbnail.extension}`;

const Character = ({ character }) => {
  const src = getSrc(character);
  const details = useContext(Details);

  const displayDetails = useCallback(() => details.set(character), [character, details]);

  return (
    <button className="character" onClick={displayDetails}>
      <img className="avatar" src={src} alt={character.name}/>
      <span className="name">{character.name}</span>
    </button>
  );
};

export default Character;