import React from 'react';
import './Loader.scss';

const Loader = ({ centered }) => (
  <div className={`loader ${centered ? 'loader--centered' : ''}`}>
    Chargement ...
  </div>
);

export default Loader;