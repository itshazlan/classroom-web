// App.tsx
import React from 'react';
import { EventEmitter } from './emitter';
import Child from './child';

const Parent: React.FC = () => {
  const emitter = new EventEmitter<string>();

  return (
    <div>
      <Child emitter={emitter} />
    </div>
  );
};

export default Parent;
