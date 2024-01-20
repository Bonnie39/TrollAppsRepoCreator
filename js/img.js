// Function to update image preview with validation
function updateImagePreview() {
    const repoIconURLInput = document.getElementById('repoIconURL');
    const previewImage = document.getElementById('previewImage');

    const iconURL = repoIconURLInput.value;

    // Validate if it is a valid image URL
    isValidImageURL(iconURL, function (isValid) {
        if (isValid) {
            // Update the image source
            previewImage.src = iconURL;
        } else {
            // Clear the image source if the URL is not valid
            previewImage.src = '';
        }
    });
}

// Function to validate if a URL is a valid image URL
function isValidImageURL(url, callback) {
    const img = new Image();
    img.onload = function () {
        // The URL is a valid image
        callback(true);
    };
    img.onerror = function () {
        // The URL is not a valid image
        callback(false);
    };
    img.src = url;
}

// Attach event listener to input field to trigger the update function on change
const repoIconURLInput = document.getElementById('repoIconURL');
repoIconURLInput.addEventListener('input', updateImagePreview);
