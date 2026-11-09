

variable "app_vault" {
  type        = string
  description = "Name of Vault"
}
variable "root_rg" {
  type        = string
  description = "Resource group name of K8 cluster"
}

variable "k8_cluster_name" {
  type        = string
  description = "Name of K8 cluster"
}
variable "k8_control_plane_identity_name" {
  type        = string
  description = "Name of K8 control plane identity"
}
variable "container_registry_name" {
  type        = string
  description = "Name of container registry"
}





variable "app_auth_domain" {
  sensitive   = true
  type        = string
  description = "Auth domain for API"
}

variable "app_auth_api_key" {
  sensitive   = true
  type        = string
  description = "Auth key for API"
}
variable "app_auth_web_key" {
  sensitive   = true
  type        = string
  description = "Auth key for web"
}
