import { ChartStyleSectionConfig } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import produce, { Draft } from 'immer';

export interface Action<T> {
  ancestors: number[];
  value: T;
}

export function updateBy<T>(base: T, updator: (draft: Draft<T>) => void) {
  return produce(base, draft => {
    updator(draft);
  });
}

export function addTo<T1>(base: T1[], value: T1): T1[] {
  return produce(base, draft => {
    draft.push(value as any);
  });
}

export function addByKey<T1, T2>(base: T1[], key: string, value: T2): T1[] {
  return produce(base, draft => {
    draft[key].push(value);
  });
}

export function updateByKey<T1, T2>(
  base: T1,
  key: string | number,
  value: T2,
): T1 {
  return produce(base, draft => {
    draft[key] = value;
  });
}

export function updateCollectionByAction<T extends ChartStyleSectionConfig>(
  base: T[],
  action: Action<T>,
) {
  const value = action.value;
  const keys = [...action.ancestors];

  const nextState = produce(base, draft => {
    const index = keys.shift() as number;
    if (index !== undefined) {
      if (keys.length > 0) {
        recursiveUpdateImpl(draft[index], keys, value as any);

        return;
      }
      draft[index] = value as any;
    }
  });
  return nextState;
}

export function updateByAction<T extends ChartStyleSectionConfig>(
  base: T,
  action: Action<T>,
) {
  const value = action.value;
  const keys = [...action.ancestors];

  const nextState = produce(base, draft => {
    recursiveUpdateImpl(draft, keys, value as any);
  });
  return nextState;
}

export function recursiveUpdateImpl<T extends ChartStyleSectionConfig>(
  draft: T,
  keys: number[],
  value: T,
) {
  if (!keys || keys.length === 0) {
    draft = value;
    return;
  }
  if (draft.rows) {
    if (keys.length === 1) {
      const index = keys[0];
      draft.rows[index] = value;
      return;
    } else if (keys.length > 1) {
      const index = keys.shift() as number;
      recursiveUpdateImpl(draft.rows[index], keys, value);
      return;
    }
  }
}
