data "azurerm_kubernetes_cluster" "k8_cluster" {
  name                = var.k8_cluster_name
  resource_group_name = var.k8_cluster_rg
}
