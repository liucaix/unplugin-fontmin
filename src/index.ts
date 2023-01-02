import path from 'path'
// import type * as Buffer from 'buffer'
import { createUnplugin } from 'unplugin'
import Fontmin from 'fontmin'
import type { Options, fixModeConfig, fontTarget } from './types'
import _3500 from './fontSrc'
const ttfRegex = /\.woff|\.ttf|\.woff2/

interface fontsReducer extends fontTarget {
  instance: any
}
const fonts: fontsReducer[] = []
export default createUnplugin<Options>(options => ({
  // 插件名称
  name: 'myTest',

  // pre 会较于 post 先执行
  enforce: 'pre', // post

  // 指明它们仅在 'build' 或 'serve' 模式时调用
  apply: 'build', // apply 亦可以是一个函数
  async generateBundle(_: any, bundler: any) {
    const arr = []
    for (const v in bundler)
      arr.push(path.basename(bundler[v].name!))
    searchFonts(bundler, options)
    minFonts()
  },
}))
const getConfig = ({ fileUrl = 'default', target = 3500, outPutType = 'woff2' }: Partial<fontTarget>,
  source: Object): fontsReducer => {
  return {
    fileUrl,
    target,
    outPutType,
    instance: source,
  }
}
// 分析用户配置,搜索字体文件
function searchFonts(bundle: any, config: fixModeConfig) {
  // 如果是数组,那么进行比较
  if (Array.isArray(config)) {
    for (const key in bundle) {
      console.log(key)
      const res = config.find((v) => {
        return v.fileUrl === path.basename(bundle[key].name!)
      })
      if (res)
        fonts.push(getConfig(res, bundle[key]))
    }
    if (fonts.length !== config.length) {
      console.log(fonts.length, config.length)
      throw new Error('配置失败,请检查文件名是否正确!')
    }
  }
  else {
    config = config ?? {}
    // 如果fileUrl设置了,那么字体唯一,进行查找
    if (config.fileUrl) {
      for (const key in bundle) {
        if (path.basename(bundle[key].name!) === config.fileUrl)
          fonts.push(getConfig(config, bundle[key]))
      }
    }
    // 否则查找全部字体
    else {
      for (const key in bundle) {
        if (key.match(ttfRegex)) {
          console.log(`由于你未进行自定义配置,查找到了字体:${key}`)
          config.fileUrl = path.basename(bundle[key].name!)
          fonts.push(getConfig(config, (bundle[key])))
        }
      }
    }
  }
  if (fonts.length === 0)
    console.log('未检测到字体文件!')
  console.log(fonts)
}

// 执行字体精简
function minFonts() {
  for (const v of fonts) {
    const fontMin = new Fontmin()
      .src((v.instance as any).source)
      .use(Fontmin.glyph({
        text: (v.target === 3500) ? _3500 : v.target,
      }))
    fontMin.run((err: any, res: any) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log('res:', res[0]._contents);
        (v.instance as any).source = res[0]._contents
      }
    })
  }
}

