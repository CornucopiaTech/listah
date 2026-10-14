


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

variable "k8_cluster_name" {
  type        = string
  description = "Name of K8 cluster"
}

variable "k8_cluster_rg" {
  type        = string
  description = "Resource group name of K8 cluster"
}

variable "k8_service_account_name" {
  type        = string
  description = "Name of K8 cluster service account that pods will use to interact with cloud services"
}
variable "k8_namespace" {
  type        = string
  description = "Namespace for this app in shared K8 cluster"
}


variable "vnet_name" {
  type        = string
  description = "Name of Virtual network"
}

variable "vnet_rg" {
  type        = string
  description = "Name of vnet resource group"
}

variable "subnet_name" {
  type        = string
  description = "Name of subnet"
}

variable "container_registry_name" {
  type        = string
  description = "Name of container registry"
}

variable "container_registry_rg" {
  type        = string
  description = "Name of container registry resource group"
}


variable "app_auth_domain" {
  sensitive   = true
  type        = string
  description = "Auth domain for app"
}

variable "app_auth_api_key" {
  sensitive   = true
  type        = string
  description = "Auth key for app"
}
