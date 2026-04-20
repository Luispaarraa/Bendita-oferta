const STORE_NAMES = {
    oxxo: '🏪 OXXO',
    '7eleven': '🛒 7-Eleven',
    extra: '🏠 Extra',
    soriana: '🛍️ Soriana',
    chedraui: '🛒 Chedraui',
    walmart: '🏬 Walmart',
    elektra: '📱 Elektra'
};

const STORE_COLORS = {
    oxxo: '#E8001C',
    '7eleven': '#007848',
    extra: '#FF6600',
    soriana: '#E31E24',
    chedraui: '#0071BC',
    walmart: '#0071CE',
    elektra: '#FFD200'
};

const STORAGE_KEY = 'benditaOferta_posts';
let posts = [];
let currentFilter = 'all';
let currentDateFilter = 'all';
let searchQuery = '';
let useFirebase = false;

// Map state
let map = null;
let miniMap = null;
let miniMapPin = null;
let selectedPostLocation = null;
let mapMarkers = [];
let userCircle = null;
let userMapMarker = null;
let userPosition = null;
let radiusKm = 0; // 0 = no radius filter
let mapVisible = false;

const defaultPosts = [
    {
        id: 1,
        store: 'oxxo',
        title: '2x1 en Cervezas Modelo Pack 6',
        originalPrice: 180,
        discountPrice: 99,
        description: 'Aprovecha el 2x1 en cervezas Modelo Pack de 6 unidades. Oferta válida en cualquier OXXO.',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80',
        user: 'OfertasMX',
        userPhoto: null,
        likes: 45,
        liked: false,
        comments: [
            { user: 'JuanP', userPhoto: null, text: 'Ya la vi en mi OXXO, es real! ✅', time: '2h' },
            { user: 'MariaG', userPhoto: null, text: 'Gracias por avisar, voy corriendo', time: '1h' }
        ],
        location: { lat: 29.0892, lng: -110.9736, address: 'OXXO Blvd. Kino, Hermosillo' },
        timestamp: Date.now() - 3600000 * 2
    },
    {
        id: 2,
        store: '7eleven',
        title: 'Descuento 50% en Snacks Nachos',
        originalPrice: 45,
        discountPrice: 22.50,
        description: 'Nachos con queso a mitad de precio. Perfecto para ver el partido.',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80',
        user: 'DealsHunter',
        userPhoto: null,
        likes: 32,
        liked: false,
        comments: [{ user: 'CarlosR', userPhoto: null, text: 'Válido también en las máquinas', time: '30min' }],
        location: { lat: 29.0729, lng: -110.9559, address: '7-Eleven Centro, Hermosillo' },
        timestamp: Date.now() - 3600000 * 5
    },
    {
        id: 3,
        store: 'soriana',
        title: 'Combo Refrescos 2L + 6pz',
        originalPrice: 120,
        discountPrice: 79,
        description: '6 refrescos de 2 litros de diferentes sabores.',
        image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800&q=80',
        user: 'AhorradorPro',
        userPhoto: null,
        likes: 28,
        liked: false,
        comments: [],
        location: { lat: 29.0612, lng: -110.9483, address: 'Soriana Perisur, Hermosillo' },
        timestamp: Date.now() - 3600000 * 8
    },
    {
        id: 4,
        store: 'elektra',
        title: 'Smart TV 32" Samsung',
        originalPrice: 4999,
        discountPrice: 3499,
        description: 'Smart TV Samsung 32 pulgadas con Roku. Precio especial!',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        user: 'TecnoOfertas',
        userPhoto: null,
        likes: 156,
        liked: false,
        comments: [{ user: 'PedroL', userPhoto: null, text: 'Ya compré uno', time: '3h' }],
        location: { lat: 29.0821, lng: -110.9621, address: 'Elektra Blvd. Luis Encinas, Hermosillo' },
        timestamp: Date.now() - 3600000 * 12
    },
    {
        id: 5,
        store: 'chedraui',
        title: '30% Descuento Frutas y Verduras',
        originalPrice: 0,
        discountPrice: 0,
        description: 'Todo el departamento con 30% de descuento.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
        user: 'ChedrauiFan',
        userPhoto: null,
        likes: 67,
        liked: false,
        comments: [],
        location: { lat: 29.0558, lng: -110.9712, address: 'Chedraui San Benito, Hermosillo' },
        timestamp: Date.now() - 3600000 * 24
    },
    {
        id: 6,
        store: 'extra',
        title: 'Café Starbucks a $25',
        originalPrice: 45,
        discountPrice: 25,
        description: 'Café Starbucks de cualquier tamaño a solo $25.',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        user: 'CafeLover',
        userPhoto: null,
        likes: 89,
        liked: false,
        comments: [{ user: 'LuisM', userPhoto: null, text: 'Válido en mi tienda', time: '4h' }],
        location: { lat: 29.0675, lng: -110.9801, address: 'Extra La Salle, Hermosillo' },
        timestamp: Date.now() - 3600000 * 36
    },
    {
        id: 7,
        store: 'walmart',
        title: '3x2 en Detergente Ariel',
        originalPrice: 89,
        discountPrice: 59,
        description: 'Lleva 3 y paga 2 en detergente Ariel de 1kg.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        user: 'WalmartFan',
        userPhoto: null,
        likes: 41,
        liked: false,
        comments: [],
        location: { lat: 29.0943, lng: -110.9438, address: 'Walmart Reforma, Hermosillo' },
        timestamp: Date.now() - 3600000 * 10
    }
];

// ============================================================
//  INICIALIZACIÓN
// ============================================================

async function init() {
    await checkFirebaseConnection();
    loadPosts();
    setupEventListeners();
    setupDateFilters();
    renderPosts();
    updateStats();
}

async function checkFirebaseConnection() {
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            await db.collection('posts').limit(1).get();
            useFirebase = true;
            console.log('🔥 Conectado a Firebase');
        }
    } catch (e) {
        console.log('📦 Usando localStorage');
        useFirebase = false;
    }
}

// ============================================================
//  DATOS
// ============================================================

function loadPosts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        posts = JSON.parse(stored);
    } else {
        posts = [...defaultPosts];
        savePosts();
    }
}

async function savePosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    if (useFirebase && typeof db !== 'undefined') {
        try {
            const batch = db.batch();
            const collRef = db.collection('posts');
            const snapshot = await collRef.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
            posts.forEach(post => batch.set(collRef.doc(String(post.id)), post));
            await batch.commit();
        } catch (e) {
            console.error('Error guardando en Firebase:', e);
        }
    }
    updateStats();
    if (mapVisible) updateMapMarkers();
}

// ============================================================
//  EVENTOS
// ============================================================

function setupEventListeners() {
    document.getElementById('btnNewPost').addEventListener('click', openModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('btnCancel').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderPosts();
    });

    // Store pills
    document.querySelectorAll('.store-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.store-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.store;
            renderPosts();
            if (mapVisible) updateMapMarkers();
        });
    });

    // Image upload
    const imageUploadZone = document.getElementById('imageUploadZone');
    const imageInput = document.getElementById('imageInput');
    imageUploadZone.addEventListener('click', () => imageInput.click());
    imageUploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadZone.style.borderColor = 'var(--green)';
    });
    imageUploadZone.addEventListener('dragleave', () => {
        imageUploadZone.style.borderColor = '';
    });
    imageUploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadZone.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    });
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });
    document.getElementById('removeImage').addEventListener('click', removeImage);

    // Map toggle
    document.getElementById('btnToggleMap').addEventListener('click', toggleMap);
    document.getElementById('btnCloseMap').addEventListener('click', closeMapPanel);
    document.getElementById('btnMyLocation').addEventListener('click', getUserLocation);
    document.getElementById('btnClearMapFilter').addEventListener('click', clearMapFilter);

    // Radius selector
    document.querySelectorAll('.radius-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = parseFloat(btn.dataset.radius);
            radiusKm = val;
            if (userPosition) {
                updateUserCircle();
                renderPosts();
            }
        });
    });

    // Mini map location button
    document.getElementById('btnUseMyLocation').addEventListener('click', useMyLocationForPost);
}

function setupDateFilters() {
    document.querySelectorAll('.date-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentDateFilter = pill.dataset.date;
            renderPosts();
        });
    });
}

// ============================================================
//  MAP PRINCIPAL
// ============================================================

function toggleMap() {
    if (mapVisible) {
        closeMapPanel();
    } else {
        openMapPanel();
    }
}

function openMapPanel() {
    const panel = document.getElementById('mapPanel');
    panel.classList.add('visible');
    mapVisible = true;
    document.getElementById('btnToggleMap').classList.add('active');

    // Init map after panel is visible
    setTimeout(() => {
        if (!map) {
            initMainMap();
        } else {
            map.invalidateSize();
            updateMapMarkers();
        }
    }, 100);
}

function closeMapPanel() {
    document.getElementById('mapPanel').classList.remove('visible');
    mapVisible = false;
    document.getElementById('btnToggleMap').classList.remove('active');
}

function initMainMap() {
    map = L.map('ofertasMap', {
        center: [29.0729, -110.9559],
        zoom: 13,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Click on map to set location center for radius filter
    map.on('click', (e) => {
        if (radiusKm > 0) {
            userPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
            updateUserCircle();
            renderPosts();
        }
    });

    updateMapMarkers();
}

function createStoreIcon(store, count) {
    const color = STORE_COLORS[store] || '#00FF88';
    const emoji = STORE_NAMES[store]?.split(' ')[0] || '📍';
    return L.divIcon({
        className: 'leaflet-store-icon',
        html: `<div class="map-pin" style="--pin-color:${color}">
            <span class="map-pin-emoji">${emoji}</span>
            ${count > 1 ? `<span class="map-pin-count">${count}</span>` : ''}
        </div>`,
        iconSize: [44, 52],
        iconAnchor: [22, 52],
        popupAnchor: [0, -54]
    });
}

function updateMapMarkers() {
    if (!map) return;

    // Remove old markers
    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    // Group posts by store+location
    const groups = {};
    posts.forEach(post => {
        if (!post.location?.lat) return;
        const key = `${post.store}_${post.location.lat.toFixed(4)}_${post.location.lng.toFixed(4)}`;
        if (!groups[key]) groups[key] = { post, posts: [], count: 0 };
        groups[key].posts.push(post);
        groups[key].count++;
    });

    Object.values(groups).forEach(({ post, posts: groupPosts, count }) => {
        const isActive = currentFilter === 'all' || currentFilter === post.store;
        const icon = createStoreIcon(post.store, count);

        const topPosts = groupPosts.slice(0, 3).map(p => `
            <div class="popup-offer">
                <strong>${p.title}</strong>
                <span class="popup-price">$${p.discountPrice.toFixed(2)}</span>
            </div>
        `).join('');

        const marker = L.marker([post.location.lat, post.location.lng], {
            icon,
            opacity: isActive ? 1 : 0.35
        }).addTo(map)
          .bindPopup(`
            <div class="map-popup">
                <div class="popup-store">${STORE_NAMES[post.store]}</div>
                <div class="popup-address">${post.location.address || ''}</div>
                <div class="popup-offers">${topPosts}</div>
                <button class="popup-filter-btn" onclick="filterByStoreFromMap('${post.store}')">
                    Ver ${count} oferta${count > 1 ? 's' : ''} →
                </button>
            </div>
          `, { maxWidth: 260 });

        mapMarkers.push(marker);
    });
}

function filterByStoreFromMap(store) {
    currentFilter = store;
    document.querySelectorAll('.store-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.store === store);
    });
    renderPosts();
    // Close all popups
    mapMarkers.forEach(m => m.closePopup());
    // Scroll to feed
    document.getElementById('feed').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.filterByStoreFromMap = filterByStoreFromMap;

function getUserLocation() {
    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            if (map) {
                map.setView([userPosition.lat, userPosition.lng], 14);
                updateUserCircle();
                if (radiusKm > 0) renderPosts();
            }
        },
        () => alert('No se pudo obtener tu ubicación')
    );
}

function updateUserCircle() {
    if (!map || !userPosition) return;

    if (userMapMarker) map.removeLayer(userMapMarker);
    if (userCircle) map.removeLayer(userCircle);

    const userIcon = L.divIcon({
        className: 'leaflet-user-icon',
        html: `<div class="user-location-pin"><span>📍</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
    });

    userMapMarker = L.marker([userPosition.lat, userPosition.lng], { icon: userIcon }).addTo(map);

    if (radiusKm > 0) {
        userCircle = L.circle([userPosition.lat, userPosition.lng], {
            radius: radiusKm * 1000,
            color: '#00FF88',
            fillColor: '#00FF88',
            fillOpacity: 0.08,
            weight: 2,
            dashArray: '6,6'
        }).addTo(map);
        updateMapMarkers();
    }
}

function clearMapFilter() {
    radiusKm = 0;
    userPosition = null;
    if (userMapMarker && map) { map.removeLayer(userMapMarker); userMapMarker = null; }
    if (userCircle && map) { map.removeLayer(userCircle); userCircle = null; }
    document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
    currentFilter = 'all';
    document.querySelectorAll('.store-pill').forEach(p => p.classList.toggle('active', p.dataset.store === 'all'));
    renderPosts();
    updateMapMarkers();
}

// ============================================================
//  MINI MAP (MODAL)
// ============================================================

function initMiniMap() {
    if (miniMap) {
        miniMap.invalidateSize();
        return;
    }

    const startLat = userPosition?.lat || 29.0729;
    const startLng = userPosition?.lng || -110.9559;

    miniMap = L.map('miniMap', {
        center: [startLat, startLng],
        zoom: 14,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(miniMap);

    miniMap.on('click', (e) => {
        selectedPostLocation = { lat: e.latlng.lat, lng: e.latlng.lng, address: '' };

        if (miniMapPin) miniMap.removeLayer(miniMapPin);

        const pinIcon = L.divIcon({
            className: 'leaflet-user-icon',
            html: `<div class="user-location-pin selected"><span>📍</span></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        miniMapPin = L.marker([e.latlng.lat, e.latlng.lng], { icon: pinIcon }).addTo(miniMap);
        document.getElementById('locationAddress').placeholder = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
    });
}

function useMyLocationForPost() {
    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización');
        return;
    }

    const btn = document.getElementById('btnUseMyLocation');
    btn.textContent = '⏳ Obteniendo...';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            selectedPostLocation = { lat, lng, address: '' };

            if (miniMap) {
                miniMap.setView([lat, lng], 16);

                if (miniMapPin) miniMap.removeLayer(miniMapPin);
                const pinIcon = L.divIcon({
                    className: 'leaflet-user-icon',
                    html: `<div class="user-location-pin selected"><span>📍</span></div>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 36]
                });
                miniMapPin = L.marker([lat, lng], { icon: pinIcon }).addTo(miniMap);
            }
            btn.textContent = '✅ Ubicación obtenida';
            setTimeout(() => { btn.textContent = '📍 Usar mi ubicación'; }, 2000);
        },
        () => {
            btn.textContent = '📍 Usar mi ubicación';
            alert('No se pudo obtener tu ubicación');
        }
    );
}

// ============================================================
//  MODAL NUEVA OFERTA
// ============================================================

function openModal() {
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    selectedPostLocation = null;
    if (miniMapPin) { miniMap?.removeLayer(miniMapPin); miniMapPin = null; }

    // Init mini map after modal renders
    setTimeout(() => initMiniMap(), 200);
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.body.style.overflow = '';
    resetForm();
}

function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('locationAddress').value = '';
    document.getElementById('locationAddress').placeholder = 'Ej: OXXO Blvd. Kino, Hermosillo';
    selectedPostLocation = null;
    removeImage();
}

function handleImageFile(file) {
    if (!file.type.match(/image\/(jpeg|png)/)) { alert('Solo JPG o PNG'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Máx 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('uploadPlaceholder').style.display = 'none';
        document.getElementById('imagePreview').classList.add('show');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    document.getElementById('previewImg').src = '';
    document.getElementById('uploadPlaceholder').style.display = 'flex';
    document.getElementById('imagePreview').classList.remove('show');
    document.getElementById('imageInput').value = '';
}

async function handlePostSubmit(e) {
    e.preventDefault();

    const store = document.getElementById('storeSelect').value;
    const title = document.getElementById('titleInput').value;
    const originalPrice = parseFloat(document.getElementById('originalPrice').value) || 0;
    const discountPrice = parseFloat(document.getElementById('discountPrice').value);
    const description = document.getElementById('descriptionInput').value;
    const imagePreview = document.getElementById('previewImg').src;
    const address = document.getElementById('locationAddress').value;

    // Build location object
    let location = null;
    if (selectedPostLocation) {
        location = { ...selectedPostLocation, address: address || selectedPostLocation.address };
    } else if (address) {
        location = { lat: null, lng: null, address };
    }

    const newPost = {
        id: Date.now(),
        store,
        title,
        originalPrice,
        discountPrice,
        description,
        image: imagePreview || '',
        user: 'Anónimo',
        userPhoto: null,
        userId: null,
        likes: 0,
        liked: false,
        comments: [],
        location,
        timestamp: Date.now()
    };

    posts.unshift(newPost);
    savePosts();
    renderPosts();
    closeModal();
}

// ============================================================
//  FILTROS Y DISTANCIA
// ============================================================

function getDistance(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const aa =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
}

// ============================================================
//  RENDERIZADO
// ============================================================

function renderPosts() {
    const feed = document.getElementById('feed');
    const emptyState = document.getElementById('emptyState');

    let filtered = posts;

    // Store filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.store === currentFilter);
    }

    // Search
    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            p.store.toLowerCase().includes(searchQuery)
        );
    }

    // Date filter
    const now = Date.now();
    if (currentDateFilter === 'today') {
        const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
        filtered = filtered.filter(p => p.timestamp >= dayStart.getTime());
    } else if (currentDateFilter === 'week') {
        filtered = filtered.filter(p => p.timestamp >= now - 7 * 86400000);
    } else if (currentDateFilter === 'month') {
        filtered = filtered.filter(p => p.timestamp >= now - 30 * 86400000);
    }

    // Radius filter
    if (userPosition && radiusKm > 0) {
        filtered = filtered.filter(p => {
            if (!p.location?.lat) return false;
            return getDistance(userPosition, p.location) <= radiusKm;
        });
    }

    if (filtered.length === 0) {
        feed.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    feed.innerHTML = filtered.map(post => createPostCard(post)).join('');

    feed.querySelectorAll('.post-card').forEach(card => {
        const postId = parseInt(card.dataset.id);
        card.querySelector('.like-btn').addEventListener('click', () => toggleLike(postId));
        card.querySelector('.comment-btn').addEventListener('click', () => toggleComments(postId));
        card.querySelector('.btn-comment').addEventListener('click', () => submitComment(postId));
        card.querySelector('.comment-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitComment(postId);
        });
        const locBtn = card.querySelector('.btn-show-on-map');
        if (locBtn) {
            locBtn.addEventListener('click', () => showPostOnMap(postId));
        }
    });
}

function renderAvatar(user, userPhoto) {
    if (userPhoto) {
        return `<img class="user-avatar user-avatar--photo" src="${userPhoto}" alt="${user}" onerror="this.outerHTML='<div class=\\'user-avatar\\'>${user.charAt(0).toUpperCase()}</div>'">`;
    }
    return `<div class="user-avatar">${user.charAt(0).toUpperCase()}</div>`;
}

function createPostCard(post) {
    const discount = post.originalPrice > 0
        ? Math.round((1 - post.discountPrice / post.originalPrice) * 100)
        : 0;
    const timeAgo = getTimeAgo(post.timestamp);
    const hasLocation = post.location?.lat;
    const distText = (hasLocation && userPosition)
        ? `· ${getDistance(userPosition, post.location).toFixed(1)} km`
        : '';

    return `
        <article class="post-card" data-id="${post.id}" data-store="${post.store}">
            <div class="post-header">
                <span class="store-badge">${STORE_NAMES[post.store] || post.store}</span>
                <div class="user-info">
                    ${renderAvatar(post.user, post.userPhoto)}
                    <div>
                        <div class="user-name">${post.user}</div>
                        <div class="post-time">${timeAgo}${distText ? ` <span class="post-distance">${distText}</span>` : ''}</div>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-prices">
                    ${post.originalPrice > 0 ? `<span class="price-original">$${post.originalPrice.toFixed(2)}</span>` : ''}
                    <span class="price-discount">$${post.discountPrice.toFixed(2)}</span>
                    ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                </div>
                ${post.description ? `<p class="post-description">${post.description}</p>` : ''}
                ${post.location?.address ? `<div class="post-location">📍 ${post.location.address}</div>` : ''}
            </div>
            ${post.image ? `<img class="post-image" src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">` : ''}
            <div class="post-actions">
                <button class="action-btn like-btn ${post.liked ? 'liked' : ''}">
                    <svg viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${post.likes}</span>
                </button>
                <button class="action-btn comment-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>${post.comments.length}</span>
                </button>
                ${hasLocation ? `
                <button class="action-btn btn-show-on-map">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Ver en mapa</span>
                </button>` : ''}
            </div>
            <div class="comments-section" id="comments-${post.id}">
                ${post.comments.length > 0 ? `
                    <div class="comments-list">
                        ${post.comments.map(c => `
                            <div class="comment">
                                ${renderAvatar(c.user, c.userPhoto)}
                                <div class="comment-content">
                                    <div class="comment-header">
                                        <span class="comment-author">${c.user}</span>
                                        <span class="comment-time">${c.time}</span>
                                    </div>
                                    <p class="comment-text">${c.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="Escribe un comentario...">
                    <button class="btn-comment">Publicar</button>
                </div>
            </div>
        </article>
    `;
}

function showPostOnMap(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post?.location?.lat) return;
    if (!mapVisible) openMapPanel();
    setTimeout(() => {
        if (map) {
            map.setView([post.location.lat, post.location.lng], 16);
            // Find and open that marker's popup
            mapMarkers.forEach(m => {
                const ll = m.getLatLng();
                if (Math.abs(ll.lat - post.location.lat) < 0.0001 && Math.abs(ll.lng - post.location.lng) < 0.0001) {
                    m.openPopup();
                }
            });
        }
    }, 300);
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        savePosts();
        renderPosts();
    }
}

function toggleComments(postId) {
    document.getElementById(`comments-${postId}`).classList.toggle('show');
}

function submitComment(postId) {
    const post = posts.find(p => p.id === postId);
    const section = document.getElementById(`comments-${postId}`);
    const input = section.querySelector('.comment-input');
    const text = input.value.trim();
    if (!text) return;

    post.comments.push({ user: 'Anónimo', userPhoto: null, text, time: 'Ahora' });
    savePosts();
    renderPosts();
    setTimeout(() => {
        document.getElementById(`comments-${postId}`)?.classList.add('show');
    }, 10);
}

function updateStats() {
    document.getElementById('totalPosts').textContent = posts.length;
    document.getElementById('totalComments').textContent = posts.reduce((a, p) => a + p.comments.length, 0);
}

function getTimeAgo(timestamp) {
    const s = Math.floor((Date.now() - timestamp) / 1000);
    if (s < 60) return 'Ahora';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
}

document.addEventListener('DOMContentLoaded', init);