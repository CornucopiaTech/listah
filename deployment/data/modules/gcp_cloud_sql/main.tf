

resource "google_sql_database_instance" "main" {
  name             = "${var.tags.Name}-db-instance"
  database_version = "POSTGRES_18"
  region           = var.tags.region
  project          = var.project_id
  root_password    = var.root_password

  settings {
    # Second-generation instance tiers are based on the machine
    # type. See argument reference below.
    edition = var.edition
    tier    = var.instance_tier
    # activation_policy = "ON_DEMAND" //Can't be used by 2nd Gen.
    availability_type = var.tags.environment == "dev" ? "ZONAL" : "REGIONAL"
    disk_autoresize   = true
    final_backup_config {
      enabled        = var.tags.environment == "dev" ? false : true
      retention_days = var.tags.environment == "dev" ? null : 365
    }
    ip_configuration {
      # private_network = var.vpc_id
      ssl_mode       = "ENCRYPTED_ONLY"
      server_ca_mode = "GOOGLE_MANAGED_INTERNAL_CA"
      #  requireSsl = true
      # authorized_networks {
      #   name = "Web "
      # }
    }
    connection_pool_config {
      connection_pooling_enabled = var.edition == "ENTERPRISE" ? false : true
    }
  }
}


resource "google_sql_database" "database" {
  name     = "${var.tags.Name}-db"
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

resource "google_sql_user" "users" {
  name     = var.username
  instance = google_sql_database_instance.main.name
  password = var.user_password
  type     = "BUILT_IN"
}


resource "google_sql_ssl_cert" "client_cert" {
  common_name = "${var.tags.Name}-db-client-ssl-cert"
  instance    = google_sql_database_instance.main.name
  project     = var.project_id
}
