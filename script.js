//modal
const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".closeBtn");
const titleInput = document.querySelector("#titleInput");
const descriptionInput = document.querySelector("#description-input");
const selectedStatus = document.querySelector("#status");
let currentStatus = "To Try";
const addIdeaBtn = document.querySelector(".add-idea-btn");
const addIdeaForm = document.querySelector(".form-group");
//search
const searchInput = document.querySelector("#SearchInput");
//main
const board = document.querySelector(".board");
const columnContents = document.querySelectorAll(".column-content");
let ideas = [
  {
    id: 1,
    title: "Weekly Meal Planner",
    desc: "Organize weekly meals, save your favorite recipes, and plan dishes you want to try.",
    status: "To Try",
  },
  {
    id: 2,
    title: "Daily Study Tracker",
    desc: "Break subjects into tasks, organize study sessions, and track your progress easily.",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Travel Planner",
    desc: "Plan your trip essentials, list places to visit, and mark items as you prepare everything.",
    status: "Done",
  },
];

//displayed ideas
let displayedIdeas = [...ideas];

function renderIdeas(ideasArray) {
  document
    .querySelectorAll(".column-content")
    .forEach((col) => (col.innerHTML = ""));

  ideasArray.forEach((idea) => {
    const ideaDiv = document.createElement("div");
    ideaDiv.classList.add("idea");
    ideaDiv.draggable = true;
    ideaDiv.dataset.index = idea.id;
    //drag & drop
    ideaDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", ideaDiv.dataset.index);
      ideaDiv.style.cursor = "grabbing";
      ideaDiv.style.opacity = "0.5";
    });
    ideaDiv.addEventListener("dragend", () => {
      ideaDiv.style.cursor = "grab";
      ideaDiv.style.opacity = "1";
    });
    const title = document.createElement("h2");
    title.textContent = idea.title;

    const description = document.createElement("p");
    description.textContent = idea.desc;

    const featuresDiv = document.createElement("div");
    featuresDiv.classList.add("features");

    const deltBtn = document.createElement("button");
    deltBtn.classList.add("delete-btn");
    deltBtn.textContent = "Delete";
    deltBtn.dataset.index = idea.id;

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("copy-btn");
    copyBtn.textContent = "Copy";

    const columnDiv = document.querySelector(
      `[data-column="${idea.status}"] .column-content`
    ); //.column-content inside that element

    featuresDiv.append(deltBtn, copyBtn);
    ideaDiv.append(title, description, featuresDiv);

    columnDiv.append(ideaDiv);
  });
}

function updateDisplayedIdeas() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    displayedIdeas = ideas.filter((idea) =>
      idea.title.toLowerCase().includes(searchTerm)
    );
  } else {
    displayedIdeas = [...ideas];
  }
}

//drag and drop

columnContents.forEach((content) => {
  content.addEventListener("dragover", (e) => {
    e.preventDefault();
    content.closest(".column").classList.add("dragover");
  });

  content.addEventListener("dragleave", () => {
    content.closest(".column").classList.remove("dragover");
  });

  content.addEventListener("drop", (e) => {
    e.preventDefault();
    content.closest(".column").classList.remove("dragover");

    const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
    const draggedIdea = ideas.find((i) => i.id === draggedId);
    const columnStatus = content.closest(".column").dataset.column;

    draggedIdea.status = columnStatus;
    updateDisplayedIdeas();
    renderIdeas(displayedIdeas);
    localStorage.setItem("ideas", JSON.stringify(ideas));
  });
});

//addIdea dynamically

addIdeaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTitle = titleInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  ideas.push({
    id: Date.now(),
    title: newTitle,
    desc: newDescription,
    status: currentStatus,
  });
  updateDisplayedIdeas();
  renderIdeas(displayedIdeas);
  titleInput.value = "";
  descriptionInput.value = "";
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 300);
  localStorage.setItem("ideas", JSON.stringify(ideas));
});

//event delegation & copy
board.addEventListener("click", (e) => {
  //closest parent div
  const parentDiv = e.target.closest(".idea");
  if (!parentDiv) return;

  if (e.target.classList.contains("delete-btn")) {
    const id = parseInt(e.target.dataset.index);
    ideas = ideas.filter((idea) => idea.id !== id);
    updateDisplayedIdeas();
    renderIdeas(displayedIdeas);
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }

  if (e.target.classList.contains("copy-btn")) {
    const heading = parentDiv.querySelector("h2").textContent.trim();
    const desc = parentDiv.querySelector("p").textContent.trim();

    const copiedText = `Title: ${heading}\nDescription: ${desc}`;

    navigator.clipboard
      .writeText(copiedText)
      .then(() => {
        e.target.textContent = "Copied!";
        setTimeout(() => {
          e.target.textContent = "Copy";
        }, 2000);
      })
      .catch(() => {
        e.target.textContent = "Failed to Copy!";
        setTimeout(() => {
          e.target.textContent = "Copy";
        }, 2000);
      });
  }
});

//open modal
addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
  }, 300);
});
//floatingBTN
const floatingAddBtn = document.getElementById("floatingAddBtn");
floatingAddBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
  }, 300);
});
//close modal
closeBtn.addEventListener("click", () => {
  setTimeout(() => {
    modal.classList.remove("show");
  }, 300);

  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
});
//searching
searchInput.addEventListener("input", () => {
  updateDisplayedIdeas();
  renderIdeas(displayedIdeas);
});
//selected status
selectedStatus.addEventListener("change", () => {
  currentStatus = selectedStatus.value;
});

//loading

window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("ideas"));
  if (saved) ideas = saved;
  updateDisplayedIdeas();
  renderIdeas(displayedIdeas);
});

//click
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    setTimeout(() => {
      modal.classList.remove("show");
    }, 300);

    setTimeout(() => {
      modal.style.display = "none";
    }, 400);
  }
});
