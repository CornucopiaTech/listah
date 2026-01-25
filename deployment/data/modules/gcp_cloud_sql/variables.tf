variable "tags" {
  type = object({
    Name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
}

variable "instance_tier" { type = string }
variable "username" { type = string }
variable "root_password" { type = string }
variable "user_password" { type = string }
variable "vpc_id" { type = string }
