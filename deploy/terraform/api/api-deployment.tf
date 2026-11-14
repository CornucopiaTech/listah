
resource "kubernetes_manifest" "api_deployment" {
  manifest = {
    "apiVersion" = "apps/v1"
    "kind"       = "Deployment"
    "metadata" = {
      "name"      = "${var.app_name}-api-deployment"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "api"
        "tier"   = "backend"
      }
    }
    "spec" = {
      "replicas" = var.env == "dev" ? 1 : 2
      "selector" = {
        "matchLabels" = {
          "app"    = "${var.app_name}"
          "env"    = "${var.env}"
          "target" = "api"
          "tier"   = "backend"
        }
      }
      "template" = {
        "metadata" = {
          "labels" = {
            "app"    = "${var.app_name}"
            "env"    = "${var.env}"
            "target" = "api"
            "tier"   = "backend"
          }
        }
        "spec" = {
          "container" = [
            {
              "name"  = "${var.app_name}-api-container"
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
                    "name" = "${var.app_name}-api-configmap"
                  }
                }
              ]
              "env" = [
                {
                  "name"  = "TLS_CERT"
                  "value" = "/etc/tls/tls.crt"
                },
                {
                  "name"  = "TLS_KEY"
                  "value" = "/etc/tls/tls.key"
                },
                {
                  "name" = "DATABASE_USER"
                  "valueFrom" = {
                    "secretKeyRef" = {
                      "name" = "${var.app_name}-pgdb-rw-role"
                      "key"  = "username"
                    }
                  }
                },
                {
                  "name" = "DATABASE_PASSWORD"
                  "valueFrom" = {
                    "secretKeyRef" = {
                      "name" = "${var.app_name}-pgdb-rw-role"
                      "key"  = "password"
                    }
                  }
                },
                {
                  "name" = "AUTH_KEY"
                  "valueFrom" = {
                    "secretKeyRef" = {
                      "name" = "${var.app_name}-api-auth"
                      "key"  = "api_auth_key"
                    }
                  }
                },
                {
                  "name" = "AUTH_DOMAIN"
                  "valueFrom" = {
                    "secretKeyRef" = {
                      "name" = "${var.app_name}-api-auth"
                      "key"  = "api_auth_domain"
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
