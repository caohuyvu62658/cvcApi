1. Tạo gg recaptcha
2. Kết nối vps
3. Cài mongodb, redis, nginx, node-18, pm2
4. Pull 3 repo về vps
5. Tạo .env cho 3 repo, .env1, .env2 cho repo frontend, admin ( update port, domain, mongodb name, captcha, ...)
6. Run: yarn install, yarn build ở 3 repo
7. Tạo file ecosystem.config.json ở cùng thư mục với 3 repo
```
{
  "apps": [
    {
      "name": "credit iframe",
      "cwd": "./frontend",
      "script": "npx",
      "args" : "serve -s build -p 3010"
    },
    {
      "name": "credit dash",
      "cwd": "./admin",
      "script": "npx",
      "args" : "serve -s build -p 3011"
    },
    {
      "name": "credit api",
      "cwd": "./api",
      "script": "npm",
      "args" : "start",
      "env": {
        "PORT": "3012",
        "MONGO_NAME": "credits",
        "GROUP_ID": "-956408064",
        "BOT_TOKEN": "6068687436:AAFxuUChV7j5D136xDSqkZSgXgHOnI5XdgE"
      }
    },
    {
      "name": "credit iframe 2",
      "cwd": "./frontend",
      "script": "npx",
      "args" : "serve -s build2 -p 3013"
    },
    {
      "name": "credit dash 2",
      "cwd": "./admin",
      "script": "npx",
      "args" : "serve -s build2 -p 3014"
    },
    {
      "name": "credit api 2",
      "cwd": "./api",
      "script": "npm",
      "args" : "start",
      "env": {
        "PORT": "3015",
        "MONGO_NAME": "credits2",
        "GROUP_ID": "-895600801",
        "BOT_TOKEN": "6358774412:AAHkU8dFqX0wfb_d5ZvpC-awP-qQTHjps8Y"
      }
    },
    {
      "name": "credit iframe 3",
      "cwd": "./frontend",
      "script": "npx",
      "args" : "serve -s build3 -p 3016"
    },
    {
      "name": "credit dash 3",
      "cwd": "./admin",
      "script": "npx",
      "args" : "serve -s build3 -p 3017"
    },
    {
      "name": "credit api 3",
      "cwd": "./api",
      "script": "npm",
      "args" : "start",
      "env": {
        "PORT": "3018",
        "MONGO_NAME": "credits3",
        "GROUP_ID": "-926900666",
        "BOT_TOKEN": "6034309134:AAGk_W0CJ9R3weyLF1NGoC5FoE72TdNG9Co"
      }
    }
  ]
}
```
8. Run: pm2 start ecosystem.config.json
9. cd /etc/nginx/sites-available/ , tạo file credit.config
```
# credit if
server{
    listen 80;
    server_name if.shopsmartly.us;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit admin
server{
    listen 80;
    server_name dash.shopsmartly.us;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit api
server{
    listen 80;
    server_name api.shopsmartly.us;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit if 2
server{
    listen 80;
    server_name if.funkyfinds.org;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://localhost:3013;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit admin 2
server{
    listen 80;
    server_name dash.funkyfinds.org;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3014;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit api 2
server{
    listen 80;
    server_name api.funkyfinds.org;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3015;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit if 3
server{
    listen 80;
    server_name if.internetdownloadmanagerb.com;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://localhost:3016;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit admin 3
server{
    listen 80;
    server_name dash.internetdownloadmanagerb.com;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3017;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
# credit api 3
server{
    listen 80;
    server_name api.internetdownloadmanagerb.com;
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3018;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}```
10. ```
sudo ln -s /etc/nginx/sites-avaiable/extension.config /et/nginx/sites-enabled/
sudo systemctl restart nginx```
11. Check ...
