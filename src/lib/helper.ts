export function minuteToHour(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export function padToTwoDigits(num: number) {
  return num.toString().padStart(2, '0');
}

export function createDebouncedTimeout() {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (callback: () => void, delayInSeconds: number): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, delayInSeconds * 1000); // Convert seconds to milliseconds
  };
}
