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

export const ApiEndpoints: IApiEndpointConfig = {
  readItem: "listah.v1.ItemService/ReadItem",
  readTag: "listah.v1.ItemService/ReadTag",
  readTagProperty: "listah.v1.ItemService/ReadTagProperty",
  readFilter: "listah.v1.ItemService/ReadFilter",
  updateTag: "listah.v1.ItemService/UpsertTag",
  updateItem: "listah.v1.ItemService/UpsertItem",
  updateFilter: "listah.v1.ItemService/UpsertFilter",
}


export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";



export interface TraceBaggage {
  traceparent?: string;
  tracestate?: string;
  b3?: string;
}

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
      });
    }
  }
}
