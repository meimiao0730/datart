import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { getMembers, getRoles } from '../../MemberPage/slice/thunks';
import { getSchedules } from '../../SchedulePage/slice/thunks';
import { getSources } from '../../SourcePage/slice/thunks';
import { getViews } from '../../ViewPage/slice/thunks';
import { getFolders, getStoryboards } from '../../VizPage/slice/thunks';
import { ResourceTypes, SubjectTypes, Viewpoints } from '../constants';
import {
  selectFolderListLoading,
  selectFolders,
  selectMemberListLoading,
  selectMembers,
  selectRoleListLoading,
  selectRoles,
  selectScheduleListLoading,
  selectSchedules,
  selectSourceListLoading,
  selectSources,
  selectStoryboardListLoading,
  selectStoryboards,
  selectViewListLoading,
  selectViews,
} from './selectors';
import {
  GetPermissionParams,
  GrantPermissionParams,
  Privilege,
  ResourcePermissions,
  SubjectPermissions,
} from './types';

export const getResourcePermission = createAsyncThunk<
  ResourcePermissions,
  GetPermissionParams<ResourceTypes>
>('permission/getResourcePermission', async ({ orgId, type, id }) => {
  try {
    const { data } = await request<ResourcePermissions>({
      url: '/roles/permission/resource',
      method: 'GET',
      params: { orgId, resourceType: type, resourceId: id },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getSubjectPermission = createAsyncThunk<
  SubjectPermissions,
  GetPermissionParams<SubjectTypes>
>('permission/getSubjectPermission', async ({ orgId, type, id }) => {
  try {
    const { data } = await request<SubjectPermissions>({
      url: '/roles/permission/subject',
      method: 'GET',
      params: { orgId, subjectType: type, subjectId: id },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getDataSource = createAsyncThunk<
  null,
  { viewpoint: Viewpoints; dataSourceType: ResourceTypes | SubjectTypes },
  { state: RootState }
>(
  'permission/getDataSource',
  async ({ viewpoint, dataSourceType }, { getState, dispatch }) => {
    const folders = selectFolders(getState());
    const storyboards = selectStoryboards(getState());
    const views = selectViews(getState());
    const sources = selectSources(getState());
    const schedules = selectSchedules(getState());
    const roles = selectRoles(getState());
    const members = selectMembers(getState());
    const folderListLoading = selectFolderListLoading(getState());
    const storyboardListLoading = selectStoryboardListLoading(getState());
    const viewListLoading = selectViewListLoading(getState());
    const sourceListLoading = selectSourceListLoading(getState());
    const scheduleListLoading = selectScheduleListLoading(getState());
    const roleListLoading = selectRoleListLoading(getState());
    const memberListLoading = selectMemberListLoading(getState());
    const orgId = selectOrgId(getState());

    switch (dataSourceType) {
      case SubjectTypes.Role:
        if (!roles && !roleListLoading) {
          dispatch(getRoles(orgId));
        }
        break;
      case SubjectTypes.UserRole:
        if (!members && !memberListLoading) {
          dispatch(getMembers(orgId));
        }
        break;
      case ResourceTypes.Viz:
        if (!folders && !folderListLoading) {
          dispatch(getFolders(orgId));
        }
        if (!storyboards && !storyboardListLoading) {
          dispatch(getStoryboards(orgId));
        }
        break;
      case ResourceTypes.View:
        if (!views && !viewListLoading) {
          dispatch(getViews(orgId));
        }
        break;
      case ResourceTypes.Source:
        if (!sources && !sourceListLoading) {
          dispatch(getSources(orgId));
        }
        break;
      case ResourceTypes.Schedule:
        if (!schedules && !scheduleListLoading) {
          dispatch(getSchedules(orgId));
        }
        break;
    }
    return null;
  },
);

export const grantPermissions = createAsyncThunk<
  Privilege[],
  GrantPermissionParams
>('permission/grantPermissions', async ({ params, options, resolve }) => {
  try {
    const { data } = await request<Privilege[]>({
      url: '/roles/permission/grant',
      method: 'POST',
      data: params,
    });
    resolve();
    return options.reserved.concat(data);
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});
