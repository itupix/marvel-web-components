import React, { useContext } from 'react';
import { Details } from '../contexts';
import References from '../References';
import './CharacterDetails.scss';

const CharacterDetails = () => {
  const details = useContext(Details);

  const close = () => details.set(null);
  const className = details.value ? 'character-details--visible' : '';
  const src = details.value ? `${details.value.thumbnail.path}/standard_xlarge.${details.value.thumbnail.extension}` : null;

  return (
    <div className={`character-details ${className}`}>
      {details.value && (
        <>
          <div className="bio">
            <img className="bio__avatar" src={src} alt={details.name} />
            <h2 className="bio__title">{details.name}</h2>
            <p className="bio__description">{details.description}</p>
          </div>
          <References />
          <button className="character-details__close" onClick={close}>Fermer</button>
        </>
      )}
    </div>
  )
};

export default CharacterDetails;