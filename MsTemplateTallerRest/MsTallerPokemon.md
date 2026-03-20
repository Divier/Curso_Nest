_Autor:_ Equipo OpenShift  
_Versión:_ 1.0

[[_TOC_]]

# MsTallerPokemon 

---
## Control del documento

- **Nombre del servicio**: MsTallerPokemon. 
- **Proyecto**:ECOMMERCE.
- **Namespace**: Indicar el namespace productivo.
- **Tecnología**: NestJS.
- **Fábrica**: Fabrica Digital.

---
## Alcance

**Objetivo del microservicio**: Microservicio para consultar informacion de los pokemon.

**Nota:** El contenido debe ser coherente con la información proporcionada en el campo `DESCRIPTION` del archivo `.params`.

---
## Referencias


| **Referencia** | **_Endpoint_** |
|--|--|
| Swagger | localhost:8080/api |

**Nota:** Si el Swagger se encuentra en la raíz, el valor de la columna _endpoint_ debe ser `/`.

---

## Diagramas

### Diagrama de componentes de solución

Imagen legible del diagrama de componentes.

Ejemplo:
![Diagrama_Componentes.png](/.attachments/diagrama_componentes.png)

### Diagrama de secuencia

Imagen legible del diagrama de secuencia.

Ejemplo:
![image.png](/.attachments/diagrama_secuencia.png)

---

## Diseño de componentes lógicos de la solución

### Entidades de negocio 

Especificar si aplica exposición por 3scale o API Gateway. Sin embargo, no se deben exponer las credenciales o contraseñas de dichas exposiciones.

Ejemplos:

a) Cuando el microservicio se consume a través de 3scale

| **_API Management_ (3scale/API Gateway)** | **Aplica** | **URL** |
|--|--|--|
| 3scale | ✅ | https://apimejemplo-3scale-apicast-production.apps.ocpprd.claro.co/MS/COM/Performance/RSReTeSpeTestPlatform/V1/ValidateTest | 

b) Cuando el microservicio se consume a través de API Gateway

| **_API Management_ (3scale/API Gateway)** | **Aplica** | **URL** |
|--|--|--|
| API Gateway | ✅ | https://apim.claro.com.co/apimejemplo/MS/COM/Performance/RSReTeSpeTestPlatform/V1/ValidateTest  | 

c) Cuando el microservicio se consume directamente por ruta (no por 3scale ni API Gateway) o cuando el microservicio es un servicio legado (es decir, un microservicio orquestador consume este microservicio). En este caso, su consumo no depende de la exposición de una API.

| **_API Management_ (3scale/API Gateway)** | **Aplica** | **URL** |
|--|--|--|
| 3scale | ❌ | ❌ | 
| API Gateway | ❌ | ❌ | 

### Enriquecimiento/Transformación

En esta sección se deben indicar cada uno de los métodos del microservicio. La información de cada método debe incluir la descripción, el *path*, *headers*, parámetros (si aplica), *body* (si aplica).

- **Método 1:** GET - Devuelve una lista de pokemones

| **Mapeo de campos** | **Descripción** |
|--|--|
| Método | GET |
| URL| http://localhost:8080/MS/CUS/CustomerBill/RSCuAcBalPartialDetail/V1/GET/partialBalance/GET/mainOperationExample/getPokemons |
| Descripción | Trae un listado de pokemones |
| _Request headers_ |  |

**Request (*Parameters*)**

_Parameters_ (si aplica, por ejemplo en métodos `GET`)

| **Nombre del parámetro** | **Tipo** | **Obligatoriedad** | **Descripción** | **Valor de prueba** |
|--|--|--|--|--|
| limit | string | ❌ | cantidad de pokemones a traer | 1 |
| offset | string | ❌ | cantidad de pokemones a saltar | 0 |

Body (si aplica, por ejemplo en métodos `POST`, `PUT`, `PATCH`)
```JSON
{}

```

Response

```JSON
{
    "responseCode": 200,
    "message": "Operación exitosa",
    "data": {
        "count": 1350,
        "next": "https://pokeapi.co/api/v2/pokemon?offset=1&limit=1",
        "previous": null,
        "results": [
            {
                "name": "bulbasaur",
                "url": "https://pokeapi.co/api/v2/pokemon/1/"
            }
        ]
    },
    "timestamp": "2026-03-02T20:20:23.332Z",
    "transactionId": "14d25882-f470-47ba-a304-70886d4dbf06"
}

```

Ejemplo:
- **Método 2:** GET - Consulta la informacion de un pokemon por nombre 

| **Mapeo de campos** | **Descripción** |
|--|--|
| Método | GET |
| URL| http://localhost:8080/MS/CUS/CustomerBill/RSCuAcBalPartialDetail/V1/GET/partialBalance/GET/mainOperationExample/getPokemonByName/:name |
| Descripción | Retorna la informacion del pokemon enviado por parametro de la URL |
| _Request headers_* | N/A |

\* No exponer información sensible (token, contraseñas, etc.).

**Request (*Parameters*)**

_Parameters_ 

Ejemplo:
| **Nombre del parámetro** | **Tipo** | **Obligatoriedad** | **Descripción** | **Valor de prueba** |
|--|--|--|--|--|
| name | String | ✅ | Nombre del pokemon | pikachu |

_Response_

```JSON
{
    "responseCode": 200,
    "message": "Operación exitosa",
	"data": {
		...
	}
	"timestamp": "2026-03-02T20:25:07.640Z",
    "transactionId": "5d358562-b67e-4571-86f5-6837faa9fde1"
}

```
**Nota**: En caso de ser un suscriptor de Kafka, indicar el nombre del microservicio publicador.

----
## Capa de datos

#### Consumo de servicios SOAP/REST/GraphQL

- **Tipo:** REST.

- **Métodos disponibles u operaciones:** Detalle de los métodos disponibles.

- **URL o _Endpoint_:** Explicación del formato.

- **Ejemplo de consumo:** Ejemplo de cómo consumir el legado (p. ej., SOAP).

---  

## Matriz de Escalamiento

La matriz de escalamiento se debe tener para cada uno de los legados evidenciados en el HLS. **Nota:** El equipo de operaciones OpenShift verificará que los números de teléfono proporcionados sean válidos y se ajusten al nivel jerárquico especificado. 

| **Legado** | **Grupo Mi Asistencia 360*** | **Nivel 1** | **Nivel 2** | **Dueño de la aplicación (Claro)** |
|--|--|--|--|--|
|  |  |  |  |  |
|  |  |  |  |  |

\* Si no cuenta con grupo, por favor mencionarlo con anterioridad para realizar la respectiva validación.

## Comentarios finales

El documento deberá nombrarse siguiendo la convención: `nombremicro.md` y ubicarse en la raíz del repositorio.

| ⬅️ [Página anterior]() | [Página siguiente]() ➡️ |
|:------------------------------------|----------------------------------:|

