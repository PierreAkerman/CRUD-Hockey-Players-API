const sectionList = document.getElementById('sectionList');
const sectionNew = document.getElementById('sectionNew');
const sectionEdit = document.getElementById('sectionEdit');

const playerTableBody = document.getElementById('playerTableBody');

const submitNewPlayer = document.getElementById('submitNewPlayer');
const submitEditPlayer = document.getElementById('submitEditPlayer');

const newName = document.getElementById('newName');
const newJersey = document.getElementById('newJersey');
const newAge = document.getElementById('newAge');
const newBorn = document.getElementById('newBorn');

const editName = document.getElementById('editName');
const editJersey = document.getElementById('editJersey');
const editAge = document.getElementById('editAge');
const editBorn = document.getElementById('editBorn');

const search = document.getElementById('search');
const baseApi = "https://hockeyplayers.systementor.se/pirreakerman@gmail.com/player";

const sortOnHeaders = document.getElementById('table').querySelectorAll('th>a');
for (let header of sortOnHeaders) {
  header.addEventListener('click', () => {
    sort(header.id);
  })
}

class Player {
  constructor(id, name, jersey, age, born) {
    this.id = id;
    this.name = name;
    this.jersey = jersey;
    this.age = age;
    this.born = born;
  }
}

function showSection(sectionsId) {
  if (sectionsId == 'sectionList') {
    sectionList.style.display = "block";
    sectionNew.style.display = "none";
    sectionEdit.style.display = "none";
  }
  else if (sectionsId == 'sectionNew') {
    sectionList.style.display = "none";
    sectionNew.style.display = "block";
    sectionEdit.style.display = "none";
  }
  else if (sectionsId == 'sectionEdit') {
    sectionList.style.display = "none";
    sectionNew.style.display = "none";
    sectionEdit.style.display = "block";
  }
}

newLink.addEventListener("click", () => {
  showSection('sectionNew');
});

listLink.addEventListener("click", () => {
  showSection('sectionList');
});

submitNewPlayer.addEventListener("click", () => {
  createPlayer();
});

submitEditPlayer.addEventListener("click", () => {
  editPlayer();
});

search.addEventListener("keyup", () => {
  searchPlayer();
});

// ---Kan flyttas ut till modul--- //
function createPlayer() {
  fetch(baseApi, {
    method: "POST",
    sortOnHeaders: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      namn: newName.value,
      jersey: newJersey.value,
      age: newAge.value,
      born: newBorn.value,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      const player = new Player(
        json.id,
        newName.value,
        newJersey.value,
        newAge.value,
        newBorn.value
      );

      players.push(player);
      renderPlayer(player);
      showSection("sectionList");
    });
}

// ---Kan flyttas ut till modul--- //
function editPlayer() {
  fetch(baseApi + "/" + editingPlayer.id, {
    method: "PUT",
    sortOnHeaders: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      namn: editName.value,
      jersey: editJersey.value,
      age: editAge.value,
      born: editBorn.value,
    }),
  })
    .then((response) => {
      refreshPlayers().then(() => {
        createTable();
        showSection("sectionList");
      })
    });
}

// ---Kan flyttas ut till modul--- //
function searchPlayer(){
  const lowercase = search.value.toLowerCase();

  const filteredList = players.filter((player) =>
    player.name.toLowerCase().includes(lowercase)
  );
  playerTableBody.innerHTML = "";
  filteredList.forEach((player) => {
    renderPlayer(player);
  });
}

let editingPlayer = null;
function fillEditForm(id) {
  editingPlayer = players.find((player) => player.id == id)
  editName.value = editingPlayer.name;
  editJersey.value = editingPlayer.jersey;
  editAge.value = editingPlayer.age;
  editBorn.value = editingPlayer.born;
  showSection('sectionEdit');
}

function renderPlayer(player) {
  let jsCall = `fillEditForm(${player.id})`;
  let template = `<tr>
                        <td>${player.name}</td>
                        <td class="editplcement1">${player.jersey}</td>
                        <td class="editplcement1">${player.age}</td>
                        <td>${player.born}</td>
                        <td class="editplcement1 iconsize"><a href="#" onclick="${jsCall}"><i class='bx bxs-edit'></i></a></td>
                    </tr>`;
  playerTableBody.innerHTML = playerTableBody.innerHTML + template;
}

function createTable() {
  playerTableBody.innerHTML = "";
  players.forEach(player => {
    renderPlayer(player);
  });
}

async function refreshPlayers() {
  players = [];
  return fetch(baseApi)
    .then((response) => response.json())
    .then((array) => {
      array.forEach((player) => {
        p = new Player(
          player.id,
          player.namn,
          player.jersey,
          player.age,
          player.born
        );
        const keys = Object.keys(p);
        keys.forEach((key) => { ascending[key] = false });
        players.push(p);
      });
    });
}
  /*
    Ascending är en array med booleaner
    som säger vilken ordning som en header
    ska sorteras på.
  */

  // Om ascending-arren med nyckeln är sann, ändra på riktning spelarna sorteras på
function sort(key) {
  players.sort((player1, player2) => {
    if (player1[key] > player2[key]) {
      return 1;
    } else if (player1[key] < player2[key]) {
      return -1;
    } else return 0;
  });

  if (ascending[key]) {
    players.reverse();
  }
  ascending[key] = !ascending[key];
  playerTableBody.innerHTML = "";
  createTable();
}

let players = [];
let ascending = [];
refreshPlayers()
  .then(players => {
    createTable();
    showSection('sectionList');
  });