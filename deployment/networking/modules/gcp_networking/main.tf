
resource "google_compute_network" "vpc_network" {
  project                 = var.gcp_project_id
  name                    = "${var.tags.Name}-vpc-network"
  auto_create_subnetworks = false
}

# Define private IP addresses for peering connection
resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.tags.Name}-private-ip-address"
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

## Uncomment this block after adding a valid DNS suffix
# resource "google_service_networking_peered_dns_domain" "default" {
#   name       = "example-com"
#   network    = google_compute_network.vpc_network.id
#   dns_suffix = "example.com."
#   service    = "servicenetworking.googleapis.com"
# }


# Not sure if needed
resource "google_compute_subnetwork" "private_subnet" {
  name                     = "${var.tags.Name}-private-subnet"
  ip_cidr_range            = "10.0.0.0/20"
  region                   = var.tags.region
  network                  = google_compute_network.vpc_network.id
  private_ip_google_access = true
}

# resource "google_compute_subnetwork" "public_subnet" {
#   name                     = "${var.tags.Name}-public-subnet"
#   ip_cidr_range            = "10.0.16.0/20"
#   region                   = var.tags.region
#   network                  = google_compute_network.vpc_network.id
#   private_ip_google_access = true
# }

# Internal router
resource "google_compute_router" "router" {
  name    = "${var.tags.Name}-router"
  region  = var.tags.region
  network = google_compute_network.vpc_network.id
}

# # Nat Gateway
# resource "google_compute_router_nat" "nat" {
#   name                               = "${var.tags.Name}-nat"
#   router                             = google_compute_router.router.name
#   region                             = var.tags.region
#   nat_ip_allocate_option             = "AUTO_ONLY"
#   source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"

#   subnetwork {
#     name                    = google_compute_subnetwork.private_subnet.id
#     source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
#   }
# }

# # Public -> internet route
# resource "google_compute_route" "public_internet_route" {
#   name             = "${var.tags.Name}-public-internet-route"
#   network          = google_compute_network.vpc_network.id
#   dest_range       = "0.0.0.0/0"
#   next_hop_gateway = "default-internet-gateway"
#   priority         = 1000

#   # Apply only to the public subnet
#   tags = ["${var.tags.project}-web"]
# }

# # Web -> internet ingress firewall: Allow
# resource "google_compute_firewall" "web-internet-ingress-firewall-rule" {
#   name        = "${var.tags.Name}-web-internet-ingress-firewall-rule"
#   network     = google_compute_network.vpc_network.id
#   description = "Firewall rule allowing ingress internet access to web-tagged resources"
#   direction   = "INGRESS"
#   allow {
#     protocol = "all"
#   }
#   priority      = 1000
#   source_ranges = ["0.0.0.0/0"]
#   target_tags   = ["${var.tags.project}-web"]
# }

# # Web -> internet egress firewall: Allow
# resource "google_compute_firewall" "web-internet-egress-firewall-rule" {
#   name        = "${var.tags.Name}-web-internet-egress-firewall-rule"
#   network     = google_compute_network.vpc_network.id
#   description = "Firewall rule allowing egress internet access to web-tagged resources"
#   direction   = "EGRESS"
#   allow {
#     protocol = "all"
#   }
#   priority           = 1000
#   destination_ranges = ["0.0.0.0/0"]
#   target_tags        = ["${var.tags.project}-web"]
# }

# # data -> internet ingress firewall: Deny
# resource "google_compute_firewall" "data-internet-ingress-firewall-rule" {
#   name        = "${var.tags.Name}-data-internet-ingress-firewall-rule"
#   network     = google_compute_network.vpc_network.id
#   description = "Firewall rule allowing ingress internet access to web-tagged resources"
#   direction   = "INGRESS"
#   deny {
#     protocol = "all"
#   }
#   priority      = 1000
#   source_ranges = ["0.0.0.0/0"]
#   target_tags   = ["${var.tags.project}-data"]
# }

# # data -> internet egress firewall: Deny
# resource "google_compute_firewall" "data-internet-egress-firewall-rule" {
#   name        = "${var.tags.Name}-data-internet-egress-firewall-rule"
#   network     = google_compute_network.vpc_network.id
#   description = "Firewall rule disallowing egress internet access to data-tagged resources"
#   direction   = "EGRESS"
#   deny {
#     protocol = "all"
#   }
#   destination_ranges = ["0.0.0.0/0"]
# }

# # data -> data firewall: Allow
# resource "google_compute_firewall" "web-data-firewall-rule" {
#   name        = "${var.tags.Name}-web-data-firewall-rule"
#   network     = google_compute_network.vpc_network.id
#   description = "Firewall rule allowing access between web and data-tagged resources"
#   allow {
#     protocol = "all"
#   }
#   # source_ranges = ["10.10.10.0/22", "10.10.20.0/22"]
#   source_tags = ["${var.tags.project}-data", "${var.tags.project}-web"]
#   target_tags = ["${var.tags.project}-data", "${var.tags.project}-web"]
# }
