

export interface IEnvConfig {
  apiUrl: string;
  authKey: string;
}

export interface IApiEndpointConfig {
  readItem: string;
  readTag: string;
  readSavedFilter: string;
  updateItem: string;
  updateSavedFilter: string;
}


export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";



export interface TraceBaggage {
  traceparent?: string;
  tracestate?: string;
  b3?: string;
}
