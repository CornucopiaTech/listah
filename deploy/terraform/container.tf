


# resource "azurerm_container_registry" "k8_acr" {
#   name                = "${local.default_tags.root_name}Acr${title(local.default_tags.environment)}${title(local.default_tags.location)}"
#   resource_group_name = azurerm_resource_group.app_rg.name
#   location            = local.default_tags.location
#   sku                 = "Basic"
#   admin_enabled       = false
#   tags = {
#     for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app container image storage" :
#     try(azurerm_resource_group.app_rg.tags[k], null)
#   }
# }
