#!/bin/bash
set -e

# ========================================
# 多平台镜像脚本
# ========================================
DOCKER_USERNAME="allen.ouyang"
DOCKER_PASSWORD="Lxpj2023"
BASE_IMAGE="nginx:1.29.3"                                 # 官方镜像
TARGET_IMAGE="harbor.innomedi.cn/yuanxin/nginx:1.29.3"   # Harbor 上的目标镜像
PLATFORMS="linux/amd64,linux/arm64"                      # 需要支持的平台

# ========================================
# 登录 Harbor
# ========================================
echo "🔐 登录 Harbor 仓库..."
echo "$DOCKER_PASSWORD" | docker login harbor.innomedi.cn -u "$DOCKER_USERNAME" --password-stdin || {
    echo "❌ Harbor 登录失败"
    exit 1
}

# ========================================
# 创建 buildx builder（如果不存在就创建）
# ========================================
docker buildx create --use || echo "⚠️ buildx builder 已存在，使用现有的"

# ========================================
# 构建多平台镜像并推送
# ========================================
echo "📦 构建并推送多平台镜像到 Harbor: ${TARGET_IMAGE}"
docker buildx build \
    --platform ${PLATFORMS} \
    -t ${TARGET_IMAGE} \
    --push \
    --pull \
    - <<EOF
FROM ${BASE_IMAGE}
EOF

echo "✅ 多平台镜像推送成功：${TARGET_IMAGE}"




# 单平台镜像 登录你的 Harbor
#DOCKER_USERNAME="allen.ouyang"
#DOCKER_PASSWORD="Lxpj2023"
#echo $DOCKER_PASSWORD | docker login  harbor.innomedi.cn -u $DOCKER_USERNAME --password-stdin

#docker pull nginx:1.29.3

#docker tag nginx:1.29.3 harbor.innomedi.cn/yuanxin/nginx:1.29.3

## 推送到 Harbor 仓库
#docker push harbor.innomedi.cn/yuanxin/nginx:1.29.3
