# Image Generation Validation Prototype

A React application for validating image generation with OpenAI.

## Features

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- OpenAI integration for image generation
- Validation of image prompts

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jonnext/image-generation.git
cd image-generation
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up environment variables (optional):
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file if you want to use image generation features

```bash
cp .env.example .env
# Then edit .env to add your API key (optional)
```

> **Note:** The OpenAI API key is only required if you want to use the image generation features. The application can be deployed without it.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at http://localhost:5173

### Building

To build for production:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

- `src/`: Source code
  - `Components/`: React components
  - `Pages/`: Page components
  - `hooks/`: Custom React hooks
  - `utils/`: Utility functions
  - `constants/`: Constants used throughout the app
  - `assets/`: Static assets

## License

MIT
