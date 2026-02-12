locals {
  default_gcp_tags = {
    name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "opentofu-via-github-actions"
  }
}

module "gcp_vpc" {
  source         = "./modules/gcp_networking"
  tags           = local.default_gcp_tags
  gcp_project_id = var.gcp_project_id
}
