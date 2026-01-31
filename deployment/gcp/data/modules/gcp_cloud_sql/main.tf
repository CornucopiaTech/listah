

# Service Account
resource "google_project_service" "iam_api" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

# Enable SQL Admin API
resource "google_project_service" "sqladmin_api" {
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

# Enable Secret Manager API
resource "google_project_service" "secretmanager_api" {
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

# Enable Cloud Key Management Service (KMS) API
resource "google_project_service" "cloudkms_api" {
  service            = "cloudkms.googleapis.com"
  disable_on_destroy = false
}


# Define crypto keys for secrets
resource "google_kms_key_ring" "key_ring" {
  name       = "${var.tags.name}-crypto-key-ring"
  location   = var.tags.region
  depends_on = [google_project_service.cloudkms_api]
}


# Define root user in db
resource "google_kms_crypto_key" "crypto_key" {
  name     = "${var.tags.name}-crypto-key"
  key_ring = google_kms_key_ring.key_ring.id
}
resource "google_secret_manager_secret" "root_password" {
  secret_id = "${var.tags.name}-root-password"
  labels = {
    for k, v in var.tags : k => (k == "name" ? "${v}-root-password" : v)
  }

  replication {
    auto {
      customer_managed_encryption {
        kms_key_name = google_kms_crypto_key.crypto_key.name
      }
    }
  }
  deletion_protection = var.tags.environment == "prod" ? true : false
  depends_on          = [google_project_service.secretmanager_api]
}
resource "random_password" "root_password_value" {
  length           = 20
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
resource "google_secret_manager_secret_version" "root_password_version" {
  secret      = google_secret_manager_secret.root_password.name
  secret_data = random_password.root_password_value.result
}


# Define db
resource "google_sql_database_instance" "main" {
  name             = "${var.tags.name}-db-instance"
  database_version = "POSTGRES_18"
  region           = var.tags.region
  project          = var.project_id
  root_password    = random_password.root_password_value.result

  deletion_protection = var.tags.environment == "prod" ? true : false
  settings {
    edition                     = var.edition
    tier                        = var.instance_tier
    availability_type           = var.tags.environment == "dev" ? "ZONAL" : "REGIONAL"
    disk_autoresize             = true
    deletion_protection_enabled = var.tags.environment == "prod" ? true : false
    final_backup_config {
      enabled        = var.tags.environment == "prod" ? true : false
      retention_days = var.tags.environment == "dev" ? null : 365
    }
    ip_configuration {
      private_network = var.vpc_id
      ssl_mode        = "ENCRYPTED_ONLY"
      server_ca_mode  = "GOOGLE_MANAGED_INTERNAL_CA"
    }
    connection_pool_config {
      connection_pooling_enabled = var.edition == "ENTERPRISE" ? false : true
    }
    retain_backups_on_delete = var.tags.environment == "prod" ? true : false
  }
}
resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}


# Define app user in db
resource "google_secret_manager_secret" "user_password" {
  secret_id = "${var.tags.name}-user-password"
  labels = {
    for k, v in var.tags : k => (k == "name" ? "${v}-user-password" : v)
  }

  replication {
    auto {
      customer_managed_encryption {
        kms_key_name = google_kms_crypto_key.crypto_key.name
      }
    }
  }
  deletion_protection = var.tags.environment == "prod" ? true : false
  depends_on          = [google_project_service.secretmanager_api]
}
resource "random_password" "user_password_value" {
  length           = 20
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
resource "google_secret_manager_secret_version" "user_password_version" {
  secret      = google_secret_manager_secret.user_password.name
  secret_data = random_password.user_password_value.result
}
resource "google_sql_user" "users" {
  name     = var.username
  instance = google_sql_database_instance.main.name
  password = random_password.user_password_value.result
  type     = "BUILT_IN"
}


# Define DB cert
resource "google_sql_ssl_cert" "client_cert" {
  common_name = "${var.tags.name}-db-client-ssl-cert"
  instance    = google_sql_database_instance.main.name
  project     = var.project_id
}
