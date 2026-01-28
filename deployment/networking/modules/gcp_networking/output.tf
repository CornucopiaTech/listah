output "vpc_id" {
  value       = google_compute_network.vpc_network.id
  description = "The id of the vpc."
}

output "private_subnet_id" {
  value       = google_compute_subnetwork.private_subnet.subnetwork_id
  description = "The id of the private subnet in the vpc."
}
