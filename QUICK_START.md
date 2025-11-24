# Quick Start Guide - Support Chatbot Element

## Step 1: Build the Element

```bash
npm install
npm run build:element:prod
```

This creates the bundled files in `dist/support-chatbot-element/`

## Step 2: Copy Files to Your Project

Copy these files to your target project:
- `main.js` (or `main.[hash].js`)
- `polyfills.js` (or `polyfills.[hash].js`) 
- `styles.css` (or `styles.[hash].css`)

## Step 3: Include in Your HTML

### For Angular Projects:

**index.html:**
```html
<link rel="stylesheet" href="assets/chatbot/styles.css">
<script src="assets/chatbot/polyfills.js"></script>
<script src="assets/chatbot/main.js"></script>
```

**Component Template:**
```html
<support-chatbot
  api-url="http://localhost:3000"
  bot-name="Support Assistant">
</support-chatbot>
```

### For PrimeFaces/JSF:

**Template (template.xhtml):**
```xhtml
<h:outputStylesheet library="chatbot" name="styles.css" />
<h:outputScript library="chatbot" name="polyfills.js" />
<h:outputScript library="chatbot" name="main.js" />
```

**Page (page.xhtml):**
```xhtml
<support-chatbot
  api-url="http://localhost:3000"
  bot-name="Support Assistant">
</support-chatbot>
```

## Step 4: Configure Your Backend

Ensure your backend API is running and accessible at the URL specified in `api-url`.

## That's It!

The chatbot should now appear in your application. For more details, see [ANGULAR_ELEMENT_USAGE.md](./ANGULAR_ELEMENT_USAGE.md).

