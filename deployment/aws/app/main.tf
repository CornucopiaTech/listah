data "terraform_remote_state" "networking" {
  backend = "gcs"

  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/networking/"
  }
}

data "terraform_remote_state" "data" {
  backend = "gcs"

  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/data/"
  }
}
