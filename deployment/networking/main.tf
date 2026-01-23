
module "aws_vpc" {
  source = "./modules/aws_networking"
  tags = {
    name        = "${var.project}-${var.environment}"
    project     = var.project
    environment = var.environment
  }
}
