


resource "azurerm_key_vault_secret" "db_rw_role_username" {
  name         = "${local.default_tags.app_name}-pgdb-rw-role-username-${local.default_tags.environment}"
  value        = "${local.default_tags.app_name}-pgdb-rw-role"
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db read-write role username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
resource "random_string" "db_rw_role_password" {
  length  = 25
  special = false
  numeric = true
  upper   = true
}
resource "azurerm_key_vault_secret" "db_rw_role_password" {
  name         = "${local.default_tags.app_name}-pgdb-rw-role-password-${local.default_tags.environment}"
  value        = random_string.db_rw_role_password.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db read-write role password" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}




resource "azurerm_key_vault_secret" "db_ro_role_username" {
  name         = "${local.default_tags.app_name}-pgdb-ro-role-username-${local.default_tags.environment}"
  value        = "${local.default_tags.app_name}-pgdb-ro-role"
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db read-only role username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
resource "random_string" "db_ro_role_password" {
  length  = 25
  special = false
  numeric = true
  upper   = true
}
resource "azurerm_key_vault_secret" "db_ro_role_password" {
  name         = "${local.default_tags.app_name}-pgdb-ro-role-password-${local.default_tags.environment}"
  value        = random_string.db_ro_role_password.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db read-only role password" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}




resource "azurerm_key_vault_secret" "db_admin_role_username" {
  name         = "${local.default_tags.app_name}-pgdb-admin-role-username-${local.default_tags.environment}"
  value        = "${local.default_tags.app_name}-pgdb-admin-role"
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db admin role username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
resource "random_string" "db_admin_role_password" {
  length  = 25
  special = false
  numeric = true
  upper   = true
}
resource "azurerm_key_vault_secret" "db_admin_role_password" {
  name         = "${local.default_tags.app_name}-pgdb-admin-role-password-${local.default_tags.environment}"
  value        = random_string.db_admin_role_password.result
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db admin role password" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}




resource "azurerm_key_vault_secret" "db_user_username" {
  name = "${local.default_tags.app_name}-pgdb-username-${local.default_tags.environment}"
  # value        = random_string.db_user_username.result
  value        = "app"
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db user username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
resource "random_string" "db_user_password" {
  length  = 20
  special = false
  numeric = true
  upper   = true
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
  name = "${local.default_tags.app_name}-pgdb-superuser-username-${local.default_tags.environment}"
  # value        = random_string.db_superuser_username.result
  value        = "postgres"
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db superuser username" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
resource "random_string" "db_superuser_password" {
  length  = 20
  special = false
  numeric = true
  upper   = true
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
