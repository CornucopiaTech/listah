
# Service Account
resource "google_project_service" "iam_api" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

# Define service account and permissions
resource "google_service_account" "app_service_account" {
  account_id                   = "${var.tags.project}-api-sa"
  display_name                 = "${var.tags.project} Service Account"
  project                      = var.project_id
  create_ignore_already_exists = true
  depends_on                   = [google_project_service.iam_api]
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
resource "google_project_iam_member" "secret-access" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}


# Cloud Run
resource "google_project_service" "cloudrun_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_cloud_run_v2_service" "app" {
  name                = "${var.tags.name}-api-service"
  location            = var.tags.region
  deletion_protection = var.tags.environment == "dev" ? false : true
  ingress             = "INGRESS_TRAFFIC_ALL"

  scaling {
    min_instance_count = 1
    max_instance_count = 100
    scaling_mode       = "AUTOMATIC"
  }

  template {
    service_account = google_service_account.app_service_account.email
    vpc_access {
      egress = "PRIVATE_RANGES_ONLY" # "ALL_TRAFFIC"
      network_interfaces {
        network    = var.vpc_id
        subnetwork = var.subnet_id
      }
    }
    containers {
      image = var.image_tag

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
        name = "ALLOWED_ORIGINS"
        value = var.known_origins
      }
      env {
        name = "POSTGRES_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = var.db_password
            version = "latest"
          }
        }
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
        value = 60
      }
      env {
        name  = "APP_NAME"
        value = var.tags.project
      }
    }

    labels = {
      for k, v in var.tags : k => (k == "name" ? "${v}-api-container" : v)
    }
  }
  labels = {
    for k, v in var.tags : k => (k == "name" ? "${v}-api-service" : v)
  }
  depends_on = [
    google_project_service.cloudrun_api,
    google_project_iam_member.secret-access
  ]
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
