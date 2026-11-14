
resource "kubernetes_config_map_v1" "web_config_map" {
  metadata {
    name      = "${var.app_name}-web-configmap"
    namespace = var.env
    labels = {
      app    = var.app_name
      env    = var.env
      target = "web"
      tier   = "frontend"
    }
  }

  data = {
    LOG_LEVEL = "INFO"
    ENV       = var.env
    APP_NAME  = var.app_name
    API_URL   = "${var.app_name}-api-svc.${var.env}.svc.local"
    DEBUG     = "False"
  }
}
