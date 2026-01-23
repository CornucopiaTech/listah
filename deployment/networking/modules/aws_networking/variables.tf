variable "tags" {
  type = object({
    project    = string
    environment = string
  })
}
