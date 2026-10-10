
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

data "azurerm_subscription" "current" {}
data "azurerm_client_config" "current" {}
