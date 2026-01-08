# Game 7 - Image Playground

A web-based image generation playground that allows users to create custom images by selecting different environments and objects.

## Features

- Environment selection (forest, beach, city, space, underwater, etc.)
- Object selection (car, house, animal, person, etc.)
- Image generation simulation
- Responsive design
- Modern UI with gradient backgrounds and smooth animations

## How to Use

1. Select an environment from the dropdown menu
2. Select an object from the dropdown menu
3. Click the "Generate Image" button
4. View your generated image in the preview area

## Technologies Used

- HTML5
- CSS3 (with gradients, animations, and responsive design)
- JavaScript (for interactivity and image handling)

## File Structure

- `index.html` - Main HTML structure
- `style.css` - Styling and layout
- `script.js` - Interactive functionality
- `config.js` - API configuration

## Setup

To use the full functionality with AI image generation:

1. Get an API token from [Hugging Face](https://huggingface.co/settings/tokens)
2. Add your token to the `config.js` file in the `huggingFace.token` field
3. The application will use fallback images if no token is provided

## Note

This application connects to the Hugging Face API for AI image generation, with fallback images provided when the API is not configured or unavailable.