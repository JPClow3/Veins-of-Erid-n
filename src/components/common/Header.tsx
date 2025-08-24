import React, { memo } from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-violet-400 font-heading tracking-wider">
        Veins of Eridûn
      </h1>
      <p className="text-slate-300 mt-2 text-lg font-ui">A story of secrets, power, and awakened Flow.</p>
    </header>
  );
};

export default memo(Header);