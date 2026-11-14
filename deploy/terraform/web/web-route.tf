
resource "kubernetes_manifest" "web_sub_route" {
  manifest = {
    "webVersion" = "gateway.networking.k8s.io/v1"
    "kind"       = "HTTPRoute"
    "metadata" = {
      "name"      = "${var.app_name}-web-sub-http-route"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
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
        "web.${var.domain_prefix}${var.app_name}.${var.dns_name}"
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
              "name" = "${var.app_name}-web-svc"
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

resource "kubernetes_manifest" "web_path_route" {
  manifest = {
    "webVersion" = "gateway.networking.k8s.io/v1"
    "kind"       = "HTTPRoute"
    "metadata" = {
      "name"      = "${var.app_name}-web-path-http-route"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
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
                "value" = "/web"
              }
            }
          ]
          "backendRefs" = [
            {
              "name" = "${var.app_name}-web-svc"
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

resource "kubernetes_manifest" "web_root_route" {
  manifest = {
    "webVersion" = "gateway.networking.k8s.io/v1"
    "kind"       = "HTTPRoute"
    "metadata" = {
      "name"      = "${var.app_name}-web-root-http-route"
      "namespace" = var.env
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
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
                "value" = "/"
              }
            }
          ]
          "backendRefs" = [
            {
              "name" = "${var.app_name}-web-svc"
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
