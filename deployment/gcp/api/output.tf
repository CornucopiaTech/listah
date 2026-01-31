output "api_urls" {
  value       = module.api_service.app_urls
  description = "Urls serving traffic for the app service"
}
