output "db_dbname" {
  value       = local.db_dbname
  description = "Name of the database"
  sensitive   = true
}

output "db_username" {
  value       = local.db_username
  description = "Username of the application user in the database"
  sensitive   = true
}

output "db_userpassword" {
  value       = module.gcp_cloud_sql.db_userpassword
  description = "Result of randomly generated secret for the Db user password"
  sensitive   = true
}
output "db_secret_userpassword_name" {
  value       = module.gcp_cloud_sql.db_secret_userpassword_name
  description = "Name of the secret that stores the Db user password"
  sensitive   = true
}

output "db_client_cert" {
  value       = module.gcp_cloud_sql.db_client_cert
  description = "The client certs for the Cloud SQL instance"
  sensitive   = true
}

output "db_dns_name" {
  value       = module.gcp_cloud_sql.db_dns_name
  description = "The dns name for connecting to Cloud SQL instance"
  sensitive   = true
}

output "db_public_ip_address" {
  value       = module.gcp_cloud_sql.db_public_ip_address
  description = "The public ip address for Cloud SQL instance"
  sensitive   = true
}

output "db_private_ip_address" {
  value       = module.gcp_cloud_sql.db_private_ip_address
  description = "The private ip address for Cloud SQL instance"
  sensitive   = true
}

output "db_connection_name" {
  value       = module.gcp_cloud_sql.db_connection_name
  description = "The connection name for Cloud SQL instance"
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
