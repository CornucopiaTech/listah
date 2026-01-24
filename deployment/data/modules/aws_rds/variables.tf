variable "tags" {
  type = object({
    Name        = string
    project     = string
    environment = string
    region      = string
  })
}

variable "allocated_storage" {
  type = int
}
variable "db_name" { type = string }
variable "engine" { type = string }
variable "engine_version" { type = string }
variable "instance_class" { type = string }
variable "username" { type = string }
# variable "password" { type = string }
variable "parameter_group_name" { type = string }
