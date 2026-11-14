
resource "kubernetes_manifest" "api_sub_route" {
  manifest = {
    "apiVersion" = "gateway.networking.k8s.io/v1"
    "kind"       = "HTTPRoute"
    "metadata" = {
      "name"      = "${var.app_name}-api-sub-http-route"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "api"
        "tier"   = "backend"
      }
    }
    "spec" = {
      "parentRefs" = [
        {
          "name"      = var.gateway_name
          "namespace" = var.root_name
        }
      ]
      "hostnames" = [
        "api.${var.domain_prefix}${var.app_name}.${var.dns_name}"
      ]
      "rules" = [
        {
          "matches" = [
            {
              "path" = {
                "type"  = "PathPrefix"
                "value" = "/"
              }
            }
          ]
          "backendRefs" = [
            {
              "name" = "${var.app_name}-api-svc"
              "port" = "80"
            }
          ]
        }
      ]
    }
    "timeouts" = {
      "create" = "20m"
      "update" = "20m"
    }
  }
}

resource "kubernetes_manifest" "api_path_route" {
  manifest = {
    "apiVersion" = "gateway.networking.k8s.io/v1"
    "kind"       = "HTTPRoute"
    "metadata" = {
      "name"      = "${var.app_name}-api-path-http-route"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "api"
        "tier"   = "backend"
      }
    }
    "spec" = {
      "parentRefs" = [
        {
          "name"      = var.gateway_name
          "namespace" = var.root_name
        }
      ]
      "hostnames" = [
        "${var.domain_prefix}${var.app_name}.${var.dns_name}"
      ]
      "rules" = [
        {
          "matches" = [
            {
              "path" = {
                "type"  = "PathPrefix"
                "value" = "/api"
              }
            }
          ]
          "backendRefs" = [
            {
              "name" = "${var.app_name}-api-svc"
              "port" = "80"
            }
          ]
        }
      ]
    }
    "timeouts" = {
      "create" = "20m"
      "update" = "20m"
    }
  }
}
