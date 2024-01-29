// MyComponent.tsx
import React, { useEffect } from 'react';
import { EventEmitter } from './emitter';

interface ChildProps {
  emitter: EventEmitter<string>;
}

const Child: React.FC<ChildProps> = ({ emitter }) => {
  useEffect(() => {
    // Subscribe to events when the component mounts
    const eventHandler = (data: any) => {
      console.log(`Received data: ${data}`);
    };

    emitter.on('myEvent', eventHandler);

    // Unsubscribe when the component unmounts
    return () => {
      emitter.off('myEvent', eventHandler);
    };
  }, [emitter]);

  const sendData = () => {
    // Emit an event with data
    emitter.emit('myEvent', 'Hello from Child!');
  };

  return (
    <div>
      <button onClick={sendData}>Send Data</button>
    </div>
  );
};

export default Child;
