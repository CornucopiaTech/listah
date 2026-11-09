


variable "location" {
  type        = string
  description = "Region used in deployment"
}

variable "environment" {
  type        = string
  description = "Deployment environment. dev, test, or prod"
  validation {
    condition     = var.environment == "dev" || var.environment == "test" || var.environment == "prod"
    error_message = "Unknown deployment environment.."
  }
}

variable "root_name" {
  type        = string
  description = "Root/stack name defined in labels/tags"
  default     = "meristas"
}

variable "app_name" {
  type        = string
  description = "app name within root/stack defined in labels/tags"
  default     = "listah"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name"
}

variable "storage_account_name" {
  type        = string
  description = "Storage account name"
}

variable "state_management_container_name" {
  type        = string
  description = "Container where state files are maintained"
}

variable "state_management_key" {
  type        = string
  description = "Prefix within bucket/container where state files are maintained"
}

variable "subscription_id" {
  type        = string
  description = "subscription id"
  sensitive   = true
}
