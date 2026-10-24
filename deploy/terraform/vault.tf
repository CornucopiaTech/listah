
resource "azurerm_key_vault" "app_vault" {
  name                            = "${local.default_tags.app_name}-vault-${local.default_tags.environment}"
  resource_group_name             = azurerm_resource_group.app_rg.name
  location                        = azurerm_resource_group.app_rg.location
  rbac_authorization_enabled      = true
  sku_name                        = "standard"
  tenant_id                       = data.azurerm_subscription.current.tenant_id
  enabled_for_deployment          = true
  enabled_for_disk_encryption     = true
  enabled_for_template_deployment = true
  public_network_access_enabled   = true
  soft_delete_retention_days      = 7
  network_acls {
    bypass         = "AzureServices"
    default_action = "Allow"
    virtual_network_subnet_ids = [
      data.azurerm_subnet.app_subnet.id,
    ]
  }
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "${local.default_tags.app_name} key vault" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
