
resource "kubernetes_config_map_v1" "api_config_map" {
  for_each = toset(local.deploy_envs)

  metadata {
    name      = "${var.app_name}-api-configmap"
    namespace = each.key
    labels = {
      app    = var.app_name
      env    = each.key
      target = "api"
      tier   = "backend"
    }
  }

  data = {
    LOG_LEVEL       = "INFO"
    ENV             = each.key
    PORT            = "80"
    APP_PORT        = "80"
    APP_NAME        = var.app_name
    ALLOWED_ORIGINS = "1,2"
    # DATABASE_DB                 = "${var.app_name}-pgdb-instance"
    DATABASE_DB                 = "${var.app_name}-pgdb-instance"
    DATABASE_HOST               = "${var.app_name}-pgdb-cluster-rw.${each.key}.svc.cluster.local"
    DATABASE_PORT               = "5432"
    DATABASE_USE_TLS            = "false"
    OTEL_EXPORTER_OTLP_ENDPOINT = "DEBUG"
    OLTP_EXPORTER_TYPE          = "otlp"
    METRIC_FREQ_SEC             = "60"
    TRACE_FREQ_SEC              = "1"
  }

  # binary_data = {
  #   "my_payload.bin" = "${filebase64("${path.module}/my_payload.bin")}"
  # }
}

resource "kubernetes_config_map_v1" "web_config_map" {
  for_each = toset(local.deploy_envs)

  metadata {
    name      = "${var.app_name}-web-configmap"
    namespace = each.key
    labels = {
      app    = var.app_name
      env    = each.key
      target = "web"
      tier   = "frontend"
    }
  }

  data = {
    LOG_LEVEL = "INFO"
    ENV       = each.key
    APP_NAME  = var.app_name
    API_URL   = "${var.app_name}-api-svc.${each.key}.svc.local"
    DEBUG     = "False"
  }

  # binary_data = {
  #   "my_payload.bin" = "${filebase64("${path.module}/my_payload.bin")}"
  # }
}
