import React, { useEffect } from 'react'
import styles from './initAMap.less'
import AMapLoader from '@amap/amap-jsapi-loader'

interface Props {}

let map: any = null

const InitAMap: React.FC<Props> = (props) => {
  const {} = props

  useEffect(() => {
    initMap()

    return () => {
      map?.destroy()
    }
  }, [])

  const initMap = () => {
    console.log('开始初始化地图...')
    window._AMapSecurityConfig = {
      securityJsCode: 'f356f92733b1df37f748672df2409d83'
    }
    AMapLoader.load({
      key: '3996e830d5c2db68ca06246af1e46f87', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      AMapUI: {
        //是否加载 AMapUI，缺省不加载
        version: '1.1', //AMapUI 版本
        plugins: ['overlay/SimpleMarker'] //需要加载的 AMapUI ui 插件
      },
      Loca: {
        version: '2.0'
      }
    })
      .then((AMap) => {
        console.log('AMap 高德地图', AMap)
        map = new AMap.Map('container', {
          // 设置地图容器id
          viewMode: '3D', // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
          center: [116.397428, 39.90923], // 初始化地图中心点位置
          mapStyle: 'amap://styles/b781dce2e50884e20d9a8dada33006f2'
        })

        const marker = new AMap.Marker({
          position: [116.39, 39.9] //位置
        })
        const infoWindow = new AMap.InfoWindow({
          //创建信息窗体
          isCustom: true, //使用自定义窗体
          content: '<div>HELLO,AMAP!</div>', //信息窗体的内容可以是任意html片段
          offset: new AMap.Pixel(16, -45)
        })
        const onMarkerClick = (e: any) => {
          infoWindow.open(map, e.target.getPosition()) //打开信息窗体
          //e.target就是被点击的Marker
        }
        map.add(marker) //添加到地图
        marker.on('click', onMarkerClick) //绑定click事件

        // const loca = new AMap.Loca.Container({
        //   map,
        //   opacity: 1
        // })
        //
        // const geo = new AMap.Loca.GeoJSONSource({
        //   url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/cuisine.json'
        // })
        //
        // const pl = (window.pl = new AMap.Loca.PointLayer({
        //   zIndex: 10,
        //   blend: 'lighter'
        // }))
        //
        // const style = {
        //   radius: 3.5,
        //   unit: 'px',
        //   color: '#3C1FA8',
        //   borderWidth: 0,
        //   blurWidth: 3.5
        // }
        // pl.setSource(geo)
        // pl.setStyle(style)
        // loca.add(pl)
        //
        // pl.addAnimate({
        //   key: 'radius',
        //   value: [0, 1],
        //   duration: 500,
        //   easing: 'Linear',
        //   transform: 2000,
        //   random: true,
        //   delay: 8000,
        //   yoyo: true,
        //   repeat: 100000
        // })
        // const dat = new AMap.Loca.Dat()
        // dat.addLayer(pl)
      })
      .catch((e) => {
        console.log('地图加载异常', e)
      })
  }

  return (
    <div
      id="container"
      className={styles.initMap}
      style={{ width: '100%', height: '345px' }}
    ></div>
  )
}

export default InitAMap
