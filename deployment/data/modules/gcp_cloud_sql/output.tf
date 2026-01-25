output "db_client_cert" {
  value       = google_sql_ssl_cert.client_cert.certs
  description = "The client certs for the Cloud SQL instance"
}
