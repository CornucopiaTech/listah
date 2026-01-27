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


module "gcp_cloud_run" {
  source                = "./modules/gcp_cloud_run"
  db_username           = var.db_username
  db_password           = var.db_password
  db_host               = data.terraform_remote_state.data.outputs.db_dns_name
  db_dns_name           = data.terraform_remote_state.data.outputs.db_dns_name
  db_private_ip_address = data.terraform_remote_state.data.outputs.db_private_ip_address
  db_name               = var.db_name
  vpc_id                = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  project_id            = var.gcp_project_id
  image_tag = var.image_tag
  tags = {
    name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "opentofu-via-github-actions"
  }
}
