
resource "kubernetes_manifest" "pgdb_schema_mutation" {
  manifest = {
    apiVersion = "batch/v1"
    kind       = "Job"
    metadata = {
      name      = "${var.app_name}-pgdb-db-schema-mutation"
      namespace = var.env
      labels = {
        app    = "${var.app_name}"
        env    = "${var.env}"
        target = "pgdb"
        tier   = "data"
      }
    }
    spec = {
      template = {
        spec = {
          containers = [
            {
              name  = "${var.app_name}-pgdb-db-schema-mutation"
              image = var.image_url
              env = [
                {
                  name = "LIQUIBASE_COMMAND_USERNAME"
                  valueFrom = {
                    secretKeyRef = {
                      name = "${var.app_name}-pgdb-admin-role"
                      key  = "username"
                    }
                  }
                },
                {
                  name = "LIQUIBASE_COMMAND_PASSWORD"
                  valueFrom = {
                    secretKeyRef = {
                      name = "${var.app_name}-pgdb-admin-role"
                      key  = "password"
                    }
                  }
                },
                {
                  name  = "DATABASE_DIALECT"
                  value = "postgresql"
                },
                {
                  name  = "DATABASE_NAME"
                  value = "app"
                },
                {
                  name  = "DATABASE_PORT"
                  value = "5432"
                },
                {
                  name  = "DATABASE_HOST"
                  value = "${var.app_name}-pgdb-cluster-rw.${var.env}.svc.cluster.local"
                },
                {
                  name  = "LIQUIBASE_COMMAND_URL"
                  value = "jdbc:$(DATABASE_DIALECT)://$(DATABASE_HOST):$(DATABASE_PORT)/$(DATABASE_NAME)"
                }
              ]
            }
          ]
          restartPolicy = "Never"
        }
      }
      backoffLimit = "4"
    }

  }
  # wait_for_completion = "true"
}
