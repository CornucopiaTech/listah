
module "aws_rds" {
  source = "./modules/aws_rds"
  allocated_storage = var.allocated_storage
  db_name = var.project
  engine = var.engine
  engine_version = var.engine_version
  instance_class = var.instance_class
  username = var.username
  parameter_group_name = var.parameter_group_name
  tags = {
    Name        = "${var.project}-${var.environment}-${var.aws_region}"
    project     = var.project
    environment = var.environment
    region      = var.aws_region
  }
}
