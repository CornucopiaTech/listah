locals {
  default_aws_tags = {
    Name        = "${var.project}-${var.environment}-${var.aws_region}"
    project     = var.project
    environment = var.environment
    region      = var.aws_region
    controller  = "opentofu-via-github-actions"
  }
}
module "aws_vpc" {
  source = "./modules/aws_networking"
  tags   = local.default_aws_tags

}
