

data "azurerm_resource_group" "app_rg" {
  name = var.root_rg
}

data "azurerm_key_vault" "app_vault" {
  name                = var.app_vault
  resource_group_name = var.root_rg
}

data "azurerm_container_registry" "app_container_registry" {
  name                = var.container_registry_name
  resource_group_name = var.root_rg
}

data "azurerm_kubernetes_cluster" "k8_cluster" {
  name                = var.k8_cluster_name
  resource_group_name = var.root_rg
}

data "azurerm_user_assigned_identity" "k8_control_plane_identity" {
  name                = var.k8_control_plane_identity_name
  resource_group_name = var.root_rg
}


data "azurerm_dns_zone" "public_dns_zone" {
  name                = var.app_dns_name
  resource_group_name = var.root_rg
}




# data "azurerm_virtual_network" "app_network" {
#   name                = var.vnet_name
#   resource_group_name = var.vnet_rg
# }

# data "azurerm_subnet" "app_subnet" {
#   name                 = var.subnet_name
#   virtual_network_name = data.azurerm_virtual_network.app_network.name
#   resource_group_name  = data.azurerm_virtual_network.app_network.resource_group_name
# }
