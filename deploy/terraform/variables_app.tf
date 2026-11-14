

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

variable "storage_class" {
  type        = string
  description = "Name of storage class"
}

# variable "app_tls_secret" {
#   type        = string
#   description = "TLS secret name for app"
# }

variable "gateway_name" {
  type        = string
  description = "Name for app gateway"
}

variable "app_dns_name" {
  type        = string
  description = "Name for app public DNS"
}





variable "api_dev_auth_domain" {
  sensitive   = true
  type        = string
  description = "Auth domain for API"
}
variable "api_prod_auth_domain" {
  sensitive   = true
  type        = string
  description = "Auth domain for API"
}

variable "api_dev_auth_key" {
  sensitive   = true
  type        = string
  description = "Auth key for API"
}
variable "api_prod_auth_key" {
  sensitive   = true
  type        = string
  description = "Auth key for API"
}


variable "web_dev_auth_key" {
  sensitive   = true
  type        = string
  description = "Auth key for web"
}
variable "web_prod_auth_key" {
  sensitive   = true
  type        = string
  description = "Auth key for web"
}


variable "api_dev_image_url" {
  sensitive   = true
  type        = string
  description = "Image URL for API"
}
variable "api_prod_image_url" {
  sensitive   = true
  type        = string
  description = "Image URL for API"
}

variable "web_dev_image_url" {
  sensitive   = true
  type        = string
  description = "Image URL for web"
}
variable "web_prod_image_url" {
  sensitive   = true
  type        = string
  description = "Image URL for web"
}

variable "pgdb_dev_image_url" {
  sensitive   = true
  type        = string
  description = "Image URL for pgdb"
}
variable "pgdb_prod_image_url" {
  sensitive   = true
  type        = string
  description = "Image URL for pgdb"
}
