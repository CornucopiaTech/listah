
variable "gcp_project_id" {
  type        = string
  description = "Google Project Id that owns/hosts the resources being deployed"
  sensitive   = true
}

variable "tags" {
  type = object({
    name        = string
    project     = string
    environment = string
    region      = string
    controller  = string
  })
}
