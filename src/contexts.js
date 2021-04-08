import React, { useState } from 'react';

export const Query = React.createContext(null);
export const Offset = React.createContext(0);
export const Total = React.createContext(null);
export const Details = React.createContext(null);

export const useQuery = () => {
  const [value, set] = useState(null);
  return { value, set };
};

export const useDetails = () => {
  const [value, set] = useState(null);
  return { value, set };
};

export const useTotal = () => {
  const [value, set] = useState(null);
  return { value, set };
};

export const useOffset = () => {
  const [value, set] = useState(null);
  return { value, set };
};