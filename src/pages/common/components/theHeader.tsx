import React, { useEffect, useState } from 'react'
import { history } from '@umijs/max'
import cn from 'classnames'
import { Avatar, Dropdown, Input, MenuProps, message } from 'antd'
import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import styles from './theHeader.less'
import { useRecoilState } from 'recoil'
import { commonStore } from '../stores'
import { storage } from '@/utils'
import { IUserInfoParams } from '@/pages/common/types/common'
import TheEditPassword from '@/pages/common/components/theEditPassword'
import { commonService } from '@/pages/common/services'
import avatar from '@/assets/images/avatar.png'

interface Props {}

const { Search } = Input
const TheHeader: React.FC<Props> = (props) => {
  const [isExpandMenu, setIsExpandMenu] = useRecoilState(
    commonStore.isExpandMenu
  )
  const [isVisiblePassword, setIsVisiblePassword] = useState(false)

  const [userInfo, setUserInfo] = useState<IUserInfoParams>({
    active: 0,
    createAt: '',
    email: '',
    gender: 0,
    id: '',
    mobile: '',
    nickname: '',
    organizationId: '',
    remark: '',
    status: 0,
    username: ''
  })

  useEffect(() => {
    const data = storage.getSession('userInfo')
    // console.log('获取的用户信息', data)
    setUserInfo(data)
  }, [])
  const onHealthReport = () => {
    console.log('健康报告')
    history.push('/healthReport')
  }

  const onSearch = () => {}

  const onUserInfo = () => {
    // history.push('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: <span>修改密码</span>
    },
    {
      key: '1',
      label: <span>退出</span>
    }
  ]

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e.key === '0') {
      setIsVisiblePassword(true)
    } else if (e.key === '1') {
      const { status } = await commonService.loginOut()
      if (status === 0) {
        storage.setSession('userInfo', {})
        storage.setSession('permissions', [])
        storage.setSession('token', '')
        storage.setSession('defaultOpenKeys', [])
        message.success('退出成功', 1).then(() => {
          history.push('/login')
        })
      }
    }
  }

  const onExpand = () => {
    setIsExpandMenu(!isExpandMenu)
  }
  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisiblePassword(false)
  }
  const displayName =
    userInfo?.nickname || userInfo?.userIdentifier || '未设置昵称'

  return (
    <div className={cn(styles.theHeader)}>
      <div className={cn(styles.headerContent)}>
        <div className={cn(styles.actions)}>
          <div className={cn(styles.left)}>
            {isExpandMenu ? (
              <MenuUnfoldOutlined onClick={onExpand} />
            ) : (
              <MenuFoldOutlined onClick={onExpand} />
            )}
          </div>
          <div className={cn(styles.right)}>
            {/*<div className={cn(styles.btns)}>*/}
            {/*  <Input*/}
            {/*    className={cn(styles.actionBtn)}*/}
            {/*    placeholder="搜索你想要的内容"*/}
            {/*    onChange={onSearch}*/}
            {/*    prefix={<SearchOutlined />}*/}
            {/*  />*/}
            {/*  <ReloadOutlined className={cn(styles.actionBtn)} />*/}
            {/*  <BellOutlined className={cn(styles.actionBtn)} />*/}
            {/*  <SettingOutlined className={cn(styles.actionBtn)} />*/}
            {/*</div>*/}
            {/*<div className={cn(styles.line)}></div>*/}
            <div className={cn(styles.userInfo)}>
              <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                placement="bottom"
              >
                <div className={cn(styles.userName)}>
                  <span className={cn(styles.userNameText)}>{displayName}</span>
                  <DownOutlined style={{ marginLeft: 8 }} />
                </div>
              </Dropdown>
              <Avatar src={avatar} onClick={onUserInfo} />
            </div>
          </div>
        </div>
      </div>
      <TheEditPassword
        isVisible={isVisiblePassword}
        handleOk={handleNewOk}
        handleCancel={() => setIsVisiblePassword(false)}
      />
    </div>
  )
}

export default TheHeader
