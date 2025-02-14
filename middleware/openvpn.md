# 部署openvpn

## 一、编写docker-compose.yml文件

```yaml
version: '3'
services:
  openvpn:
    image: harbor.skyline.com/base/openvpn
    ports:
      - 1194:1194/udp
    cap_add:
      - NET_ADMIN
    restart: always
    volumes:
      - /data:/etc/openvpn
    environment:
      - OVPN_SERVER_URL=udp://119.136.27.212:1194
    command: ovpn_run

volumes:
  openvpn-data:
```



## 二、在启动容器前，初始化配置文件和证书

（1）配置openvpn容器：

```shell
docker-compose run --rm openvpn ovpn_genconfig -u udp://SERVER_DOMAIN_NAME
```

（2）初始化（固定命令格式）：

```shell
docker-compose run --rm openvpn ovpn_initpki
```

::: tip

按照提示输入密码、确认密码等

:::



## 三、启动容器

进入到docker-compose.yml目录，执行以下命令：

```shell
docker-compose up -d
```



## 四、创建用户客户端文件

设置环境变量（使用 export 可以使该变量成为环境变量，使变量在子进程下也可以执行），其中引号内的`your_client_name`替换成自己需要创建的文件名称，后续直接引用该名称。

```shell
docker-compose run --rm openvpn easyrsa build-client-full $CLIENTNAME nopass
docker-compose run --rm openvpn ovpn_getclient $CLIENTNAME > $CLIENTNAME.ovpn
```

::: tip

$CLIENTNAME 是用户名称  nopass 是免密  如果没有nopass  会提示要输入密码

说明：easyrsa是为了做PKI使用的。openvpn使用easy_rsa生成的CA证书，公钥和私钥来实现SSLVPN。

执行完会在docker-compose.yml同级目录下生成后缀为ovpn的文件，用于客户端进行连接

:::



## 五、删除用户（可选，需要时再使用）

```shell
docker-compose run --rm openvpn easyrsa revoke $CLIENTNAME
docker-compose run --rm openvpn easyrsa gen-crl update-db
docker-compose restart
```

