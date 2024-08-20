async function searchWordDefs(word) {
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

      return await response.json();
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
  } catch (error) {
    console.error(`Error during word lookup: ${error.message}`);
    return;
  } finally {
    taskInput.disabled = false;
  }

  for (let def of defs.definition) {
    // Create a new list item
    const li = document.createElement("li");
    li.textContent = `${taskText} (${def.pos[0]}.) ${def.translation}`;

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Append delete button to list item
    li.appendChild(deleteBtn);

    // Append list item to task list
    document.getElementById("task-list").appendChild(li);

    // Clear the input
    taskInput.value = "";

    // Add event listener to delete button
    deleteBtn.addEventListener("click", function () {
      li.remove();
    });
  }
}

function wordListNote(title, words) {
  let textWords = Array.from(
    words.map((word) => `<li><div>${word}</div></li>`)
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export4.dtd">
<en-export export-date="20240820T161339Z" application="Evernote" version="10.101.5">
  <note>
    <title>${title}</title>
    <created>20240820T160822Z</created>
    <updated>20240820T161314Z</updated>
    <content>
      <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
        <en-note>
          <ol>
            ${textWords}
          </ol>
        </en-note>
      ]]>
    </content>
  </note>
</en-export>
`;
}

async function onShareClicked(_event) {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");

  let wordNodes = document.getElementById("task-list").children;
  let words = Array.from(wordNodes).map((node) => node.textContent);

  let wordText = wordListNote(`${month}/${date}`, words);
  navigator.share({
    text: wordText,
  });
}

document
  .getElementById("task-form")
  .addEventListener("submit", onSearchClicked);

document
  .getElementById("btn-search")
  .addEventListener("click", onSearchClicked);

document.getElementById("btn-share").addEventListener("click", onShareClicked);
