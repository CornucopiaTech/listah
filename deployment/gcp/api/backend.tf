terraform {
  backend "gcs" {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/api/"
  }
}
