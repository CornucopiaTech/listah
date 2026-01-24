variable "tags" {
  type = object({
    Name    = string
    project    = string
    environment = string
  })
}
