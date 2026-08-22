import React, { useState } from 'react'
import cn from 'classnames'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import styles from './login.less'
import skyOriginLogo from '@/assets/images/sky-origin-logo.png'

import ForgetPassword from './forgetPassword'
import LoginPassword from '@/pages/login/components/loginPassword'
import { Tabs } from 'antd'
import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import LoginAction from '@/pages/login/components/loginAction'
import { ELoginType } from '@/pages/common/types/common'
import RegisterPassword from '@/pages/login/components/registerPassword'

interface Props {}

const particleOptions: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push'
      },
      onHover: {
        enable: true,
        mode: 'grab'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 220,
        links: {
          opacity: 1
        }
      },
      push: {
        quantity: 3
      }
    }
  },
  particles: {
    color: {
      value: '#075985'
    },
    links: {
      color: '#075985',
      distance: 180,
      enable: true,
      opacity: 0.92,
      width: 2
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out'
      },
      random: false,
      speed: 0.38,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 1100
      },
      value: 90
    },
    opacity: {
      animation: {
        enable: true,
        speed: 0.85,
        sync: false
      },
      value: { min: 0.9, max: 1 },
      twinkle: {
        enable: true,
        frequency: 0.06,
        opacity: 1
      }
    },
    shape: {
      type: 'circle'
    },
    size: {
      animation: {
        enable: true,
        speed: 1.1,
        sync: false
      },
      value: { min: 2, max: 4 }
    }
  },
  detectRetina: true
}

const createAccentParticleOptions = (color: string): ISourceOptions => ({
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    color: { value: color },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'out' },
      random: true,
      speed: 0.28,
      straight: false
    },
    number: {
      density: { enable: true, area: 900 },
      value: 12
    },
    opacity: {
      animation: { enable: true, speed: 0.7, sync: false },
      value: { min: 0.85, max: 1 }
    },
    shape: { type: 'circle' },
    size: { value: { min: 2.5, max: 4.5 } }
  },
  detectRetina: true
})

const orangeParticleOptions = createAccentParticleOptions('#f97316')
const violetParticleOptions = createAccentParticleOptions('#8b5cf6')
const cyanParticleOptions = createAccentParticleOptions('#06b6d4')

const initializeParticles = async (engine: Engine) => {
  await loadSlim(engine)
}

const Login: React.FC<Props> = (props) => {
  const {} = props
  const [isShowLogin, setIsShowLogin] = useState(true)
  const [isShowForgetPassword, setIsShowForgetPassword] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<ELoginType>(ELoginType.login)
  const [activeTabKey, setActiveTabKey] = useState('0')

  const items = [
    {
      icon: <LockOutlined />,
      title: '账户密码登录'
    },
    {
      icon: <PhoneOutlined />,
      title: '验证码登录'
    }
  ]
  const onRegister = () => {
    setLoginType(ELoginType.register)
  }

  const onLogin = () => {
    console.log('返回登录时获取激活key', activeTabKey)
    setLoginType(ELoginType.login)
  }

  const onForgetPassword = () => {
    setLoginType(ELoginType.forgetPassword)
  }

  const onActiveTabChange = (activeKey: string) => {
    console.log('激活下标', activeKey)
    setActiveTabKey(activeKey)
  }

  return (
    <div className={cn(styles.login)}>
      <div className={cn(styles.particlesBackground)} aria-hidden="true">
        <ParticlesProvider init={initializeParticles}>
          <Particles
            id="login-particles"
            options={particleOptions}
          />
          <Particles
            id="login-accent-particles"
            options={orangeParticleOptions}
          />
          <Particles
            id="login-violet-particles"
            options={violetParticleOptions}
          />
          <Particles
            id="login-cyan-particles"
            options={cyanParticleOptions}
          />
        </ParticlesProvider>
      </div>
      <div className={cn(styles.loginHeader)}>
        <img src={skyOriginLogo} alt="深空起源" />
      </div>
      <div className={cn(styles.loginBox)}>
        <div className={cn(styles.loginMain)}>
          <div className={cn(styles.loginBoxBackground)} aria-hidden="true" />

          <div className={cn(styles.center)}>
            <div className={cn(styles.left)}>
              <div className={cn(styles.networkVisual)} aria-hidden="true">
                <div className={cn(styles.networkOrbit, styles.orbitOne)} />
                <div className={cn(styles.networkOrbit, styles.orbitTwo)} />
                <div className={cn(styles.networkCore)}>
                  <span className={cn(styles.coreDot)} />
                  <span className={cn(styles.coreRing)} />
                </div>
                <span className={cn(styles.networkNode, styles.nodeOne)} />
                <span className={cn(styles.networkNode, styles.nodeTwo)} />
                <span className={cn(styles.networkNode, styles.nodeThree)} />
                <span className={cn(styles.networkNode, styles.nodeFour)} />
              </div>
            </div>
            <div className={cn(styles.right)}>
              {loginType === ELoginType.login && (
                <>
                  <div className={cn(styles.title)}>登录</div>
                  <Tabs
                    activeKey={activeTabKey}
                    onChange={onActiveTabChange}
                    items={items.map((item, i) => {
                      return {
                        key: String(i),
                        icon: item.icon,
                        label: item.title,
                        children:
                          i === 0 ? (
                            <LoginPassword
                              onRegister={onRegister}
                              onForgetPassword={onForgetPassword}
                            />
                          ) : (
                            <LoginAction
                              onRegister={onRegister}
                              onForgetPassword={onForgetPassword}
                            />
                          )
                      }
                    })}
                  />
                </>
              )}

              {loginType === ELoginType.register && (
                <RegisterPassword
                  onLogin={onLogin}
                  onForgetPassword={onForgetPassword}
                />
              )}

              {loginType === ELoginType.forgetPassword && (
                <ForgetPassword onRegister={onRegister} onLogin={onLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
