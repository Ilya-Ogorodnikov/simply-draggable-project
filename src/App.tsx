import { useCallback } from 'react';
import { IEventArgs, useDraggable } from './hooks';

const quickAndDirtyStyle = {
  width: '200px',
  height: '200px',
  background: '#FF9900',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const DraggableComponent = () => {
  const handleDrag = useCallback((event: IEventArgs) => {
    return {
      x: event.x,
      y: event.y,
    };
  }, []);

  const [ref, pressed, handleMouseDown] = useDraggable({
    onDrag: handleDrag,
  });

  return (
    <div
      ref={ref}
      style={quickAndDirtyStyle}
      onMouseDown={handleMouseDown}
    >
      <p>{pressed ? 'Dragging...' : 'Press to drag'}</p>
    </div>
  );
};

export default function App1() {
  return (
    <div className="App">
      <DraggableComponent />
      <DraggableComponent />
      <DraggableComponent />
      <DraggableComponent />
      <DraggableComponent />
    </div>
  );
}
