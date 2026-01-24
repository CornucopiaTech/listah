

resource "aws_db_subnet_group" "db_subnet" {
  # name       = "main"
  subnet_ids = [aws_public_subnet_id, ]

  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-subnet" : v)
  }
}

# Add Secret

# Add KMS key for secret

# Instance profile

# Db security group

resource "aws_kms" "db_cluster_key" {

}

resource "aws_db_instance" "app_cluster" {
  allocated_storage    = var.allocated_storage
  db_name              = var.db_name
  engine               = "postgres"
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  username             = var.username
  # password             = "foobarbaz"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = (var.tags.environment == "prod" ? false : true)
  publicly_accessible = true
  manage_master_user_password = true
  copy_tags_to_snapshot  = true
  region = var.tags.region
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade", "iam-db-auth-error"]

  kms_key_id = aws_kms.db_cluster_key.id
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-cluster" : v)
  }
}

# resource "aws_db_instance" "default" {
#   allocated_storage    = 10
#   db_name              = "mydb"
#   engine               = "mysql"
#   engine_version       = "8.0"
#   instance_class       = "db.t3.micro"
#   username             = "foo"
#   password             = "foobarbaz"
#   parameter_group_name = "default.mysql8.0"
#   skip_final_snapshot  = true
# }
