export function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function todayYMD() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function monthKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function shiftMonth(ym: string, delta: number) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return monthKey(d);
}

export function weekdayShortLabels() {
  // starting Sunday
  const base = new Date(2026, 0, 4); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toLocaleString(undefined, { weekday: 'short' });
  });
}

export function parseYMD(ymd: string) {
  const [y, m, d] = ymd.split('-').map((x) => Number(x));
  return new Date(y, m - 1, d);
}

export function formatMonthLabel(ym: string) {
  const [y, m] = ym.split('-').map((x) => Number(x));
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

export function daysInMonth(ym: string) {
  const [y, m] = ym.split('-').map((x) => Number(x));
  return new Date(y, m, 0).getDate();
}

export function isWeekend(ymd: string) {
  const d = parseYMD(ymd);
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function addDays(ymd: string, n: number) {
  const d = parseYMD(ymd);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function eachDay(from: string, to: string) {
  const result: string[] = [];
  let cur = from;
  while (parseYMD(cur) <= parseYMD(to)) {
    result.push(cur);
    cur = addDays(cur, 1);
  }
  return result;
}

