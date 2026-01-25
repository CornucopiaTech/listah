output "vpc_id" {
  value       = google_compute_network.vpc_network.id
  description = "The id of the vpc."
}

# output "private_subnet_id" {
#   value       = google_compute_subnetwork.private_subnet.id
#   description = "The id of the private subnet in the vpc."
# }

# output "public_subnet_id" {
#   value       = google_compute_subnetwork.public_subnet.id
#   description = "The id of the public subnet in the vpc."
# }
