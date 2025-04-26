use chrono::{DateTime, Local, NaiveDateTime, Utc};
use prost_types::Timestamp;
use sqlx::types::time::OffsetDateTime;

pub const DATE_TIME_FORMAT: &'static str = "%Y-%m-%dT%H:%M:%S%.6fZ";

pub fn now() -> (String, NaiveDateTime) {
    let now = Utc::now().with_timezone(&Local);
    (now.format(DATE_TIME_FORMAT).to_string(), now.naive_local())
}

pub fn dt_to_ts(dt: &DateTime<Utc>) -> Timestamp {
    Timestamp {
        seconds: dt.timestamp(),
        nanos: dt.timestamp_subsec_nanos() as i32,
    }
}

pub fn ts_to_dt(ts: &Timestamp) -> DateTime<Utc> {
    DateTime::<Utc>::from_naive_utc_and_offset(
        DateTime::from_timestamp(ts.seconds, ts.nanos as u32)
            .unwrap()
            .naive_utc(),
        Utc,
    )
}

pub fn i64_to_ts(ts_int64: i64) -> Timestamp {
    Timestamp {
        seconds: ts_int64,
        nanos: 0,
    }
}

pub fn offsetdatetime_to_ts(offset_date_time: OffsetDateTime) -> Timestamp {
    Timestamp {
        seconds: offset_date_time.unix_timestamp(),
        nanos: offset_date_time.unix_timestamp_nanos() as i32,
    }
}
