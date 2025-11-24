# How to Pass Username and Employee ID to the Chatbot

The chatbot component supports multiple ways to pass username and employee ID. Choose the method that best fits your use case.

## Method 1: Using Individual Attributes (Recommended for Angular Elements)

This is the easiest method when using the chatbot as an Angular Element (custom element) in any HTML/JSF application.

### In HTML/JSF/XHTML:

```html
<!-- Pass as individual attributes -->
<support-chatbot
    api-url="http://localhost:3000"
    username="john.doe"
    empid="EMP123">
</support-chatbot>
```

### In Angular Component Template:

```html
<app-support-chatbot
    [apiUrl]="'http://localhost:3000'"
    [username]="'john.doe'"
    [empid]="'EMP123'">
</app-support-chatbot>
```

### In Angular Component with Dynamic Values:

```typescript
// In your component.ts
export class MyComponent {
  currentUser = {
    username: 'john.doe',
    empid: 'EMP123'
  };
}
```

```html
<!-- In your component template -->
<app-support-chatbot
    [apiUrl]="'http://localhost:3000'"
    [username]="currentUser.username"
    [empid]="currentUser.empid">
</app-support-chatbot>
```

## Method 2: Using userData Object (Recommended for Angular Components)

This method works best when using the chatbot as a regular Angular component.

### In Angular Component Template:

```html
<app-support-chatbot
    [apiUrl]="'http://localhost:3000'"
    [userData]="{ username: 'john.doe', empid: 'EMP123' }">
</app-support-chatbot>
```

### With Dynamic Values:

```typescript
// In your component.ts
export class MyComponent {
  userInfo = {
    username: 'john.doe',
    empid: 'EMP123'
  };
}
```

```html
<!-- In your component template -->
<app-support-chatbot
    [apiUrl]="'http://localhost:3000'"
    [userData]="userInfo">
</app-support-chatbot>
```

## Method 3: Using userData as JSON String (For Angular Elements)

When using the chatbot as an Angular Element, you can pass the userData as a JSON string:

### In HTML/JSF/XHTML:

```html
<support-chatbot
    api-url="http://localhost:3000"
    user-data='{"username":"john.doe","empid":"EMP123"}'>
</support-chatbot>
```

### In JSF with EL Expression:

```xhtml
<support-chatbot
    api-url="http://localhost:3000"
    user-data='#{chatbotBean.userDataJson}'>
</support-chatbot>
```

Where `chatbotBean.userDataJson` returns a JSON string:
```java
public String getUserDataJson() {
    return "{\"username\":\"" + getUsername() + "\",\"empid\":\"" + getEmpid() + "\"}";
}
```

## Method 4: Programmatically Setting via JavaScript (For Angular Elements)

If you need to set user data dynamically via JavaScript:

```html
<support-chatbot
    id="my-chatbot"
    api-url="http://localhost:3000">
</support-chatbot>

<script>
    // Wait for the element to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const chatbot = document.getElementById('my-chatbot');
        
        // Method 1: Set individual attributes
        chatbot.setAttribute('username', 'john.doe');
        chatbot.setAttribute('empid', 'EMP123');
        
        // Method 2: Set userData as JSON string
        chatbot.setAttribute('user-data', JSON.stringify({
            username: 'john.doe',
            empid: 'EMP123'
        }));
    });
</script>
```

## Complete Example: JSF/PrimeFaces Integration

```xhtml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:p="http://primefaces.org/ui">

<h:head>
    <title>Support Chat</title>
</h:head>

<h:body>
    <p:outputPanel>
        <!-- Option 1: Individual attributes (easiest) -->
        <support-chatbot
            api-url="http://localhost:3000"
            username="#{userBean.username}"
            empid="#{userBean.employeeId}"
            bot-name="Support Assistant"
            initial-message="Hello! How can I help you?">
        </support-chatbot>
        
        <!-- Option 2: JSON string -->
        <!-- 
        <support-chatbot
            api-url="http://localhost:3000"
            user-data='{"username":"#{userBean.username}","empid":"#{userBean.employeeId}"}'>
        </support-chatbot>
        -->
    </p:outputPanel>
</h:body>
</html>
```

## Complete Example: Angular Component

```typescript
import { Component } from '@angular/core';
import { SupportChatbotComponent } from 'support-chatbot';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [SupportChatbotComponent],
  template: `
    <app-support-chatbot
      [apiUrl]="'http://localhost:3000'"
      [username]="currentUser.username"
      [empid]="currentUser.empid"
      [botName]="'Support Assistant'">
    </app-support-chatbot>
  `
})
export class SupportComponent {
  currentUser = {
    username: 'john.doe',
    empid: 'EMP123'
  };
}
```

## Priority Order

The component uses the following priority order when multiple methods are provided:

1. **Direct @Input properties** (`username` and `empid` attributes)
2. **Parsed userData** (from `userData` input)
3. **sessionStorage** (if available in browser)

## Notes

- User data is automatically saved to `sessionStorage` when provided
- The data persists across page refreshes within the same browser session
- All chat messages and file uploads will include the username and empid
- The data is sent to the backend API for database storage

## Testing

You can test by opening the browser console and checking:
- `sessionStorage.getItem('chatbot_user_data')` should contain your user data
- Network requests to `/api/chat` and `/api/tickets` should include username and empid in the request body

