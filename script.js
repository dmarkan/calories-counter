// Predefined ingredients with their calorie values (same as before)
const ingredients = {
    "jaje": 70,
    "maslinovo ulje": 119,
    "šunka": 120,
    "grčki jogurt": 59,
    "paradajz": 22,
    "krastavac": 16,
    "pileće meso": 165,
    "beli luk": 4,
    "crni luk": 40,
    "krompir": 77,
    "brokoli": 34,
    "sir": 350,
    "mleko": 42,
    "jogurt": 61,
    "avokado": 160,
    "badem": 579,
    "orasi": 654,
    "riža": 130,
    "testenina": 131,
    "kesten": 131,
    "mleveno meso": 250,
    "losos": 208,
    "tuna": 132,
    "kisela pavlaka": 193,
    "brašno": 364,
    "kvasac": 105,
    "med": 304,
    "maslac": 717,
    "margarin": 717,
    "so": 0,
    "biber": 6,
    "limun": 29,
    "kakao": 228,
    "malo mleko": 50,
    "banane": 89,
    "jabuka": 52,
    "narandža": 47,
    "grožđe": 69,
    "jagoda": 32,
    "breskva": 39,
    "šljiva": 46,
    "kiwi": 61,
    "dinja": 34,
    "kesten": 131,
    "pržena jaja": 160,
    "kisele krastavce": 16,
    "spanać": 23,
    "zelena paprika": 20,
    "crvena paprika": 31,
    "zobene pahuljice": 389,
    "kinoa": 120,
    "seme bundeve": 446,
    "seme suncokreta": 584,
    "laneno seme": 534,
    "sezam": 573,
    "čokolada": 546,
    "kesten pire": 200,
    "kukuruz": 96,
    "zeleni pasulj": 31,
    "krvavice": 260,
    "zeleni čaj": 1,
    "kafa": 2,
    "beli hleb": 265,
    "crni hleb": 259,
    "integralni hleb": 247,
    "baget": 274,
    "pica": 266,
    "ciabatta": 290,
    "dark chocolate": 546,
    "milk chocolate": 535,
    "marcipan": 570,
    "brownie": 320,
    "oreo": 530,
    "džem": 250,
    "kesten pire": 200,
    "pavlaka": 217,
    "lazanje": 136,
    "tiramisu": 358,
    "puding": 130
};

// Variables to keep track of total calories and ingredient list
let totalCalories = 0;
let ingredientList = [];

// Function to load saved data from localStorage
function loadSavedData() {
    const savedCalories = localStorage.getItem('totalCalories');
    const savedIngredients = localStorage.getItem('ingredientList');
    
    if (savedCalories && savedIngredients) {
        totalCalories = parseInt(savedCalories);
        ingredientList = JSON.parse(savedIngredients);
        updateResult();
    }
}

// Function to save data to localStorage
function saveData() {
    localStorage.setItem('totalCalories', totalCalories);
    localStorage.setItem('ingredientList', JSON.stringify(ingredientList));
}

// Function to start voice recognition
function startListening() {
    const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'sr-RS';
    recognition.interimResults = false;
    recognition.onstart = function() {
        console.log("Voice recognition started. Speak now...");
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("You said: " + transcript);
        if (transcript.includes("briši")) {
            deleteLastIngredient();
        } else {
            calculateCalories(transcript);
        }
    };

    recognition.onerror = function(event) {
        console.error("Error occurred in speech recognition: " + event.error);
    };

    recognition.start();
}

// Function to calculate calories from ingredients and quantities
function calculateCalories(transcript) {
    const words = transcript.split(" ");
    
    for (let i = 0; i < words.length; i++) {
        const ingredient = ingredients[words[i]];

        if (ingredient) {
            let quantity = 100;

            if (i > 0 && !isNaN(words[i - 1])) {
                quantity = parseInt(words[i - 1]);
            }
            else if (i < words.length - 1 && words[i + 1].endsWith("g") && !isNaN(words[i + 1].slice(0, -1))) {
                quantity = parseInt(words[i + 1].slice(0, -1));
            }

            const ingredientCalories = (ingredient * quantity) / 100;
            totalCalories += ingredientCalories;

            ingredientList.push(`${words[i]} (${quantity}g)`);
        }
    }

    saveData();
    updateResult();
}

// Function to update the result on the screen
function updateResult() {
    const resultMessage = `Ukupno kalorija: ${Math.round(totalCalories)} kalorija. Sastojci: ${ingredientList.join(", ")}.`;
    document.getElementById('resultMessage').textContent = resultMessage;
}

// Function to delete the last ingredient
// Function to delete the last ingredient
function deleteLastIngredient() {
    if (ingredientList.length > 0) {
        const lastIngredient = ingredientList.pop(); // Remove last ingredient from list
        
        // Match ingredient name and quantity in grams
        const ingredientMatch = lastIngredient.match(/([a-zčćžšđA-ZČĆŽŠĐ\s]+)\s\((\d+)(g| grama)\)/);
        
        if (ingredientMatch) {
            const lastIngredientName = ingredientMatch[1].trim();  // Ingredient name (e.g., "jaje")
            const lastIngredientQuantity = parseInt(ingredientMatch[2]); // Quantity in grams (e.g., 200)

            // Find the calories per 100g for the ingredient
            const ingredientCaloriesPer100g = ingredients[lastIngredientName];

            if (ingredientCaloriesPer100g) {
                // Calculate the calories for the actual quantity used
                const ingredientCalories = (ingredientCaloriesPer100g * lastIngredientQuantity) / 100;

                // Subtract the calories of the last ingredient
                totalCalories -= ingredientCalories;

                // Save and update the result
                saveData();
                updateResult();
            } else {
                alert("Ingredient not found in the predefined list.");
            }
        } else {
            alert("Failed to extract ingredient and quantity.");
        }
    } else {
        alert("No ingredients to delete.");
    }
}


// Function to clear the saved data
function clearData() {
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('ingredientList');
    totalCalories = 0;
    ingredientList = [];
    updateResult();
}

// Load the saved data when the app starts
window.onload = loadSavedData;
