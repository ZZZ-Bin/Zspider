const log = require('single-line-log').stdout

module.exports = function progressBar(totalNum, completedNum, description='Progress', bar_length=25, info) {
 
 // 刷新进度条图案、文字的方法
  let percent = (completedNum / totalNum).toFixed(4);  // 计算进度(子任务的 完成数 除以 总数)
  let cell_num = Math.floor(percent * bar_length);       // 计算需要多少个 █ 符号来拼凑图案
 
  // 拼接黑色条
  let cell = '';
  for (let i=0;i<cell_num;i++) {
   cell += '█';
  }
 
  // 拼接灰色条
  let empty = '';
  for (let i=0;i<bar_length-cell_num;i++) {
   empty += '░';
  }
 
  // 拼接最终文本
  let text = `+ ${description}: \x1B[33m${info}\x1b[0m —————— ${completedNum}/${totalNum}\n${cell}${empty} ${(100*percent).toFixed(2)}%`
   
  // 在单行输出文本
  log(text);
  // console.log(` +${description}: `,'\x1B[34m%s\x1b[39m', `${info}`)
  return log.clear
}
