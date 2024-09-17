import { Epoch, Snowyflake } from 'snowyflake';
const snowy = new Snowyflake({
  workerId: 0n,
  processId: 1n,
  epoch: Epoch.Twitter,
} as const);

export function generateId(): string {
  return snowy.nextId().toString();
}
