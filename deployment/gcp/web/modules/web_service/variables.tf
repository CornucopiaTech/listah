variable "tags" {
  type = object({
    name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
}

variable "api_url" { type = string }
variable "api_version" { type = string }
variable "vpc_id" { type = string }
variable "subnet_id" { type = string }
variable "project_id" { type = string }
variable "image_tag" { type = string }
variable "auth_key" { type = string }
