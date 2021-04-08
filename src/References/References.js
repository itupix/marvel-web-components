import React, { useState, useContext } from 'react';
import Collection from '../Collection';
import { Details } from '../contexts';
import { categories } from '../constants';
import './References.scss';

const References = () => {
  const [current, setCurrent] = useState(0)
  const details = useContext(Details);

  return (
    <div className="references">
      <nav className="tabs" data-current={current}>
        {categories.map((category, index) => (
          <button key={index} onClick={() => setCurrent(index)}>{category.label}</button>
        ))}
      </nav>
      <div className="tab-content" data-current={current}>
        {categories.map(category => <Collection key={details.value[category.key].collectionURI} URI={details.value[category.key].collectionURI} />)}
      </div>
    </div>
  )
};

export default References;