
# DB Super user credentials
resource "random_string" "db_superuser_password" {
  length  = 30
  special = false
  numeric = true
  upper   = true
}
resource "random_string" "db_appuser_password" {
  length  = 30
  special = false
  numeric = true
  upper   = true
}
resource "random_string" "db_ro_role_password" {
  length  = 30
  special = false
  numeric = true
  upper   = true
}
resource "random_string" "db_rw_role_password" {
  length  = 30
  special = false
  numeric = true
  upper   = true
}
resource "random_string" "db_admin_role_password" {
  length  = 30
  special = false
  numeric = true
  upper   = true
}
resource "azurerm_key_vault_secret" "pgdb" {
  name = "${local.default_tags.app_name}-pgdb-${local.default_tags.environment}"
  value = jsonencode({
    superuser_username = "postgres"
    superuser_password = random_string.db_superuser_password.result

    appuser_username = "app"
    appuser_password = random_string.db_appuser_password.result

    ro_role_username = "${local.default_tags.app_name}-pgdb-ro-role"
    ro_role_password = random_string.db_ro_role_password.result

    rw_role_username = "${local.default_tags.app_name}-pgdb-rw-role"
    rw_role_password = random_string.db_rw_role_password.result

    admin_role_username = "${local.default_tags.app_name}-pgdb-admin-role"
    admin_role_password = random_string.db_admin_role_password.result
  })

  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app db credentials" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}



# API auth key
resource "azurerm_key_vault_secret" "app_auth_secrets_api" {
  name = "${local.default_tags.app_name}-api-auth-secrets-${local.default_tags.environment}"
  value = jsonencode({
    domain       = var.app_auth_domain
    auth_api_key = var.app_auth_api_key
    }
  )
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app api auth secrets" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}


# Web auth key
resource "azurerm_key_vault_secret" "app_auth_secrets_web" {
  name = "${local.default_tags.app_name}-web-auth-secrets-${local.default_tags.environment}"
  value = jsonencode({
    auth_web_key = var.app_auth_web_key
    }
  )
  key_vault_id = azurerm_key_vault.app_vault.id
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "app web auth secrets" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
