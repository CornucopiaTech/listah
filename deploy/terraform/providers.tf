
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "5.8.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.4"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.9"
    }
  }
}
provider "azurerm" {
  # Configuration options
  features {
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
  subscription_id = var.subscription_id
}


provider "helm" {
  kubernetes = {
    host                   = data.azurerm_kubernetes_cluster.k8_cluster.kube_config.0.host
    cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.k8_cluster.kube_config[0].cluster_ca_certificate)

    exec = {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "kubelogin"
      args = [
        "get-token",
        "--login", "azurecli",
        "--environment", "AzurePublicCloud",
        "--server-id", "6dae42f8-4368-4678-94ff-3960e28e3630", # AKS AAD server app ID (constant)
        "--tenant-id", data.azurerm_subscription.current.tenant_id,
      ]
    }
  }
}
provider "kubernetes" {
  host                   = data.azurerm_kubernetes_cluster.k8_cluster.kube_config.0.host
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.k8_cluster.kube_config[0].cluster_ca_certificate)

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "kubelogin"
    args = [
      "get-token",
      "--login", "azurecli",
      "--environment", "AzurePublicCloud",
      "--server-id", "6dae42f8-4368-4678-94ff-3960e28e3630", # AKS AAD server app ID (constant)
      "--tenant-id", data.azurerm_subscription.current.tenant_id,
    ]
  }
}
data "azurerm_subscription" "current" {}
data "azurerm_client_config" "current" {}
