
locals {
  db_usernames_map = {
    superuser  = "postgres"
    appuser    = "app"
    ro_role    = "ro-role"
    rw_role    = "rw-role"
    admin_role = "admin-role"
  }
  domain_prefix = {
    dev  = "dev."
    prod = ""
  }
}
