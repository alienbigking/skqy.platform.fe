#!/bin/bash
set -e

COMPOSE_FILE="docker-compose.prod.yml"

# 拉取最新的镜像
#sudo docker compose  pull
sudo docker compose -f $COMPOSE_FILE pull

# 停止运行现有的容器
#sudo docker compose down
sudo docker compose -f $COMPOSE_FILE down

# 启动容器
#sudo docker compose up -d --build

sudo docker compose -f $COMPOSE_FILE up -d --pull always
