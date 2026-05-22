# README

# 环境依赖

### node 安装版本建议为：16.16.0

### 下载连接为https://nodejs.org/zh-cn/blog/release/v16.16.0

# 版本说明

### react版本为 18.0.0

# 设计文档:

### https://lanhuapp.com/web/#/item/project/stage?tid=3081df2d-428b-45aa-bde6-eab3bba190e1&pid=75621029-50db-4444-95ec-279f2bd0a7a9

# 安装依赖

### npm install

# 启动

### npm start:dev 或npm start:prod 本项目配置了多个环境，本地运行时自行选择相关的环境启动

# 打包

### npm build

# 相关技术介绍

### 路由

#### 基于 React Router 6，类 Remix，支持嵌套、动态、动态可选、预加载、基于路由的请求优化等。

### 什么是MFSU

#### MFSU 是一种基于 webpack5 新特性 Module Federation 的打包提速方案。核心原理是将应用的依赖构建为一个 Module Federation 的 remote 应用，以免去应用热更新时对依赖的编译。因此，开启 mfsu 可以大幅减少热更新所需的时间。在生产模式，也可以通过提前编译依赖，大幅提升部署效率。
