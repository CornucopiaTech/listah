output "web_urls" {
  value       = google_cloud_run_v2_service.app.urls
  description = "Urls serving traffic for the app service"
}
