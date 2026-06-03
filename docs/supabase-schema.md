# Supabase Schema

Runner's Hi MVP currently stores runs locally with AsyncStorage. Supabase sync will be added later, using the tables below.

## Environment Variables

Create a local `.env` file from `.env.example`:

```sh
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Do not commit real Supabase keys.

## `runs`

Stores one completed GPS run.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Future auth user id |
| `started_at` | `timestamptz` | Run start time |
| `ended_at` | `timestamptz` | Run end time |
| `duration_seconds` | `integer` | Total elapsed seconds |
| `distance_meters` | `integer` | Filtered GPS distance |
| `average_pace_seconds_per_km` | `integer` | Nullable when unavailable |
| `earned_hp` | `integer` | Hi Point earned by this run |
| `note` | `text` | Optional memo |
| `created_at` | `timestamptz` | Insert timestamp |

## `run_points`

Stores filtered route coordinates for a run.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `run_id` | `uuid` | References `runs.id` |
| `latitude` | `double precision` | GPS latitude |
| `longitude` | `double precision` | GPS longitude |
| `altitude` | `double precision` | Nullable altitude |
| `accuracy` | `double precision` | Nullable GPS accuracy in meters |
| `speed` | `double precision` | Nullable speed in m/s |
| `recorded_at` | `timestamptz` | Coordinate timestamp |
| `sequence` | `integer` | Route ordering |

## `user_profiles`

Stores future user-facing growth summary.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Same as auth user id |
| `display_name` | `text` | Optional display name |
| `total_hp` | `integer` | Cached total Hi Point |
| `current_tier` | `text` | Cached runner tier |
| `created_at` | `timestamptz` | Insert timestamp |
| `updated_at` | `timestamptz` | Last profile update |
