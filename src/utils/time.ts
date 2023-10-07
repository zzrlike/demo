export const getTime = () => {
  let message = ''
  // 通过内置的构造函数获取时间Date
  const hours = new Date().getHours()
  if (hours < 9) {
    message = '早上好'
  } else if (hours <= 14) {
    message = '上午好'
  } else if (hours <= 18) {
    message = '下午好'
  } else {
    message = '晚上好'
  }
  return message
}
