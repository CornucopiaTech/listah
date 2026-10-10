
output "app_identity" {
  value       = azurerm_user_assigned_identity.app_identity
  description = "app identity"
  sensitive   = true
}



output "app_vault" {
  value       = azurerm_key_vault.app_vault
  description = "app vault"
  sensitive   = true
}
