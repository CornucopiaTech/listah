
resource "kubernetes_manifest" "api_secrets" {
  manifest = {
    "apiVersion" = "external-secrets.io/v1"
    "kind"       = "ExternalSecret"
    "metadata" = {
      "name"      = "${var.app_name}-api-auth"
      "namespace" = "${var.env}"
      "labels" = {
        "app"    = "${var.app_name}"
        "env"    = "${var.env}"
        "target" = "api"
        "tier"   = "backend"
      }
    }
    "spec " = {
      "refreshInterval" = "0h30m00s"
      "secretStoreRef" = {
        "kind" = "ClusterSecretStore"
        "name" = var.vault.name
      }
      "target" = {
        "name"           = "${var.app_name}-api-auth"
        "namespace"      = "${var.env}"
        "creationPolicy" = "Owner"
      }
      "data" = [
        {
          "secretKey" = "api_auth_key"
          "remoteRef" = {
            "key"      = "secret/${azurerm_key_vault_secret.api_secrets.name}"
            "property" = "auth_key"
          }
        },
        {
          "secretKey" = "api_auth_domain"
          "remoteRef" = {
            "key"      = "secret/${azurerm_key_vault_secret.api_secrets.name}"
            "property" = "auth_domain"
          }
        },
      ]
    }
  }
}
