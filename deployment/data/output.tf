output "db_client_cert" {
  value       = module.gcp_cloud_sql.db_client_cert
  description = "The client certs for the Cloud SQL instance"
  sensitive   = true
}

output "db_dns_name" {
  value       = module.gcp_cloud_sql.db_client_cert
  description = "The dns name for connecting to Cloud SQL instance via Private Service Connect"
  sensitive   = true
}
