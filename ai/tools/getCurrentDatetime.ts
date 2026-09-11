export const declaration = {
  name: 'getCurrentDatetime',
  description: 'Get current Indian Standard Time (IST - UTC+5:30), formatted date, day of the week, current tourism season, and active festival context.',
  parameters: {
    type: 'OBJECT',
    properties: {},
  },
};

export async function execute(): Promise<any> {
  const now = new Date();

  // Format to IST
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const parts = istFormatter.formatToParts(now);
  const formattedIST = istFormatter.format(now);

  const monthNumber = now.getMonth() + 1;
  let tourismSeason = 'Pleasant Sightseeing Season';
  if ([11, 12, 1, 2].includes(monthNumber)) {
    tourismSeason = 'Peak Winter Tourism Season (Ideal for Desert & Heritage Plains)';
  } else if ([3, 4, 5, 6].includes(monthNumber)) {
    tourismSeason = 'Summer Season (Ideal for Himalayan Circuits, Hill Stations, & Monasteries)';
  } else if ([7, 8, 9].includes(monthNumber)) {
    tourismSeason = 'Monsoon Season (Ideal for Western Ghats, Waterfalls, & Ayurveda Wellness)';
  }

  return {
    current_time_ist: formattedIST,
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    iso_timestamp: now.toISOString(),
    tourism_season: tourismSeason,
    cultural_context: 'Heritage monuments open around sunrise (~6:00 AM) to sunset (~6:00 PM) unless specified otherwise.',
  };
}
