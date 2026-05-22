import React, { memo, useEffect, useState } from 'react'
import { Button, Checkbox, message, Popover, Slider } from 'antd'
import cn from 'classnames'
import styles from './setCenter.less'
import { SettingOutlined } from '@ant-design/icons'
import { liveEcgService } from '@/pages/liveEcg/services'
import { isNullObject } from '@/utils'
import { Permission } from '@/components/permission'

interface Props {
  data?: {
    [key in string]: any
  }
  handleOk?: () => void
  handleCancel?: () => void
}

const SetCenter: React.FC<Props> = memo((props) => {
  const { data, handleOk, handleCancel } = props
  const [isVisible, setIsVisible] = useState(false)
  const [tachycardiaValue, setTachycardiaValue] = useState<number>(100)
  const [bradycardiaValue, setBradycardiaValue] = useState<number>(40)
  const [notifySignalInterruptValue, setNotifySignalInterruptValue] =
    useState<boolean>(false)
  const [realtimeStatisticsValue, setRealtimeStatisticsValue] =
    useState<boolean>(false)
  const [sidebarUserListValue, setSidebarUserListValue] =
    useState<boolean>(false)

  useEffect(() => {
    console.log('配置中心获取的data数据', data)
    if (!isNullObject(data as object)) {
      setTachycardiaValue(data?.tachycardiaThreshold)
      setBradycardiaValue(data?.bradycardiaThreshold)
      setNotifySignalInterruptValue(data?.notifySignalInterrupt)
      setRealtimeStatisticsValue(data?.realtimeStatistics)
      setSidebarUserListValue(data?.sidebarUserList)
    }
  }, [data])

  const onOk = async () => {
    console.log('操作成功')
    const { code, data } = await liveEcgService.updateSetThreshold({
      tachycardiaThreshold: tachycardiaValue,
      bradycardiaThreshold: bradycardiaValue,
      notifySignalInterrupt: notifySignalInterruptValue,
      realtimeStatistics: realtimeStatisticsValue,
      sidebarUserList: sidebarUserListValue
    })
    if (code === '200') {
      message.success('设置成功')
      handleOk?.()
      setIsVisible(false)
    }
  }

  const onCancel = () => {
    // handleCancel?.()
    setIsVisible(false)
  }
  const handleOpenChange = (open: boolean) => {
    setIsVisible(open)
  }

  const onChangeTachycardia = (value: number) => {
    setTachycardiaValue(value)
  }

  const onChangeBradycardia = (value: number) => {
    setBradycardiaValue(value)
  }

  const onChangeNotifySignalInterrupt = (e: any) => {
    setNotifySignalInterruptValue(e.target.checked)
  }
  const onChangeRealtimeStatistics = (e: any) => {
    setRealtimeStatisticsValue(e.target.checked)
  }
  const onChangeSidebarUserListValue = (e: any) => {
    setSidebarUserListValue(e.target.checked)
  }

  return (
    <Popover
      open={isVisible}
      trigger="click"
      onOpenChange={handleOpenChange}
      content={
        <div className={cn(styles.setThreshold)}>
          <div className={cn(styles.header)}>
            <span>设置中心</span>
          </div>
          <div className={cn(styles.content)}>
            <div className={cn(styles.item)}>
              <div className={cn(styles.title)}>
                心率过高：{tachycardiaValue}
              </div>
              <Slider
                value={tachycardiaValue}
                min={100}
                max={140}
                onChange={onChangeTachycardia}
              />
            </div>
            <div className={cn([styles.item, styles.bradycardia])}>
              <div className={cn(styles.title)}>
                心率过低：{bradycardiaValue}
              </div>
              <Slider
                value={bradycardiaValue}
                min={40}
                max={60}
                onChange={onChangeBradycardia}
              />
            </div>
            <div className={cn([styles.item, styles.checkbox])}>
              <Checkbox
                checked={notifySignalInterruptValue}
                onChange={onChangeNotifySignalInterrupt}
              >
                信号中断声音提醒
              </Checkbox>
            </div>
            <Permission code="liveEcg.list.showStatistics">
              <div className={cn([styles.item, styles.checkbox])}>
                <Checkbox
                  checked={realtimeStatisticsValue}
                  onChange={onChangeRealtimeStatistics}
                >
                  显示统计信息
                </Checkbox>
              </div>
            </Permission>

            <Permission code="liveEcg.list.showSidebar">
              <div className={cn([styles.item, styles.checkbox])}>
                <Checkbox
                  checked={sidebarUserListValue}
                  onChange={onChangeSidebarUserListValue}
                >
                  显示侧边栏
                </Checkbox>
              </div>
            </Permission>
          </div>
          <div className={cn(styles.actions)}>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              onClick={onOk}
              className={cn(['gMainButton'])}
            >
              确定
            </Button>
          </div>
        </div>
      }
      overlayClassName={cn(styles.setThresholdPopover)}
    >
      <SettingOutlined />
    </Popover>
  )
})

export default SetCenter
