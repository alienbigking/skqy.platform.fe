#!/bin/bash
set -e

# 输出日志信息
echo "列出正在CI/CD环境中运行的容器："
docker ps -a

echo "列出正在CI/CD环境中存在的所有镜像："
docker images -a

# 获取指定镜像的容器ID
containers=$(docker ps -q --filter ancestor=harbor.innomedi.cn/yuanxin/platform:$CI_COMMIT_BRANCH)

if [ -n "$containers" ]; then
  echo "停止并移除容器: $containers"
  docker stop $containers
  docker rm $containers
else
  echo "没有正在运行的容器需要停止和移除"
fi

# 删除旧的 Docker 镜像
old_images=$(docker images harbor.innomedi.cn/yuanxin/platform:$CI_COMMIT_BRANCH -q)
if [ -n "$old_images" ]; then
  echo "删除旧的镜像: $old_images"
  docker rmi $old_images
fi

# 设置镜像标签 -$CI_PIPELINE_ID
IMAGE_TAG="$CI_COMMIT_BRANCH"



# 登录到 harbor registry
echo $CI_HARBOR_PASSWORD | docker login --username $CI_HARBOR_USERNAME --password-stdin harbor.innomedi.cn

docker build --push -t harbor.innomedi.cn/yuanxin/platform:$IMAGE_TAG .

#docker rmi harbor.innomedi.cn/yuanxin/platform:$IMAGE_TAG
