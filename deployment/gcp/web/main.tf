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


data "terraform_remote_state" "api" {
  backend = "gcs"
  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/api/"
  }
}


module "web_service" {
  source      = "./modules/web_service"
  api_url    = data.terraform_remote_state.api.outputs.api_urls[1]
  api_version = "1"
  vpc_id      = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  subnet_id   = data.terraform_remote_state.networking.outputs.gcp_private_subnet_id
  project_id  = var.gcp_project_id
  image_tag   = var.image_tag
  tags        = local.default_gcp_tags
}
