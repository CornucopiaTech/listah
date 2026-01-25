locals {
  default_aws_tags = {
    Name        = "${var.project}-${var.environment}-${var.aws_region}"
    project     = var.project
    environment = var.environment
    region      = var.aws_region
    controller  = "OpenTofu via Github Actions"
  }
  default_gcp_tags = {
    Name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "OpenTofu via Github Actions"
  }
}
module "aws_vpc" {
  source = "./modules/aws_networking"
  tags   = local.default_aws_tags

}

module "gcp_vpc" {
  source         = "./modules/gcp_networking"
  tags           = local.default_gcp_tags
  gcp_project_id = var.gcp_project_id
}
