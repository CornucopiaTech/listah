

# locals {
#   dns_cname_lists = split(",", var.cname_list_value)
# }

# resource "azurerm_dns_zone" "public_dns_zone" {
#   name                = "${local.default_tags.root_name}.com"
#   resource_group_name = azurerm_resource_group.app_rg.name
#   tags = {
#     for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app public dns zone" :
#     try(azurerm_resource_group.app_rg.tags[k], null)
#   }
# }

# resource "azurerm_dns_a_record" "app_a_record" {
#   name                = "${local.default_tags.root_name}-dns-a-record${local.default_tags.environment}"
#   zone_name           = azurerm_dns_zone.public_dns_zone.name
#   resource_group_name = azurerm_resource_group.app_rg.name
#   ttl                 = 300
#   target_resource_id  = azurerm_public_ip.app_lb_pip.id
#   tags = {
#     for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app public dns zone A record" :
#     try(azurerm_resource_group.app_rg.tags[k], null)
#   }
# }


# resource "azurerm_dns_cname_record" "cname_records" {
#   for_each = toset(local.dns_cname_lists)

#   name                = "${local.default_tags.root_name}-dns-${replace(each.key, ".", "-")}-cname-record${local.default_tags.environment}"
#   zone_name           = azurerm_dns_zone.public_dns_zone.name
#   resource_group_name = azurerm_resource_group.app_rg.name
#   ttl                 = 300
#   record              = "${each.key}.${azurerm_dns_zone.public_dns_zone.name}"
#   tags = {
#     for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app public dns zone CNAME record" :
#     try(azurerm_resource_group.app_rg.tags[k], null)
#   }
# }
