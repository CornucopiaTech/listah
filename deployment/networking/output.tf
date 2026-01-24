output "aws_vpc_id" {
  value = module.aws_vpc.vpc_id
  description = "The id of the vpc."
}

output "aws_public1_subnet_id" {
  value = module.aws_vpc.public1_subnet_id
  description = "The id of the public subnet in the vpc."
}


output "aws_public2_subnet_id" {
  value = module.aws_vpc.public2_subnet_id
  description = "The id of the public subnet in the vpc."
}
