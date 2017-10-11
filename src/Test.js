import React from 'react';
import Timer from './components/Timer';
export default class Test extends React.Component {
  
    render() {
      return (<div>
               <Timer
                  start={new Date('8/29/2017 17:34')}
                  duration={1000}
                  isBig={true}

                  />
                <Timer
                    start={new Date('8/29/2017 17:20')}
                    finish={new Date('8/29/2017 17:21')}
                    duration={120}
                    isBig={true}
                     />
                <Timer
                    start={new Date('8/29/2017 17:20')}
                    duration={100000}
                    isBig={true}
                     />
      </div>)
    }
  }