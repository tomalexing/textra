import React from 'react';

const Timer = ({ start, duration, isBig = false, isExpired = false, finish, checkStatus = () => {} } = {}) => {
  let percentage;

  if(finish === undefined){
    percentage = ((new Date() - new Date(start))) / duration /1000 ; // duration in sec
    if(percentage < 0) percentage = 0;
    if((new Date() - new Date(start))/1000 > duration) {
      // expired
      percentage = 0.99;
      isExpired = true;
    }
  }
  if(finish instanceof Date){
    percentage = duration / ((new Date(finish) - new Date(start))) * 1000 ; // duration in sec
    if(percentage < 0) percentage = 0;
    if((new Date(finish) - new Date(start))/1000 < duration) {
      // expired
      percentage = 0.99;
      isExpired = true;
    }
  }


  if(isNaN(percentage) || Number.isNaN(percentage)) {
    percentage = 0.5; // Fill circle
    isExpired = true;
  }

  checkStatus(isExpired);

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
    <span title={`${isExpired ? 'Время истекло' : 'В процессе работы'}`}><svg className={`Timer ${isBig ? 'Timer-big' : ''} ${isExpired ? 'Timer-yellow' : ''}`} xmlns="http://www.w3.org/2000/svg">
      <path d={points.join(' ')} />
    </svg></span>
  )
}

export default Timer;