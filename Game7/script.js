document.addEventListener('DOMContentLoaded', function() {
    const environmentSelect = document.getElementById('environment');
    const objectSelect = document.getElementById('object');
    const generateBtn = document.getElementById('generate-btn');
    const generatedImage = document.getElementById('generated-image');
    const imageContainer = document.getElementById('image-container');
    const placeholder = document.getElementById('placeholder');
    const loadingElement = document.getElementById('loading');
    
    generateBtn.addEventListener('click', generateImage);
    
    async function generateImage() {
        // Show loading state
        loadingElement.style.display = 'block';
        generatedImage.style.display = 'none';
        placeholder.style.display = 'none';
        
        // Get selected values
        const environment = environmentSelect.value;
        const object = objectSelect.value;
        
        try {
            // Create a prompt for the image generation
            const prompt = `A ${object} in a ${environment} environment, photorealistic, high quality`;
            
            // Call the Hugging Face Stable Diffusion API
            // Note: You'll need to get a free API token from Hugging Face and replace 'YOUR_HF_TOKEN' with your actual token
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
                {
                    headers: { 
                        Authorization: "Bearer YOUR_HF_TOKEN" // Replace with your actual token
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: prompt,
                    }),
                }
            );
            
            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                // Set the image source and show it
                generatedImage.src = imageUrl;
                generatedImage.onload = function() {
                    loadingElement.style.display = 'none';
                    generatedImage.style.display = 'block';
                    
                    // Clean up the object URL after the image loads
                    URL.revokeObjectURL(imageUrl);
                };
            } else {
                // If API call fails, use sample images as fallback
                throw new Error('API call failed');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            
            // Sample images for fallback
            const sampleImages = {
                'forest-car': 'https://images.unsplash.com/photo-1505420287108-5f0e0b3cec20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'forest-house': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'forest-animal': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'beach-car': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'beach-house': 'https://images.unsplash.com/photo-151291774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'beach-animal': 'https://images.unsplash.com/photo-1554238781-ea0e3d38e3c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'city-car': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'city-house': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'city-animal': 'https://images.unsplash.com/photo-1557838966-7ae3e68bc0e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'space-car': 'https://images.unsplash.com/photo-1541701494587-cb5850286ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'space-house': 'https://images.unsplash.com/photo-1466781726301-9267faea3e0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'space-animal': 'https://images.unsplash.com/photo-1503256207527-5f4c2ef896f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'underwater-car': 'https://images.unsplash.com/photo-1591195854647-9b72e9a3b76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'underwater-house': 'https://images.unsplash.com/photo-1582159489455-33b6f7dbd0b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'underwater-animal': 'https://images.unsplash.com/photo-153559874564d-e27b25c3a2d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                'default': 'https://images.unsplash.com/photo-1567309254107-5bab5d5c3090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
            };
            
            const imageKey = `${environment}-${object}`;
            const imageUrl = sampleImages[imageKey] || sampleImages.default;
            
            generatedImage.src = imageUrl;
            generatedImage.onload = function() {
                loadingElement.style.display = 'none';
                generatedImage.style.display = 'block';
            };
            
            // Handle image loading error
            generatedImage.onerror = function() {
                loadingElement.style.display = 'none';
                placeholder.textContent = 'Error loading image. Please try again.';
                placeholder.style.display = 'block';
            };
        }
    }
    
    // Optional: Add functionality to allow users to download the generated image
    generatedImage.addEventListener('load', function() {
        // This event fires when the image is loaded
        console.log('Image loaded successfully');
    });
});