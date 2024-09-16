import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DateDisplay = ({ date }) => {

  try {
    const parsedDate = new Date(date);
    let displayDate;

    if (isToday(parsedDate)) {
      displayDate = `hoje às ${format(parsedDate, 'HH:mm', { locale: ptBR })}`;
    } else if (isYesterday(parsedDate)) {
      displayDate = `ontem às ${format(parsedDate, 'HH:mm', { locale: ptBR })}`;
    } else {
      displayDate = format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    }

    return <span>{displayDate}</span>;

  } catch (error) {
    return <span></span>;
  }



};

export default DateDisplay;