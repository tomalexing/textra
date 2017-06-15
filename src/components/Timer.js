import React from 'react';

const Timer = ({ start, duration, isBig = false } = {}) => {

  const percentage = ((new Date() - new Date(start))) / duration / 1000;

  const START = Math.PI * 0.5;
  const TAU = Math.PI * 2;
  const radius = isBig ? 7 : 5;
  //const percentage = .8;
  const targetX = radius - Math.cos(START + (percentage * TAU)) * radius;
  const targetY = radius - Math.sin(START - (percentage * TAU)) * radius;
  const largeArcFlag = percentage > 0.5 ? 1 : 0;
  const points = [
    // Top center.
    `M ${radius} 0`,

    // Arc are applied to whatever parcentage, swap flag equals 1 and I dont know what is mean. :)
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${targetX} ${targetY}`,

    // Back to the center.
    `L ${radius} ${radius}`,

    // Close path
    'Z'
  ];

  return (
    <svg className={`Timer ${isBig ? 'Timer-big' : ''}`} xmlns="http://www.w3.org/2000/svg">
      <path d={points.join(' ')} />
    </svg>
  )
}

export default Timer;