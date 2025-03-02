import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
import { ResourceTypes, SubjectTypes, Viewpoints } from '../constants';
import { ResourcePermissions, SubjectPermissions } from './types';

const selectDomain = (state: RootState) => state.permission || initialState;

export const selectFolders = createSelector(
  [selectDomain],
  permissionState => permissionState.folders,
);

export const selectStoryboards = createSelector(
  [selectDomain],
  permissionState => permissionState.storyboards,
);

export const selectViews = createSelector(
  [selectDomain],
  permissionState => permissionState.views,
);

export const selectSources = createSelector(
  [selectDomain],
  permissionState => permissionState.sources,
);

export const selectSchedules = createSelector(
  [selectDomain],
  permissionState => permissionState.schedules,
);

export const selectRoles = createSelector(
  [selectDomain],
  permissionState => permissionState.roles,
);

export const selectMembers = createSelector(
  [selectDomain],
  permissionState => permissionState.members,
);

export const selectFolderListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.folderListLoading,
);

export const selectStoryboardListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.storyboardListLoading,
);

export const selectViewListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.viewListLoading,
);

export const selectSourceListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.sourceListLoading,
);

export const selectScheduleListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.scheduleListLoading,
);

export const selectRoleListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.roleListLoading,
);

export const selectMemberListLoading = createSelector(
  [selectDomain],
  permissionState => permissionState.memberListLoading,
);

export const selectPermissionMap = createSelector(
  [selectDomain],
  permissionState => permissionState.permissions,
);

export const makeSelectPrivileges = () =>
  createSelector(
    [
      selectPermissionMap,
      (_, props: { viewpoint: Viewpoints }) => props.viewpoint,
      (_, props: { dataSourceType: ResourceTypes | SubjectTypes }) =>
        props.dataSourceType,
    ],
    (permissionMap, viewpoint, dataSourceType) => {
      if (viewpoint === Viewpoints.Resource) {
        const permissionObject = permissionMap[viewpoint].permissionObject as
          | ResourcePermissions
          | undefined;
        if (dataSourceType === SubjectTypes.Role) {
          return permissionObject?.rolePermissions?.filter(
            ({ subjectType }) => subjectType === dataSourceType,
          );
        } else {
          return permissionObject?.userPermissions?.filter(
            ({ subjectType }) => subjectType === dataSourceType,
          );
        }
      } else {
        const permissionObject = permissionMap[viewpoint].permissionObject as
          | SubjectPermissions
          | undefined;
        return permissionObject?.permissionInfos?.filter(
          ({ resourceType }) => resourceType === dataSourceType,
        );
      }
    },
  );

export const selectPermissionLoading = createSelector(
  [
    selectPermissionMap,
    (_, props: { viewpoint: Viewpoints }) => props.viewpoint,
  ],
  (permissionMap, viewpoint) => permissionMap[viewpoint].loading,
);
