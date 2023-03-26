import { useRef } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { ItemType } from '../utils/enums';
import { DragItem, TaskModel } from '../utils/models';

export function useTaskDragAndDrop<T extends HTMLElement>({
  task,
  index,
}: {
  task: TaskModel;
  index: number;
}) {
  const ref = useRef<T>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: ItemType.TASK,
    item: { from: task.column, id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [_, drop] = useDrop<DragItem, void, unknown>({
    accept: ItemType.TASK,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const draggedItemIndex = item.index;
      const hoveredItemIndex = index;

      if (draggedItemIndex === hoveredItemIndex){
        return
      }

      const isDraggedItemAboveHovered =draggedItemIndex < hoveredItemIndex
      const isDraggedItemBelowHovered =draggedItemIndex > hoveredItemIndex

      const {x:mouseX,y:mouseY} = monitor.getClientOffset() as XYCoord

      const hoveredBoundingRect = ref.current.getBoundingClientRect()

      const hoveredMiddleHeight = 
      (hoveredBoundingRect.bottom - hoveredBoundingRect.top)/2

      const mouseYRelativeToHovered = mouseY - hoveredBoundingRect.top
      const mouseXRelativeToHovered = mouseX - hoveredBoundingRect.top

    },
  });

  drag(ref);

  return {
    ref,
    isDragging,
  };
}
