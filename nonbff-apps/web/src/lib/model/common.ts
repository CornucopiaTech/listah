import * as z from "zod";

export interface IEnvConfig {
  apiUrl: string;
  authKey: string;
  debug: boolean;
  user: string;
}

export interface IApiEndpointConfig {
  readTag: string;
  readTagProperty: string;
  readItem: string;
  readFilter: string;
  updateTag: string;
  updateItem: string;
  updateFilter: string;
}


export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";



export interface TraceBaggage {
  traceparent?: string;
  tracestate?: string;
  b3?: string;
}

export const ZPagination = z.object({
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sort: z.string().catch('name'),

});
export type IPagination = z.infer<typeof ZPagination>;

// Item Definitions
export const ZSearch = z.object({
  tags: z.array(z.string()).catch([]),
  filters: z.array(z.string()).catch([]),
  text: z.string().catch(''),
});
export type ISearch = z.infer<typeof ZSearch>;


export interface BackendErrorPayload {
  code: string;
  message: string;
  details?: Array<{
    type: string;
    value: string; // Base64 encoded protobuf payload, or raw string if using pure JSON
    fieldViolations?: Array<{ field: string; description: string }>;
  }>;
}

export class AppError extends Error {
  public code: string;
  public status: number;
  public tracking?: string;
  public fieldViolations: Array<{ field: string; description: string }> = [];

  constructor(message: string, status: number, trackingId?: string | null, payload?: BackendErrorPayload) {
    super(message);
    this.name = "AppError";
    this.tracking = trackingId || "";
    this.status = status;
    this.code = payload?.code || "INTERNAL_ERROR";

    // Extract tracking IDs or validations if provided by the backend structure
    if (payload?.details) {
      payload.details.forEach((detail) => {
        if (detail.fieldViolations) {
          this.fieldViolations = detail.fieldViolations;
        }
        // // If your backend maps the tracking ID inside the JSON structure:
        // if (detail.type === "listah.v1.SystemErrorDetails" && typeof detail.value === "string") {
        //   // If JSON mapping is configured, you might get a direct string,
        //   // otherwise you'd decode base64 here if needed.
        //   this.trackingId = detail.value;
        // }
      });
    }
  }
}
