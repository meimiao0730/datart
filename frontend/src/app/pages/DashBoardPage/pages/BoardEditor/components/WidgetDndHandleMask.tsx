/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { CONTAINER_TAB } from 'app/pages/DashBoardPage/constants';
import { ContainerItem, WidgetType } from 'app/pages/DashBoardPage/slice/types';
import React, { memo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { editBoardStackActions } from '../slice';
export interface WidgetDndHandleMaskProps {
  widgetId: string;
  widgetType: WidgetType;
}
export const WidgetDndHandleMask: React.FC<WidgetDndHandleMaskProps> = memo(
  ({ widgetId, widgetType }) => {
    const dispatch = useDispatch();
    interface DropResult {
      tabItem: ContainerItem;
      parentId: string;
    }

    const [_, dragRef, dragPreview] = useDrag(() => ({
      type: CONTAINER_TAB,
      item: { type: widgetType },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        if (item && dropResult) {
          const { tabItem, parentId } = dropResult;
          dispatch(
            editBoardStackActions.addWidgetToContainerWidget({
              parentId,
              tabItem: { ...tabItem, childWidgetId: widgetId },
              sourceId: widgetId,
            }),
          );
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }));

    const ssp = e => {
      e.stopPropagation();
    };
    return (
      <>
        <div
          ref={dragPreview}
          className="dragRef2"
          onClick={ssp}
          onDragStart={ssp}
          style={{
            position: 'absolute',
            top: '0',
            cursor: 'grabbing',
            width: '100%',
            height: '100%',
          }}
        ></div>
        <div
          ref={dragRef}
          // onDragStart={ssp}
          onClick={ssp}
          className="dragRef1"
          style={{
            position: 'absolute',
            cursor: 'grabbing',
            top: '0',
            zIndex: 15,
            width: '100%',
            height: '100%',
          }}
        ></div>
      </>
    );
  },
);
export default WidgetDndHandleMask;
