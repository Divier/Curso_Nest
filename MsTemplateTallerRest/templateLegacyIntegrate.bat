@echo off
setlocal EnableDelayedExpansion
cls

set selectedREST=0
set selectedORACLE=0
set selectedPCML=0
set selectedKafkaPub=0

set "WIKI_URL=https://dev.azure.com/OrgClaroColombia/API%%20MANAGEMENT/_git/API-MANAGEMENT.wiki"
set "WIKI_TEMP=wiki-temp"
set "TARGET_FILE=MsNestJsTemplateIntegrations.md"

echo.
echo ========================================================================
echo Descargando documento de Estandares y documentacion de microservicios
echo ========================================================================

:: Si ya existe la carpeta temporal, la elimina
if exist "%WIKI_TEMP%" (
    echo Eliminando carpeta temporal anterior...
    rmdir /s /q "%WIKI_TEMP%"
)

git clone "%WIKI_URL%" "%WIKI_TEMP%"


if errorlevel 1 (
    echo Error al clonar la Wiki.
    exit /b 1
)

echo.
echo - Buscando Documento-SSD.md...

set "FILE_FOUND=0"

for /r "%WIKI_TEMP%" %%F in (Documento-SSD.md) do (
    copy "%%F" "%TARGET_FILE%" >nul
    set FILE_FOUND=1
)

if "%FILE_FOUND%"=="1" (
    echo -- Documento copiado correctamente como %TARGET_FILE%
) else (
    echo No se encontro Documento-SSD.md en la Wiki.
)

echo.
echo --Limpiando archivos temporales...
rmdir /s /q "%WIKI_TEMP%"

 if exist env.build.json del env.build.json

powershell -NoProfile -ExecutionPolicy Bypass -Command "$base = Get-Content 'env.tmp.json' -Raw | ConvertFrom-Json; $result = @{}; $result.default = $base.default; $result | ConvertTo-Json -Depth 5 | Set-Content 'env.build.json'"
pause

:MENU
cls
echo ================================================================
echo  FABRICA DIGITAL - HERRAMIENTA DE INTEGRACION DE LEGADOS v1.2
echo ================================================================
echo.
echo 1 - Integrar legado REST - SOAP
echo 2 - Integrar legado ORACLEDB
echo 3 - Integrar legado PCML
echo 4 - Implementar Producer-Kafka

echo 0 - Finalizar Proceso
echo.

set /p option=Indique el legado sobre el cual realizara su servicio: 

if "%option%"=="1" (
    if "!selectedREST!"=="1" (
        echo.
        echo REST/SOAP ya fue seleccionado anteriormente.
        pause
        goto MENU
    )
    set selectedREST=1
    call :REST
    goto MENU
)

if "%option%"=="2" (
    if "!selectedORACLE!"=="1" (
        echo.
        echo ORACLEDB ya fue seleccionado anteriormente.
        pause
        goto MENU
    )
    set selectedORACLE=1
    call :ORACLE
    goto MENU
)

if "%option%"=="3" (
    if "!selectedPCML!"=="1" (
        echo.
        echo PCML ya fue seleccionado anteriormente.
        pause
        goto MENU
    )
    set selectedPCML=1
    call :PCML
    goto MENU
)

if "%option%"=="4" (
    if "!selectedKafkaPub!"=="1" (
        echo.
        echo Producer-Kafka ya fue seleccionado anteriormente.
        pause
        goto MENU
    )
    set selectedKafkaPub=1
    call :KAFKAPUB
    goto MENU
)

if "%option%"=="0" goto END

echo Opcion invalida
pause
goto MENU

:: =====================================================
:: REST - SOAP
:: =====================================================
:REST
echo.
echo ----- Legado REST - SOAP seleccionado -----

echo - Obteniendo src/restExample
git checkout origin/template-rest_soap -- src/restExample
echo - creando carpeta temporal restExample
echo - Obteniendo infrastructure del share
git checkout origin/template-rest_soap -- src/share/infrastructure/REST

echo - Moviendo archivo restExample.service.ts
move src\restExample\application\restExample.service.ts  src\main-example\application
echo - Moviendo directorio infrastructure\rest
move src\restExample\infrastructure src\main-example\infrastructure
echo - Moviendo archivo dto restExample.request.dto.ts
move src\restExample\domain\dto\restExample.request.dto.ts src\main-example\domain\dto
echo - Moviendo archivo dto restExample.response.dto.ts
move src\restExample\domain\dto\restExample.response.dto.ts src\main-example\domain\dto
echo - Limpiando archivos temporales de restExample
rmdir /s /q src\restExample


echo - Obteniendo test unitario de restExample/application
git checkout origin/template-rest_soap -- test/restExample/application
echo - Obteniendo test unitario de restExample/infrastructure
git checkout origin/template-rest_soap -- test/restExample/infrastructure


echo.
set /p getdocker=Desea obtener el Dockerfile del legado REST/SOAP (S/N): 

if /I "!getdocker!"=="S" (
    git checkout origin/template-rest_soap -- Dockerfile
    echo - Dockerfile Legado REST-SOAP obtenido correctamente.
) else (
    echo - Dockerfile Legado REST-SOAP omitido.
)

call :GENERATE_ENV_REST
exit /b

:: =====================================================
:: ORACLE
:: =====================================================
:ORACLE
echo.
echo --- ORACLEDB seleccionado ---

echo - Obteniendo src/oracleExample
git checkout origin/template-oracledb -- src/oracleExample
echo - creando carpeta temporal oracleExample
echo - Obteniendo infrastructure del share
git checkout origin/template-oracledb -- src/share/infrastructure/ORACLE


echo - Moviendo archivo oracleExample.service.ts
move src\oracleExample\application\oracleExample.service.ts src\main-example\application
echo - Moviendo directorio infrastructure\oracle
move src\oracleExample\infraestructure\oracle src\main-example\infrastructure 
echo - Moviendo archivo dto oracleExample.request.dto.ts
move src\oracleExample\domain\dto\oracleExample.request.dto.ts src\main-example\domain\dto
echo - Moviendo archivo dto oracleExample.response.dto.ts
move src\oracleExample\domain\dto\oracleExample.response.dto.ts src\main-example\domain\dto
echo - Limpiando archivos temporales de oracleExample
rmdir /s /q src\oracleExample

echo - Obteniendo test unitario de oracleExample/application
git checkout origin/template-oracledb -- test/oracleExample/application
echo - Obteniendo test unitario de oracleExample/infraestructure
git checkout origin/template-oracledb -- test/oracleExample/infraestructure

echo.
set /p getdocker=Desea obtener el Dockerfile del legado ORACLEDB (S/N): 

if /I "!getdocker!"=="S" (
    echo - Obteniendo Dockerfile...
    git checkout origin/template-oracledb -- Dockerfile
    echo - Dockerfile Legado ORACLEDB obtenido correctamente.
) else (
    echo - Dockerfile Legado ORACLEDB omitido.
)

call :GENERATE_ENV_ORACLE
call :UPDATE_DEPENDENCIES
exit /b

:: =====================================================
:: PCML
:: =====================================================
:PCML
echo.
echo --- PCML seleccionado ---

echo - Obteniendo src/pcmlExample
git checkout origin/template_pcml -- src/pcmlExample
echo - creando carpeta temporal pcmlExample
echo - Obteniendo infrastructure del share
git checkout origin/template_pcml -- src/share/infrastructure/PCML


echo - Moviendo archivo pcmlExample.service.ts
move src\pcmlExample\application\pcmlExample.service.ts  src\main-example\application
echo - Moviendo directorio infrastructure\pcml
move src\pcmlExample\infraestructure src\main-example\infrastructure
echo - Moviendo archivo dto pcmlExample.request.dto.ts
move src\pcmlExample\domain\dto\pcmlExample.request.dto.ts src\main-example\domain\dto
echo - Moviendo archivo dto pcmlExample.response.dto.ts
move src\pcmlExample\domain\dto\pcmlExample.response.dto.ts src\main-example\domain\dto
echo - Limpiando archivos temporales de pcmlExample
rmdir /s /q src\pcmlExample


echo - Obteniendo test unitario de pcmlExample/application
git checkout origin/template_pcml -- test/pcmlExample/application
echo - Obteniendo test unitario de pcmlExample/infraestructure
git checkout origin/template_pcml -- test/pcmlExample/infraestructure


echo.
set /p getdocker=Desea obtener el Dockerfile del legado PCML (S/N): 

if /I "!getdocker!"=="S" (
    git checkout origin/template_pcml -- Dockerfile
    echo - Dockerfile Legado PCML obtenido correctamente.
) else (
    echo - Dockerfile Legado PCML omitido.
)

call :GENERATE_ENV_PCML
call :UPDATE_DEPENDENCIES_PCML
exit /b

:: =====================================================
:: KAFKA -PRODUCER
:: =====================================================
:KAFKAPUB
echo.
echo --- KAFKA - PRODUCER seleccionado ---

echo - Obteniendo src/kafkaProducer
git checkout origin/template-kafka-producer -- src/kafkaProducer


echo - Moviendo archivo kafkaProducer.service.ts
move src\kafkaProducer\application\kafkaProducer.service.ts  src\main-example\application
echo - Moviendo directorio infrastructure\kafka
move src\kafkaProducer\infrastructure src\main-example\infrastructure
echo - Moviendo archivo dto kafkaProducer.request.dto.ts
move src\kafkaProducer\domain\dto\kafkaProducer.request.dto.ts src\main-example\domain\dto
echo - Limpiando archivos temporales de kafkaProducer
rmdir /s /q src\kafkaProducer


echo - Obteniendo test unitario de kafkaProducer/application
git checkout origin/template-kafka-producer -- test/kafkaProducer/application
echo - Obteniendo test unitario de kafkaProducer/infrastructure
git checkout origin/template-kafka-producer -- test/kafkaProducer/infrastructure
echo - Obteniendo test unitario de kafkaProducer/application
git checkout origin/template-kafka-producer -- test/kafkaProducer/domain


echo.
set /p getdocker=Desea obtener el Dockerfile de KAFKA Producer? (S/N) : 

if /I "!getdocker!"=="S" (
    git checkout origin/template-kafka-producer -- Dockerfile
    echo - Dockerfile Legado KAFKA Producer obtenido correctamente.
) else (
    echo - Dockerfile Legado KAFKA Producer omitido.
)

call :GENERATE_ENV_KAFKAPUB
call :UPDATE_DEPENDENCIES_KAFKAPUB
exit /b

:: =====================================================
:: GENERAR ENV REST
:: =====================================================
:GENERATE_ENV_REST
echo.
set /p genenv=Desea actualizar el archivo .env? (S/N) :

if /I "!genenv!"=="S" (
    echo  - Actualizando variables de entorno del Legado REST - SOAP en archivo .env
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$base = Get-Content 'env.tmp.json' -Raw | ConvertFrom-Json; $build = Get-Content 'env.build.json' -Raw | ConvertFrom-Json; $existingProp = $build.PSObject.Properties['rest']; if(-not $existingProp){ $build | Add-Member -MemberType NoteProperty -Name 'rest' -Value $base.rest } else { $build.rest = $base.rest }; $build | ConvertTo-Json -Depth 10 | Set-Content 'env.build.json'; Write-Host '- VARIABLES DE ENTORNO REST creadas correctamente'"
)
echo.
set /p genenvconf=Desea actualizar el archivo de configuracion de variables de entorno env.config? (S/N):

if /I "!genenvconf!"=="S" (
    echo - Obteniendo env.config temporal desde la rama template-rest_soap...
    git show origin/template-rest_soap:src/share/domain/resources/env.config.ts >  restenv.config.ts
	
    if not exist restenv.config.ts (
        echo Error: No se pudo obtener env.config desde la rama.
        exit /b 1
    )

    echo - Actualizando objeto REST en env.config actual...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $template = Get-Content 'restenv.config.ts' -Raw; $targetPath = 'src/share/domain/resources/env.config.ts'; $current = Get-Content $targetPath -Raw; if ($template -match 'REST:\s*\{[^}]+\}') { $restBlock = $matches[0]; if ($current -notmatch 'REST:\s*\{') { $updated = $current -replace '\}\)\);', ('  ' + $restBlock + ',}));'); Set-Content $targetPath $updated; Write-Host '- Objeto REST agregado correctamente.'; } else { Write-Host 'El objeto REST ya existe en env.config.'; } } else { Write-Host 'No se encontro el objeto REST en restenv.config.ts'; } } catch { Write-Host ('Error actualizando env.config: ' + $_.Exception.Message); exit 1 }"
    echo - Archivo env.config modificado correctamente.
    echo - Limpiando archivos temporales.
    del /f /q restenv.config.ts
)
pause
exit /b

:: =====================================================
:: GENERAR ENV ORACLE
:: =====================================================
:GENERATE_ENV_ORACLE
echo.
set /p genenv=Desea actualizar el archivo .env ? (S/N) :

if /I "!genenv!"=="S" (
    echo  - Actualizando variables de entorno del Legado ORACLEDB en archivo .env
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$base = Get-Content 'env.tmp.json' -Raw | ConvertFrom-Json; $build = Get-Content 'env.build.json' -Raw | ConvertFrom-Json; $existingProp = $build.PSObject.Properties['oracledb']; if(-not $existingProp){ $build | Add-Member -MemberType NoteProperty -Name 'oracledb' -Value $base.oracledb } else { $build.oracledb = $base.oracledb }; $build | ConvertTo-Json -Depth 10 | Set-Content 'env.build.json'; Write-Host '- VARIABLES DE ENTORNO ORACLE creadas correctamente'"
)
echo.
set /p genenvconf=Desea actualizar el archivo de configuracion de variables de entorno env.config? (S/N):
if /I "!genenvconf!"=="S" (
    echo - Obteniendo env.config temporal desde la rama template-oracledb...
    git show origin/template-oracledb:src/share/domain/resources/env.config.ts >  oracleenv.config.ts    

    if not exist oracleenv.config.ts (
        echo -- Error: No se pudo obtener env.config desde la rama.
        exit /b 1
    )

    echo - Actualizando objeto ORACLE en env.config actual...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $template = Get-Content 'oracleenv.config.ts' -Raw; $targetPath = 'src/share/domain/resources/env.config.ts'; $current = Get-Content $targetPath -Raw; if ($template -match 'ORACLE:\s*\{[^}]+\}') { $oracleBlock = $matches[0]; if ($current -notmatch 'ORACLE:\s*\{') { $updated = $current -replace '\}\)\);', ('  ' + $oracleBlock + ',}));'); Set-Content $targetPath $updated; Write-Host '- Objeto ORACLE agregado correctamente.'; } else { Write-Host 'El objeto ORACLE ya existe en env.config.'; } } else { Write-Host 'No se encontro el objeto ORACLE en oracleenv.config.ts'; } } catch { Write-Host ('Error actualizando env.config: ' + $_.Exception.Message); exit 1 }"
    echo - Archivo env.config modificado correctamente.
    echo - Limpiando archivos temporales.
    del /f /q oracleenv.config.ts
)

exit /b

:: =====================================================
:: GENERAR PCML
:: =====================================================
:GENERATE_ENV_PCML
echo.
set /p genenvpcml=Desea actualizar el archivo .env? (S/N): 

if /I "!genenvpcml!"=="S" (
    echo  - Actualizando variables de entorno del Legado PCML en archivo .env
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$base = Get-Content 'env.tmp.json' -Raw | ConvertFrom-Json; $build = Get-Content 'env.build.json' -Raw | ConvertFrom-Json; $existingProp = $build.PSObject.Properties['pcml']; if(-not $existingProp){ $build | Add-Member -MemberType NoteProperty -Name 'pcml' -Value $base.pcml } else { $build.pcml = $base.pcml }; $build | ConvertTo-Json -Depth 10 | Set-Content 'env.build.json'; Write-Host '- VARIABLES DE ENTORNO PCML creadas correctamente'"
)
echo.
set /p genenvconf=Desea actualizar el archivo de configuracion de variables de entorno env.config? (S/N):
if /I "!genenvconf!"=="S" (
    echo - Obteniendo env.config temporal desde la rama template-template_pcml...
	git show origin/template_pcml:src/share/domain/resources/env.config.ts >  pcmlenv.config.ts
  
    if not exist pcmlenv.config.ts (
        echo -- Error: No se pudo obtener env.config desde la rama.
        exit /b 1
    )

    echo - Actualizando objeto ORACLE en env.config actual...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $template = Get-Content 'pcmlenv.config.ts' -Raw; $targetPath = 'src/share/domain/resources/env.config.ts'; $current = Get-Content $targetPath -Raw; if ($template -match 'PCML:\s*\{[^}]+\}') { $pcmlBlock = $matches[0]; if ($current -notmatch 'PCML:\s*\{') { $updated = $current -replace '\}\)\);', ('  ' + $pcmlBlock + ',}));'); Set-Content $targetPath $updated; Write-Host '- Objeto PCML agregado correctamente.'; } else { Write-Host 'El objeto PCML ya existe en env.config.'; } } else { Write-Host 'No se encontro el objeto PCML en pcmlenv.config.ts'; } } catch { Write-Host ('Error actualizando env.config: ' + $_.Exception.Message); exit 1 }"
    echo - Archivo env.config modificado correctamente.
    echo - Limpiando archivos temporales.
    del /f /q pcmlenv.config.ts
)
exit /b

:: =====================================================
:: GENERAR ENV KAFKA PRODUCER
:: =====================================================
:GENERATE_ENV_KAFKAPUB
echo.
set /p genenvkafkapub=Desea actualizar el archivo .env? (S/N) : 

if /I "!genenvkafkapub!"=="S" (
    echo  - Actualizando variables de entorno del KAFKA PRODUCER en archivo .env
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$base = Get-Content 'env.tmp.json' -Raw | ConvertFrom-Json; $build = Get-Content 'env.build.json' -Raw | ConvertFrom-Json; $existingProp = $build.PSObject.Properties['kafka']; if(-not $existingProp){ $build | Add-Member -MemberType NoteProperty -Name 'kafka' -Value $base.kafka } else { $build.kafka = $base.kafka }; $build | ConvertTo-Json -Depth 10 | Set-Content 'env.build.json'; Write-Host '- VARIABLES DE ENTORNO KAFKA PRODUCER creadas correctamente'"
)
echo.
set /p genenvconf=Desea actualizar el archivo de configuracion de variables de entorno env.config? (S/N):
if /I "!genenvconf!"=="S" (
    echo - Obteniendo env.config temporal desde la rama template-kafka-producer...
	git show origin/template-kafka-producer:src/share/domain/resources/env.config.ts >  kafkapubenv.config.ts   

    if not exist kafkapubenv.config.ts (
        echo Error: No se pudo obtener env.config desde la rama.
        exit /b 1
    )
    echo - Actualizando objeto Kafka en env.config actual...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $template = Get-Content 'kafkapubenv.config.ts' -Raw; $targetPath = 'src/share/domain/resources/env.config.ts'; $current = Get-Content $targetPath -Raw; if ($template -match 'Kafka:\s*\{[^}]+\}') { $kafkaBlock = $matches[0]; if ($current -notmatch 'Kafka:\s*\{') { $updated = $current -replace '\}\)\);', ('  ' + $kafkaBlock + ',}));'); Set-Content $targetPath $updated; Write-Host '- Objeto Kafka agregado correctamente.'; } else { Write-Host 'El objeto Kafka ya existe en env.config.'; } } else { Write-Host 'No se encontro el objeto Kafka en kafkapubenv.config.ts'; } } catch { Write-Host ('Error actualizando env.config: ' + $_.Exception.Message); exit 1 }"
    echo - Archivo env.config modificado correctamente.
    echo - Limpiando archivos temporales.
    del /f /q kafkapubenv.config.ts
)

exit /b

:: =====================================================
:: ACTUALIZAR DEPENDENCIAS ORACLE
:: =====================================================
:UPDATE_DEPENDENCIES
echo.
set /p updatedeps=Desea actualizar las dependencias del package.json? (S/N) : 

if /I "!updatedeps!"=="S" (
    echo - Actualizando dependencias desde package.fragment.json...

    if not exist package.fragment.json (
        echo Error: package.fragment.json no encontrado.
        exit /b 1
    )
 
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $base = Get-Content 'package.json' -Raw | ConvertFrom-Json; $frag = Get-Content 'package.fragment.json' -Raw | ConvertFrom-Json; if ($null -ne $frag.oracledb -and $null -ne $frag.oracledb.dependencies) { $frag.oracledb.dependencies.PSObject.Properties | ForEach-Object { $base.dependencies | Add-Member -NotePropertyName $_.Name -NotePropertyValue $_.Value -Force }; $base | ConvertTo-Json -Depth 10 | Set-Content 'package.json'; Write-Host 'Dependencias actualizadas correctamente.' } else { Write-Host 'No se encontraron dependencias en oracledb.' } } catch { Write-Host ('Error al actualizar dependencias: ' + $_.Exception.Message); exit 1 }"

    if !ERRORLEVEL! equ 0 (
        echo - Actualizacion completada.
    ) else (
        echo - Error durante la actualizacion.
    )
)
pause
exit /b

:: =====================================================
:: ACTUALIZAR PCML
:: =====================================================
:UPDATE_DEPENDENCIES_PCML
echo.
set /p updatedepspcml=Desea actualizar las dependencias del package.json? (S/N) : 

if /I "!updatedepspcml!"=="S" (
    echo - Actualizando dependencias desde package.fragment.json...

    if not exist package.fragment.json (
        echo - Error: package.fragment.json no encontrado.
        exit /b 1
    )
 
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $base = Get-Content 'package.json' -Raw | ConvertFrom-Json; $frag = Get-Content 'package.fragment.json' -Raw | ConvertFrom-Json; if ($null -ne $frag.pcml -and $null -ne $frag.pcml.dependencies) { $frag.pcml.dependencies.PSObject.Properties | ForEach-Object { $base.dependencies | Add-Member -NotePropertyName $_.Name -NotePropertyValue $_.Value -Force }; $base | ConvertTo-Json -Depth 10 | Set-Content 'package.json'; Write-Host '- Dependencias actualizadas correctamente.' } else { Write-Host '- No se encontraron dependencias en pcml.' } } catch { Write-Host ('- Error al actualizar dependencias: ' + $_.Exception.Message); exit 1 }"

    if !ERRORLEVEL! equ 0 (
        echo - Actualizacion completada.
    ) else (
        echo - Error durante la actualizacion.
    )
)
pause
exit /b

:: =====================================================
:: ACTUALIZAR KAFKAPUB
:: =====================================================
:UPDATE_DEPENDENCIES_KAFKAPUB
echo.
set /p updatedepskafkapub=Desea actualizar las dependencias del package.json? (S/N) : 

if /I "!updatedepskafkapub!"=="S" (
    echo - Actualizando dependencias desde package.fragment.json...

    if not exist package.fragment.json (
        echo - Error: package.fragment.json no encontrado.
        exit /b 1
    )
 
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $base = Get-Content 'package.json' -Raw | ConvertFrom-Json; $frag = Get-Content 'package.fragment.json' -Raw | ConvertFrom-Json; if ($null -ne $frag.kafkapub -and $null -ne $frag.kafkapub.dependencies) { $frag.kafkapub.dependencies.PSObject.Properties | ForEach-Object { $base.dependencies | Add-Member -NotePropertyName $_.Name -NotePropertyValue $_.Value -Force }; $base | ConvertTo-Json -Depth 10 | Set-Content 'package.json'; Write-Host '- Dependencias actualizadas correctamente.' } else { Write-Host '- No se encontraron dependencias en kafkapub.' } } catch { Write-Host ('- Error al actualizar dependencias: ' + $_.Exception.Message); exit 1 }"

    if !ERRORLEVEL! equ 0 (
        echo - Actualizacion completada.
    ) else (
        echo - Error durante la actualizacion.
    )
)
pause
exit /b

:: =====================================================
:END
echo.
echo ==========================================
echo Proceso finalizado.
echo ==========================================
echo Generando archivo .env final...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$build = Get-Content 'env.build.json' -Raw | ConvertFrom-Json; $envFile = '.env'; '' | Set-Content $envFile; foreach($section in $build.PSObject.Properties){ foreach($prop in $section.Value.PSObject.Properties){ $key = $prop.Name; $value = [string]$prop.Value; $escaped = $value.Replace('\"','\\\"'); Add-Content $envFile ($key + '=\"' + $escaped + '\"');     } }; Write-Host '- Archivo .env generado correctamente'"
del /f /q env.build.json

set /p pack=Desea empaquetar el proyecto ? (S/N) : 
if /I "!pack!"=="S" (
    echo - Empaquetando proyecto...
    npm pack
)

pause
exit /b