output "api_urls" {
  value       = module.api_service.api_urls
  description = "Urls serving traffic for the app service"
}
