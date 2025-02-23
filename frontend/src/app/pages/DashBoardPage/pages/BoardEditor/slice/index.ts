import { combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { BOARD_UNDO } from 'app/pages/DashBoardPage/constants';
import { EditBoardState } from 'app/pages/DashBoardPage/pages/BoardEditor/slice/types';
import {
  BoardInfo,
  BoardLinkFilter,
  JumpPanel,
  WidgetData,
  WidgetInfo,
  WidgetPanel,
} from 'app/pages/DashBoardPage/slice/types';
import { getInitBoardInfo } from 'app/pages/DashBoardPage/utils/board';
import { Layout } from 'react-grid-layout';
/** { excludeAction,includeAction } */
import undoable, { includeAction } from 'redux-undo';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ChartEditorProps } from '../components/ChartEditor';
import { editBoardStackSlice } from './childSlice/stackSlice';
import {
  getEditBoardDetail,
  getEditWidgetDataAsync,
  toUpdateDashboard,
} from './thunk';

// BoardInfo
// editDashBoardInfoActions

const editDashBoardInfoSlice = createSlice({
  name: 'editBoard',
  initialState: getInitBoardInfo('default') as EditBoardState['boardInfo'],
  reducers: {
    initEditBoardInfo(state, action: PayloadAction<BoardInfo>) {
      const boardInfo = action.payload;
      Object.keys(boardInfo).forEach(key => {
        state[key] = boardInfo[key];
      });
    },
    changeDashboardEdit(state, action: PayloadAction<boolean>) {
      state.editing = action.payload;
    },
    changeEditBoardLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    changeFullScreenItem(state, action: PayloadAction<string>) {
      state.fullScreenItemId = action.payload;
    },
    changeFilterPanel(state, action: PayloadAction<WidgetPanel>) {
      state.filterPanel = action.payload;
    },
    changeLinkagePanel(state, action: PayloadAction<WidgetPanel>) {
      state.linkagePanel = action.payload;
    },
    changeJumpPanel(state, action: PayloadAction<JumpPanel>) {
      state.jumpPanel = action.payload;
    },
    adjustDashLayouts(state, action: PayloadAction<Layout[]>) {
      state.layouts = JSON.parse(JSON.stringify(action.payload));
      // state.layouts = [...action.payload];
    },
    changeShowBlockMask(state, action: PayloadAction<boolean>) {
      state.showBlockMask = action.payload;
    },
    changeBoardDroppable(state, action: PayloadAction<boolean>) {
      state.isDroppable = action.payload;
    },
    addClipboardWidgets(
      state,
      action: PayloadAction<BoardInfo['clipboardWidgets']>,
    ) {
      state.clipboardWidgets = action.payload;
    },
    clearClipboardWidgets(state) {
      state.clipboardWidgets = {};
    },
    changeChartEditorProps(
      state,
      action: PayloadAction<ChartEditorProps | undefined>,
    ) {
      state.chartEditorProps = action.payload;
    },
    changeBoardLinkFilter(
      state,
      action: PayloadAction<{
        boardId: string;
        triggerId: string;
        linkFilters?: BoardLinkFilter[];
      }>,
    ) {
      const { boardId, triggerId, linkFilters } = action.payload;
      state.linkFilter = state.linkFilter.filter(
        link => link.triggerWidgetId !== triggerId,
      );
      if (linkFilters) {
        state.linkFilter = state.linkFilter.concat(linkFilters);
      }
    },
  },
  extraReducers: builder => {
    //  updateDashboard
    builder.addCase(toUpdateDashboard.pending, state => {
      state.saving = true;
    });
    builder.addCase(toUpdateDashboard.fulfilled, (state, action) => {
      state.saving = false;
    });
    builder.addCase(toUpdateDashboard.rejected, state => {
      state.saving = false;
    });
    //loadEditBoardDetail
    builder.addCase(getEditBoardDetail.pending, state => {
      state.loading = true;
    });
    builder.addCase(getEditBoardDetail.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getEditBoardDetail.rejected, state => {
      state.loading = false;
    });
  },
});
// widgetInfo
// editWidgetInfoActions
const widgetInfoRecordSlice = createSlice({
  name: 'editBoard',
  initialState: {} as EditBoardState['widgetInfoRecord'],
  reducers: {
    selectWidget(
      state,
      action: PayloadAction<{
        multipleKey: boolean;
        id: string;
        selected: boolean;
      }>,
    ) {
      const { multipleKey, id, selected } = action.payload;
      if (multipleKey) {
        state[id].selected = selected;
      } else {
        for (let key of Object.keys(state)) {
          if (key === id) {
            state[id].selected = selected;
          } else {
            state[key].selected = false;
          }
        }
      }
    },
    selectSubWidget(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state[id].selected) {
        for (let key of Object.keys(state)) {
          state[key].selected = false;
        }
        state[id].selected = true;
      }
    },
    renderedWidgets(state, action: PayloadAction<string[]>) {
      const ids = action.payload;
      ids.forEach(id => {
        state[id] && (state[id].rendered = true);
      });
    },
    clearSelectedWidgets(state) {
      for (let key of Object.keys(state)) {
        state[key].selected = false;
        state[key].editing = false;
      }
    },
    openWidgetEditing(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      for (let key of Object.keys(state)) {
        state[key].selected = false;
      }
      state[id].selected = true;
      state[id].editing = true;
    },
    closeWidgetEditing(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id) {
        state[id].selected = false;
        state[id].editing = false;
      } else {
        for (let key of Object.keys(state)) {
          state[key].selected = false;
          state[key].editing = false;
        }
      }
    },
    addWidgetInfos(state, action: PayloadAction<Record<string, WidgetInfo>>) {
      const widgetInfoRecord = action.payload;
      const widgetIds = Object.keys(widgetInfoRecord);
      widgetIds.forEach(id => {
        state[id] = widgetInfoRecord[id];
      });
    },
    clearWidgetInfo(state) {
      Object.keys(state).forEach(id => {
        delete state[id];
      });
    },
    changeWidgetInLinking(
      state,
      action: PayloadAction<{
        boardId: string;
        widgetId: string;
        toggle: boolean;
      }>,
    ) {
      const { boardId, widgetId, toggle } = action.payload;
      state[widgetId].inLinking = toggle;
    },
  },
  extraReducers: builder => {
    builder.addCase(getEditWidgetDataAsync.pending, (state, action) => {
      const { widgetId } = action.meta.arg;
      state[widgetId].loading = true;
    });
    builder.addCase(getEditWidgetDataAsync.fulfilled, (state, action) => {
      const { widgetId } = action.meta.arg;
      state[widgetId].loading = false;
    });
    builder.addCase(getEditWidgetDataAsync.rejected, (state, action) => {
      const { widgetId } = action.meta.arg;
      state[widgetId].loading = false;
    });
  },
});
// getEditWidgetDataAsync
// editWidgetDataActions
const editWidgetDataSlice = createSlice({
  name: 'editBoard',
  initialState: {} as EditBoardState['widgetDataMap'],
  reducers: {
    setWidgetData(state, action: PayloadAction<WidgetData>) {
      const widgetData = action.payload;
      state[widgetData.id] = widgetData;
    },
  },
});
export const { actions: editBoardStackActions } = editBoardStackSlice;
export const { actions: editDashBoardInfoActions } = editDashBoardInfoSlice;
export const { actions: editWidgetInfoActions } = widgetInfoRecordSlice;
export const { actions: editWidgetDataActions } = editWidgetDataSlice;
const filterActions = [
  editBoardStackActions.setBoardToEditStack,
  editBoardStackActions.updateBoard,
  editBoardStackActions.updateBoardConfig,
  editBoardStackActions.addWidgets,
  editBoardStackActions.deleteWidgets,
  editBoardStackActions.changeWidgetsRect,
  editBoardStackActions.resizeWidgetEnd,

  editBoardStackActions.tabsWidgetAddTab,
  editBoardStackActions.tabsWidgetRemoveTab,
  editBoardStackActions.updateWidgetConfig,
  editBoardStackActions.updateWidgetsConfig,
].map(ele => ele.toString());
const editBoardStackReducer = undoable(editBoardStackSlice.reducer, {
  undoType: BOARD_UNDO.undo,
  redoType: BOARD_UNDO.redo,
  ignoreInitialState: true,
  // filter: excludeAction([configActions.changeSlideEdit(false).type]),
  // 像 高频的 组件拖拽。resize、select虽然是用户的行为，但是也不能都记录在 快照中.只记录resizeEnd 和 dragEnd 有意义的结果快照
  filter: includeAction(filterActions),
});

const editBoardReducer = combineReducers({
  stack: editBoardStackReducer,
  boardInfo: editDashBoardInfoSlice.reducer,
  widgetInfoRecord: widgetInfoRecordSlice.reducer,
  widgetDataMap: editWidgetDataSlice.reducer,
});

export const useEditBoardSlice = () => {
  useInjectReducer({ key: 'editBoard', reducer: editBoardReducer });
};
