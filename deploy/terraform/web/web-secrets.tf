
resource "kubernetes_manifest" "web_secrets" {
  manifest = {
    "apiVersion" = "external-secrets.io/v1"
    "kind"       = "ExternalSecret"
    "metadata" = {
      "name"      = "${var.app_name}-web-auth"
      "namespace" = "${var.env}"
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "web"
        "tier"   = "frontend"
      }
    }
    "spec " = {
      "refreshInterval" = "0h00m30s"
      "secretStoreRef" = {
        "kind" = "ClusterSecretStore"
        "name" = var.vault.name
      }
      "target" = {
        "name"           = "${var.app_name}-web-auth"
        "namespace"      = "${var.env}"
        "creationPolicy" = "Owner"
      }
      "data" = [
        {
          "secretKey" = "web_auth_key"
          "remoteRef" = {
            "key"      = "secret/${azurerm_key_vault_secret.web_secrets.name}"
            "property" = "auth_key"
          }
        },
      ]
    }
  }
}
