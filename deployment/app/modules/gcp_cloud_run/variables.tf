variable "tags" {
  type = object({
    name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
}

variable "db_username" { type = string }
variable "db_password" { type = string }
variable "db_name" { type = string }
variable "db_host" { type = string }
variable "db_dns_name" { type = string }
variable "db_private_ip_address" { type = string }
variable "vpc_id" { type = string }
variable "project_id" { type = string }
