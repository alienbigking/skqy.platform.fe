import { defineConfig } from '@umijs/max'
import { routes } from './src/routes'

const compressionPlugin = require('compression-webpack-plugin')
const productionGzipExtensions =
  /\.(ts|tsx|less|js|css|json|txt|html|ico|svg|wav)(\?.*)?$/i

export default defineConfig({
  // base: process.env.NODE_ENV === 'production' ? '/html/lxpjEcgTest' : '',
  hash: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: { type: 'hash' },
  proxy: {
    // 浏览器把相对路径解析成绝对路径时会自动带上 /
    '/yxpt': {
      // target: 'https://local-platform-api.innomedi.cn:8444',
      // target: 'https://test.innomedi.cn',
      // target: 'https://prod.innomedi.cn',
      // changeOrigin: true
      //  代理路径重写
      // pathRewrite: { '^yxpt': '/yxpt' }
      // secure: false
    },
    '/areas_v3': {
      target: 'https://geo.datav.aliyun.com',
      changeOrigin: true
    },
    '/geocoder': {
      target: 'https://api.tianditu.gov.cn',
      changeOrigin: true
    }
  },
  chainWebpack: (config, args) => {
    config.merge({
      optimization: {
        splitChunks: {
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          cacheGroups: {
            react: {
              name: 'react',
              priority: 20,
              test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router|react-dnd|react-adsense|react-countup|react-dnd-html5-backend|react-helmet|react-perfect-scrollbar|react-scripts|react-sortable-hoc|recoil|react-quill|lodash|lodash-decorators|redux-saga|re-select|dva|moment|echarts|dayjs|jspdf|html2canvas)[\\/]/
            },
            antd: {
              name: 'antd',
              priority: 20,
              test: /[\\/]node_modules[\\/](antd|@ant-design\/icons|@ant-design\/compatible)[\\/]/
            },
            vendor: {
              name: 'vendors',
              test(resource: any) {
                return /[\\/]node_modules[\\/]/.test(resource)
              },
              priority: 10
            },
            async: {
              chunks: 'async',
              minChunks: 2,
              name: 'async',
              maxInitialRequests: 1,
              minSize: 0,
              priority: 5,
              reuseExistingChunk: true
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
    })
    // 开启图片压缩
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({ bypassOnDebug: true })

    // 开启前端Gzip压缩，在本地不用压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression-webpack-plugins').use(compressionPlugin, [
        {
          filename: '[path][base].gz',
          algorithm: 'gzip',
          minRatio: 0.8,
          test: productionGzipExtensions, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          deleteOriginalAssets: false //是否删除源文件
        }
      ])
    }
  },
  // antd: {
  //   configProvider: {
  //     wave: {
  //       disabled: false
  //     },
  //     locale: zhCN
  //   },
  //   theme: {
  //     components: {
  //       Menu: {
  //         itemSelectedBg: '#33A596',
  //         itemSelectedColor: '#ffffff'
  //       }
  //     }
  //   },
  //   style: 'less'
  // },
  // 启用 mock 功能
  mock: {
    // 指定 mock 数据的根目录
    // 这里假设 mock 数据文件位于项目根目录下的 mock 文件夹中
    // 如果您的 mock 数据文件位于其他位置，请根据实际情况修改路径
    include: ['mock/**/_mock.ts']
  },
  metas: [
    {
      name: 'referrer',
      content: 'no-referrer'
    }
  ],
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [...routes],
  npmClient: 'npm',
  define: {
    // UMI_ENV 是加载不同环境配置的约定，是 node 层的，但他不会注入到项目里。
    // 项目里的环境变量属于 browser runtime 层，要通过 webpack 注入，这在 umi 里是 define 选项，所以正常的环境变量要在项目里用：需要先在外部指定（他可能来自于命令行，或 .env 配置文件），之后加载到 node 里，之后通过 define 注入到项目里
    // 所以如果你要用 process.env.UMI_ENV ，就需要：
    'process.env.UMI_ENV': process.env.UMI_ENV
  }
})
