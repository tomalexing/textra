import React from 'react'

const Inditator = ({ icon: Icon = false, value = '', hint = '', className = '' } = {}) => (
  <div className={`String-indicator ${className} `}>
    {(Icon === false) ? "" : ((typeof Icon === "string") ? <img src={Icon} alt={hint} /> : Icon)}
    <span>{Number.isNaN(value) ? "" : value}</span>
  </div>
);

export default Inditator;