let initial_page = document.body.innerHTML;

function chooseGameType(callback) {
  let choice = document.querySelectorAll('input[name="content_type"]');
  let content = document.getElementById("content");
  let content_list = [];
  let selected_mode;

  function showOptions(list) {
    content.innerHTML = "" + `<option value="default">Not chosen</option>`;
    for (let i = 1; i <= list.length; i++) {
      content.innerHTML += `
      <option>${list[i-1]}</option>
      `;
    }
  }

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

  choice.forEach(element => {
    element.addEventListener("change", handleUserChoice);
  });

  content.addEventListener("change", event => {
    selected_mode = event.target.value;
    callback(selected_mode);
  });
}

function getSelectedMode() {
  return new Promise((resolve, reject) => {
    chooseGameType(function(selected_mode) {
      resolve(selected_mode);
    })
  });  
}

function retrieveUserInput(type_of_item, item_number, item_value, number_of_item) {
  return new Promise((resolve, reject) => {
    let input;
    let gameplay = document.getElementById("gameplay");
    let user_input = document.getElementById("user_input");
    let input_submit = document.getElementById("input_submit");

    gameplay.innerHTML = `Write the ${type_of_item} #${item_number} out of ${number_of_item} : <span class="text_to_write">${item_value}</span>`;
    input_submit.addEventListener("click", () => {
      input = user_input.value;
      resolve(input);
    });
  });
}

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

  challenge_number.textContent = "";
  answer_review.textContent = "";
  current_score.textContent = "";
  final_score.textContent = "";

  game_choice = await getSelectedMode();
  type_of_item = game_choice;
  list_of_item = GAME_MODE[game_choice];
  number_of_item = list_of_item.length;

  // ********************************

  for (item_number; item_number <= number_of_item; item_number++) {
    challenge_number.textContent = `Do the challenge ${item_number}`;
    item_value = list_of_item[item_number - 1];
    answer = await retrieveUserInput(type_of_item, item_number, item_value, number_of_item);
    answer_review.removeAttribute("id", "win");
    answer_review.removeAttribute("id", "loose");

    if (answer === item_value) {
      answer_review.setAttribute("id", "win");
      answer_review.textContent = "Great!";
      score += 1;

    }
    
    else {
      answer_review.setAttribute("id", "loose");
      answer_review.textContent = "Wrong!";
    }

    current_score.textContent = `Current score : ${score}`;

    if (item_number === number_of_item) {
      final_score.setAttribute("id", "final_score");
      final_score.textContent = `Final score : ${score}/${number_of_item}`;
    }

    let inserted_text = document.getElementById("user_input");
    inserted_text.value = "";
  }

  let submit_button = document.getElementById("input_submit");
  submit_button.innerHTML = "";
}

function retryGame() {
  let retry_button = document.createElement("button");
  retry_button.id = "retry";
  retry_button.textContent = "Retry";
  let create_retry_button = document.getElementById("input_field");
  create_retry_button.appendChild(retry_button);
  let retry = document.getElementById("retry");
  retry.addEventListener("click", () => {
    document.body.innerHTML = "";
    run();
  });
}

async function run() {
  document.body.innerHTML = initial_page;
  try {
    await startGame();
    retryGame();
  } catch (error) {
      document.body.innerHTML = `Some errors occured : ${error}`;
      console.log(error);
    }
}
