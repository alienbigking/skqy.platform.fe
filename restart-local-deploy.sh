#!/bin/bash
set -e

COMPOSE_FILE="docker-compose.local-deploy.yml"
# 拉取最新的镜像
#sudo docker compose  pull
sudo docker compose -f $COMPOSE_FILE pull

# 停止运行现有的容器
#sudo docker compose down
sudo docker compose -f $COMPOSE_FILE down

# 删除旧的镜像，此行仅在本地测试时使用，实际部署时请删除此行
sudo docker rmi harbor.innomedi.cn/yuanxin/local-deploy-platform:1.0.0

# 启动容器
#sudo docker compose up -d --build

sudo docker compose -f $COMPOSE_FILE up -d --pull always
