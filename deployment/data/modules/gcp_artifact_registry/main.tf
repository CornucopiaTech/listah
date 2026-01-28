
# Artifact registry
resource "google_project_service" "artifactregistry_api" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}
resource "google_artifact_registry_repository" "repo" {
  location      = var.tags.region
  project       = var.project_id
  repository_id = "${var.tags.name}-container-repo"
  description   = "${var.tags.project} container repository/registry"
  format        = "DOCKER"
  # cleanup_policies {
  #   id     = "${var.tags.name}-container-repo"
  #   action = "DELETE"
  #   most_recent_versions {
  #     keep_count = 3
  #   }
  # }
  docker_config {
    immutable_tags = true
  }
  labels = {
    for k, v in var.tags : k => (k == "name" ? "${v}-container-repo" : v)
  }
  depends_on = [google_project_service.artifactregistry_api]
}
