output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The id of the vpc."
}

output "private_subnet_id" {
  value       = aws_subnet.private.id
  description = "The id of the private subnet in the vpc."
}

output "public_subnet_id" {
  value       = aws_subnet.public.id
  description = "The id of the public subnet in the vpc."
}
