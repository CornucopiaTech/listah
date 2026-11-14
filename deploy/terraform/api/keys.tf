



# API secrets
resource "azurerm_key_vault_secret" "api_secrets" {
  name         = "${var.tags.app_name}-${var.env}-api-secrets-${var.tags.location}"
  value        = jsonencode(var.app_secrets)
  key_vault_id = var.vault.id
  tags = {
    for k in sort(keys(var.tags)) :
    k =>
    k == "res_purpose" ? "api secrets" :
    k == "env" ? var.env :
    try(var.tags[k], null)
  }
}
