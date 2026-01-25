

resource "google_sql_database_instance" "main" {
  name             = "${var.tags.Name}-db-instance"
  database_version = "POSTGRES_18"
  region           = var.tags.region
  project          = var.tags.project
  root_password    = var.root_password

  settings {
    # Second-generation instance tiers are based on the machine
    # type. See argument reference below.
    tier              = var.instance_tier
    activation_policy = "ON_DEMAND"
    availability_type = var.tags.environment == "dev" ? "ZONAL" : "REGIONAL"
    disk_autoresize   = true
    ip_configuration {
      # private_network = var.vpc_id
      ssl_mode        = "ENCRYPTED_ONLY"
    }
    connection_pool_config {
      connection_pooling_enabled = true
    }
  }
}


resource "google_sql_database" "database" {
  name     = "${var.tags.Name}-db"
  instance = google_sql_database_instance.main.name
  project  = var.tags.project
}

resource "google_sql_user" "users" {
  name     = var.username
  instance = google_sql_database_instance.main.name
  password = var.user_password
}


resource "google_sql_ssl_cert" "client_cert" {
  common_name = "${var.tags.Name}-db-client-ssl-cert"
  instance    = google_sql_database_instance.main.name
  project     = var.tags.project
}
