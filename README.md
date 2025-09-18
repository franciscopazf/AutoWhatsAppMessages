const readmeContent = `
# WhatsAppMessage JS

Una herramienta en JavaScript para **enviar mensajes automáticamente en WhatsApp Web**, con opciones de personalización como loops, índices, hooks y división de mensajes.

> ⚠️ Requisitos mínimos:
> - Abrir [WhatsApp Web](https://web.whatsapp.com/) en el navegador.
> - Abrir el chat donde se enviarán los mensajes.
> - Abrir **DevTools** (F12 o Ctrl+Shift+I / Cmd+Option+I).
> - Pegar el código en la consola.

---

## 1. Clase \`WhatsAppMessage\`  [Ver el script](./whatsappMessage.js)


### Creación de un objeto

```js
// Crear un objeto con el método estático new()
const mensaje = WhatsAppMessage.new();
```

O también puedes usar:

```js
const mensaje = new WhatsAppMessage();
```

---

### Métodos principales

| Método | Descripción |
|--------|------------|
| \`setMessage(msg)\` | Define el mensaje a enviar. Puede ser un texto simple o multilinea. |
| \`setIntervalSeconds(seg)\` | Intervalo entre mensajes en segundos. |
| \`setLoop(n)\` | Cantidad de veces que se repetirá todo el conjunto de mensajes. |
| \`setShowIndex(flag)\` | Muestra índice antes de cada mensaje (\`true/false\`). |
| \`setSplit(rule)\` | Divide el mensaje en varios: <br>• \`false\` → no divide<br>• \`true\` → por saltos de línea<br>• \`"caracter"\` → por carácter personalizado |
| \`verbose(flag)\` | Muestra en consola los mensajes enviados (\`true/false\`). |
| \`onBeforeSend(fn)\` | Hook que se ejecuta **antes** de enviar cada mensaje. |
| \`onAfterSend(fn)\` | Hook que se ejecuta **después** de enviar cada mensaje. |
| \`sendNow()\` | Método principal que inicia el envío. |

---

### Ejemplo mínimo

```js
WhatsAppMessage.new()
    .setMessage("Hola mundo 🌎")
    .sendNow();
```

> Esto enviará el mensaje "Hola mundo 🌎" **una sola vez**, sin índices ni logs, con intervalo default 1 segundo.

---

### Ejemplo avanzado

```js
WhatsAppMessage.new()
    .setMessage("Primero\\nSegundo\\nTercero")
    .setSplit(true)        // divide por salto de línea
    .setLoop(2)            // repite el conjunto de mensajes 2 veces
    .setShowIndex(true)    // muestra índices 1., 2., 3.
    .setIntervalSeconds(2) // espera 2 segundos entre mensajes
    .verbose(true)         // log en consola
    .onBeforeSend((msg, loop, i) => console.log("Antes:", msg))
    .onAfterSend((msg, loop, i) => console.log("Después:", msg))
    .sendNow();
```

---

## 2. Versión condensada    [Ver version condensada](./condensed.js)

Si no quieres usar clases, existe una **versión simplificada** en una sola función:
copia la funcion del archivo condensed.js

```js
sendWhatsAppMessage({
    message: "Hola\\nMundo",
    splitRule: true,
    loopCount: 2,
    showIndex: true,
    interval: 1500,
    verbose: true
});
```

### Opciones de configuración de la función

| Opción | Valor por defecto | Descripción |
|--------|-----------------|------------|
| \`message\` | "Hello Example" | Texto a enviar |
| \`interval\` | 1000 | Milisegundos entre mensajes |
| \`loopCount\` | 1 | Número de repeticiones del conjunto de mensajes |
| \`showIndex\` | false | Mostrar índice antes del mensaje |
| \`splitRule\` | false | Dividir mensajes (\`true\`=newline, string=carácter) |
| \`verbose\` | false | Mostrar logs en consola |
| \`onBeforeSend\` | null | Función hook antes de enviar cada mensaje |
| \`onAfterSend\` | null | Función hook después de enviar cada mensaje |

> Ejemplo mínimo:

```js
sendWhatsAppMessage({ message: "Hola mundo 🌎" });
```

> Ejemplo avanzado:

```js
sendWhatsAppMessage({
    message: "Uno\\nDos\\nTres",
    splitRule: true,
    loopCount: 3,
    showIndex: true,
    interval: 2000,
    verbose: true
});
```

---

## 3. Comportamiento esperado general

- Los mensajes se escriben automáticamente en el contenteditable de WhatsApp Web.  
- El botón enviar se presiona automáticamente después de cada mensaje.  
- Se respeta el intervalo configurado.  
- Hooks se ejecutan si se definieron.  
- Se pueden enviar mensajes múltiples usando saltos de línea o un carácter personalizado.  
- Se puede repetir todo el conjunto de mensajes con \`loopCount\`.  

---

## 4. Notas finales

- Siempre probar primero con mensajes de prueba.  
- No hay confirmación visual más allá del envío en WhatsApp Web.  
- Requiere que WhatsApp Web esté **activo y abierto en el chat deseado**.  
- Para editar comportamiento, modificar los parámetros de creación del objeto o de la función condensada.  




2️⃣ **Tabla de features futuras** con tus ideas:

## 🚀 Features futuras

| Feature | Descripción |
|---------|------------|
| Envío a más de una persona | Posibilidad de enviar el mismo mensaje a varios contactos o grupos. |
| Programación de mensajes | Configurar mensajes para enviarse en una fecha y hora específicas. |
| Extensión con GUI | Crear una interfaz gráfica para gestionar mensajes y configuraciones sin usar la consola. |
| Envío mediante CSV | Permitir enviar mensajes a múltiples destinatarios leyendo un archivo CSV con columnas: destinatario | mensaje | fecha y hora |