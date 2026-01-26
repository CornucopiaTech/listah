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
  username      = var.username
  db_name       = var.db_name
  root_password = var.root_password
  user_password = var.user_password
  vpc_id        = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  project_id    = var.gcp_project_id
  edition       = var.db_edition
  tags = {
    name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "opentofu-via-github-actions"
  }
}

module "gcp_artifact_registry" {
  source                = "./modules/gcp_artifact_registry"
  project_id            = var.gcp_project_id
  tags = {
    name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "opentofu-via-github-actions"
  }
}
