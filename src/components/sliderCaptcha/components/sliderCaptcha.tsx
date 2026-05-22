import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import styles from './sliderCaptcha.less'
import { DoubleRightOutlined } from '@ant-design/icons'

interface Props {
  onSuccess?: (value?: any) => void
  onFail?: (value?: any) => void
  onReset?: (value?: any) => void
}

const SliderCaptcha: React.FC<Props> = (props) => {
  const { onSuccess, onFail, onReset } = props

  const isDragging = useRef(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSuccessState, setIsSuccessState] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        sliderRef.current.style.left = '0px'
        setIsSuccessState(false)
        onReset?.()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleMouseDown = () => {
    isDragging.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleMove = (clientX: number) => {
    if (isDragging.current && sliderRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const newOffsetX = Math.min(
        Math.max(0, clientX - rect.left),
        rect.width - 50
      )
      requestAnimationFrame(() => {
        sliderRef.current!.style.left = `${newOffsetX}px`
      })
    }
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleEnd = () => {
    if (isDragging.current) {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)

      if (sliderRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const offsetX = parseFloat(sliderRef.current.style.left)
        if (offsetX >= rect.width - 50 * window.devicePixelRatio) {
          onSuccess?.()
          setIsSuccessState(true)
        } else {
          onFail?.()
          setIsSuccessState(false)
          sliderRef.current.style.left = '0px'
        }
      }
    }
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn(styles.sliderCaptcha)}>
      <div
        className={cn([
          styles.sliderTrack,
          isSuccessState ? styles.successState : ''
        ])}
      >
        <div
          ref={sliderRef}
          className={cn(styles.sliderThumb)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ left: 0 }}
        >
          <DoubleRightOutlined />
        </div>
      </div>
    </div>
  )
}

export default SliderCaptcha
