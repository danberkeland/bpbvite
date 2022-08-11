
import React from 'react';
import './App.css';
import SubComp1 from './subComp1';

function NewComp1() {
  return (
    <React.Fragment>
      <SubComp1 />
      <div className="App">
     New Comp 1
     made a couple changes
     made a few more changes
    </div>
    </React.Fragment>
    
  );
}

export default NewComp1;
