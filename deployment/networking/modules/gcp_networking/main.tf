
resource "google_compute_network" "vpc_network" {
  project                 = var.gcp_project_id
  name                    = "${var.tags.Name}-vpc-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "private_subnet" {
  name                     = "${var.tags.Name}-private-subnet"
  ip_cidr_range            = "10.10.10.0/22"
  region                   = var.tags.region
  network                  = google_compute_network.vpc_network.id
  private_ip_google_access = true
}

resource "google_compute_subnetwork" "public_subnet" {
  name                     = "${var.tags.Name}-public-subnet"
  ip_cidr_range            = "10.10.20.0/22"
  region                   = var.tags.region
  network                  = google_compute_network.vpc_network.id
  private_ip_google_access = true
}

# Internal router
resource "google_compute_router" "router" {
  name    = "${var.tags.Name}-router"
  region  = var.tags.region
  network = google_compute_network.vpc_network.id
}

# Nat Gateway
resource "google_compute_router_nat" "nat" {
  name                               = "${var.tags.Name}-nat"
  router                             = google_compute_router.router.name
  region                             = var.tags.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"

  subnetwork {
    name                    = google_compute_subnetwork.private_subnet.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }
}

# Public -> internet route
resource "google_compute_route" "public_internet_route" {
  name             = "${var.tags.Name}-public-internet-route"
  network          = google_compute_network.vpc_network.id
  dest_range       = "0.0.0.0/0"
  next_hop_gateway = "default-internet-gateway"
  priority         = 1000

  # Apply only to the public subnet
  tags = ["${var.tags.project}-web"]
}

# Web -> internet ingress firewall: Allow
resource "google_compute_firewall" "web-internet-ingress-firewall-rule" {
  name        = "${var.tags.Name}-web-internet-ingress-firewall-rule"
  network     = google_compute_network.vpc_network.id
  description = "Firewall rule allowing ingress internet access to web-tagged resources"
  direction   = "INGRESS"
  allow {
    protocol = "all"
    ports    = ["0-65535"]
  }
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["${var.tags.project}-web"]
}

# Web -> internet egress firewall: Allow
resource "google_compute_firewall" "web-internet-egress-firewall-rule" {
  name        = "${var.tags.Name}-web-internet-egress-firewall-rule"
  network     = google_compute_network.vpc_network.id
  description = "Firewall rule allowing egress internet access to web-tagged resources"
  direction   = "EGRESS"
  allow {
    protocol = "all"
    ports    = ["0-65535"]
  }
  priority           = 1000
  destination_ranges = ["0.0.0.0/0"]
  target_tags        = ["${var.tags.project}-web"]
}

# data -> internet ingress firewall: Deny
resource "google_compute_firewall" "data-internet-ingress-firewall-rule" {
  name        = "${var.tags.Name}-data-internet-ingress-firewall-rule"
  network     = google_compute_network.vpc_network.id
  description = "Firewall rule allowing ingress internet access to web-tagged resources"
  direction   = "INGRESS"
  deny {
    protocol = "all"
    ports    = ["0-65535"]
  }
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["${var.tags.project}-data"]
}

# data -> internet egress firewall: Deny
resource "google_compute_firewall" "data-internet-egress-firewall-rule" {
  name        = "${var.tags.Name}-data-internet-egress-firewall-rule"
  network     = google_compute_network.vpc_network.id
  description = "Firewall rule disallowing egress internet access to data-tagged resources"
  direction   = "EGRESS"
  deny {
    protocol = "all"
    ports    = ["0-65535"]
  }
  destination_ranges = ["0.0.0.0/0"]
}

# data -> data firewall: Allow
resource "google_compute_firewall" "web-data-firewall-rule" {
  name        = "${var.tags.Name}-web-data-firewall-rule"
  network     = google_compute_network.vpc_network.id
  description = "Firewall rule allowing access between web and data-tagged resources"
  allow {
    protocol = "all"
    ports    = ["0-65535"]
  }
  # source_ranges = ["10.10.10.0/22", "10.10.20.0/22"]
  source_tags = ["${var.tags.project}-data", "${var.tags.project}-web"]
  target_tags   = ["${var.tags.project}-data", "${var.tags.project}-web"]
}
