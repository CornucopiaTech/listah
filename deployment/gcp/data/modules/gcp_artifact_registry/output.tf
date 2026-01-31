output "artifact_repo_name" {
  value       = google_artifact_registry_repository.repo.name
  description = "The name of the artifact repository"
}
output "artifact_repo_uri" {
  value       = google_artifact_registry_repository.repo.registry_uri
  description = "The uri of the artifact repository"
}
