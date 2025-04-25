import { Timestamp } from '@bufbuild/protobuf/wkt';

export function TimestampToDate(timestamp: Timestamp): Date {
  return new Date(Number(timestamp.seconds) * 1000);
}
