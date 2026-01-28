variable "tags" {
  type = object({
    Name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
}

variable "allocated_storage" { type = int }
variable "instance_class" { type = string }
variable "username" { type = string }
# variable "password" { type = string }
variable "parameter_group_name" { type = string }
variable "rds_subnets" {
  type = list(string)
}
