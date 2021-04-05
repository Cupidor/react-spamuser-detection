/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path) => reg.test(path);

// 格式化时间
export const format = (t) => {
  return t > 9 ? t : '0' + t;
};

/**
 * 10位13位时间戳转string 格式（2018-10-15 16:03:27） 日期
 * @param timestamp
 * @param simpleDateFormatType 时间戳类型（"yyyy-MM-dd HH:mm:ss"）
 * @return
 */
export function numberDateFormat(timestamp, simpleDateFormatType) {
  if (timestamp.length === 10) {
    timestamp = Number(timestamp) * 1000;
  }
  let d = new Date(Number(timestamp));
  let year = d.getFullYear();
  let month = format(d.getMonth() + 1);
  let date = format(d.getDate());
  let hour = format(d.getHours());
  let minutes = format(d.getMinutes());
  let seconds = format(d.getSeconds());
  switch (simpleDateFormatType) {
    case 'yyyy-MM-dd HH:mm:ss':
      return `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`;
    case 'yyyy-MM-dd HH:mm':
      return `${year}-${month}-${date} ${hour}:${minutes}`;
    case 'yyyy-MM-dd':
      return `${year}-${month}-${date}`;
    case 'yyyyMMddHHmmss':
      return `${year}${month}${date}${hour}${minutes}${seconds}`;
    case 'yyyyMMddHHmm':
      return `${year}${month}${date}${hour}${minutes}`;
    default:
      return `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`;
  }
}

// 获取文件类型
export function getFileType(filename) {
  let index = filename.lastIndexOf('.');
  let suffix = filename.substring(index + 1); //从.加一 到最后
  const imageFilter = '.jpg|.jpeg|.png|.gif|.ico|.bmp';
  const wordFilter = '.doc|.docx';
  const excelFilter = '.xls|.xlsx|.csv';
  const pptFilter = '.ppt|.pptx';
  const pdfFilter = '.pdf';
  const txtFilter = '.txt';
  const videoFilter = '.ogg|.mp4|.rm|.rmvb|.avi|.mpg|.mpeg|.wmv|.asf|.mkv|.mov|.flv|.3gp';
  const zipFilter = '.rar|.zip|.arj|.gz|.z';
  if (imageFilter.indexOf(suffix) !== -1) {
    return 'image';
  } else if (wordFilter.indexOf(suffix) !== -1) {
    return 'word';
  } else if (excelFilter.indexOf(suffix) !== -1) {
    return 'excel';
  } else if (pptFilter.indexOf(suffix) !== -1) {
    return 'ppt';
  } else if (pdfFilter.indexOf(suffix) !== -1) {
    return 'pdf';
  } else if (txtFilter.indexOf(suffix) !== -1) {
    return 'txt';
  } else if (zipFilter.indexOf(suffix) !== -1) {
    return 'zip';
  } else if (videoFilter.indexOf(suffix) !== -1) {
    return 'video';
  } else {
    return 'other';
  }
}
