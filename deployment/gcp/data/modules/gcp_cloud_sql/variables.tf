variable "tags" {
  type = object({
    name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
}

variable "instance_tier" { type = string }
variable "db_name" { type = string }
variable "username" { type = string }
variable "vpc_id" { type = string }
variable "project_id" { type = string }
variable "edition" { type = string }
