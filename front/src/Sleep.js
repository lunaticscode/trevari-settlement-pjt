export default class Sleep{
    static sleep_func(milisecond){
           const sleep = (time) => { return new Promise(resolve => setTimeout(resolve, time)); };
           return sleep(milisecond);
    }
}