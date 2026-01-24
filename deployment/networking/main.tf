
module "aws_vpc" {
  source = "./modules/aws_networking"
  tags = {
    Name        = "${var.project}-${var.environment}-${var.aws_region}"
    project     = var.project
    environment = var.environment
    region      = var.aws_region
  }
}
