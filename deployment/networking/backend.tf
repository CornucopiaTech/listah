terraform {
  backend "gcs" {
    bucket = var.STATE_MANAGEMENT_BUCKET_NAME
    prefix = "${var.STATE_MANAGEMENT_PREFIX}/networking/"
  }
}
