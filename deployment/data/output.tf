output "db_client_cert" {
  value       = module.gcp_cloud_sql.db_client_cert
  description = "The client certs for the Cloud SQL instance"
  sensitive   = true
}

output "db_dns_name" {
  value       = module.gcp_cloud_sql.db_dns_name
  description = "The dns name for connecting to Cloud SQL instance via Private Service Connect"
  sensitive   = true
}

output "db_private_ip_address" {
  value       = module.gcp_cloud_sql.db_private_ip_address
  description = "The dns name for connecting to Cloud SQL instance via Private Service Connect"
  sensitive   = true
}


output "artifact_repo_name" {
  value       = module.gcp_artifact_registry.artifact_repo_name
  description = "The name of the artifact repository"
}
output "artifact_repo_uri" {
  value       = module.gcp_artifact_registry.artifact_repo_uri
  description = "The uri of the artifact repository"
}
