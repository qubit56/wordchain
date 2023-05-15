$(document).ready(function() {
    var userInput = "";  // 마지막 단어 저장 변수
    var score = 0;  // 점수 저장 변수
    let lastWord = "";
    let $chatLog = $("#chat-log");
    let $score = $("#score");
  
    var chatBody = $('.chat-body');
  
    // 메시지 추가 함수
    function addMessage(message, isUser) {
      var className = isUser ? 'user' : 'chatbot';
      var $messageBubble = $('<div class="message-bubble"></div>');
      $messageBubble.addClass(className);
      $messageBubble.text(message);
      var $messageRow = $('<div class="message-row"></div>');
      $messageRow.append($messageBubble);
      chatBody.append($messageRow);
      chatBody.scrollTop(chatBody[0].scrollHeight);
    }
  
    // 단어의 유효성을 확인하는 함수
    function isWordValid(word) {
      return new Promise((resolve, reject) => {
        var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
        $.get(url, function(response) {
          if (response.length > 0) {
            var meanings = response[0]['meanings'];
            if (meanings.length > 0) {
              resolve(true);
            }
          }
          resolve(false);
        });
      });
    }
  
    // 끝말잇기 게임 시작
    //addMessage('끝말잇기를 시작합니다!', false);
    //addMessage('아무 단어나 먼저 입력하세요.', false);
  
    function resetGame() {
      lastWord = "";
      score = 0;
      $score.text(score);
      addMessage("끝말잇기 게임을 시작합니다.",false);
    }
  
    function handleUserInput() {
      let userInput = $("#user-input").val();
      if (userInput === "") {
        addMessage("단어를 입력하세요.",true);
        return;
      }
      if (lastWord !== "" && userInput[0] !== lastWord[lastWord.length-1]) {
        addMessage(`끝말잇기 규칙에 어긋납니다! `,false);
        score--;
        $score.text(score);
        return;
      }
      isWordValid(userInput)
        .then(function(isValid) {
          if (isValid) {
            if (lastWord === "") {
              addMessage(`'${userInput}'은(는) 시작하는 단어입니다.'${userInput[userInput.length-1]}'로 시작하세요`,true);
            } else {
              addMessage(`'${userInput}'은(는) 정답입니다! '${userInput[userInput.length-1]}'로 시작하세요`,false);
              score++;
              $score.text(score);
            }
            lastWord = userInput;
          } else {
            addMessage(`'${userInput}'은(는) 유효한 단어가 아닙니다! '${userInput[userInput.length-1]}'로 시작하세요`,false);
            score--;
            $score.text(score);
          }
        });
      $("#user-input").val("");
    }
  
    resetGame();
  
    $("#send-message").on("click", function() {
      handleUserInput();
    });
  
    $("#user-input").on("keydown", function(event) {
        if (event.keyCode === 13) {
            handleUserInput();
        }
    });
  });