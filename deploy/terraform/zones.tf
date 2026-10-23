



data "azurerm_dns_zone" "public_dns_zone" {
  name                = var.app_dns_name
  resource_group_name = var.app_dns_rg
}



# resource "azurerm_dns_a_record" "app_a_record" {
#   name                = "${local.default_tags.root_name}-dns-a-record${local.default_tags.environment}"
#   zone_name           = data.azurerm_dns_zone.public_dns_zone.name
#   resource_group_name = data.azurerm_dns_zone.public_dns_zone.resource_group_name
#   ttl                 = 300
#   target_resource_id  = azurerm_public_ip.app_lb_pip.id
#   tags = {
#     for k in sort(concat(keys(data.azurerm_dns_zone.public_dns_zone.resource_group_name.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app public dns zone A record" :
#     try(data.azurerm_dns_zone.public_dns_zone.resource_group_name.tags[k], null)
#   }
# }


# resource "azurerm_dns_cname_record" "cname_records" {
#   for_each = toset([
#     local.default_tags.app_name,
#     "www.${local.default_tags.app_name}"
#   ])

#   name      = "${local.default_tags.root_name}-dns-${replace(each.key, ".", "-")}-cname-record${local.default_tags.environment}"
#   zone_name = data.azurerm_dns_zone.public_dns_zone.name
#   # The Cname record must be in the same resource group as the zone.
#   resource_group_name = data.azurerm_dns_zone.public_dns_zone.resource_group_name
#   ttl                 = 300
#   record              = "${each.key}.${data.azurerm_dns_zone.public_dns_zone.name}"
#   tags = {
#     for k in sort(concat(keys(data.azurerm_dns_zone.public_dns_zone.resource_group_name.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app public dns zone CNAME record" :
#     try(data.azurerm_dns_zone.public_dns_zone.resource_group_name.tags[k], null)
#   }
# }
