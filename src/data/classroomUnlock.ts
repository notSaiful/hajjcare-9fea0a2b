/** Browser-only sequential unlock. Day 1 is open. Day N+1 opens after Day N is finished. */

export function dayIsFinished(day: number, done: readonly number[], played: readonly number[]): boolean {
  return done.includes(day) || played.includes(day);
}

/** The day the pilgrim should do now. Day 1 until it is finished, then the next unfinished day. */
export function firstOpenDay(done: readonly number[], played: readonly number[]): number {
  for (let day = 1; day <= 100; day += 1) {
    if (!dayIsFinished(day, done, played)) return day;
  }
  return 100;
}

export function dayIsUnlocked(day: number, done: readonly number[], played: readonly number[], edit: boolean): boolean {
  if (edit) return true;
  if (day <= 1) return true;
  if (day > 100) return false;
  return dayIsFinished(day - 1, done, played);
}
