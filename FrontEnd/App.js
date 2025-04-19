const form = document.getElementById("deathForm");

function toggleBook() {
  const book = document.getElementById("book");
  book.classList.toggle("open");
}

function simulateDeath(victim) {
  if (!victim.photo) {
    alert("La persona no morirá si no se carga la foto.");
    return;
  }

  setTimeout(() => {
    if (!victim.cause) {
      victim.cause = "Ataque al corazón";
      addToVictims(victim);
    } else if (!victim.details) {
      alert("Tienes 6 minutos y 40 segundos para escribir los detalles...");
    }
  }, 1000); // Puedes poner 400000 para 6m 40s
}

function addToVictims(victim) {
  console.log("⚰️", victim);
  alert(`${victim.name} ha muerto por ${victim.cause}.`);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const victim = {
    name: document.getElementById("name").value,
    cause: document.getElementById("cause").value,
    details: document.getElementById("details").value,
    photo: document.getElementById("photo").files[0],
  };

  simulateDeath(victim);
});
