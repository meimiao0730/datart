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

import { Col, InputNumber, Row, Select, Space } from 'antd';
import { ChartStyleSectionConfig } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const BasicMarginWidth: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const { value: mixedValue, label } = data;
    const widthModeTypes = ['px', '%'];

    const getMode = (value?: string | number) => {
      if (value === null || value === undefined) {
        return widthModeTypes[0];
      }
      return `${value}`.includes(widthModeTypes[1])
        ? widthModeTypes[1]
        : widthModeTypes[0];
    };

    const getNumber = (value?: string | number) => {
      if (value === null || value === undefined) {
        return 0;
      }
      return `${value}`.replaceAll(widthModeTypes[1], '');
    };

    const handleValueChange = newValue => {
      if (getMode(mixedValue) === widthModeTypes[0]) {
        onChange?.(ancestors, newValue);
      }
      if (getMode(mixedValue) === widthModeTypes[1]) {
        onChange?.(ancestors, newValue + widthModeTypes[1]);
      }
    };

    const handleModeChange = newMode => {
      if (newMode === widthModeTypes[0]) {
        onChange?.(ancestors, getNumber(mixedValue));
      }
      if (newMode === widthModeTypes[1]) {
        onChange?.(ancestors, getNumber(mixedValue) + widthModeTypes[1]);
      }
    };

    return (
      <StyledBasicMarginWidth align={'middle'}>
        <Col span={12}>{t(label)}</Col>
        <Col span={12}>
          <Space>
            <InputNumber
              value={getNumber(mixedValue)}
              onChange={handleValueChange}
            />
            <Select value={getMode(mixedValue)} onChange={handleModeChange}>
              <Select.Option value={widthModeTypes[0]}>
                {widthModeTypes[0]}
              </Select.Option>
              <Select.Option value={widthModeTypes[1]}>
                {widthModeTypes[1]}
              </Select.Option>
            </Select>
          </Space>
        </Col>
      </StyledBasicMarginWidth>
    );
  },
  itemLayoutComparer,
);

export default BasicMarginWidth;

const StyledBasicMarginWidth = styled(Row)`
  line-height: 32px;

  & .ant-select {
    width: 60px;
  }

  & .ant-input-number {
    width: 60px;
  }
`;
