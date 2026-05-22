#!/bin/bash
set -e

echo "环境变量:"
env

if [ "$CI_COMMIT_REF_NAME" == "stage" ]; then
  echo "分支 $CI_COMMIT_REF_NAME 运行 build:stage"
  npm run build:stage
elif [ "$CI_COMMIT_REF_NAME" == "uat" ]; then
  echo "分支 $CI_COMMIT_REF_NAME 运行 build:uat"
  npm run build:uat
elif [ "$CI_COMMIT_REF_NAME" == "main" ]; then
  echo "分支 $CI_COMMIT_REF_NAME 运行 build:production"
  npm run build:production
else
  echo "分支 $CI_COMMIT_REF_NAME 暂未支持构建。"
  exit 1
fi

# 输出构建目录内容
echo "构建完成。列出构建目录内容："
ls -al build

# 检查构建目录是否存在
if [ -d "build" ]; then
  echo "构建目录存在。"
else
  echo "构建目录不存在。"
  exit 1
fi
