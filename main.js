let events = [];
let arr = [];

const eventName = document.querySelector('#eventName');
const eventDate = document.querySelector('#eventDate');
const buttonAdd = document.querySelector('#bAdd');
const eventsContainer = document.querySelector('#eventsContainer');

const json = load();

try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}

events = arr ? [...arr] : [];

console.log(arr);
renderEvents();


document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    addEvent();
});

buttonAdd.addEventListener('click', e => {
    e.preventDefault();
    addEvent();
});

function addEvent() {
    if (eventName.value === "" || eventDate.value === "") {
        alert('Debes llenar los espacios vacíos.');
        return;
    }

    if (dateDiff(eventDate.value) < 0) {
        alert('La fecha no debe ser anterior a la actual.');
        return;
    }

    const newEvent = {
        id: generateUniqueId(),
        name: eventName.value,
        date: eventDate.value,
    };

    events.unshift(newEvent);

    save(JSON.stringify(events));

    eventName.value = "";
    eventDate.value = "";

    renderEvents(events);
}

function dateDiff(d) {
    const date1 = new Date(d);
    const date2 = new Date();
    const difference = date1.getTime() - date2.getTime();
    const days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
}

function renderEvents() {
    const eventsHTML = events.map(event => {
        return `
        <div class="event">
            <div class="days">
                <span class="days-number">${dateDiff(event.date)}</span>
                <span class="days-text">días</span>
            </div>

            <div class="event-name">${event.name}</div>
            <div class="event-date">${event.date}</div>
            <div class="actions">
                <button class="bDelete" data-id="${event.id}">Eliminar</button>
            </div>
        </div>
        `;
    });
    
    if (eventsContainer) {
        eventsContainer.innerHTML = eventsHTML.join("");
    } else {
        console.error("El contenedor de eventos no está definido.");
    }

    document.querySelectorAll(".bDelete").forEach(button => {
        button.addEventListener("click", e => {
            const id = button.getAttribute('data-id');
            events = events.filter(event => event.id !== id);

            save(JSON.stringify(events));

            renderEvents();
        });
    });
}



//genera un id unico
function generateUniqueId() {
    return (Math.random() * 100).toString(36).slice(3);
}

//guarda la información almacenada en el localStorage
function save(data){
    localStorage.setItem('items', data);
}

// Carga la información almacenada desde el localStorage
function load(){
    return localStorage.getItem('items');
}
