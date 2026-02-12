locals {
  default_gcp_tags = {
    name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "opentofu-via-github-actions"
  }
}

data "terraform_remote_state" "networking" {
  backend = "gcs"

  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/networking/"
  }
}

data "terraform_remote_state" "data" {
  backend = "gcs"

  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/data/"
  }
}


module "api_service" {
  source      = "./modules/api_service"
  db_username = data.terraform_remote_state.data.outputs.db_username
  db_password = data.terraform_remote_state.data.outputs.db_secret_userpassword_name
  db_host     = data.terraform_remote_state.data.outputs.db_private_ip_address
  db_name     = data.terraform_remote_state.data.outputs.db_dbname
  vpc_id      = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  subnet_id   = data.terraform_remote_state.networking.outputs.gcp_private_subnet_id
  project_id  = var.gcp_project_id
  image_tag   = var.image_tag
  known_origins   = var.known_origins
  tags        = local.default_gcp_tags
}
