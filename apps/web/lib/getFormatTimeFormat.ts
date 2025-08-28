export type FormatDateTimeOptions = {
  timeZone?: string;              // e.g., 'Asia/Kolkata', 'UTC', 'America/New_York'
  locale?: string;                // e.g., 'en-IN', 'en-US'
  withSeconds?: boolean;          // include seconds if true
  hour12?: boolean;               // 12h vs 24h clock
  timeZoneName?: 'short' | 'long' | undefined; // e.g., IST / GMT+5:30
};

export function formatDateTime(
  input: Date | string | number,
  opts: FormatDateTimeOptions = {}
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) throw new Error('Invalid date');

  const {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
    locale = 'en-IN',
    withSeconds = false,
    hour12 = true,
    timeZoneName = 'short',
  } = opts;

  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12,
    timeZone,
    timeZoneName,
  });

  return formatter.format(date);
}