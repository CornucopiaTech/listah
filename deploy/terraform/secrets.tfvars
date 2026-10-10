
root_name                       = "meristas"
app_name                        = "listah"
location                        = "northcentralus"
resource_group_name             = "meristas-root-res-grp"
state_management_container_name = "terraform-state-management-4805b524-78cd-49ac-b517-9c9ce68bca39"
storage_account_name            = "meristasrootstorageacct"
environment                     = "dev"
subscription_id                 = "5d5747ad-76bf-4629-8fe4-97687a2f2423"


# Hints for variable population
# k8_service_account_name = "${local.default_tags.root_name}-${local.default_tags.app_name}-sa"
# k8_namespace            = "${local.default_tags.root_name}"
k8_service_account_name = "meristas-listah-sa"
k8_namespace            = "listah"

# azurerm_resource_group.k8_user_admin_rg.name   = "${local.default_tags.root_name}-k8-user-admin-rg-${local.default_tags.environment}-${var.location}"
# k8_cluster_name                 = "${local.default_tags.root_name}-k8-cluster-${local.default_tags.environment}-${local.default_tags.location}"
# k8_cluster_rg   = azurerm_resource_group.k8_user_admin_rg.name
k8_cluster_name = "meristas-k8-cluster-dev-northcentralus"
k8_cluster_rg   = "meristas-k8-user-admin-rg-dev-northcentralus"

# vnet_name = "${local.default_tags.root_name}-vnet-${local.default_tags.environment}-${local.default_tags.location}"
# vnet_rg = azurerm_resource_group.k8_user_admin_rg.name
vnet_name = "meristas-vnet-dev-northcentralus"
vnet_rg   = "meristas-k8-user-admin-rg-dev-northcentralus"


# subnet_name = "${azurerm_virtual_network.prim_network.tags.root_name}-k8-node-subnet-${azurerm_virtual_network.prim_network.tags.environment}-${local.default_tags.location}"
subnet_name = "meristas-k8-node-subnet-dev-northcentralus"
