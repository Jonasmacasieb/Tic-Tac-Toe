  
    var colorBoxes = document.querySelectorAll('.color-box');
    var selectedColorDisplay = document.getElementById('selectedColorDisplay');
    // Variable to store the selected color
    var selectedColor = '';

    // Loop through each color box and attach click event listener
    colorBoxes.forEach(function(box) {
        box.addEventListener('click', function() {
            // Get the background color of the clicked box
            selectedColor = box.style.backgroundColor;
            
   
            // Update the display with the selected color
            selectedColorDisplay.style.backgroundColor = selectedColor;
            
        });
    });

    document.getElementById('confirmButton').addEventListener('click', function() {
      
        document.body.style.backgroundColor = selectedColor;
        
      
    });



    
      // Get the elements
var modal = document.getElementById("myModal");
var backgroundModal = document.getElementById("backgroundModal");
var btn = document.getElementById("myBtn");
var moreSettingsBtn = document.getElementById("moreSettingsButton");
var span = document.getElementsByClassName("close-button")[0];
var backgroundSpan = document.getElementsByClassName("close-button1")[0];
var closeButton2 = document.getElementsByClassName("close-button2")[0]; // Add this line to select the second close button

// Event listener to show the main modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Event listener to show the background modal from the main modal
moreSettingsBtn.onclick = function() {
    modal.style.display = "none"; // Hide main modal
    backgroundModal.style.display = "block"; // Show background modal
}

// Event listener to close the main modal
span.onclick = function() {
    modal.style.display = "none";
}

// Event listener to close the background modal
backgroundSpan.onclick = function() {
    backgroundModal.style.display = "none";
}

// Event listener to close background modal and show main modal
closeButton2.onclick = function() {
    backgroundModal.style.display = "none"; // Hide background modal
    modal.style.display = "block"; // Show main modal
}

// Event listener to close modals when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == backgroundModal) {
        backgroundModal.style.display = "none";
    }
}

  
    