
export default class Cookie{
    //* path=/; (전역 설정)
    static set_cookie(key, value, expire_day){
        let date = new Date();
        let expire_time =  ( date.getTime() + ( expire_day * 24 * 60 * 60 * 1000) );
        document.cookie= key + "=" + value + ";" + " path=/; " + "expires=" + expire_time + ";";
    }

    static get_cookie(key){
            let value = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return value? value[2] : null;
    }

    static delete_cookie(key) {
        let temp = this.get_cookie(key);
        console.log(temp);
        if( temp ){
            let date = new Date();
            date.setDate(date.getDate() - 1);
            // this.set_cookie ...
            document.cookie = key + "=" + temp + "; " + "expires="+date.toUTCString()+";";
        }
    }
}