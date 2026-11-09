
locals {
  default_tags = {
    root_name   = "${var.root_name}"
    app_name    = "${var.app_name}"
    controller  = "terraform-via-github-actions"
    location    = var.location
    env         = null
    res_purpose = null
  }
}
