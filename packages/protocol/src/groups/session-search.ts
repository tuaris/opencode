import { Schema } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/http-api"

const Count = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0))

export const SessionSearchStatus = Schema.Union([
  Schema.Struct({ status: Schema.Literal("disabled") }),
  Schema.Struct({
    status: Schema.Literals(["running", "paused"]),
    progress: Schema.Struct({ label: Schema.String, numerator: Count, denominator: Count }),
  }),
  Schema.Struct({ status: Schema.Literal("completed"), skipped: Count }),
  Schema.Struct({ status: Schema.Literals(["unsupported", "error"]), error: Schema.String }),
])

/** Lives in the `server.experimental` group (see `groups/experimental.ts`). */
export const SessionSearchEndpoints = [
  HttpApiEndpoint.get("sessionSearch.status", "/api/experimental/session-search", {
    success: SessionSearchStatus,
  }).annotateMerge(
    OpenApi.annotations({
      identifier: "experimental.sessionSearch.status",
      summary: "Get session search build status",
      description:
        "Experimental: may change without compatibility guarantees. Return the progress of the one-time session search index build that `experimental.sqlite_fts` starts. `paused` means the build is incomplete and not running in this server, for example while the flag is off.",
    }),
  ),
] as const
