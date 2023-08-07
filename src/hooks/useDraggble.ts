import { useCallback, useRef, useState, MouseEvent as ReactMouseEvent, useEffect, RefObject } from 'react';

export interface IEventArgs {
  x: number;
  y: number;
}

export interface IDraggbleArgs {
  onDrag: (event: IEventArgs) => IEventArgs;
}

type useDraggableType = (args: IDraggbleArgs) => [RefObject<HTMLDivElement>, boolean, (e: ReactMouseEvent) => void];

/**
 * Тайпгард для проверки является ли переданный элемент экземпляром div-а
 */
const divTypeGuard = (target: (MouseEvent | ReactMouseEvent)['target']): target is HTMLDivElement => {
  return target instanceof HTMLDivElement;
};

/**
 * Хук, который отвечает за draggble-логику
 */
export const useDraggable: useDraggableType = ({ onDrag }) => {
  // Состояние для отслеживания нажатия на элемент
  const [pressed, setPressed] = useState(false);

  // Начальная позиция
  const position = useRef<IEventArgs>({ x: 0, y: 0 });

  // Реф для элемента, который будет draggble
  const ref = useRef<HTMLDivElement>(null);

  // Функция для изменения состояния нажатия
  const handleMouseDown = useCallback((event: ReactMouseEvent) => {
    // Данная проверка исключительно чтобы TS подхватил типизацию div-а
    if (divTypeGuard(event.target)) {
      event.target.style.userSelect = 'none';
    }

    setPressed(true);
  }, []);

  useEffect(() => {
    // Если нажатия по элементу не было - ничего не делаем
    if (!pressed) {
      return;
    }

    // Функция для изменения позиции элемента
    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current || !position.current) {
        return;
      }

      // Расчет новой позиции и передача значений в функцию onDrag
      position.current = onDrag?.({
        x: position.current.x + event.movementX,
        y: position.current.y + event.movementY,
      });

      // Устанавливаем элементу новые координаты. Используем функцию translate
      // для плавного изменения положения элемента. Это происходит за счет
      // того, что функция translate выносит вычисления на отдельный слой видеокарты
      ref.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
    };

    // Функция для прекращения перетаскивания (нужно перестать удерживать мышь на блоке)
    const handleMouseUp = (event: MouseEvent | ReactMouseEvent) => {
      if (divTypeGuard(event.target)) {
        event.target.style.userSelect = 'auto';
      }
      setPressed(false);
    };

    // Подписываемся на движения мыши по всему документу
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Чистим слушатели событий при перерендерах и размонтировании
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pressed, onDrag]);

  // Возвращаем кортеж
  return [ref, pressed, handleMouseDown];
};
