const api_host_addr = window.location.protocol + '//' + window.location.hostname + ':9501/';
export default class FetchUtil {
     static fetch_api(dir, method, data){
         let result = '';
         async function fetchApi() {
             try{
                 let response = await fetch(api_host_addr+'api/'+dir,
                     {
                         method: method,
                         body: ( method.toLowerCase().toString() === "post" ) ? JSON.stringify(data) : null,
                         headers: {'Content-Type':'application/json'},
                         }
                     );

                 //console.log(response.statusText);
                 result = response.json();
                 return result;
             }
             catch(e) {
                 //* API 서버 off 혹은 기타 에러 상황 시,
                 return e.toString();
             }
         }
         return fetchApi().then(res => res);
     }
}