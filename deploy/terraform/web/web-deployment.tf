
resource "kubernetes_manifest" "web_deployment" {
  manifest = {
    "apiVersion" = "apps/v1"
    "kind"       = "Deployment"
    "metadata" = {
      "name"      = "${var.app_name}-web-deployment"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
      }
    }
    "spec" = {
      "replicas" = var.env == "dev" ? 1 : 2
      "selector" = {
        "matchLabels" = {
          "app"    = "${var.app_name}"
          "env"    = "${var.env}"
          "target" = "web"
          "tier"   = "frontend"
        }
      }
      "template" = {
        "metadata" = {
          "labels" = {
            "app"    = "${var.app_name}"
            "env"    = "${var.env}"
            "target" = "web"
            "tier"   = "frontend"
          }
        }
        "spec" = {
          "container" = [
            {
              "name"  = "${var.app_name}-web-container"
              "image" = var.image_url
              "ports" = [
                {
                  "name"          = "http"
                  "containerPort" = 80
                },
                {
                  "name"          = "https"
                  "containerPort" = 443
                }
              ]
              "volumeMounts" = [
                {
                  "name"      = "tls"
                  "mountPath" = "/etc/tls"
                  "readOnly"  = "true"
                }
              ]
              "envFrom" = [
                {
                  "configMapRef" = {
                    "name" = "${var.app_name}-web-configmap"
                  }
                }
              ]
              "env" = [
                {
                  "name"  = "DEBUG"
                  "value" = "False"
                },
                {
                  "name"  = "TLS_CERT"
                  "value" = "/etc/tls/tls.crt"
                },
                {
                  "name"  = "TLS_KEY"
                  "value" = "/etc/tls/tls.key"
                },
                {
                  "name" = "AUTH_KEY"
                  "valueFrom" = {
                    "secretKeyRef" = {
                      "name" = "${var.app_name}-web-auth"
                      "key"  = "web_auth_key"
                    }
                  }
                },
              ]
            }
          ]
          "volumes" = [
            {
              "name" = "tls"
              "secret" = {
                "secretName" = var.tls_secret
              }
            }
          ]
        }
      }
    }
    "timeouts" = {
      "create" = "20m"
      "update" = "20m"
    }
  }
}
