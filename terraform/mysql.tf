resource "azurerm_mysql_server" "deltaserver" {
  name                = "delta-mysqlserver"
  location            = azurerm_resource_group.DeltaResources.location
  resource_group_name = azurerm_resource_group.DeltaResources.name

  administrator_login          = "DeltaAdmin"
  administrator_login_password = "D3lt4T3e4m!"

  sku_name   = "GP_Gen5_2"
  storage_mb = 5120
  version    = "5.7"

  auto_grow_enabled                 = false
  backup_retention_days             = 7
  geo_redundant_backup_enabled      = true
  infrastructure_encryption_enabled = true
  public_network_access_enabled     = true
  ssl_enforcement_enabled           = false
}

resource "azurerm_mysql_database" "budgettracker" {
  name                = "budgettrackerdb"
  resource_group_name = azurerm_resource_group.DeltaResources.name
  server_name         = azurerm_mysql_server.deltaserver.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}
