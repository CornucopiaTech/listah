
resource "kubernetes_manifest" "api_svc" {
  manifest = {
    "apiVersion" = "apps/v1"
    "kind"       = "Service"
    "metadata" = {
      "name"      = "${var.app_name}-api-svc"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "api"
        "tier"   = "backend"
      }
    }
    "spec" = {
      "type"     = "ClusterIP"
      "replicas" = 2
      "selector" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "api"
        "tier"   = "backend"
      }
      "ports" = [
        {
          "name"       = "http"
          "port"       = 80
          "targetPort" = "http"
        },
        {
          "name"       = "https"
          "port"       = 443
          "targetPort" = "https"
        }
      ]

    }
    "timeouts" = {
      "create" = "20m"
      "update" = "20m"
    }
  }
}
