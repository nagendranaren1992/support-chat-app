import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { SupportChatbotComponent } from './lib/support-chatbot.component';

// Bootstrap function to create and register the custom element
async function bootstrap() {
  // Create an Angular application with necessary providers
  const app = await createApplication({
    providers: [
      provideHttpClient()
    ]
  });

  // Create the custom element from the component
  const chatbotElement = createCustomElement(SupportChatbotComponent, {
    injector: app.injector
  });

  // Register the custom element with the browser
  customElements.define('support-chatbot', chatbotElement);

  console.log('Support Chatbot custom element registered successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

