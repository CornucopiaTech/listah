variable "tags" {
  type = object({
    name    = string
    project    = string
    environment = string
  })
}
