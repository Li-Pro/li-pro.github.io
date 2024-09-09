async function searchWordDefs(word) {
  // return {
  //   "word": "hello",
  //   "pos": [
  //     "exclamation",
  //     "noun"
  //   ],
  //   "verbs": [],
  //   "pronunciation": [
  //     {
  //       "pos": "exclamation",
  //       "lang": "uk",
  //       "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/uk_pron/u/ukh/ukhef/ukheft_029.mp3",
  //       "pron": "/heˈləʊ/"
  //     },
  //     {
  //       "pos": "exclamation",
  //       "lang": "us",
  //       "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/us_pron/h/hel/hello/hello.mp3",
  //       "pron": "/heˈloʊ/"
  //     }
  //   ],
  //   "definition": [
  //     {
  //       "id": 0,
  //       "pos": "exclamation",
  //       "text": "used when meeting or greeting someone",
  //       "translation": "喂，你好（用於問候或打招呼）",
  //       "example": [
  //         {
  //           "id": 0,
  //           "text": "Hello, Paul. I haven't seen you for ages.",
  //           "translation": "「你好，保羅。好久不見了。」"
  //         },
  //         {
  //           "id": 1,
  //           "text": "I know her vaguely - we've exchanged hellos a few times.",
  //           "translation": "我對她不太熟悉——我們只有打過幾次招呼。"
  //         },
  //         {
  //           "id": 2,
  //           "text": "I just thought I'd call by and say hello.",
  //           "translation": "我正好想要去順道拜訪問候一下。"
  //         },
  //         {
  //           "id": 3,
  //           "text": "And a big hello (= welcome) to all the parents who've come to see the show.",
  //           "translation": "非常歡迎所有來看演出的家長。"
  //         }
  //       ]
  //     },
  //     {
  //       "id": 1,
  //       "pos": "exclamation",
  //       "text": "something that is said at the beginning of a phone conversation",
  //       "translation": "（打電話時的招呼語）你好，喂",
  //       "example": [
  //         {
  //           "id": 0,
  //           "text": "\"Hello, I'd like some information about flights to the US, please.\"",
  //           "translation": "「你好，我想詢問一些你們飛往美國的航班資料。」"
  //         }
  //       ]
  //     },
  //     {
  //       "id": 2,
  //       "pos": "exclamation",
  //       "text": "something that is said to attract someone's attention",
  //       "translation": "（引起別人注意的招呼語）",
  //       "example": [
  //         {
  //           "id": 0,
  //           "text": "The front door was open so she walked inside and called out, \"Hello! Is there anybody in?\"",
  //           "translation": "前門開著，於是她走進去喊道：「喂！有人在嗎?」"
  //         }
  //       ]
  //     },
  //     {
  //       "id": 3,
  //       "pos": "exclamation",
  //       "text": "said to someone who has just said or done something stupid, especially something that shows they are not noticing what is happening",
  //       "translation": "（表示認為某人言行愚蠢可笑，尤指對正在發生的事不注意）",
  //       "example": [
  //         {
  //           "id": 0,
  //           "text": "She asked me if I'd just arrived and I was like \"Hello, I've been here for an hour.\"",
  //           "translation": "她問我是否剛剛到，我回答她說「嗨，我已經到這裡一個小時了。」"
  //         }
  //       ]
  //     },
  //     {
  //       "id": 4,
  //       "pos": "exclamation",
  //       "text": "an expression of surprise",
  //       "translation": "（表示驚訝）",
  //       "example": [
  //         {
  //           "id": 0,
  //           "text": "Hello, this is very strange - I know that man.",
  //           "translation": "嘿，這可真奇怪——我認識那個人。"
  //         }
  //       ]
  //     }
  //   ]
  // };  // TODO: DEBUG
  return await fetch(
    `https://dictionary-api.eliaschen.dev/api/dictionary/en-tw/${word}`
  )
    .catch(() => {
      throw new Error("unknown");
    })
    .then(async (response) => {
      if (response.status == 404) {
        throw new Error("not-found");
      }

      if (!response.ok) {
        throw new Error("unknown");
      }

      defs = await response.json();
      defs.definition = Array.from(defs.definition).filter(
        def => def.translation !== ""  // bug, skip phrases
      );
      return defs;
    });
}

async function onSearchClicked(event) {
  event.preventDefault();

  // Get the task input
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  let defs = null;
  try {
    taskInput.disabled = true;
    defs = await searchWordDefs(taskText);
    // navigator.clipboard.writeText(JSON.stringify(defs)); // TODO: DEBUG
  } catch (error) {
    console.error(`Error during word lookup: ${error.message}`);
    return;
  } finally {
    taskInput.disabled = false;
    taskInput.focus();
  }

  const word_ctnr = document.createElement("li");
  word_ctnr.classList.add("word-container");

  function desc_def(def) {
    return `${taskText} (${def.pos[0]}.) ${def.translation}`;
  }

  for (let def of defs.definition) {
    // Create a new list item
    const li = document.createElement("li");
    li.classList.add("word-item");
    li.classList.add("word-tmpl");

    // Create the main task text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = desc_def(def);
    li.appendChild(taskSpan);

    const taskPad = document.createElement("span");
    taskPad.classList.add("word-item-pad");
    li.appendChild(taskPad);

    // Create delete button
    const selectBtn = document.createElement("button");
    selectBtn.textContent = "Select";
    selectBtn.classList.add("select-btn");
    li.appendChild(selectBtn);

    selectBtn.addEventListener(
      "click",
      () => {
        word_ctnr.querySelector(".word-repr").children[0].textContent = taskSpan.textContent;
      }
    )

    li.style.display = "none";
    word_ctnr.appendChild(li);
  }

  // Create a new list item
  const word_repr = document.createElement("li");
  word_repr.classList.add("word-item");
  word_repr.classList.add("word-repr");

  // Create the main task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = desc_def(defs.definition[0]);
  word_repr.appendChild(taskSpan);

  const taskPad = document.createElement("span");
  taskPad.classList.add("word-item-pad");
  word_repr.appendChild(taskPad);

  // Create edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  word_repr.appendChild(editBtn);

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  word_repr.appendChild(deleteBtn);

  // Add event listener to edit button
  editBtn.addEventListener(
    "click",
    () => Array.from(word_ctnr.querySelectorAll(".word-tmpl"))
      .forEach(
        ele => {
          console.log(ele)
          if (ele.style.display === "none") {
            ele.style.display = "flex";
          } else {
            ele.style.display = "none";
          }
        }
      )
  );

  // Add event listener to delete button
  deleteBtn.addEventListener("click", function () {
    word_ctnr.remove();
  });

  word_ctnr.prepend(word_repr);

  // Append list item to task list
  document.getElementById("task-list").appendChild(word_ctnr);

  // Clear the input
  taskInput.value = "";
}

function wordListNote(title, words) {
  let textWords = Array.from(
    Array
      .from(words.entries())
      .map(([id, word]) => ` ${id + 1}. ${word}`)
  ).join("\n");

  return `${title}\n${textWords}`;
}

async function onShareClicked(_event) {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");

  let wordNodes = document.getElementById("task-list").children;
  let words = Array.from(wordNodes).map((node) => node.children[0].children[0].textContent);

  let wordText = wordListNote(`${month}/${date}`, words);
  navigator.share({
    text: wordText
  });
}

document
  .getElementById("task-form")
  .addEventListener("submit", onSearchClicked);

document
  .getElementById("btn-search")
  .addEventListener("click", onSearchClicked);

document.getElementById("btn-share").addEventListener("click", onShareClicked);

document.getElementById("task-input").focus();

// // TODO: DEBUG
// document.getElementById("task-input").value = "hello";
// onSearchClicked({ preventDefault: () => null });
