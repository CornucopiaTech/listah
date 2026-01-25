data "terraform_remote_state" "networking" {
  backend = "gcs"

  config = {
    bucket = var.state_management_bucket_name
    prefix = "${var.state_management_prefix}/networking/"
  }
}


module "gcp_cloud_sql" {
  source        = "./modules/gcp_cloud_sql"
  instance_tier = var.instance_tier
  username      = var.username
  root_password = var.root_password
  user_password = var.user_password
  vpc_id        = data.terraform_remote_state.networking.outputs.gcp_vpc_id
  project_id    = var.gcp_project_id
  edition       = var.db_edition
  tags = {
    Name        = "${var.project}-${var.environment}-${var.gcp_region}"
    project     = var.project
    environment = var.environment
    region      = var.gcp_region
    controller  = "OpenTofu via Github Actions"
  }
}
