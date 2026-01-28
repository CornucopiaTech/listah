variable "tags" {
  type = object({
    name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
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
variable "db_host" {
  type      = string
  sensitive = true
}
variable "db_dns_name" {
  type      = string
  sensitive = true
}
variable "db_private_ip_address" {
  type      = string
  sensitive = true
}
variable "vpc_id" { type = string }
variable "subnet_id" { type = string }
variable "project_id" { type = string }
variable "image_tag" { type = string }
