import path from 'path'
// import type * as Buffer from 'buffer'
import { createUnplugin } from 'unplugin'
import Fontmin from 'fontmin'
import type { Options, fontTarget } from './types'
import _3500 from './fontSrc'

const ttfRegex = /\.woff|\.ttf|\.woff2/

interface fontsReducer extends fontTarget {
  instance: any
}
const fonts: fontsReducer[] = []
export default createUnplugin<Options | undefined>(options => ({
  // 插件名称
  name: 'myTest',

  // pre 会较于 post 先执行
  enforce: 'pre', // post

  // 指明它们仅在 'build' 或 'serve' 模式时调用
  apply: 'build', // apply 亦可以是一个函数
  async generateBundle(_: any, bundler: any) {
    console.log('liucai')
    console.log(bundler)
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

function searchFonts(bundle: any, config: Partial<fontTarget> | fontTarget[]) {
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
    let res: string | undefined
    // 如果config.fileUrl存在的话,那么将找到这个字体
    if (config.fileUrl) {
      for (const key in bundle) {
        if (path.basename(bundle[key].name!) === config.fileUrl)
          fonts.push(getConfig(config, bundle[key]))
      }
    }
    // 否则查找第一个
    else {
      for (const key in bundle) {
        if (key.match(ttfRegex)) {
          config.fileUrl = path.basename(bundle[key].name!)
          fonts.push(getConfig(config, (bundle[key])))
        }
      }
    }
    if (fonts.length === 0)
      console.log('未检测到字体文件!')
  }
  console.log(fonts)
}

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

