// useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const calculateDefaultValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error while retrieving from local storage:', error);
      return initialValue;
    }
  };

  const [value, setValue] = useState(calculateDefaultValue);

  useEffect(() => {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error while storing in local storage:', error);
    }
  }, [key, value]);

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  return [value, updateValue];
}