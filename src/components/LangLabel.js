import React from 'react';

const LangLabel = ({ from = 'Rus', to = 'Eng', selected = false, className = '' } = {}) => {
  return (
    <div className={`LangLabel  ${selected ? 'selected' : ''} ${className}`}>
      <span className="LangLabel-from" >{from}</span>
      <span className="LangLabel-to" >{to}</span>
    </div>
  )
}
export default LangLabel