resource "azurerm_storage_account" "BudgeTrackerFront" {
  name                     = "BudgetTracker-Front"
  resource_group_name      = azurerm_resource_group.DeltaResources.name
  location                 = azurerm_resource_group.DeltaResources.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind = "StorageV2"
  azurerm_storage_account = true

  static_website {
    index_document = "index.html"
  }

}
resource "azurerm_storage_container" "WebContainer" {
  name                  = "$web"
  storage_account_name  = azurerm_storage_account.BudgeTrackerFront.name
  container_access_type = "private"
}