
# Enable Cloud Run API
resource "google_project_service" "cloudrun_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry_api" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam_api" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}


resource "google_artifact_registry_repository" "repo" {
  location      = var.tags.region
  project       = var.project_id
  repository_id = "${var.tags.Name}-container-repo"
  description   = "${var.tags.project} container repository/registry"
  format        = "DOCKER"
  # cleanup_policies {
  #   id     = "${var.tags.Name}-container-reg-repo"
  #   action = "DELETE"
  #   most_recent_versions {
  #     keep_count = 3
  #   }
  # }
  docker_config {
    immutable_tags = true
  }
  labels = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-container-reg-repo" : v)
  }
}

resource "google_service_account" "app_service_account" {
  account_id                   = "${var.tags.project}-run-sa"
  display_name                 = "${var.tags.project} Service Account"
  project                      = var.project_id
  create_ignore_already_exists = true
}

resource "google_project_iam_member" "cloud_sql_admin_binding" {
  project = var.project_id
  role    = "roles/cloudsql.admin"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

resource "google_project_iam_member" "network_admin_binding" {
  project = var.project_id
  role    = "roles/compute.networkAdmin"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

resource "google_project_iam_member" "dns_admin" {
  project = var.project_id
  role    = "roles/dns.admin"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

resource "google_project_iam_member" "cloudsql_instanceUser" {
  project = var.project_id
  role    = "roles/cloudsql.instanceUser"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}


resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}


resource "google_cloud_run_v2_service" "app" {
  name                = "${var.tags.Name}-cloudrun-service"
  location            = var.tags.region
  deletion_protection = var.tags.environment == "dev" ? false : true
  ingress             = "INGRESS_TRAFFIC_ALL"

  scaling {
    max_instance_count = 100
  }

  template {
    service_account = google_service_account.app_service_account.email
    containers {
      image = google_artifact_registry_repository.repo.registry_uri

      liveness_probe {
        failure_threshold     = 5
        initial_delay_seconds = 60
        timeout_seconds       = 30
        period_seconds        = 30

        http_get {
          path = "/health"
          # Custom headers to set in the request
          # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service#http_headers
          http_headers {
            name  = "Access-Control-Allow-Origin"
            value = "*"
          }
        }
      }
      startup_probe {
        failure_threshold     = 5
        initial_delay_seconds = 60
        timeout_seconds       = 30
        period_seconds        = 30

        http_get {
          path = "/health"
          # Custom headers to set in the request
          # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service#http_headers
          http_headers {
            name  = "Access-Control-Allow-Origin"
            value = "*"
          }
        }
      }
      env {
        name  = "POSTGRES_PASSWORD"
        value = var.db_password
      }
      env {
        name  = "POSTGRES_USER"
        value = var.db_username
      }
      env {
        name  = "POSTGRES_DB"
        value = var.db_name
      }
      env {
        name  = "DATABASE_HOST"
        value = var.db_host
      }
      env {
        name  = "DB_DNS_NAME"
        value = var.db_dns_name
      }
      env {
        name  = "DB_PRIVATE_IP"
        value = var.db_private_ip_address
      }
      env {
        name  = "DATABASE_PORT"
        value = "5432"
      }
      env {
        name  = "POSTGRES_USE_TLS"
        value = "true"
      }
      env {
        name  = "OTEL_EXPORTER_OTLP_ENDPOINT"
        value = "CHANGEME"
      }
      env {
        name  = "OLTP_EXPORTER_TYPE"
        value = "otlp"
      }
      env {
        name  = "METRIC_FREQ_SEC"
        value = 60
      }
      env {
        name  = "TRACE_FREQ_SEC"
        value = 5
      }
      env {
        name  = "APP_NAME"
        value = var.tags.project
      }
    }

    labels = {
      for k, v in var.tags : k => (k == "Name" ? "${v}-cloudrun-service-container" : v)
    }
  }
  labels = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-cloudrun-service" : v)
  }
}


resource "google_cloud_run_service_iam_binding" "allow_all_users" {
  location = google_cloud_run_v2_service.app.location
  project  = var.project_id
  service  = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}
