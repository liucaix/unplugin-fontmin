interface FontSrc {
  fileName: string
  source: Buffer
}
const ttfRegex = /\.woff|\.ttf|\.woff2/
const fontSrcArr: FontSrc[] = []
export function filterBundler(bundle: any) {
  console.log(bundle)
  bundle.values().forEach((v: any) => {
    if (v.fileName.match(ttfRegex)) {
      fontSrcArr.push({
        fileName: v.fileName,
        source: v.source,
      })
    }
  })
  console.log(fontSrcArr)
}


