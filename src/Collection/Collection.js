import React, { useState, useEffect } from 'react';
import Loader from '../Loader';
import Error from '../Error';
import { fetchCollection } from '../services';

const getSrc = ({ thumbnail }) => thumbnail ? `${thumbnail.path}/portrait_medium.${thumbnail.extension}` : "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_medium.jpg";

const getCollection = async ({ setStatus, setCollection, URI }) => {
  setStatus('loading');
  const collection = await fetchCollection(URI);

  if(collection) {
    const enhancedCollection = collection.map(item => ({
      ...item,
      src: getSrc(item)
    }))
    
    setCollection(enhancedCollection);
    setStatus('ok');
  } else {
    setStatus('error');
  }
};

const Collection = ({ URI }) => {
  const [status, setStatus] = useState(null);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    getCollection({ setStatus, setCollection, URI })
  }, [URI]);

  return (
    <div className="tab-content__item">
      {{
        ok: (
          <>
            {collection && collection.length ? (
              <ul className="references-list">
                {collection.map(({ src, title }) => (
                  <li key={title}>
                    <img src={src} alt={title}/>
                    {title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tab-content__message">Cette collection est vide.</p>
            )}
          </>
        ),
        loading: <Loader centered/>,
        error: <Error message="Impossible d'afficher les références de ce personnage à cause d'une erreur technique." />
      }[status]}
    </div>
  )
};

export default Collection;