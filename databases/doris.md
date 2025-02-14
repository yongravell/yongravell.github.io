## 备份快照

创建仓库

```shell
CREATE REPOSITORY `s3_repo`
WITH S3
ON LOCATION "s3://<back_name>/doris-snapshot"
PROPERTIES
(
    "AWS_ENDPOINT" = "https://s3.ap-southeast-1.amazonaws.com",
    "AWS_ACCESS_KEY" = '',
    "AWS_SECRET_KEY"='',
    "AWS_REGION" = "ap-southeast-1"
);
```



备份

```shell
# 备份快照
BACKUP SNAPSHOT <库名>.<快照名称> TO s3_repo;

BACKUP SNAPSHOT db_test.snapshot_label2
TO s3_repo;
```



查询

```sql
# 查看快照
SHOW SNAPSHOT ON s3_repo WHERE SNAPSHOT = "snapshot_label3";

# 取消备份任务
CANCEL BACKUP FROM <库名>;

# 删除仓库
DROP REPOSITORY `s3_repo`;

# 查看仓库
SHOW REPOSITORIES;

# 查看备份的快照
SHOW SNAPSHOT ON s3_repo;
```



## 恢复快照

```shell
#SHOW SNAPSHOT ON s3_repo;  可以查看backup_timestamp
RESTORE SNAPSHOT <库名>.`<备份名>`
FROM `s3_repo`
PROPERTIES ( "backup_timestamp"="2024-09-04-06-19-37" )

# 恢复单张表到指定库
RESTORE SNAPSHOT db_test.`dws1`
FROM `obs_repo`
ON ( `table_name` )
PROPERTIES ( "backup_timestamp"="2025-02-13-05-43-14" )



# 查看恢复快照的进度
SHOW RESTORE FROM <库名>;
```



## 数据导出

```shell
# 导出命令
EXPORT TABLE <库名>.<表名> PARTITION (p20240910, p20240911,) TO "s3://<back_name>/" PROPERTIES ( "format" = "parquet", "data_consistency" = "partition", "max_file_size" = "2048MB", "parallelism" = "10" ) WITH s3 (
    "s3.endpoint" = "s3.ap-southeast-1.amazonaws.com",
    "s3.region" = "ap-southeast-1",
    "s3.access_key" = ""
    "s3.secret_key"="",
);

# 查看导出状态
show export;
```



### OBS

```shell
# 创建仓库
CREATE REPOSITORY `obs_repo`
WITH S3
ON LOCATION "s3://<OBS桶名>/"
PROPERTIES
(
    "AWS_ENDPOINT" = "https://obs.ap-southeast-3.myhuaweicloud.com",
    "AWS_ACCESS_KEY" = '',
    "AWS_SECRET_KEY"='',
    "AWS_REGION" = "ap-southeast-3"
);



## 导出数据
EXPORT TABLE <库名>.<表名> TO "s3://<桶名>" PROPERTIES ( "format" = "parquet", "data_consistency" = "partition", "max_file_size" = "2048MB", "parallelism" = "10" ) WITH s3 (
    "s3.endpoint" = "https://obs.ap-southeast-3.myhuaweicloud.com",
    "s3.region" = "ap-southeast-3",
    "s3.secret_key"="",
    "s3.access_key" = ""
);
```



## 授权

```shell

CREATE USER read_only@'%' IDENTIFIED BY '123456';

GRANT SELECT_PRIV ON *.*.* TO 'read_only'@'%';

DROP USER read_only@'%';
```

