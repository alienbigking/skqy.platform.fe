import React from 'react'
import cn from 'classnames'
import { history } from '@umijs/max'
import {
  AppstoreOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  FormOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import styles from './workbench.less'
import { ContentWrapper } from '@/components/contentWrapper'

interface EntryItem {
  title: string
  description: string
  path: string
  icon: React.ReactNode
  color: string
}

const moduleEntries: EntryItem[] = [
  {
    title: '首页配置',
    description: '管理 Discount Expert App 首页展示内容',
    path: '/discountExpert/home',
    icon: <AppstoreOutlined />,
    color: '#33A596'
  },
  {
    title: '商品管理',
    description: '维护商品基础信息与上下架状态',
    path: '/productManagement',
    icon: <ShoppingOutlined />,
    color: '#1677ff'
  },
  {
    title: '产品类别',
    description: '配置商品分类和层级结构',
    path: '/productCategory',
    icon: <TagOutlined />,
    color: '#722ed1'
  },
  {
    title: '应用配置',
    description: '维护当前后台系统与应用参数',
    path: '/appConfig',
    icon: <SettingOutlined />,
    color: '#eb2f96'
  },
  {
    title: '用户与权限',
    description: '管理用户、角色、菜单与权限',
    path: '/user',
    icon: <UserOutlined />,
    color: '#fa8c16'
  },
  {
    title: '数据统计',
    description: '查看业务数据和统计分析入口',
    path: '/organizationDataStatistics',
    icon: <DatabaseOutlined />,
    color: '#13c2c2'
  },
  {
    title: '日志管理',
    description: '查看系统操作日志和追踪记录',
    path: '/log',
    icon: <FileSearchOutlined />,
    color: '#52c41a'
  },
  {
    title: '配置中心',
    description: '承载后续更多应用级配置能力',
    path: '/menu',
    icon: <FormOutlined />,
    color: '#595959'
  }
]

const highlights = [
  '面向 Discount Expert 的业务后台',
  '首页、商品、分类、配置统一管理',
  '后续可继续扩展运营和内容能力'
]

const Workbench: React.FC = () => {
  return (
    <div className={cn(styles.workbench)}>
      <ContentWrapper>
        <div className={cn(styles.hero)}>
          <div>
            <Tag color="success">skqy.platform.fe</Tag>
            <Typography.Title level={2} className={cn(styles.title)}>
              欢迎回到管理控制台
            </Typography.Title>
            <Typography.Paragraph className={cn(styles.subtitle)}>
              这里是当前项目的后台入口，优先承载 Discount Expert 的应用配置、
              商品管理和基础权限能力。
            </Typography.Paragraph>
            <Space wrap className={cn(styles.highlights)}>
              {highlights.map((item) => (
                <Tag key={item} className={cn(styles.highlightTag)}>
                  {item}
                </Tag>
              ))}
            </Space>
          </div>
          <div className={cn(styles.heroActions)}>
            <Button
              type="primary"
              size="large"
              onClick={() => history.push('/discountExpert/home')}
            >
              进入首页配置
            </Button>
            <Button size="large" onClick={() => history.push('/productManagement')}>
              管理商品
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]} className={cn(styles.cardGrid)}>
          {moduleEntries.map((item) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={item.path}>
              <Card
                hoverable
                className={cn(styles.entryCard)}
                onClick={() => history.push(item.path)}
              >
                <div
                  className={cn(styles.iconWrap)}
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <Typography.Title level={4} className={cn(styles.entryTitle)}>
                  {item.title}
                </Typography.Title>
                <Typography.Paragraph className={cn(styles.entryDesc)}>
                  {item.description}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </ContentWrapper>
    </div>
  )
}

export default Workbench
