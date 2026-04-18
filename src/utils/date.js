function padTwoDigits(value) {
  return String(value).padStart(2, '0');
}

export function formatCurrentTimestamp() {
  const now = new Date();
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()];
  return `${weekday}, ${month} ${now.getDate()} ${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}`;
}
