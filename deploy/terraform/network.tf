
data "azurerm_virtual_network" "app_network" {
  name                = var.vnet_name
  resource_group_name = var.vnet_rg
}

data "azurerm_subnet" "app_subnet" {
  name                 = var.subnet_name
  virtual_network_name = data.azurerm_virtual_network.app_network.name
  resource_group_name  = data.azurerm_virtual_network.app_network.resource_group_name
}
