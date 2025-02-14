# 使用acme生成证书

acme github:  https://github.com/acmesh-official/acme.sh

acme DNSapi文档 https://github.com/acmesh-official/acme.sh/wiki/dnsapi



安装acme

```shell
wget -O -  https://get.acme.sh | sh
```



使用阿里云域API自动颁发证书

首先，您需要登录到Aliyun帐户以获取API密钥。 https://ak-console.aliyun.com/#/accesskey

https://github.com/acmesh-official/acme.sh/wiki/dnsapi#11-use-aliyun-domain-api-to-automatically-issue-cert

```shell
export Ali_Key="sdfsdfsdfljlbjkljlkjsdfoiwje"
export Ali_Secret="jlsdflanljkljlfdsaklkjflsa"
acme.sh --issue --dns dns_ali -d example.com -d www.example.com
```

:::tip

Ali_Key和Ali_Secret将被保存~/.acme.sh/account.conf，需要时会被重用。

:::



在nginx中使用acme配置https证书

```nginx
  server {
        listen 80;
        server_name bbs.ccuul.com;
            return   301 https://$server_name$request_uri;
        location / {
        index index.html index.htm;
        }
}

  server {
        #listen 80;
        listen 443 ssl;
        server_name www.example.com;
        ssl_certificate <替换成自己的路径>;   #将domain name.pem替换成您证书的文件名。
        ssl_certificate_key <替换成自己的路径>;   #将domain name.key替换成您证书的密钥文件名。
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

    location / {
        client_max_body_size 200m;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        set $proxy_dest http://192.168.1.1;
        proxy_pass $proxy_dest;
        proxy_connect_timeout 90;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_http_version 1.1;
      }
    } 

```

