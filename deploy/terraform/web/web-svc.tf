
resource "kubernetes_manifest" "web_svc" {
  manifest = {
    "webVersion" = "apps/v1"
    "kind"       = "Service"
    "metadata" = {
      "name"      = "${var.app_name}-web-svc"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
      }
    }
    "spec" = {
      "type"     = "ClusterIP"
      "replicas" = 2
      "selector" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
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
