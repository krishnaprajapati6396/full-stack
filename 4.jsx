import React, { useState } from 'react';

const NAMES = [
  'Aarav',
  'Ananya',
  'Devansh',
  'Ishita',
  'Kabir',
  'Meera',
  'Rohan',
  'Sneha'
];

export default function LiveSearchFilter() {
  const [query, setQuery] = useState('');

  const filteredNames = NAMES.filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>Live Search</h2>
      <input
        type="text"
        placeholder="Search names..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredNames.length > 0 ? (
        <ul>
          {filteredNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}