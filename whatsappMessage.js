class ContentBoxAdapter {
    constructor() { this.methods = []; }
    addMethod(fn) { this.methods.push(fn); return this; }
    find() {
        for (const method of this.methods) {
            const box = method();
            if (box) return box;
        }
        return null;
    }
}

class SendButtonAdapter {
    constructor() { this.methods = []; }
    addMethod(fn) { this.methods.push(fn); return this; }
    find() {
        for (const method of this.methods) {
            const btn = method();
            if (btn) return btn;
        }
        return null;
    }
}

// ===== DEFAULT ADAPTERS =====
const DefaultContentBoxAdapter = new ContentBoxAdapter()
    .addMethod(() => document.querySelectorAll("[contenteditable='true']")[1])
    .addMethod(() => document.querySelector("#main div[contenteditable='true']"));

const DefaultSendButtonAdapter = new SendButtonAdapter()
    .addMethod(() => document.querySelector('[data-testid="send"]'))
    .addMethod(() => document.querySelector('[data-icon="wds-ic-send-filled"]'));

// ===== MESSAGE CLASS =====
class WhatsAppMessage {
    constructor() {
        this.contentBoxAdapter = DefaultContentBoxAdapter;
        this.buttonSendAdapter = DefaultSendButtonAdapter;
        this.message = "";
        this.interval = 1000;
        this.verboseMode = false;
        this.loopCount = 1;
        this.showIndex = false;
        this.splitRule = false; // false | true | string
        this.beforeSendHook = null;
        this.afterSendHook = null;
    }

    static new() { return new WhatsAppMessage(); }

    setContentBox(adapter) { this.contentBoxAdapter = adapter; return this; }
    setSendButton(adapter) { this.buttonSendAdapter = adapter; return this; }
    setMessage(msg) { this.message = msg; return this; }
    setIntervalSeconds(sec = 0 ) { this.interval = sec * 1000; return this; }
    setLoop(n = 1) { this.loopCount = Math.max(1, n); return this; }
    setShowIndex(flag = false) { this.showIndex = flag; return this; }
    verbose(flag = true) { this.verboseMode = flag; return this; }

    // 🔹 Split function
    setSplit(rule = false) { 
        this.splitRule = rule; 
        return this; 
    }

    // 🔹 Hooks
    onBeforeSend(fn) { this.beforeSendHook = fn; return this; }
    onAfterSend(fn) { this.afterSendHook = fn; return this; }

    // 🔹 Helper to wait with a promise
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 🔹 Process messages according to split rule
    processMessages() {
        if (!this.splitRule) return [this.message];

        if (this.splitRule === true) {
            // Split by new lines
            return this.message.split("\n").map(m => m.trim()).filter(m => m.length > 0);
        }

        if (typeof this.splitRule === "string") {
            // Split by custom character
            return this.message.split(this.splitRule).map(m => m.trim()).filter(m => m.length > 0);
        }

        return [this.message];
    }   

    // 🔹 Prepare messages with index if enabled
    getMessagesWithIndex(messages) {
        let counter = 1;
        return messages.map(msg => {
            if (this.showIndex) {
                return `${counter++}. ${msg}`;
            }
            return msg;
        });
    }

    // 🔹 Type the message into the content box
    async typeMessage(box, msg) {
        box.focus();
        document.execCommand('insertText', false, msg);
        box.dispatchEvent(new Event('change', { bubbles: true }));
        await this.wait(100); // wait for DOM update
    }

    // 🔹 Click on the send button
    clickSendButton() {
        const btn = this.buttonSendAdapter.find();
        if (btn) btn.click();
    }

    // 🔹 Send a single message (with hooks)
    async sendSingleMessage(box, msg, loop, index) {
        // Before send hook
        if (this.beforeSendHook) {
            try { this.beforeSendHook(msg, loop, index); } catch (e) { console.error(e); }
        }

        await this.typeMessage(box, msg);
        this.clickSendButton();

        if (this.verboseMode) {
            console.log(`✅ Sent: "${msg}" (loop ${loop + 1})`);
        }

        // After send hook
        if (this.afterSendHook) {
            try { this.afterSendHook(msg, loop, index); } catch (e) { console.error(e); }
        }
    }

    // 🔹 Loop for sending
    async sendLoop(box, messages) {
        for (let loop = 0; loop < this.loopCount; loop++) {
            const msgs = this.getMessagesWithIndex(messages);

            for (let i = 0; i < msgs.length; i++) {
                await this.sendSingleMessage(box, msgs[i], loop, i);

                // Delay if not the last message/loop
                if (i !== msgs.length - 1 || loop < this.loopCount - 1) {
                    await this.wait(this.interval);
                }
            }
        }
    }

    // 🔹 Main method
    async sendNow() {
        const box = this.contentBoxAdapter.find();
        if (!box) {
            console.warn("⚠️ Content box not found.");
            return;
        }

        const messages = this.processMessages();
        await this.sendLoop(box, messages);

        return this;
    }
}


WhatsAppMessage.new()
    .setMessage("Hello Example")
    .sendNow();
