output "db_client_cert" {
  value       = google_sql_ssl_cert.client_cert.cert
  description = "The client certs for the Cloud SQL instance"
  sensitive   = true
}

output "db_connection_name" {
  value       = google_sql_database_instance.main.connection_name
  description = "The connection name for connecting to Cloud SQL instance via Private Service Connect"
  sensitive   = true
}

output "db_dns_name" {
  value       = google_sql_database_instance.main.dns_name
  description = "The dns name for connecting to Cloud SQL instance via Private Service Connect"
  sensitive   = true
}

output "db_private_ip_address" {
  value       = google_sql_database_instance.main.private_ip_address
  description = "The Private IP address for connecting to Cloud SQL instance via Private Service Connect"
  sensitive   = true
}
