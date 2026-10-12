
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


output "app_container_registry" {
  value = {
    id           = data.azurerm_container_registry.app_container_registry.id
    login_server = data.azurerm_container_registry.app_container_registry.login_server
    name         = data.azurerm_container_registry.app_container_registry.name
  }
}
