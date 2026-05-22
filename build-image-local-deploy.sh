#!/bin/bash
# ========================================
DOCKER_USERNAME="allen.ouyang"
DOCKER_PASSWORD="Lxpj2023"           # 可改为 read -s 从命令行输入
IMAGE_NAME="local-deploy-platform"                 # 镜像名
REGISTRY="harbor.innomedi.cn/yuanxin"
VERSION=${1:-"1.0.0"}                # 默认版本1.0.0，可传参
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${VERSION}"

echo "🚀 【本地部署】开始前端打包..."
npm run build:localDeploy || { echo "❌ 前端打包失败"; exit 1; }

echo "🔐 登录 Harbor 仓库..."
echo "$DOCKER_PASSWORD" | docker login harbor.innomedi.cn -u "$DOCKER_USERNAME" --password-stdin || { echo "❌ 登录失败"; exit 1; }

echo "📦 构建并推送 Docker 镜像：${FULL_IMAGE_NAME}"
docker buildx create --use
docker buildx build \
  --no-cache \
  --platform linux/amd64,linux/arm64 \
  -t "${FULL_IMAGE_NAME}" \
  -f Dockerfile.build \
  . \
  --push || { echo "❌ Docker 构建失败"; exit 1; }

echo "✅ 镜像推送成功：${FULL_IMAGE_NAME}"
