import React from 'react'
import cn from 'classnames'
import styles from './home.less'
import BasicInfo from './basicInfo'

interface Props {}

const Home: React.FC<Props> = (props) => {
  return (
    <div className={cn(styles.home)}>
      <BasicInfo />
    </div>
  )
}

export default Home
