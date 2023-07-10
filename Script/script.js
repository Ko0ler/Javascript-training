let initial_page = document.body.innerHTML;

// Function to let the user choose the game mode
function chooseGameMode(callback) {
  let choice = document.querySelectorAll('input[name="content_type"]');
  let content = document.getElementById("content");
  let content_list = [];
  let selected_mode;

  // Function to show the available options based on the selected content type
  function showOptions(list) {
    content.innerHTML = "" + `<option value="default">Not chosen</option>`;
    for (let i = 1; i <= list.length; i++) {
      content.innerHTML += `
      <option>${list[i-1]}</option>
      `;
    }
  }

  // Function to handle the user's choice of content type
  function handleUserChoice() {
    choice.forEach(element => {
      if (element.checked) {
        if (element.id === "word") {
          content_list = WORD_LIST;
        }

        if (element.id === "phrase") {
          content_list = PHRASE_LIST;
        }
      }
    });
    showOptions(content_list);
  }

  // Attach change event listeners to the radio buttons
  choice.forEach(element => {
    element.addEventListener("change", handleUserChoice);
  });

  // Event listener for the content selection
  content.addEventListener("change", event => {
    selected_mode = event.target.value;
    callback(selected_mode);
  });
}

// Function to get the selected game mode
function getSelectedMode() {
  return new Promise((resolve, reject) => {
    chooseGameMode(function(selected_mode) {
      resolve(selected_mode);
    })
  });  
}

// Function to retrieve user input for a specific item
function retrieveUserInput(type_of_item, item_number, item_value, number_of_item) {
  return new Promise((resolve, reject) => {
    let input;
    let gameplay = document.getElementById("gameplay");
    let user_input = document.getElementById("user_input");
    let input_submit = document.getElementById("input_submit");

    // Display the challenge to the user
    gameplay.innerHTML = `Write the ${type_of_item} #${item_number} out of ${number_of_item} : <span class="text_to_write">${item_value}</span>`;
    input_submit.addEventListener("click", () => {
      input = user_input.value;
      resolve(input);
    });
  });
}

// Main game function
async function startGame() {
  let game_choice = "";
  let type_of_item = "";
  let list_of_item = [];
  let item_number = 1;
  let number_of_item = 0;
  let item_value = "";
  let answer = "";
  let score = 0;
  let challenge_number = document.getElementById("challenge_number");
  let answer_review = document.getElementById("review");
  let current_score = document.getElementById("current_score");
  let final_score = document.getElementById("final_score");

  // Clear previous game state
  challenge_number.textContent = "";
  answer_review.textContent = "";
  current_score.textContent = "";
  final_score.textContent = "";

  // Get the selected game mode from the user
  game_choice = await getSelectedMode();
  type_of_item = game_choice;
  list_of_item = GAME_MODE[game_choice];
  number_of_item = list_of_item.length;

  // Loop through each item
  for (item_number; item_number <= number_of_item; item_number++) {
    challenge_number.textContent = `Do the challenge ${item_number}`;
    item_value = list_of_item[item_number - 1];
    answer = await retrieveUserInput(type_of_item, item_number, item_value, number_of_item);
    answer_review.removeAttribute("id", "win");
    answer_review.removeAttribute("id", "loose");

    // Check the user's answer and update the score
    if (answer === item_value) {
      answer_review.setAttribute("id", "win");
      answer_review.textContent = "Great!";
      score += 1;
    } else {
      answer_review.setAttribute("id", "loose");
      answer_review.textContent = "Wrong!";
    }

    current_score.textContent = `Current score : ${score}`;

    // Display the final score at the end of the game
    if (item_number === number_of_item) {
      final_score.setAttribute("id", "final_score");
      final_score.textContent = `Final score : ${score}/${number_of_item}`;
    }

    // Clear the user input field for the next challenge
    let inserted_text = document.getElementById("user_input");
    inserted_text.value = "";
  }

  // Hide the submit button after the game ends
  let submit_button = document.getElementById("input_submit");
  submit_button.innerHTML = "";
}

// Function to retry the game
function retryGame() {
  let retry_button = document.createElement("button");
  retry_button.id = "retry";
  retry_button.textContent = "Retry";
  let create_retry_button = document.getElementById("input_field");
  create_retry_button.appendChild(retry_button);
  let retry = document.getElementById("retry");
  retry.addEventListener("click", () => {
    // Reset the game by reloading the page
    document.body.innerHTML = "";
    run();
  });
}

// Main function to run the game
async function run() {
  // Restore the initial HTML content
  document.body.innerHTML = initial_page;
  try {
    await startGame();
    retryGame();
  } catch (error) {
    document.body.innerHTML = `Some errors occurred: ${error}`;
    console.log(error);
  }
}
