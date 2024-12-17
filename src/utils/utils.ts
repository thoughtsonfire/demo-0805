export function highlightKeyword(keyword:string,inputString:string){
    const regex = new RegExp(`(${keyword.split('').join('|')})`,'gi')
    return inputString.replace(regex,'<em class="suggest_high_light">$1</em>')
}

/**
 * 处理播放时长，将秒数转换为分钟和秒的格式
 * @param {Number} time 传入的总时长，以秒为单位
 * @returns {String} 处理后的时间字符串，格式为 'mm:ss'
 */
export function handleTime(time:number) {
    time = parseInt(String(time));
    time = Math.floor(time);
    let m:any = Math.floor(time / 60);
    let s:any = Math.floor(time % 60);
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return m + ':' + s;
}

/**
 * 处理大于1万的数字
 * @param {Number} num 如：198765
 * @returns {String} 转换后：'19.9万'
 */
export function handleNum(num:number) {
    if (num > 10000) {
        num = Number((num / 10000).toFixed(1));
        return num + '万';
    } else {
        return num;
    }
}

/**
 * 将文本中的URL或其他可识别的链接转换为可点击的超链接
 * @param {String} text 需要识别的文本
 * @returns {String} 带有超链接a标签的文本
 */
export function linkify(text:string) {
    if (text) {
        // 匹配URL的正则表达式
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%=~_|$?!:,.]*[A-Z0-9+&@#/%=~_|$])/gi;

        // 将匹配到的URL替换为带有链接的HTML
        var linkedText = text.replace(urlRegex, function (url) {
            return '<a href="' + url + '" class="v-url" target="_blank">' + url + '</a>';
        });

        return linkedText;
    } else {
        return text; // 如果 text 未定义，则返回原始值
    }
}