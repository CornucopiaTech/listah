variable "state_management_bucket_name" {
  type        = string
  description = "Bucket where state files are maintained"
}

variable "state_management_prefix" {
  type        = string
  description = "Prefix within bucket where state files are maintained"
}
variable "gcp_project_id" {
  type        = string
  description = "Google Project Id that owns/hosts the resources being deployed"
  sensitive   = true
}
variable "gcp_region" {
  type        = string
  description = "GCP Region used in deployment"
}



variable "environment" {
  type        = string
  description = "Deployment environment. dev, test, or prod"
  validation {
    condition     = var.environment == "dev" || var.environment == "test" || var.environment == "prod"
    error_message = "Unknown deployment environment.."
  }
}

variable "project" {
  type        = string
  description = "Project name"
}

variable "image_tag" { type = string }
