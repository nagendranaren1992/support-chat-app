# Support Chatbot Angular Element - Usage Guide

This guide explains how to use the Support Chatbot as an Angular Element (Web Component) in Angular 9, Angular 18, and PrimeFaces/JSF projects.

## Table of Contents
1. [Building the Angular Element](#building-the-angular-element)
2. [Using in Angular 9](#using-in-angular-9)
3. [Using in Angular 18](#using-in-angular-18)
4. [Using in PrimeFaces/JSF](#using-in-primefacesjsf)
5. [Configuration Options](#configuration-options)
6. [Troubleshooting](#troubleshooting)

---

## Building the Angular Element

First, build the Angular Element from this project:

```bash
npm run build:element:prod
```

This will create the bundled files in `dist/support-chatbot-element/` directory. The main files you'll need are:
- `main.js` (or `main.[hash].js` in production) - The main bundle
- `polyfills.js` (or `polyfills.[hash].js`) - Polyfills for older browsers
- `styles.css` (or `styles.[hash].css`) - Component styles

---

## Using in Angular 9

### Step 1: Copy the Built Files

Copy the built files from `dist/support-chatbot-element/` to your Angular 9 project's `assets` folder or a public directory:

```
your-angular9-project/
  src/
    assets/
      chatbot/
        main.js
        polyfills.js
        styles.css
```

### Step 2: Include Scripts in index.html

Add the scripts to your `src/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Include chatbot styles -->
  <link rel="stylesheet" href="assets/chatbot/styles.css">
</head>
<body>
  <app-root></app-root>
  
  <!-- Include polyfills first (if needed for IE11) -->
  <script src="assets/chatbot/polyfills.js"></script>
  <!-- Include main chatbot bundle -->
  <script src="assets/chatbot/main.js"></script>
</body>
</html>
```

### Step 3: Use the Custom Element in Your Component

In any Angular component template, use the custom element:

```html
<!-- app.component.html -->
<div class="container">
  <h1>My Angular 9 App</h1>
  
  <!-- Use the chatbot custom element -->
  <support-chatbot
    api-url="http://localhost:3000"
    chat-api-endpoint="/api/chat"
    ticket-api-endpoint="/api/tickets"
    bot-name="Support Assistant"
    bot-avatar="/assets/chatbot/qurix.ico"
    initial-message="Hello! How can I help you?">
  </support-chatbot>
</div>
```

### Step 4: Add CORS Configuration (if needed)

If your chatbot API is on a different domain, ensure CORS is properly configured on your backend.

---

## Using in Angular 18

### Step 1: Copy the Built Files

Copy the built files from `dist/support-chatbot-element/` to your Angular 18 project:

```
your-angular18-project/
  src/
    assets/
      chatbot/
        main.js
        polyfills.js
        styles.css
```

### Step 2: Include Scripts in index.html

Add the scripts to your `src/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Include chatbot styles -->
  <link rel="stylesheet" href="assets/chatbot/styles.css">
</head>
<body>
  <app-root></app-root>
  
  <!-- Include polyfills first (if needed) -->
  <script src="assets/chatbot/polyfills.js"></script>
  <!-- Include main chatbot bundle -->
  <script src="assets/chatbot/main.js"></script>
</body>
</html>
```

### Step 3: Use the Custom Element

In any Angular component template:

```html
<!-- app.component.html -->
<div class="container">
  <h1>My Angular 18 App</h1>
  
  <!-- Use the chatbot custom element -->
  <support-chatbot
    api-url="http://localhost:3000"
    chat-api-endpoint="/api/chat"
    ticket-api-endpoint="/api/tickets"
    bot-name="Support Assistant"
    bot-avatar="/assets/chatbot/qurix.ico"
    initial-message="Hello! How can I help you?">
  </support-chatbot>
</div>
```

### Step 4: TypeScript Declaration (Optional but Recommended)

Create a type declaration file to avoid TypeScript errors:

```typescript
// src/typings.d.ts or src/app/chatbot.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'support-chatbot': {
      'api-url'?: string;
      'chat-api-endpoint'?: string;
      'ticket-api-endpoint'?: string;
      'bot-name'?: string;
      'bot-avatar'?: string;
      'initial-message'?: string;
    };
  }
}
```

---

## Using in PrimeFaces/JSF

### Step 1: Copy the Built Files

Copy the built files to your JSF project's `webapp/resources` or `webapp` directory:

```
your-jsf-project/
  src/
    main/
      webapp/
        resources/
          chatbot/
            main.js
            polyfills.js
            styles.css
        qurix.ico  (if using custom avatar)
```

### Step 2: Include Scripts in Your XHTML Template

In your main template file (e.g., `templates/template.xhtml` or `index.xhtml`):

```xhtml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:ui="http://java.sun.com/jsf/facelets"
      xmlns:p="http://primefaces.org/ui">

<head>
    <title>Your JSF Application</title>
    
    <!-- Include chatbot styles -->
    <h:outputStylesheet library="chatbot" name="styles.css" />
</head>

<body>
    <ui:insert name="content">
        <!-- Your page content -->
    </ui:insert>
    
    <!-- Include polyfills first -->
    <h:outputScript library="chatbot" name="polyfills.js" />
    <!-- Include main chatbot bundle -->
    <h:outputScript library="chatbot" name="main.js" />
</body>
</html>
```

### Step 3: Use the Custom Element in Your XHTML Page

In any XHTML page:

```xhtml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:ui="http://java.sun.com/jsf/facelets"
      xmlns:p="http://primefaces.org/ui">

<ui:composition template="/templates/template.xhtml">
    <ui:define name="content">
        <div class="container">
            <h1>My JSF Application</h1>
            
            <!-- Use the chatbot custom element -->
            <support-chatbot
                api-url="http://localhost:3000"
                chat-api-endpoint="/api/chat"
                ticket-api-endpoint="/api/tickets"
                bot-name="Support Assistant"
                bot-avatar="#{request.contextPath}/resources/qurix.ico"
                initial-message="Hello! How can I help you?">
            </support-chatbot>
        </div>
    </ui:define>
</ui:composition>
</html>
```

### Alternative: Using PrimeFaces OutputPanel

You can also wrap it in a PrimeFaces component:

```xhtml
<p:outputPanel>
    <support-chatbot
        api-url="http://localhost:3000"
        chat-api-endpoint="/api/chat"
        ticket-api-endpoint="/api/tickets"
        bot-name="Support Assistant"
        bot-avatar="#{request.contextPath}/resources/qurix.ico"
        initial-message="Hello! How can I help you?">
    </support-chatbot>
</p:outputPanel>
```

### Step 4: Configure web.xml (if needed)

Ensure your `web.xml` allows serving static resources:

```xml
<servlet-mapping>
    <servlet-name>Faces Servlet</servlet-name>
    <url-pattern>*.xhtml</url-pattern>
</servlet-mapping>

<!-- Allow serving static resources -->
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>/resources/*</url-pattern>
</servlet-mapping>
```

---

## Configuration Options

The `support-chatbot` custom element accepts the following attributes:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | `http://localhost:3000` | Base URL for the API |
| `chat-api-endpoint` | string | `/api/chat` | Endpoint for chat messages |
| `ticket-api-endpoint` | string | `/api/tickets` | Endpoint for file/ticket uploads |
| `bot-name` | string | `Qurix Support Assistant` | Name displayed in the chatbot header |
| `bot-avatar` | string | `/qurix.ico` | URL/path to the bot avatar image |
| `initial-message` | string | `Hello! How can I help you today?` | Initial greeting message |

### Example with All Options

```html
<support-chatbot
    api-url="https://api.example.com"
    chat-api-endpoint="/api/v1/chat"
    ticket-api-endpoint="/api/v1/tickets"
    bot-name="My Custom Bot"
    bot-avatar="/assets/images/bot-avatar.png"
    initial-message="Welcome! How may I assist you today?">
</support-chatbot>
```

---

## Styling and Customization

The chatbot element comes with its own styles. You can override them using CSS:

```css
/* Override chatbot container styles */
support-chatbot {
  display: block;
  max-width: 600px; /* Adjust as needed */
  margin: 0 auto;
}

/* Override specific chatbot styles */
support-chatbot::part(header) {
  background-color: #your-color;
}

support-chatbot::part(messages) {
  background-color: #your-color;
}
```

Note: The component uses Shadow DOM, so some styles may need to use `::part()` pseudo-element or `:host` selectors.

---

## Troubleshooting

### Issue: Custom element not appearing

**Solution:**
1. Check browser console for JavaScript errors
2. Ensure all script files are loaded in correct order (polyfills first, then main.js)
3. Verify file paths are correct
4. Check that the custom element is registered: `console.log(customElements.get('support-chatbot'))`

### Issue: API calls failing (CORS errors)

**Solution:**
1. Configure CORS on your backend API
2. Ensure `api-url` attribute is correct
3. Check network tab in browser DevTools

### Issue: Styles not loading

**Solution:**
1. Verify the `styles.css` file is included in your HTML
2. Check the file path is correct
3. Clear browser cache

### Issue: Component not responding to attribute changes

**Solution:**
- Attributes are read once when the element is created. To update, remove and re-add the element, or use JavaScript to update properties:

```javascript
const chatbot = document.querySelector('support-chatbot');
chatbot.setAttribute('api-url', 'https://new-api-url.com');
```

### Issue: In Angular 9 - TypeScript errors

**Solution:**
- Add type declarations as shown in the Angular 18 section, or use `// @ts-ignore` above the element usage.

### Issue: In PrimeFaces - Element not rendering

**Solution:**
1. Ensure scripts are loaded after the page content
2. Check that JSF is not escaping the HTML
3. Try using `<h:outputText escape="false">` wrapper (not recommended for security, but for testing)

---

## Building for Production

### Optimize the Build

```bash
npm run build:element:prod
```

This creates optimized, minified bundles suitable for production use.

### Versioning

For production, consider:
1. Adding version numbers to file names
2. Using a CDN to serve the files
3. Implementing cache-busting strategies

---

## Security Considerations

1. **XSS Protection**: The chatbot element is safe to use, but ensure your API endpoints are properly secured
2. **CORS**: Configure CORS properly on your backend
3. **Content Security Policy**: If using CSP, ensure it allows the chatbot scripts
4. **API Keys**: Never hardcode sensitive API keys in the attributes

---

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all configuration attributes are correct
3. Test the API endpoints independently
4. Check network requests in browser DevTools

---

## Example: Complete Integration

### Angular Example (app.component.html)

```html
<div class="app-container">
  <header>
    <h1>My Application</h1>
  </header>
  
  <main>
    <section>
      <h2>Support</h2>
      <support-chatbot
        api-url="http://localhost:3000"
        bot-name="Help Desk"
        initial-message="Need help? Ask me anything!">
      </support-chatbot>
    </section>
  </main>
</div>
```

### PrimeFaces Example (support.xhtml)

```xhtml
<ui:composition template="/templates/template.xhtml">
    <ui:define name="content">
        <div class="ui-g">
            <div class="ui-g-12">
                <h2>Support Chat</h2>
                <support-chatbot
                    api-url="#{applicationBean.apiBaseUrl}"
                    bot-name="Customer Support"
                    initial-message="Hello! How can we help you today?">
                </support-chatbot>
            </div>
        </div>
    </ui:define>
</ui:composition>
```

---

**Note:** Make sure your backend API is running and accessible from the URLs you specify in the `api-url` attribute.

