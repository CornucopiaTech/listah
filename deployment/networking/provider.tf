provider "google" {
  project = var.GCP_PROJECT_ID
  region  = var.GCP_REGION
}

provider "aws" {
  region = var.AWS_REGION
}
