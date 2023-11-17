export const dateTime = (date: Date) => `${getFormattedDate(date)} - ${getFormattedTime(date)}`;

export const getFormattedTime = (date: Date) => {
    !date && (date = new Date());
    date = new Date(date)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const AorP = hours < 12 ? 'a' : 'p';

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${AorP}m`;
}

export const getFormattedDate = (date: Date) => {
    !date && (date = new Date());
    date = new Date(date)

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
};
