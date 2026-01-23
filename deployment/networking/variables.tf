
variable "GCP_PROJECT_ID" {
  type        = string
  description = "Google Project Id that owns/hosts the resources being deployed"
  sensitive = true
}

variable "AWS_ACCOUNT_ID" {
  type        = string
  description = "AWS Account Id that owns/hosts the resources being deployed"
  sensitive = true
}

variable "AWS_REGION" {
  type        = string
  description = "AWS Region used in deployment"
}

variable "GCP_REGION" {
  type        = string
  description = "GCP Region used in deployment"
}

variable "STATE_MANAGEMENT_BUCKET_NAME" {
  type        = string
  description = "Bucket where state files are maintained"
}

variable "STATE_MANAGEMENT_PREFIX" {
  type        = string
  description = "Prefix within bucket where state files are maintained"
}

variable "ENVIRONMENT" {
  type        = string
  description = "Deployment environment. dev, test, or prod"
  sensitive = true
  validation {
    condition     = var.ENVIRONMENT == "dev" ||  var.ENVIRONMENT == "test" || var.ENVIRONMENT == "prod"
    error_message = "Unknown deployment environment.."
  }
}
