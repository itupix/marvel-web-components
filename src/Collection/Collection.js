import React, { useState, useEffect, useRef } from 'react';
import { fetchCollection } from '../services';
import 'marvel-loader';
import 'marvel-error';
import 'marvel-collection';

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

  const collectionElement = useRef(null);

  useEffect(() => collectionElement.current?.$set({ collection }), [status, collectionElement, collection]);

  useEffect(() => {
    getCollection({ setStatus, setCollection, URI });
  }, [URI]);

  return (
    <div className="tab-content__item">
      {{
        ok: <marvel-collection ref={collectionElement} />,
        loading: <marvel-loader centered/>,
        error: <marvel-error message="Impossible d'afficher les références de ce personnage à cause d'une erreur technique." />
      }[status]}
    </div>
  )
};

export default Collection;