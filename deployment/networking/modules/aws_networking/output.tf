output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The id of the vpc."
}

output "public1_subnet_id" {
  value       = aws_subnet.public1.id
  description = "The id of the 1st public subnet in the vpc."
}

output "public2_subnet_id" {
  value       = aws_subnet.public2.id
  description = "The id of the 2nd public subnet in the vpc."
}
