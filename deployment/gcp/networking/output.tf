
output "gcp_vpc_id" {
  value       = module.gcp_vpc.vpc_id
  description = "The id of the GCP vpc."
}


output "gcp_private_subnet_id" {
  value       = module.gcp_vpc.private_subnet_id
  description = "The id of the private subnet in the vpc."
}
