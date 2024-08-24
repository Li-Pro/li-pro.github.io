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
<en-export>
  <note>
    <title>${title}</title>
    <note-attribute>
      <place-name>Notes</place-name>
    </note-attribute>
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
  let words = Array.from(wordNodes).map(
    (node) => node.childNodes[0].textContent
  );

  let wordText = wordListNote(`${month}/${date}`, words);
  let blob = new Blob([wordText], { type: "application/xml" });
  let file = new File([blob], `words ${month}${date}.enex`, {
    type: "application/xml",
  });

  navigator.share({
    files: [file],
  });
}

document
  .getElementById("task-form")
  .addEventListener("submit", onSearchClicked);

document
  .getElementById("btn-search")
  .addEventListener("click", onSearchClicked);

document.getElementById("btn-share").addEventListener("click", onShareClicked);
