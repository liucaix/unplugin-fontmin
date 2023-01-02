// export type Options = analyzeModeConfig | fixModeConfig
export type Options = fixModeConfig;
// 解析模式,暂未开发
interface analyzeModeConfig {
  // 需要分析出字符的文件路径,如果include不设置,那么默认全部应用.
  include?: string[]
  // 需要排除分析出字符的文件路径
  exclude?: string[]
  // 字体精简后的输出格式
  outPutType?: 'ttf' | 'woff' | 'woff2'
}
export interface fontTarget {
  fileUrl: string
  target: 3500 | 7000 | string
  outPutType: 'ttf' | 'woff' | 'woff2'
}
// 静态模式;如果不设置,默认选择第一个ttf文件
export type fixModeConfig = Partial<fontTarget> | fontTarget[] | undefined
