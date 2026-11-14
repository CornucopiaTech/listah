



# DB Super user credentials
resource "random_string" "db_passwords" {
  for_each = toset(keys(local.db_usernames_map))

  length  = 30
  special = false
  numeric = true
  upper   = true
}
locals {
  db_creds_list = [
    for k in keys(local.db_usernames_map) :
    {
      "${k}_username" = try(local.db_usernames_map[k], null)
      "${k}_password" = try(random_string.db_passwords[k].result, null)
    }
  ]

  pgdb_creds = merge(local.db_creds_list...)

}

# PGDB Secrets
resource "azurerm_key_vault_secret" "pgdb" {
  name         = "${var.tags.app_name}-${var.env}-pgdb-${var.tags.location}"
  value        = jsonencode(local.pgdb_creds)
  key_vault_id = var.vault.id

  tags = {
    for k in sort(keys(var.tags)) :
    k =>
    k == "res_purpose" ? "app db credentials" :
    k == "env" ? var.env :
    try(var.tags[k], null)
  }
}
