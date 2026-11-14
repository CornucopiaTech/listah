

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

variable "storage_class" {
  type        = string
  description = "Storage class for app"
}


variable "image_url" {
  type        = string
  description = "Name for app image_url"
}

variable "vault" {
  type = object({
    id   = string
    name = string
  })
  description = "vault for app"
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
