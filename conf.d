server {
        listen 80;
        server_name ${SERVER_NAME};

        location / {
                return 301 https://$host$request_uri;
        }
}
server {
        listen 443 ssl;
        ssl on;
        ssl_certificate /etc/ssl/cert.crt;
        ssl_certificate_key /etc/ssl/domain.key;

        server_name ${SERVER_NAME};


        location / {
                proxy_pass http://${SERVER_NAME};
        }
}
