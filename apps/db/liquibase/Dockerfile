FROM liquibase/liquibase:5.0

# Copy the rest of the application source code and build the binary
COPY ./changelog/ /liquibase/changelog/

RUN curl -L -o  /liquibase/lib/postgresql-42.7.14.jar https://jdbc.postgresql.org/download/postgresql-42.7.14.jar



ENV LIQUIBASE_COMMAND_CHANGELOG_FILE=changelog.yaml
ENV LIQUIBASE_LOG_LEVEL=INFO
ENV LIQUIBASE_COMMAND_DRIVER=org.postgresql.Driver
ENV LIQUIBASE_CLASSPATH=/liquibase/lib/postgresql-42.7.14.jar

# Set the entry point to run the application
CMD ["liquibase", "update"]
