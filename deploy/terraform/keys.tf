
locals {
  db_usernames_map = {
    superuser  = "postgres"
    appuser    = "app"
    ro_role    = "ro-role"
    rw_role    = "rw-role"
    admin_role = "admin-role"
  }

  deploy_envs = ["dev", "prod"]

  web_auth = {
    dev  = ""
    prod = ""
  }
  api_auth = {
    dev  = ""
    prod = ""
  }
}


# DB Super user credentials
resource "random_string" "dev_db_passwords" {
  for_each = toset(keys(local.db_usernames_map))

  length  = 30
  special = false
  numeric = true
  upper   = true
}
resource "random_string" "prod_db_passwords" {
  for_each = toset(keys(local.db_usernames_map))

  length  = 30
  special = false
  numeric = true
  upper   = true
}

locals {
  dev_db_creds_list = [
    for k in keys(local.db_usernames_map) :
    {
      "${k}_username" = try(local.db_usernames_map[k], null)
      "${k}_password" = try(random_string.dev_db_passwords[k].result, null)
    }
  ]
  prod_db_creds_list = [
    for k in keys(local.db_usernames_map) :
    {
      "${k}_username" = try(local.db_usernames_map[k], null)
      "${k}_password" = try(random_string.prod_db_passwords[k].result, null)
    }
  ]

  pgdb_creds = {
    dev  = merge(local.dev_db_creds_list...)
    prod = merge(local.prod_db_creds_list...)
  }

}

resource "azurerm_key_vault_secret" "pgdb" {
  for_each = tomap(local.pgdb_creds)

  name         = "${local.default_tags.app_name}-${each.key}-pgdb-${local.default_tags.location}"
  value        = jsonencode(each.value)
  key_vault_id = data.azurerm_key_vault.app_vault.id

  tags = {
    for k in sort(keys(data.azurerm_resource_group.app_rg.tags)) :
    k =>
    k == "res_purpose" ? "app db credentials" :
    k == "env" ? each.key :
    try(data.azurerm_resource_group.app_rg.tags[k], null)
  }
}



# # API auth key
# resource "azurerm_key_vault_secret" "app_auth_secrets_api" {
#   name = "${local.default_tags.app_name}-api-auth-secrets-${local.default_tags.environment}"
#   value = jsonencode({
#     domain       = var.app_auth_domain
#     auth_api_key = var.app_auth_api_key
#     }
#   )
#   key_vault_id = azurerm_key_vault.app_vault.id
#   tags = {
#     for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app api auth secrets" :
#     try(azurerm_resource_group.app_rg.tags[k], null)
#   }
# }


# # Web auth key
# resource "azurerm_key_vault_secret" "app_auth_secrets_web" {
#   name = "${local.default_tags.app_name}-web-auth-secrets-${local.default_tags.environment}"
#   value = jsonencode({
#     auth_web_key = var.app_auth_web_key
#     }
#   )
#   key_vault_id = azurerm_key_vault.app_vault.id
#   tags = {
#     for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
#     k =>
#     k == "res_purpose" ? "app web auth secrets" :
#     try(azurerm_resource_group.app_rg.tags[k], null)
#   }
# }
