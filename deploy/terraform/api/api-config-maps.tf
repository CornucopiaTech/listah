
resource "kubernetes_config_map_v1" "api_config_map" {
  metadata {
    name      = "${var.app_name}-api-configmap"
    namespace = var.env
    labels = {
      app    = var.app_name
      env    = var.env
      target = "api"
      tier   = "backend"
    }
  }

  data = {
    LOG_LEVEL                   = "INFO"
    ENV                         = var.env
    PORT                        = "80"
    APP_PORT                    = "80"
    APP_NAME                    = var.app_name
    ALLOWED_ORIGINS             = "1,2"
    DATABASE_DB                 = "app"
    DATABASE_HOST               = "${var.app_name}-pgdb-cluster-rw.${var.env}.svc.cluster.local"
    DATABASE_PORT               = "5432"
    DATABASE_USE_TLS            = "false"
    OTEL_EXPORTER_OTLP_ENDPOINT = "DEBUG"
    OLTP_EXPORTER_TYPE          = "otlp"
    METRIC_FREQ_SEC             = "60"
    TRACE_FREQ_SEC              = "1"
  }
}
