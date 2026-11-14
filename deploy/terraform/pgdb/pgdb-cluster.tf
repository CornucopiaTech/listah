
resource "kubernetes_manifest" "pgdb_cluster" {
  manifest = {
    apiVersion = "postgresql.cnpg.io/v1"
    kind       = "Cluster"
    metadata = {
      name      = "${var.app_name}-pgdb-cluster"
      namespace = "${var.env}"
      labels = {
        "app.kubernetes.io/name"      = "${var.app_name}-pgdb-cluster"
        "app.kubernetes.io/version"   = "18.0"
        "app.kubernetes.io/component" = "database-cluster"
        "app.kubernetes.io/part-of"   = "${var.app_name}"
        "app.kubernetes.io/layer"     = "data"
        "app"                         = "${var.app_name}"
        "env"                         = "${var.env}"
        "target"                      = "pgdb"
        "tier"                        = "data"
      }
    }
    spec = {
      instances             = "1"
      imageName             = "ghcr.io/cloudnative-pg/postgresql:18.0-system-trixie"
      enableSuperuserAccess = true
      superuserSecret = {
        name = "${var.app_name}-pgdb-super-user"
      }
      bootstrap = {
        initdb = {
          database = "app"
          owner    = "app"
          secret = {
            name = "${var.app_name}-pgdb-appuser"
          }
        }
      }
      managed = {
        roles = [
          {
            name     = "app"
            createdb = "true"
            login    = "true"
          },
          {
            name            = "rw-role"
            ensure          = "present"
            login           = "true"
            superuser       = "false"
            createdb        = "false"
            createrole      = "false"
            inherit         = "true"
            replication     = "false"
            bypassrls       = "false"
            connectionLimit = "50"
            passwordSecret = {
              name = "${var.app_name}-pgdb-rw-role"
            }
          },
          {
            name            = "ro-role"
            ensure          = "present"
            login           = "true"
            superuser       = "false"
            createdb        = "false"
            createrole      = "false"
            inherit         = "true"
            replication     = "false"
            bypassrls       = "false"
            connectionLimit = "50"
            passwordSecret = {
              name = "${var.app_name}-pgdb-ro-role"
            }
          },
          {
            name            = "admin-role"
            ensure          = "present"
            login           = "true"
            superuser       = "true"
            createdb        = "true"
            createrole      = "true"
            inherit         = "true"
            replication     = "true"
            bypassrls       = "false"
            connectionLimit = "5"
            inRoles = [
              "pg_monitor",
              "pg_signal_backend"
            ]
            passwordSecret = {
              name = "${var.app_name}-pgdb-admin-role"
            }
          },
        ]
      }
      storage = {
        size         = "30Gi"
        storageClass = var.storage_class
        pvcTemplate = {
          accessModes = [
            "ReadWriteOnce"
          ]
        }
      }
      resources = {
        requests = {
          cpu    = "0.1"
          memory = "0.2Gi"
        }
        limits = {
          cpu    = "0.2"
          memory = "0.4Gi"
        }
      }
      affinity = {
        enablePodAntiAffinity = "true"
        topologyKey           = "topology.kubernetes.io/zone"
        podAntiAffinityType   = "preferred"
      }
      postgresql = {
        parameters = {
          max_connections = "100"
          shared_buffers  = "64MB"
        }
      }
    }
  }
}
