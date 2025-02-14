# nginx常用操作
## nginx源码安装
```shell
yum -y install gcc gcc-c++ make openssl-devel pcre-devel
./configure --prefix=/usr/local/nginx --with-http_ssl_module \
--with-http_stub_status_module --with-stream
make
make install 
```

## nginx强制跳转正确请求
```shell
location / {
            error_page 405 =200 /index.html;
            try_files $uri $uri/ /index.html;
        }
```

## nginx配置跨域
```shell
location / {  
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }
} 
```

## nginx转发去掉后缀
使用Nginx做代理的时候，可以简单的直接把请求原封不动的转发给下一个服务。
比如，访问abc.com/appv2/a/b.html, 要求转发到localhost:8088/appv2/a/b.html
简单配置如下：
```nginx
upstream one {
  server localhost:8088 weight=5;
  }

server {
    listen              80;
    server_name         abc.com;
    access_log  "pipe:rollback /data/log/nginx/access.log interval=1d baknum=7 maxsize=1G"  main;

    location / {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://one;
    }

}
```
即，设置proxy_pass即可。请求只会替换域名。
但很多时候，我们需要根据url的前缀转发到不同的服务。
比如
abc.com/user/profile.html转发到 用户服务localhost:8089/profile.html
abc.com/order/details.html转发到 订单服务 localhost:8090/details.html
即，url的前缀对下游的服务是不需要的，除非下游服务添加context-path, 但很多时候我们并不喜欢加这个。如果Nginx转发的时候，把这个前缀去掉就好了。
一个种方案是proxy_pass后面加根路径/.
```nginx
server {
    listen              80;
    server_name         abc.com;
    access_log  "pipe:rollback /data/log/nginx/access.log interval=1d baknum=7 maxsize=1G"  main;

    location ^~/user/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://user/;
    }

    location ^~/order/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://order/;
    }

}
```
^~/user/表示匹配前缀是user的请求，proxy_pass的结尾有/， 则会把/user/*后面的路径直接拼接到后面，即移除user.


另一种方案是使用rewrite
```nginx
upstream user {
  server localhost:8089 weight=5;
}
upstream order {
  server localhost:8090 weight=5;
}
server {
    listen              80;
    server_name         abc.com;
    access_log  "pipe:rollback /data/log/nginx/access.log interval=1d baknum=7 maxsize=1G"  main;

    location ^~/user/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        rewrite ^/user/(.*)$ /$1 break;
        proxy_pass http://user;
    }

    location ^~/order/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        rewrite ^/order/(.*)$ /$1 break;
        proxy_pass http://order;
    }

}
```
注意到proxy_pass结尾没有/， rewrite重写了url。


## nginx 加入系统服务
/etc/systemd/system/nginx.service
```shell
[Unit]
Description=nginx service
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
执行命令 `systemctl daemon-reload`

## nginx正向代理
安装
```shell
git clone https://github.com/chobits/ngx_http_proxy_connect_module.git
#
yum -y install patch
# 有版本要求1.21版本以上的nginx要使用102101版本
wget http://nginx.org/download/nginx-1.21.1.tar.gz
cd nginx-1.21.1
patch -p1 < /root/ngx_http_proxy_connect_module/patch/proxy_connect_rewrite_102101.patch

./configure --prefix=/usr/local/nginx --with-http_ssl_module \
--with-http_stub_status_module --with-stream --add-module=/root/ngx_http_proxy_connect_module --without-http_gzip_module

make
make install
```

配置
```nginx
server {
    listen                           8080;
    server_name                      localhost;
    resolver                         8.8.8.8 ipv6=off;
    proxy_connect;
    proxy_connect_allow              443 80;
    proxy_connect_connect_timeout    10s;
    proxy_connect_read_timeout       10s;
    #proxy_coneect_send_timeout       10s;
    location / {
        proxy_pass $scheme://$http_host$request_uri;
    }
}
```

## nginx配置下载文件
```nginx
    location / {
        root /data;
        autoindex on; # 启用目录列表
        autoindex_exact_size off; # 以更人性化的格式显示文件大小
        autoindex_localtime on; # 以服务器本地时间显示文件时间
        charset utf-8; # 设置字符集为 UTF-8
        try_files $uri $uri/ =404; # 确保请求的文件或目录存在，否则返回 404
    }
```

