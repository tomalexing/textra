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
                <Text/>
      </div>)
    }
  }


class Bound extends React.Component{
  constructor(p){
    super(p)
    for(let funcName of Object.getOwnPropertyNames(this.constructor.prototype)){
      if(/^on\S+/.test(funcName)){
          this[funcName] = this[funcName].bind(this)
      }
    }
  }
  render(){
    return(<div>Bound</div>)
  }
}

class Text extends Bound{
  constructor(p){
    super(p)
  }
  onSomething(){
    console.log(this)
  }
  render(){
    return(<div onClick={this.onSomething}>TEST</div>)
  }
}