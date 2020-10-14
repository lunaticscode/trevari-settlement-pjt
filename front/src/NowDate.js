export default class NowDate {
    static ymdhis() {
        let date = new Date();
        let m = date.getMonth()+1;
        let d = date.getDate();
        let h = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        return date.getFullYear()+''+(m>9?m:'0'+m)+''+(d>9?d:'0'+d)+''+(h>9?h:'0'+h)+''+(i>9?i:'0'+i)+''+(s>9?s:'0'+s);
    }
}