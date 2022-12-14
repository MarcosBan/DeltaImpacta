resource "azurerm_storage_account" "BudgeTrackerFront" {
  name                      = "budgetrackerfront"
  resource_group_name       = azurerm_resource_group.DeltaResources.name
  location                  = azurerm_resource_group.DeltaResources.location
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  account_kind              = "StorageV2"
  enable_https_traffic_only = true


  static_website {
    index_document = "index.html"
  }
}
