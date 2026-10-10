

locals {
  app_roles = [
    "Azure Kubernetes Service Cluster Admin Role",
    "Azure Kubernetes Service Contributor Role",
    "Azure Kubernetes Service RBAC Writer",
    "Container Registry Repository Reader",
    "Key Vault Administrator",
    "Key Vault Certificates Officer",
    "Key Vault Contributor",
    "Key Vault Crypto Officer",
    "Key Vault Crypto User",
    "Key Vault Reader",
    "Key Vault Secrets User",
    "Key Vault Secrets Officer",
    "Log Analytics Contributor",
    "Managed Identity Operator",
    "Monitoring Contributor",
    "Network Contributor",
    "Storage Blob Data Contributor",
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


locals {
  k8_app_namespaces = [
    local.default_tags.app_name,
  ]
}

resource "azurerm_federated_identity_credential" "k8_kubelet_federated_credentials" {
  for_each = toset(local.k8_app_namespaces)

  name                      = "${local.default_tags.app_name}-${each.key}-fed-cred-${local.default_tags.environment}-${local.default_tags.location}"
  audience                  = ["api://AzureADTokenExchange"]
  issuer                    = data.azurerm_kubernetes_cluster.k8_cluster.oidc_issuer_url
  user_assigned_identity_id = azurerm_user_assigned_identity.app_identity.id
  subject                   = "system:serviceaccount:${var.k8_namespace}:${var.k8_service_account_name}"
}
