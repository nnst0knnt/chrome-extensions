export const toSeconds = (ms: number) => Math.floor(ms / 1000);

export const toMinutes = (ms: number) => toSeconds(ms) / 60;
