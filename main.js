import './assets/css/index.scss';

const host = document.querySelector('.drone');
const parts = host.querySelectorAll('.drone__part');
const optionsContainer = document.querySelector('.options');

const TYPES = {
  frame: [0],
  motor: [1],
  fc: [2, 3, 4],
  camera: [5, 6, 7, 8],
  vtx: [5, 9, 10, 11],
};

init();

function init() {
  parts.forEach(part => {
    part.addEventListener('click', () => {
      clearSelection();
      part.classList.add('drone__part_active');
      host.classList.add('drone_active');
    });
  });
  fetchOptions();
}

function clearSelection() {
  host.classList.remove('drone_active');
  parts.forEach(part => part.classList.remove('drone__part_active'));
}

async function fetchOptions() {
  const data = await fetch('https://kiriodozaki.ru/wp-json/wp/v2/pages/564').then(response => response.json());
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.content.rendered, 'text/html');
  const items = [...doc.querySelectorAll('.uagb-rm__content')].map((card, id) => ({
    image: card.querySelector('img')?.src,
    name: card.querySelector('.uagb-rm__title')?.textContent.trim(),
    description: card.querySelector('.uagb-rm__desc')?.textContent.trim(),
    types: Object.entries(TYPES)
      .map(([type, ids]) => ids.includes(id) ? type : null)
      .filter(Boolean),
  }));
  optionsContainer.innerHTML = items
    .map(item => `
      <div class="options__item" data-type="${item.types.join(' ')}">
        <h3>${item.name}</h3>
        <img src="${item.image}" alt="" />
        <p>${item.description}</p>
      </div>
    `)
    .join('');
}
