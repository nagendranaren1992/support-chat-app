# Support Chat App - Angular Element

This project contains a support chatbot that can be used as an **Angular Element (Web Component)** in any web application, including:

- Angular 9+ projects
- Angular 18+ projects
- PrimeFaces/JSF projects
- Any HTML/JavaScript application

The chatbot is built as a standalone Angular component and packaged as a custom element that can be embedded anywhere.

## Quick Start - Building the Angular Element

To build the chatbot as a reusable Angular Element:

```bash
# Production build (optimized)
npm run build:element:prod

# Development build (with source maps)
npm run build:element:dev
```

The built files will be in `dist/support-chatbot-element/` directory.

## Usage

See **[ANGULAR_ELEMENT_USAGE.md](./ANGULAR_ELEMENT_USAGE.md)** for detailed instructions on:

- Using in Angular 9 projects
- Using in Angular 18 projects
- Using in PrimeFaces/JSF projects
- Configuration options
- Troubleshooting

## Quick Example

After building, include the scripts in your HTML:

```html
<link rel="stylesheet" href="path/to/styles.css" />
<script src="path/to/polyfills.js"></script>
<script src="path/to/main.js"></script>
```

Then use the custom element:

```html
<support-chatbot api-url="http://localhost:3000" bot-name="Support Assistant" initial-message="Hello! How can I help you?"> </support-chatbot>
```

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
