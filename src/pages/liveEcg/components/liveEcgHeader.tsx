import React, {
  forwardRef,
  Fragment,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import cn from 'classnames'
import styles from './liveEcgHeader.less'

import { Avatar, Badge, Col, Input, Row } from 'antd'
import { AlertOutlined, SoundFilled, TeamOutlined } from '@ant-design/icons'
import SetCenter from '@/pages/liveEcg/components/setCenter'
import { liveEcgService } from '@/pages/liveEcg/services'

interface Props {
  data?: {
    [key in string]: any
  }

  openLiveList?: () => void
  updateSetCenterInfo?: (value: any) => void
}

let audioSrc = require('../../../assets/sound/sound.wav')
let audioWarnSrc = require('../../../assets/sound/warnSound.wav')
let audioDeviceOffLineSrc = require('../../../assets/sound/yellowWarn.mp3')

const { Search } = Input

const LiveEcgHeader: React.FC<Props & { ref?: React.ForwardedRef<any> }> =
  forwardRef((props, ref) => {
    const { data = {}, openLiveList, updateSetCenterInfo } = props

    const [isOpenUserSound, setIsOpenUserSound] = useState(true)
    const [isOpenWarnSound, setIsOpenWarnSound] = useState(true)
    const [isVisibleSetThreshold, setIsVisibleSetThreshold] = useState(false)
    const [isOpenDeviceOffLineSound, setIsOpenDeviceOffLineSound] =
      useState(false)
    const [isVisibleStatisticsInfo, setIsVisibleStatisticsInfo] =
      useState(false)

    const audioRef = useRef<any>(null)
    const audioWarnRef = useRef<any>(null)
    const audioDeviceOffLineRef = useRef<any>(null)

    const [centerInfo, setCenterInfo] = useState<any>({
      tachycardiaThreshold: 100,
      bradycardiaThreshold: 40,
      notifySignalInterrupt: false,
      realtimeStatistics: false,
      sidebarUserList: false
    })

    useImperativeHandle(ref, () => ({
      playUserSound: () => {
        if (audioRef.current) {
          audioRef.current.play()
        }
      },
      playWarnSound: () => {
        if (audioWarnRef.current) {
          audioWarnRef.current.play()
        }
      },
      playDeviceOffLineSound: () => {
        if (audioDeviceOffLineRef.current) {
          audioDeviceOffLineRef.current.play()
        }
      },
      getCenterInfo: () => {
        return centerInfo
      }
    }))

    useEffect(() => {
      getSetCenter()
    }, [])

    const getSetCenter = async () => {
      const { code, data } = await liveEcgService.getSetCenter()
      console.log('设置中心数据', data)
      setCenterInfo(data)
      handleAudioDevice(data)
      setIsVisibleStatisticsInfo(data?.realtimeStatistics)
      updateSetCenterInfo?.(data)
    }

    // 警报声
    const onChangeWarnSound = () => {
      setIsOpenWarnSound(!isOpenWarnSound)
      audioWarnRef.current.volume = !isOpenWarnSound ? 1 : 0
      console.log('警报声是否静音', audioWarnRef.current.volume)
    }

    //  用户上线提示声
    const onChangeUserSound = () => {
      setIsOpenUserSound(!isOpenUserSound)
      audioRef.current.volume = !isOpenUserSound ? 1 : 0
      console.log('用户上线声是否静音', audioRef.current.volume)
    }
    // 打开实时最近在线用户列表
    const onOpenLiveList = () => {
      openLiveList?.()
    }

    const handleOk = () => {
      setIsVisibleSetThreshold(false)
      handleSetCenter()
      console.log('重新获取设置中心数据')
    }

    const handleSetCenter = () => {
      getSetCenter()
    }
    const handleAudioDevice = (data: any) => {
      // setIsOpenDeviceOffLineSound(!isOpenDeviceOffLineSound)
      audioDeviceOffLineRef.current.volume = data?.notifySignalInterrupt ? 1 : 0
      console.log('设备下线是否静音', audioDeviceOffLineRef.current.volume)
    }

    return (
      <div className={cn(styles.liveEcgHeader)}>
        <audio
          ref={audioRef}
          src={audioSrc}
          style={{ display: 'none' }}
        ></audio>

        <audio
          ref={audioWarnRef}
          src={audioWarnSrc}
          style={{ display: 'none' }}
        ></audio>
        <audio
          ref={audioDeviceOffLineRef}
          src={audioDeviceOffLineSrc}
          style={{ display: 'none' }}
        ></audio>
        <div className={cn(styles.content)}>
          <Row gutter={0}>
            <Col span={24}>
              <div className={cn(styles.searchContent)}>
                <div className={cn(styles.statistics)}>
                  {isVisibleStatisticsInfo && (
                    <Fragment>
                      <div className={cn(styles.registerNumber)}>
                        <span>注册人数：</span>
                        <span>{data?.registerCount}</span>
                      </div>
                      <div
                        className={cn(styles.onlineNumber)}
                        onClick={onOpenLiveList}
                      >
                        <span>在线人数：</span>
                        <span>{data?.onlineCount}</span>
                      </div>
                      <div className={cn(styles.warnPositive)}>
                        <span>预警阳性：</span>
                        <span>{data?.positiveOnlineCount}</span>
                      </div>
                      <div className={cn(styles.severePositive)}>
                        <span>预警重阳：</span>
                        <span>{data?.seriousPositiveOnlineCount}</span>
                      </div>
                    </Fragment>
                  )}
                </div>

                <div className={cn(styles.searchActions)}>
                  <div className={cn(styles.info)} onClick={onOpenLiveList}>
                    <Badge status="success" offset={[30, 0]} />
                    <TeamOutlined
                      className={cn(styles.bell)}
                      style={{ color: data?.total ? '#00E1BF' : '' }}
                    />
                  </div>
                  <div className={cn(styles.warn)}>
                    <div
                      className={cn(styles.openWarn)}
                      onClick={onChangeWarnSound}
                    >
                      <AlertOutlined
                        style={{ color: isOpenWarnSound ? '#00E1BF' : '' }}
                      />
                    </div>
                  </div>
                  <div className={cn(styles.sound)}>
                    <div
                      className={cn(styles.openSound)}
                      onClick={onChangeUserSound}
                    >
                      <SoundFilled
                        style={{ color: isOpenUserSound ? '#00E1BF' : '' }}
                      />
                    </div>
                  </div>

                  <div className={cn(styles.set)}>
                    <SetCenter data={centerInfo} handleOk={handleOk} />
                  </div>
                </div>

                <div className={cn(styles.photo)}>
                  <Avatar
                    size={44}
                    src="https://bpic.51yuansu.com/pic2/cover/00/32/53/5810f62603dda_610.jpg"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  })

export default memo(LiveEcgHeader)
