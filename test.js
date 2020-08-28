const data = 'aizs'
const dataArray = 'coco pandan'
console.log(data.indexOf('s'))
const badChar = ["'", '<', '>']
if (badChar.some(badChar => dataArray.indexOf(badChar) > 0)) console.log('tidak aman')
