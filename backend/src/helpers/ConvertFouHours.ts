import moment from "moment";
export const convertForHours = (milliseconds: number) => {
    if (isNaN(milliseconds)) {
      return "00:00:00";
    } else {
      const dur = moment.duration(milliseconds, 'milliseconds');
      const horas = moment.utc(dur.asMilliseconds()).format(" HH:mm:ss");
      const days = dur.days();
      const result = ((days === 1 ? days + " dia " : "")||(days > 1 ? days + " dias ":"")) + horas 
        
      return result;
    }
  }