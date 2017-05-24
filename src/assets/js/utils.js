export default class Utils {
    static formatTime(hour, minute) {
        return (hour < 10 ? '0' + hour :hour) + ':' + (minute < 10 ? '0' + minute : minute);
    }
    static getCurrentTime(){
        const _currentDate = new Date();
        return this.formatTime(_currentDate.getHours(), _currentDate.getMinutes());
    }
}
