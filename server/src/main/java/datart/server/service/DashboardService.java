package datart.server.service;

import datart.core.entity.Dashboard;
import datart.core.entity.Folder;
import datart.core.mappers.ext.DashboardMapperExt;
import datart.server.base.dto.DashboardBaseInfo;
import datart.server.base.dto.DashboardDetail;
import datart.server.base.params.BaseCreateParam;

import java.util.List;

public interface DashboardService extends VizCRUDService<Dashboard, DashboardMapperExt> {

    List<DashboardBaseInfo> listDashboard(String orgId);

    Folder createWithFolder(BaseCreateParam createParam);

    DashboardDetail getDashboardDetail(String dashboardId);

}