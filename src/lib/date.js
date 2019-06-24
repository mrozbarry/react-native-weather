export const localeDate = date => (
  date.toLocaleDateString(
    'en-CA',
    { hour12: true,
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }
  )
);

export const isToday = date => {
  const todayString = localeDate(new Date());
  const dateString = localeDate(date);
  return todayString === dateString;
}

export const formatDate = date => {
  const prefix = isToday(date)
    ? 'Today, '
    : '';
  return prefix + localeDate(date);
}
