import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <h1 className="font-bold text-3xl">
      <span className="text-white">{text1} </span>
      <span
        className="underline underline-offset-[6px] decoration-4"
        style={{ color: '#ff4d5a', textDecorationColor: '#ff4d5a' }}
      >
        {text2}
      </span>
    </h1>
  );
};

export default Title;
