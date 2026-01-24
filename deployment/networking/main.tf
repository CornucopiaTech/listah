
module "aws_vpc" {
  source = "./modules/aws_networking"
  tags = {
    Name        = "${var.project}-${var.environment}"
    project     = var.project
    environment = var.environment
  }
}
