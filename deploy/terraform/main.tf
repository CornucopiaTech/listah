

# ToDo: Separate image build for dev and prod
# ToDo: Make image url different for dev and prod
module "k8_pgdb_app" {
  for_each = toset(local.deploy_envs)

  source        = "./pgdb"
  app_name      = var.app_name
  env           = each.key
  image_url     = local.pgdb_image_url[each.key]
  root_name     = var.root_name
  tags          = local.default_tags
  storage_class = var.storage_class
  vault = {
    id   = data.azurerm_key_vault.app_vault.id
    name = data.azurerm_key_vault.app_vault.name
  }
}

# module "k8_api_app" {
#   for_each = toset(local.deploy_envs)

#   source        = "./api"
#   app_name      = var.app_name
#   env           = each.key
#   dns_name      = var.app_dns_name
#   tls_secret    = "${var.app_name}-${each.key}-tls"
#   image_url     = local.api_image_url[each.key]
#   domain_prefix = local.domain_prefix[each.key]
#   gateway_name  = var.gateway_name
#   root_name     = var.root_name
#   tags          = data.azurerm_resource_group.app_rg.tags
#   app_secrets   = local.api_secrets[each.key]
#   vault = {
#     id   = data.azurerm_key_vault.app_vault.id
#     name = data.azurerm_key_vault.app_vault.name
#   }
# }


# # ToDo: Make image url different for dev and prod
# module "k8_web_app" {
#   for_each = toset(local.deploy_envs)

#   source        = "./web"
#   app_name      = var.app_name
#   env           = each.key
#   dns_name      = var.app_dns_name
#   tls_secret    = "${var.app_name}-${each.key}-tls"
#   image_url     = local.web_image_url[each.key]
#   domain_prefix = local.domain_prefix[each.key]
#   gateway_name  = var.gateway_name
#   root_name     = var.root_name
#   tags          = data.azurerm_resource_group.app_rg.tags
#   app_secrets   = local.web_secrets[each.key]
#   vault = {
#     id   = data.azurerm_key_vault.app_vault.id
#     name = data.azurerm_key_vault.app_vault.name
#   }
# }
