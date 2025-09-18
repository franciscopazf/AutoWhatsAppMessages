async function sendWhatsAppMessage({
    message = "Hello Example",
    interval = 1000,
    loopCount = 1,
    showIndex = false,
    splitRule = false, // false | true (newline) | string
    verbose = false,
    onBeforeSend = null,
    onAfterSend = null
} = {}) {

    const wait = ms => new Promise(r => setTimeout(r, ms));

    // Procesar mensajes
    let messages = [message];
    if (splitRule === true) {
        messages = message.split("\n").map(m => m.trim()).filter(Boolean);
    } else if (typeof splitRule === "string") {
        messages = message.split(splitRule).map(m => m.trim()).filter(Boolean);
    }

    // Indexado opcional
    if (showIndex) {
        messages = messages.map((m, i) => `${i + 1}. ${m}`);
    }

    // Buscar elementos de WhatsApp
    const findBox = () => document.querySelectorAll("[contenteditable='true']")[1] 
                       || document.querySelector("#main div[contenteditable='true']");
    const findBtn = () => document.querySelector('[data-testid="send"]') 
                       || document.querySelector('[data-icon="wds-ic-send-filled"]');

    const box = findBox();
    if (!box) return console.warn("⚠️ Content box not found.");

    // Enviar en bucle
    for (let loop = 0; loop < loopCount; loop++) {
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];

            // Hook antes
            if (onBeforeSend) try { onBeforeSend(msg, loop, i); } catch (e) { console.error(e); }

            // Escribir y enviar
            box.focus();
            document.execCommand('insertText', false, msg);
            box.dispatchEvent(new Event('change', { bubbles: true }));
            await wait(100);
            const btn = findBtn();
            if (btn) btn.click();

            if (verbose) console.log(`✅ Sent: "${msg}" (loop ${loop + 1})`);

            // Hook después
            if (onAfterSend) try { onAfterSend(msg, loop, i); } catch (e) { console.error(e); }

            // Esperar intervalo si no es el último
            if (i !== messages.length - 1 || loop < loopCount - 1) {
                await wait(interval);
            }
        }
    }
}
