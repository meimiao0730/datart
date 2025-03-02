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
import {
  CanDropToWidgetTypes,
  CONTAINER_TAB,
} from 'app/pages/DashBoardPage/constants';
import React, { useMemo } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import styled from 'styled-components/macro';
import { ContainerItem } from '../../../slice/types';

export interface DropHolderProps {
  tabItem: ContainerItem;
  parentId: string;
}
const DropHolder: React.FC<DropHolderProps> = ({ tabItem, parentId }) => {
  const [{ isOver, canDrop }, refDrop] = useDrop(
    () => ({
      accept: CONTAINER_TAB,
      item: { tabItem, parentId },
      drop: () => ({ tabItem, parentId }),
      canDrop: (item: any) => {
        if (CanDropToWidgetTypes.includes(item.type)) {
          return true;
        }
        return false;
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  );
  const bgColor = useMemo(() => {
    let color = 'transparent';
    if (canDrop) {
      color = '#f1e648c7';
      if (isOver) {
        color = '#1bcf81d3';
      }
    }

    return color;
  }, [isOver, canDrop]);
  return (
    <DropWrap ref={refDrop} bgcolor={bgColor}>
      <div className="center">将组件拖入该区域</div>
    </DropWrap>
  );
};
export default DropHolder;
interface DropWrapProps {
  bgcolor: string;
}
const DropWrap = styled.div<DropWrapProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${p => p.bgcolor};

  .center {
    text-align: center;
  }
`;
