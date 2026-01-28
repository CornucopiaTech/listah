output "repo_uri" {
  value       = data.terraform_remote_state.data.outputs.artifact_repo_uri
  description = "The uri of the artifact repository"
  sensitive   = true
}
output "client_cert" {
  value       = data.terraform_remote_state.data.outputs.db_client_cert
  description = "The client certs for the Cloud SQL instance"
  sensitive   = true
}
