
resource "google_compute_network" "vpc_network" {
  project                 = var.gcp_project_id
  name                    = "${var.tags.name}-vpc-network"
  auto_create_subnetworks = false
}

# Define private IP addresses for peering connection
resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.tags.name}-private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
}

# Connect Private CIDR Range to the Google service networking connection
resource "google_service_networking_connection" "default" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

resource "google_compute_network_peering_routes_config" "peering_routes" {
  peering              = google_service_networking_connection.default.peering
  network              = google_compute_network.vpc_network.name
  import_custom_routes = true
  export_custom_routes = true
}

# Not sure if needed
resource "google_compute_subnetwork" "private_subnet" {
  name                     = "${var.tags.name}-private-subnet"
  ip_cidr_range            = "10.0.0.0/20"
  region                   = var.tags.region
  network                  = google_compute_network.vpc_network.id
  private_ip_google_access = true
}

# Internal router
resource "google_compute_router" "router" {
  name    = "${var.tags.name}-router"
  region  = var.tags.region
  network = google_compute_network.vpc_network.id
}
