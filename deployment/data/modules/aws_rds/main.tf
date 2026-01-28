

resource "aws_db_subnet_group" "db_subnet" {
  # name       = "main"
  subnet_ids = var.rds_subnets

  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-subnet" : v)
  }
}

# Add Secret

# Add KMS key for secret

# Instance profile

# Db security group

resource "aws_security_group" "allow_tls" {
  name        = "allow_tls"
  description = "Allow TLS inbound traffic and all outbound traffic"
  vpc_id      = var.vpc_id

  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-sg" : v)
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4" {
  security_group_id = aws_security_group.allow_tls.id
  cidr_ipv4         = aws_vpc.main.cidr_block
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}


resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.allow_tls.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}


resource "aws_iam_role" "db_role" {
  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "rds.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-role" : v)
  }
}

resource "aws_iam_instance_profile" "db_instance_profile" {
  role = aws_iam_role.db_role.name
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-instance-profile" : v)
  }
}



resource "aws_kms" "db_cluster_key" {

}

resource "aws_db_instance" "app_db" {
  allocated_storage = var.allocated_storage
  db_name           = "${var.tags.project}-${var.tags.environment}-${var.tags.aws_region}"
  engine            = "postgres"
  engine_version    = "18"
  instance_class    = var.instance_class
  username          = var.username
  # password             = "foobarbaz"
  custom_iam_instance_profile     = aws_iam_instance_profile.db_instance_profile
  skip_final_snapshot             = (var.tags.environment == "prod" ? false : true)
  publicly_accessible             = true
  manage_master_user_password     = true
  copy_tags_to_snapshot           = true
  region                          = var.tags.region
  auto_minor_version_upgrade      = true
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade", "iam-db-auth-error"]

  kms_key_id = aws_kms.db_cluster_key.id
  tags = {
    for k, v in var.tags : k => (k == "Name" ? "${v}-db-cluster" : v)
  }
}

#

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
