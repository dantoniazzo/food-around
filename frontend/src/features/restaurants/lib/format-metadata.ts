import type { OpenHours } from 'entities/restaurant';

export const formatOpenHours = (hours: OpenHours) => {
  // Map day numbers to day names
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Validate input
  if (!hours?.open || !hours?.close || hours.open.day !== hours.close.day) {
    return 'Invalid hours';
  }

  const day = hours.open.day;
  if (day < 0 || day > 6) {
    return 'Invalid day';
  }

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time: string): string => {
    const match = time.match(/^(\d{2})(\d{2})$/);
    if (!match) return 'Invalid time';

    const [, hours, minutes] = match;
    let hoursNum = parseInt(hours);
    const ampm = hoursNum >= 12 ? 'PM' : 'AM';

    hoursNum = hoursNum % 12 || 12; // Convert 0 or 12 to 12, 13 to 1, etc.
    return `${hoursNum}:${minutes} ${ampm}`;
  };

  const openTime = formatTime(hours.open.time);
  const closeTime = formatTime(hours.close.time);

  if (openTime === 'Invalid time' || closeTime === 'Invalid time') {
    return 'Invalid time format';
  }

  return `${dayNames[day]} ${openTime} - ${closeTime}`;
};
