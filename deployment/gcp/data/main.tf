locals {
  default_gcp_tags = {
    name        = "${var.name_in_tag}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "opentofu-via-github-actions"
  }
  db_username = "${var.project}-db-admin"
  db_dbname   = "${var.project}-db"
}

data "terraform_remote_state" "networking" {
  backend = "gcs"

  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/networking/"
  }
}

module "gcp_cloud_sql" {
  source        = "./modules/gcp_cloud_sql"
  instance_tier = var.instance_tier
  username      = local.db_username
  db_name       = local.db_dbname
  vpc_id        = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  project_id    = var.gcp_project_id
  edition       = var.db_edition
  home_network  = var.home_network
  tags          = local.default_gcp_tags
}

module "gcp_artifact_registry" {
  source     = "./modules/gcp_artifact_registry"
  project_id = var.gcp_project_id
  tags       = local.default_gcp_tags
}
