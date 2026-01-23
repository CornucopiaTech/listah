
module "aws_vpc" {
  source = "./modules/aws_networking"
  tags = {
    name        = "${var.tag.project}-${var.tag.environment}"
    project     = var.tag.project
    environment = var.tag.environment
  }
}
