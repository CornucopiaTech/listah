
resource "azurerm_resource_group" "app_rg" {
  name     = "${local.default_tags.root_name}-${local.default_tags.app_name}-rg-${local.default_tags.environment}-${var.location}"
  location = var.location
  tags = {
    for k in sort(concat(keys(local.default_tags), ["rg_purpose"])) :
    k =>
    k == "rg_purpose" ? "${local.default_tags.app_name} app resources" :
    try(local.default_tags[k], null)
  }
}
