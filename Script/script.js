let initial_page = document.body.innerHTML;

// Function to let the user choose the game mode
function chooseGameMode() {
  let type_of_item;
  let type_of_item_choice = document.querySelectorAll('input[name="content_type"]');
  let item_context = document.getElementById("context");
  let list_of_context = [];
  let selected_mode;

  // Function to show the available options based on the selected content type
  function showOptions(list) {
    item_context.innerHTML = `` + `<option value="default">Not chosen</option>`;
    for (let i = 1; i <= list.length; i++) {
      item_context.innerHTML += `
      <option>${list[i-1]}</option>
      `;
    }
  }

  // Function to handle the user's choice of content type
  function getContentType() {
    type_of_item_choice.forEach(element => {
      if (element.checked) {
        if (element.id === "word") {
          type_of_item = "word";
          list_of_context = Object.keys(WORD_LIST);
        }

        if (element.id === "phrase") {
          type_of_item = "phrase";
          list_of_context = Object.keys(PHRASE_LIST);
        }
      }
    });
    showOptions(list_of_context);
  }

  // Event listener for the item type selection
  type_of_item_choice.forEach(element => {
    element.addEventListener("change", getContentType);
  });

  // Event listener for the content selection
  item_context.addEventListener("change", event => {
    selected_mode = event.target.value;
    // Add a start button
    let start_button = document.getElementById("content_type");
    start_button.innerHTML = `
    <button type="button" id="start_button">Start</button>
    `;
  
    let start = document.getElementById("start_button");
    start.addEventListener("click", () => {
      startGame(type_of_item, selected_mode);
    });
  });
}

// Function to retrieve user input for a specific item
function retrieveUserInput(game_context, item_number, item_value, number_of_item) {
  return new Promise((resolve, reject) => {
    let input;
    let instruction = document.getElementById("instruction");
    let user_input = document.getElementById("user_input");
    let input_submit = document.getElementById("input_submit");

    // Display the challenge to the user
    instruction.innerHTML = `${game_context} #${item_number} out of ${number_of_item} : <span class="text_to_write">${item_value}</span>`;

    function getInput() {
      if (user_input.value != "") {
        input = user_input.value;
        resolve(input);
      }
    }

    // For user pressing Enter key
    user_input.addEventListener("keypress", event => {
      if (event.key === "Enter") {
        getInput();
      }
    });

    // For user clicking on the submit button
    input_submit.addEventListener("click", () => {
      getInput()
    });
  });
}

// Main game function
async function startGame(type_of_item, game_context) {
  let type = {};
  let list_of_item = [];
  let item_number = 1;
  let number_of_item = 0;
  let item_value = "";
  let answer = "";
  let score = 0;
  let challenge_number = document.getElementById("challenge_number");
  let answer_review = document.getElementById("review");
  let current_info = document.getElementById("info");
  let final_info = document.getElementById("final_info");
  let final_score = document.getElementById("final_score");
  let final_time = document.getElementById("final_time");
  let starting_time = Date.now();
  let time_spent;

  let hide_choice = document.getElementById("choice_section");
  let show_gameplay = document.getElementById("gampelay_section");
  hide_choice.setAttribute("class", "hide_target");
  show_gameplay.removeAttribute("class", "hide_target");
  
  type = GAME_MODE[type_of_item];
  list_of_item = type[game_context];
  number_of_item = list_of_item.length;

  function correctAnswer() {
    answer_review.setAttribute("id", "win");
    answer_review.textContent = "Let's go !!";
    score += 1;
  }

  function wrongAnswer() {
    answer_review.setAttribute("id", "lose");
    answer_review.textContent = "You suck!";
  }

  // Loop through each item
  for (item_number; item_number <= number_of_item; item_number++) {
    challenge_number.textContent = `Do the challenge ${item_number}`;
    item_value = list_of_item[item_number - 1];
    answer = await retrieveUserInput(game_context, item_number, item_value, number_of_item);

    // Reset review property
    answer_review.removeAttribute("id");
  
    // Check the user's answer and update the score
    if (answer === item_value || answer === item_value + " ") {
      correctAnswer();
    } else {
      wrongAnswer();
    }

    current_info.textContent = `Current score : ${score}`;

    // Clear the user input field for the next challenge
    let inserted_text = document.getElementById("user_input");
    inserted_text.value = "";
  }

  // Display the time spent and the final score at the end of the game
  let main = document.querySelector("main");
  main.innerHTML = ``; // Clear main content
  time_spent = (Date.now() - starting_time)/1000;
  final_time.innerHTML = `Time spent : <strong>${time_spent} seconds</strong>`;
  final_score.setAttribute("id", "final_score");
  final_score.textContent = `Final score : ${score}/${number_of_item}`;
  final_info.setAttribute("class", "popup");
  
  retryGame(time_spent);
}

// Function to retry the game
function retryGame(time_spent) {
  let retry_button = document.createElement("button");
  retry_button.id = "retry";
  retry_button.textContent = "Retry";
  let create_retry_button = document.getElementById("final_info");
  create_retry_button.appendChild(retry_button);
  let retry = document.getElementById("retry");
  retry.addEventListener("click", () => {
    // Reset the game by reloading the page
    document.body.innerHTML = initial_page;
    // Add score to score board
    let last_score = document.getElementById("last_score");
    last_score.innerHTML = `
    <p>Last Score : ${time_spent}</p>
    `;
    run();
  });
}

// Main function to run the game
function run() {
  try {
    chooseGameMode();
  } catch (error) {
    document.body.innerHTML = `
    <h4>Some errors occurred: ${error}<h4>
    `;
    console.log(error);
  }
}
