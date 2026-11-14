

variable "app_name" {
  type        = string
  description = "Name of app"
}

variable "root_name" {
  type        = string
  description = "Name of app"
}

variable "env" {
  type        = string
  description = "Env of app"
}

variable "dns_name" {
  type        = string
  description = "Name for app public DNS"
}

variable "tls_secret" {
  type        = string
  description = "Name for app TLS secret"
}

variable "image_url" {
  type        = string
  description = "Name for app image_url"
}

variable "domain_prefix" {
  type        = string
  description = "domain_prefix for app"
}

variable "gateway_name" {
  type        = string
  description = "gateway_name for app"
}

variable "vault" {
  type = object({
    id   = string
    name = string
  })
  description = "vault for app"
}

variable "app_secrets" {
  type = object({
    auth_domain = string
    auth_key    = string
  })
  description = "App secrets"
}

variable "tags" {
  type = object({
    root_name   = string
    app_name    = string
    controller  = string
    location    = string
    env         = string
    res_purpose = string
    }
  )
}
