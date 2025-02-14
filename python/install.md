# 安装python

从官网下载安装包 https://www.python.org/downloads/

安装

```shell
wget https://www.python.org/ftp/python/3.10.15/Python-3.10.15.tgz
tar -xf Python-3.10.15.tgz
cd  Python-3.10.15.tgz
./configure
make
make install
```



安装新的虚拟环境

```shell
# 安装虚拟环境
cd /usr/local/
/usr/local/python3.6/bin/pyvenv venv
cd venv
source bin/activate
##### 新用法
./python/bin/python3 -m venv /usr/local/venv
```

