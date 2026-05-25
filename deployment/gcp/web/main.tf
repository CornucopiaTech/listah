locals {
  default_gcp_tags = {
    name        = "${var.name_in_tag}"
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


# data "terraform_remote_state" "api" {
#   backend = "gcs"
#   config = {
#     bucket = var.state_management_bucket_name
#     prefix = "${var.state_management_prefix}/api/"
#   }
# }

# ToDo: Check Api Url
module "web_service" {
  source = "./modules/web_service"
  # api_url         = data.terraform_remote_state.api.outputs.api_urls[1]
  api_service_url = var.api_service_url
  api_version     = "1"
  vpc_id          = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  subnet_id       = data.terraform_remote_state.networking.outputs.gcp_private_subnet_id
  project_id      = var.gcp_project_id
  image_tag       = var.image_tag
  auth_key        = var.auth_key
  tags            = local.default_gcp_tags
}
