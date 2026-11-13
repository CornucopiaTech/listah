
locals {
  default_tags = {
    root_name   = "${var.root_name}"
    app_name    = "${var.app_name}"
    controller  = "terraform-via-github-actions"
    location    = var.location
    env         = null
    res_purpose = null
  }
  deploy_envs = ["dev", "prod"]

  web_secrets = {
    dev = {
      auth_key = var.web_dev_auth_key
    }
    prod = {
      auth_key = var.web_prod_auth_key
    }
  }
  api_secrets = {
    dev = {
      auth_domain = var.api_dev_auth_domain
      auth_key    = var.api_dev_auth_key
    }
    prod = {
      auth_domain = var.api_prod_auth_domain
      auth_key    = var.api_prod_auth_key
    }
  }
  db_usernames_map = {
    superuser  = "postgres"
    appuser    = "app"
    ro_role    = "ro-role"
    rw_role    = "rw-role"
    admin_role = "admin-role"
  }

}
