terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"

    }
  }
  backend "azurerm" {
    resource_group_name  = "TerraformInfra"
    storage_account_name = "deltainfraterraform"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}


resource "azurerm_resource_group" "DeltaResources" {
  name     = "DeltaInfra"
  location = "Central US"
}
