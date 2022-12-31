export type Options = analyzeModeConfig | fixModeConfig
// 解析模式
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
// 静态模式
type fixModeConfig = Partial<fontTarget> | fontTarget[]
