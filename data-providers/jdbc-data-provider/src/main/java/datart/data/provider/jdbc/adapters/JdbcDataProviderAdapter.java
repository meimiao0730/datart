/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package datart.data.provider.jdbc.adapters;

import datart.core.base.PageInfo;
import datart.core.common.Application;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.data.provider.JdbcDataProvider;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.base.JdbcDriverInfo;
import datart.data.provider.base.JdbcProperties;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.ResultSetMapper;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.SqlDialect;
import org.apache.commons.lang3.StringUtils;

import javax.sql.DataSource;
import java.io.Closeable;
import java.sql.*;
import java.util.*;

@Slf4j
@Setter
@Getter
public class JdbcDataProviderAdapter implements Closeable {

    private static final String SQL_DIALECT_PACKAGE = "datart.data.provider.calcite.dialect";

    protected DataSource dataSource;

    protected JdbcProperties jdbcProperties;

    protected JdbcDriverInfo driverInfo;

    protected boolean init;

    protected SqlDialect sqlDialect;

    public void init(JdbcProperties jdbcProperties, JdbcDriverInfo driverInfo) {
        try {
            this.jdbcProperties = jdbcProperties;
            this.driverInfo = driverInfo;
            this.dataSource = JdbcDataProvider.getDataSourceFactory().createDataSource(jdbcProperties);
        } catch (Exception e) {
            log.error("data provider init error", e);
            throw new DataProviderException(e);
        }
        this.init = true;
    }

    public boolean test(JdbcProperties properties) {
        try {
            Class.forName(properties.getDriverClass());
        } catch (ClassNotFoundException e) {
            String errMsg = "Driver class not found " + properties.getDriverClass();
            log.error(errMsg, e);
            throw new DataProviderException(errMsg);
        }
        try {
            DriverManager.getConnection(properties.getUrl(), properties.getUser(), properties.getPassword());
        } catch (SQLException sqlException) {
            throw new DataProviderException(sqlException);
        }
        return true;
    }

    public Set<String> readAllDatabases() throws SQLException {

        Set<String> catalogs = new HashSet<>();

        try (Connection conn = getConn()) {
            String catalog = conn.getCatalog();
            if (StringUtils.isNotBlank(catalog)) {
                return Collections.singleton(catalog);
            }
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getCatalogs()) {
                while (rs.next()) {
                    String catalogName = rs.getString(1);
                    catalogs.add(catalogName);
                }
            }
            return catalogs;
        }
    }

    public Set<String> readAllTables(String database) throws SQLException {
        try (Connection conn = getConn()) {
            Set<String> tables = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getTables(database, conn.getSchema(), null, null)) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    tables.add(tableName);
                }
            }
            return tables;
        }
    }

    public Set<Column> readTableColumn(String database, String table) throws SQLException {
        try (Connection conn = getConn()) {
            HashMap<String, Column> columnMap = new HashMap<>();
            DatabaseMetaData metadata = conn.getMetaData();
            ResultSet columns = metadata.getColumns(database, null, table, null);
            while (columns.next()) {
                Column column = readTableColumn(columns);
                columnMap.put(column.getName(), column);
            }
            return new HashSet<>(columnMap.values());
        }
    }


    public String getVariableQuote() {
        return driverInfo.getVariableQuote();
    }


    private Column readTableColumn(ResultSet columnMetadata) throws SQLException {
        Column column = new Column();
        column.setName(columnMetadata.getString(4));
        column.setType(DataTypeUtils.sqlType2DataType(columnMetadata.getString(6)));
        return column;
    }

    public Dataframe execute(String sql) throws SQLException {
        try (Connection conn = getConn()) {
            Statement statement = conn.createStatement();
            return ResultSetMapper.mapToTableData(statement.executeQuery(sql));
        }
    }

    public Dataframe execute(String selectSql, PageInfo pageInfo) throws SQLException {
        Dataframe dataframe;
        try (Connection conn = getConn()) {
            Statement statement = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            try (ResultSet resultSet = statement.executeQuery(selectSql)) {
                if (pageInfo.getPageNo() <= 1) {
                    // init pageInfo
                    resultSet.last();
                    initPageInfo(pageInfo, resultSet.getRow());
                    resultSet.first();
                }
                //paging through  sql
                if (supportPaging()) {
                    dataframe = ResultSetMapper.mapToTableData(resultSet);
                    dataframe.setPageInfo(pageInfo);
                    return dataframe;
                }

                //paging through  jdbc
                resultSet.absolute((int) Math.min(pageInfo.getTotal(), (pageInfo.getPageNo() - 1) * pageInfo.getPageSize()));

                dataframe = ResultSetMapper.mapToTableData(resultSet, pageInfo.getPageSize());
                dataframe.setPageInfo(pageInfo);
                return dataframe;
            }
        }
    }

    private Connection getConn() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void close() {
        if (dataSource == null) {
            return;
        }
        JdbcDataProvider.getDataSourceFactory().destroy(dataSource);

    }

    public boolean supportPaging() {
        return false;
    }

    public SqlDialect getSqlDialect() {
        if (sqlDialect != null) {
            return sqlDialect;
        }
        try {
            sqlDialect = SqlDialect.DatabaseProduct.valueOf(driverInfo.getDbType().toUpperCase()).getDialect();
        } catch (Exception ignored) {
            throw new DataProviderException("Dbtype " + driverInfo.getDbType() + " mismatched");
        }
        try {
            return Application.getBean(sqlDialect.getClass());
        } catch (Exception e) {
            log.debug("Custom sql dialect for {} not found. using default", sqlDialect.getClass().getSimpleName());
        }
        return sqlDialect;
    }

    private void initPageInfo(PageInfo pageInfo, int total) {
        pageInfo.setTotal(total);
        pageInfo.setPageNo(1);
    }

}
