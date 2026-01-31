

variable "aws_account_id" {
  type        = string
  description = "AWS Account Id that owns/hosts the resources being deployed"
  sensitive   = true
}

variable "aws_region" {
  type        = string
  description = "AWS Region used in deployment"
}

variable "state_management_bucket_name" {
  type        = string
  description = "Bucket where state files are maintained"
}

variable "state_management_prefix" {
  type        = string
  description = "Prefix within bucket where state files are maintained"
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

variable "db_username" {
  type      = string
  sensitive = true
}
variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_name" {
  type      = string
  sensitive = true
}
variable "image_tag" { type = string }
