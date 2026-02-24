# Multi-stage build para Oracle Instant Client
FROM registry.access.redhat.com/ubi9/nodejs-24:latest AS builder-oracle

LABEL name="architypenestjs-oracle" \
      vendor="Claro Colombia" \
      version="1.0.0" \
      summary="Microservicio NestJS con Oracle sobre Node 24 y UBI 9"

USER root

# Instalar dependencias necesarias para Oracle Instant Client (solo build tools mínimos)
RUN dnf install -y libaio unzip && \
    dnf clean all && \
    rm -rf /var/cache/dnf

# Descargar e instalar Oracle Instant Client (basiclite para menor tamaño)
ENV ORACLE_IC_VERSION=21_10 \
    LD_LIBRARY_PATH=/opt/oracle/instantclient_21_10

RUN mkdir -p /opt/oracle && \
    curl -L -o /tmp/instantclient-basic.zip \
        "https://download.oracle.com/otn_software/linux/instantclient/2110000/instantclient-basiclite-linux.x64-21.10.0.0.0dbru.zip" && \
    unzip -q /tmp/instantclient-basic.zip -d /opt/oracle && \
    rm -f /tmp/instantclient-basic.zip && \
    chown -R 1001:0 /opt/oracle && \
    chmod -R g+rwX /opt/oracle

USER 1001
WORKDIR /opt/app-root/src

# Instalar solo dependencias de producción
COPY --chown=1001:0 package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Imagen final - Solo runtime
FROM registry.access.redhat.com/ubi9/nodejs-24-minimal:latest

LABEL name="msserspecwelcomemsg" \
      vendor="Claro Colombia" \
      version="1.0.0" \
      summary="JOB que consulta el registro de información de las líneas activadas y generar archivo con la información de los clientes para alojarlo en el SFTP"

USER root
RUN microdnf install -y libaio && \
    microdnf clean all && \
    rm -rf /var/cache/yum
USER 1001

# Optimización para arranque rápido y cgroups v2 (detección automática de memoria)
ENV NODE_ENV=production \
    NODE_OPTIONS="--enable-source-maps" \
    LD_LIBRARY_PATH=/opt/oracle/instantclient_21_10 \
    TNS_ADMIN=/opt/oracle/instantclient_21_10/network/admin \
    ORACLE_HOME=/opt/oracle/instantclient_21_10

WORKDIR /opt/app-root/src

# Copiar Oracle Instant Client desde builder (solo lo necesario)
COPY --chown=1001:0 --from=builder-oracle /opt/oracle/instantclient_21_10 /opt/oracle/instantclient_21_10

# Copiar dependencias y código compilado
COPY --chown=1001:0 --from=builder-oracle /opt/app-root/src/node_modules ./node_modules
COPY --chown=1001:0 --from=builder-oracle /opt/app-root/src/package.json ./package.json
COPY --chown=1001:0 dist/ ./dist/

USER 1001
EXPOSE 8080

CMD ["node", "dist/main.js"]