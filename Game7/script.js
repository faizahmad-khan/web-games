// Game 7 - Image Playground
// Script to handle image generation based on user selections

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const environmentSelect = document.getElementById('environment');
    const objectSelect = document.getElementById('object');
    const generateBtn = document.getElementById('generate-btn');
    const imageContainer = document.getElementById('image-container');
    const generatedImage = document.getElementById('generated-image');
    const placeholder = document.getElementById('placeholder');
    const loadingDiv = document.getElementById('loading');

    // Check if required elements exist
    if (!environmentSelect || !objectSelect || !generateBtn) {
        console.error('Required elements not found');
        return;
    }

    // Function to generate image prompt based on selections
    function generatePrompt() {
        const environment = environmentSelect.value;
        const object = objectSelect.value;
        
        // Create descriptive prompt for image generation
        return `A ${object} in a ${environment} environment, realistic style, high quality`;
    }

    // Function to show loading state
    function showLoading() {
        loadingDiv.style.display = 'block';
        generatedImage.style.display = 'none';
        placeholder.style.display = 'none';
    }

    // Function to hide loading state
    function hideLoading() {
        loadingDiv.style.display = 'none';
    }

    // Function to display image
    function displayImage(src) {
        generatedImage.src = src;
        generatedImage.style.display = 'block';
        placeholder.style.display = 'none';
    }

    // Function to handle API error by showing fallback image
    function handleError() {
        const environment = environmentSelect.value;
        const object = objectSelect.value;
        const fallbackKey = `${environment}-${object}`;
        
        // Try to get fallback image from config
        const fallbackImage = config.fallbackImages[fallbackKey] || config.fallbackImages.default;
        
        console.warn('API request failed, using fallback image');
        displayImage(fallbackImage);
    }

    // Function to call Hugging Face API
    async function generateImageWithAPI() {
        const prompt = generatePrompt();
        
        // Check if API token is available
        if (!config.huggingFace.token || config.huggingFace.token === '') {
            console.warn('Hugging Face API token not configured, using fallback images');
            handleError();
            return;
        }

        try {
            const response = await fetch(`${config.huggingFace.baseUrl}/${config.huggingFace.model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.huggingFace.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: config.huggingFace.options
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            displayImage(imageUrl);
        } catch (error) {
            console.error('Error generating image:', error);
            handleError();
        }
    }

    // Event listener for generate button
    generateBtn.addEventListener('click', function() {
        // Show loading state
        showLoading();
        
        // Call the image generation function
        generateImageWithAPI();
    });

    // Optional: Generate an image on initial load with default values
    // Uncomment the next line if you want to show a default image on page load
    // generateImageWithAPI();
});