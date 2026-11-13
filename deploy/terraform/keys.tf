



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

# PGDB Secrets
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



# API secrets
resource "azurerm_key_vault_secret" "api_secrets" {
  for_each = tomap(local.api_secrets)

  name         = "${local.default_tags.app_name}-${each.key}-api-secrets-${local.default_tags.location}"
  value        = jsonencode(each.value)
  key_vault_id = data.azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(keys(data.azurerm_resource_group.app_rg.tags)) :
    k =>
    k == "res_purpose" ? "api secrets" :
    k == "env" ? each.key :
    try(data.azurerm_resource_group.app_rg.tags[k], null)
  }
}

# Web secrets
resource "azurerm_key_vault_secret" "web_secrets" {
  for_each = tomap(local.web_secrets)

  name         = "${local.default_tags.app_name}-${each.key}-web-secrets-${local.default_tags.location}"
  value        = jsonencode(each.value)
  key_vault_id = data.azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(keys(data.azurerm_resource_group.app_rg.tags)) :
    k =>
    k == "res_purpose" ? "web secrets" :
    k == "env" ? each.key :
    try(data.azurerm_resource_group.app_rg.tags[k], null)
  }
}
