# Chat Widget

## Installation

```bash
npm install
npm run build
```

## Usage

```html
<script src="dist/chat-widget.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget.ChatWidget({
      ordId: ""
    });
  });
</script>
```

## Configuration Options

- `companyName`: Name displayed in chat header
- `initialMessage`: First message shown in chat
- `primaryColor`: Main color for chat widget
- `secondaryColor`: Secondary color for messages
- `borderRadius`: Border radius for widget elements

## Development

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm run lint`: Run linter
