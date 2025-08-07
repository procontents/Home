async function fetchLinks() {
    const response = await fetch('links.txt?_=' + Date.now()); // prevent caching
    const text = await response.text();
    return text.split('\n')
        .map(line => {
            if (line.trim() === '' || line.trim() === '---') return null;
            const idMatch = line.match(/File\.No:(\d+)/);
            const titleMatch = line.match(/Title:\s*([^ ]+)/);
            const linkMatch = line.match(/link:\s*([^ ]+)/);
            const imgMatch = line.match(/img:\s*([^ ]+)/);
            const countryMatch = line.match(/country:\s*([^ ]+)/);
            const categoryMatch = line.match(/category:\s*([^ ]+)/);
            if (idMatch && titleMatch && linkMatch) {
                return {
                    id: idMatch[1],
                    name: titleMatch[1].replace(/_/g, ' '),
                    url: linkMatch[1],
                    img: imgMatch ? imgMatch[1] : null,
                    country: countryMatch ? countryMatch[1].replace(/_/g, ' ') : null,
                    category: categoryMatch ? categoryMatch[1].replace(/_/g, ' ') : null
                };
            }
            return null;
        })
        .filter(Boolean);
}

const boxesContainer = document.getElementById('boxes');
const searchInput = document.getElementById('searchInput');
const filtersContainer = document.getElementById('filters');
let allLinks = [];
let lastLinksText = '';
let selectedCountry = 'All';
let selectedCategory = 'All';

function createDropdown(options, label, onChange, selectedValue) {
    const select = document.createElement('select');
    select.className = 'filter-dropdown';
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === selectedValue) option.selected = true;
        select.appendChild(option);
    });
    select.addEventListener('change', e => onChange(e.target.value));
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    const labelElem = document.createElement('label');
    labelElem.textContent = label;
    labelElem.style.fontSize = '0.95rem';
    labelElem.style.color = '#ff3576';
    labelElem.style.marginBottom = '2px';
    wrapper.appendChild(labelElem);
    wrapper.appendChild(select);
    return wrapper;
}

function renderFilters(links) {
    // Get unique countries and categories
    const countries = Array.from(new Set(links.map(l => l.country).filter(Boolean)));
    const categories = Array.from(new Set(links.map(l => l.category).filter(Boolean)));
    countries.sort();
    categories.sort();
    countries.unshift('All');
    categories.unshift('All');
    filtersContainer.innerHTML = '';
    if (countries.length > 1) {
        filtersContainer.appendChild(createDropdown(countries, 'Country', v => { selectedCountry = v; renderBoxes(filterLinks()); }, selectedCountry));
    }
    if (categories.length > 1) {
        filtersContainer.appendChild(createDropdown(categories, 'Category', v => { selectedCategory = v; renderBoxes(filterLinks()); }, selectedCategory));
    }
}

function filterLinks() {
    let filtered = allLinks;
    if (selectedCountry !== 'All') {
        filtered = filtered.filter(l => l.country === selectedCountry);
    }
    if (selectedCategory !== 'All') {
        filtered = filtered.filter(l => l.category === selectedCategory);
    }
    const query = searchInput.value.toLowerCase();
    if (query) {
        filtered = filtered.filter(link =>
            link.name.toLowerCase().includes(query) ||
            (link.id && link.id.toLowerCase().includes(query))
        );
    }
    return filtered;
}

function renderBoxes(links) {
    boxesContainer.innerHTML = '';
    if (links.length === 0) {
        boxesContainer.innerHTML = '<p>No links found.</p>';
        return;
    }
    links.forEach(link => {
        const box = document.createElement('div');
        box.className = 'box';
        if (link.img) {
            const img = document.createElement('img');
            img.src = link.img;
            img.alt = link.name;
            img.className = 'box-img';
            box.appendChild(img);
        }
        const idDiv = document.createElement('div');
        idDiv.className = 'box-id';
        idDiv.textContent = `ID: ${link.id}`;
        box.appendChild(idDiv);
        const title = document.createElement('div');
        title.className = 'box-title';
        title.textContent = link.name;
        box.appendChild(title);
        if (link.country || link.category) {
            const meta = document.createElement('div');
            meta.className = 'box-meta';
            if (link.country) {
                const countryBadge = document.createElement('span');
                countryBadge.textContent = link.country;
                meta.appendChild(countryBadge);
            }
            if (link.category) {
                const categoryBadge = document.createElement('span');
                categoryBadge.textContent = link.category;
                meta.appendChild(categoryBadge);
            }
            box.appendChild(meta);
        }
        box.onclick = () => window.open(link.url, '_blank');
        boxesContainer.appendChild(box);
    });
}

searchInput.addEventListener('input', function() {
    renderBoxes(filterLinks());
});

async function pollLinks() {
    const response = await fetch('links.txt?_=' + Date.now());
    const text = await response.text();
    if (text !== lastLinksText) {
        lastLinksText = text;
        allLinks = text.split('\n')
            .map(line => {
                if (line.trim() === '' || line.trim() === '---') return null;
                const idMatch = line.match(/File\.No:(\d+)/);
                const titleMatch = line.match(/Title:\s*([^ ]+)/);
                const linkMatch = line.match(/link:\s*([^ ]+)/);
                const imgMatch = line.match(/img:\s*([^ ]+)/);
                const countryMatch = line.match(/country:\s*([^ ]+)/);
                const categoryMatch = line.match(/category:\s*([^ ]+)/);
                if (idMatch && titleMatch && linkMatch) {
                    return {
                        id: idMatch[1],
                        name: titleMatch[1].replace(/_/g, ' '),
                        url: linkMatch[1],
                        img: imgMatch ? imgMatch[1] : null,
                        country: countryMatch ? countryMatch[1].replace(/_/g, ' ') : null,
                        category: categoryMatch ? categoryMatch[1].replace(/_/g, ' ') : null
                    };
                }
                return null;
            })
            .filter(Boolean);
        renderFilters(allLinks);
        renderBoxes(filterLinks());
    }
}

async function init() {
    lastLinksText = '';
    await pollLinks();
    setInterval(pollLinks, 5000); // poll every 5 seconds
}

init();

// Porn Stars Section
const pornStars = [
    {
        name: 'Mia Khalifa',
        img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Mia_Khalifa_2019.png',
        meta: 'Lebanon | 1993'
    },
    {
        name: 'Johnny Sins',
        img: 'https://static.wikia.nocookie.net/p__/images/2/2d/Johnny_Sins.png',
        meta: 'USA | 1978'
    },
    {
        name: 'Angela White',
        img: 'https://static.wikia.nocookie.net/p__/images/2/2e/Angela_White.png',
        meta: 'Australia | 1985'
    },
    {
        name: 'Rocco Siffredi',
        img: 'https://static.wikia.nocookie.net/p__/images/7/7e/Rocco_Siffredi.png',
        meta: 'Italy | 1964'
    },
    {
        name: 'Sasha Grey',
        img: 'https://static.wikia.nocookie.net/p__/images/2/2a/Sasha_Grey.png',
        meta: 'USA | 1988'
    },
    {
        name: 'Asa Akira',
        img: 'https://static.wikia.nocookie.net/p__/images/7/7e/Asa_Akira.png',
        meta: 'USA | 1986'
    }
];

function renderStars() {
    const grid = document.getElementById('stars-grid');
    if (!grid) return;
    grid.innerHTML = '';
    pornStars.forEach(star => {
        const card = document.createElement('div');
        card.className = 'star-card';
        const img = document.createElement('img');
        img.className = 'star-img';
        img.src = star.img;
        img.alt = star.name;
        card.appendChild(img);
        const name = document.createElement('div');
        name.className = 'star-name';
        name.textContent = star.name;
        card.appendChild(name);
        if (star.meta) {
            const meta = document.createElement('div');
            meta.className = 'star-meta';
            meta.textContent = star.meta;
            card.appendChild(meta);
        }
        grid.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', renderStars);
