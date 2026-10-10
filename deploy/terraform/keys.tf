
resource "random_string" "db_user_username" {
  length  = 10
  special = false
  numeric = false
  upper   = false
}

resource "random_string" "db_superuser_username" {
  length  = 10
  special = false
  numeric = false
  upper   = false
}

resource "random_string" "db_user_password" {
  length  = 40
  special = false
  numeric = true
  upper   = true
}


resource "random_string" "db_superuser_password" {
  length  = 40
  special = false
  numeric = true
  upper   = true
}



resource "azurerm_key_vault_secret" "db_user_username" {
  name         = "${local.default_tags.app_name}-pgdb-username-${local.default_tags.environment}"
  value        = random_string.db_user_username.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db user username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}


resource "azurerm_key_vault_secret" "db_user_password" {
  name         = "${local.default_tags.app_name}-pgdb-password-${local.default_tags.environment}"
  value        = random_string.db_user_password.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db user password" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}


resource "azurerm_key_vault_secret" "db_superuser_username" {
  name         = "${local.default_tags.app_name}-pgdb-superuser-username-${local.default_tags.environment}"
  value        = random_string.db_superuser_username.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db superuser username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}


resource "azurerm_key_vault_secret" "db_superuser_password" {
  name         = "${local.default_tags.app_name}-pgdb-superuser-password-${local.default_tags.environment}"
  value        = random_string.db_superuser_password.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db superuser password" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
