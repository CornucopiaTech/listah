

locals {
  app_roles = [
    "Key Vault Certificates Officer",
    "Key Vault Contributor",
    "Key Vault Crypto Officer",
    "Key Vault Crypto User",
    "Key Vault Reader",
    "Key Vault Secrets User",
    "Key Vault Secrets Officer",
    "Storage Blob Data Contributor",
    "DNS Zone Contributor",
  ]
}


# Control Plane Identity
resource "azurerm_user_assigned_identity" "app_identity" {
  name                = "${local.default_tags.app_name}-app-id-${local.default_tags.environment}"
  resource_group_name = azurerm_resource_group.app_rg.name
  location            = local.default_tags.location
  tags = {
    for k in sort(concat(keys(azurerm_resource_group.app_rg.tags), ["res_purpose"])) :
    k =>
    k == "res_purpose" ? "${local.default_tags.app_name} app identity" :
    try(azurerm_resource_group.app_rg.tags[k], null)
  }
}
resource "azurerm_role_assignment" "app_identity" {
  for_each = toset(local.app_roles)

  scope                = azurerm_resource_group.app_rg.id
  role_definition_name = each.key
  principal_id         = azurerm_user_assigned_identity.app_identity.principal_id
}
resource "azurerm_role_assignment" "app_identity_zone" {
  scope                = data.azurerm_dns_zone.public_dns_zone.id
  role_definition_name = "DNS Zone Contributor"
  principal_id         = azurerm_user_assigned_identity.app_identity.principal_id
}


locals {
  k8_app_namespaces = [
    local.default_tags.app_name,
  ]
}

resource "azurerm_federated_identity_credential" "app_identity" {
  name                      = "${local.default_tags.app_name}-${var.k8_namespace}-fed-cred-${local.default_tags.environment}-${local.default_tags.location}"
  audience                  = ["api://AzureADTokenExchange"]
  issuer                    = data.azurerm_kubernetes_cluster.k8_cluster.oidc_issuer_url
  user_assigned_identity_id = azurerm_user_assigned_identity.app_identity.id
  subject                   = "system:serviceaccount:${var.k8_namespace}:${var.k8_service_account_name}"
}

data "azurerm_user_assigned_identity" "k8_control_plane_identity" {
  name                = var.k8_control_plane_identity_name
  resource_group_name = var.k8_control_plane_identity_rg
}


resource "azurerm_federated_identity_credential" "k8_control_plane_identity" {
  name                      = "${local.default_tags.app_name}-${var.root_name}-fed-cred-${local.default_tags.environment}-${local.default_tags.location}"
  audience                  = ["api://AzureADTokenExchange"]
  issuer                    = data.azurerm_kubernetes_cluster.k8_cluster.oidc_issuer_url
  user_assigned_identity_id = data.azurerm_user_assigned_identity.k8_control_plane_identity.id
  subject                   = "system:serviceaccount:${var.k8_namespace}:${var.k8_service_account_name}"
}
