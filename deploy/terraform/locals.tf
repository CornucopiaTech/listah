
locals {
  default_tags = {
    root_name   = "${var.root_name}"
    app_name    = "${var.app_name}"
    controller  = "opentofu-via-github-actions"
    environment = var.environment
    location    = var.location
  }
}
