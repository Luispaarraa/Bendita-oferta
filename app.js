const STORE_NAMES = {
    oxxo: '🏪 OXXO',
    '7eleven': '🛒 7-Eleven',
    extra: '🏠 Extra',
    soriana: '🛍️ Soriana',
    chedraui: '🛒 Chedraui',
    walmart: '🏬 Walmart',
    elektra: '📱 Elektra'
};

const STORAGE_KEY = 'benditaOferta_posts';
let posts = [];
let currentFilter = 'all';
let searchQuery = '';
let useFirebase = false;

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
        comments: [
            { user: 'PedroL', userPhoto: null, text: 'Ya compré uno', time: '3h' }
        ],
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
        timestamp: Date.now() - 3600000 * 36
    }
];

// ============================================================
//  INICIALIZACIÓN PRINCIPAL
// ============================================================

async function init() {
    await checkFirebaseConnection();
    // ✅ Iniciar auth DESPUÉS de confirmar conexión a Firebase
    loadPosts();
    setupEventListeners();
    renderPosts();
    updateStats();
}

async function checkFirebaseConnection() {
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            // ✅ Usamos la variable global db de firebase-config.js, no declaramos otra
            await db.collection('posts').limit(1).get();
            useFirebase = true;
            console.log('🔥 Conectado a Firebase');
        }
    } catch (e) {
        console.log('📦 Usando localStorage (Firebase no configurado)');
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
    if (useFirebase && db) {
        try {
            const batch = db.batch();
            const collRef = db.collection('posts');
            const snapshot = await collRef.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
            posts.forEach(post => {
                batch.set(collRef.doc(String(post.id)), post);
            });
            await batch.commit();
        } catch (e) {
            console.error('Error guardando en Firebase:', e);
        }
    }
    updateStats();
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

    document.querySelectorAll('.store-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.store-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.store;
            renderPosts();
        });
    });

    const imageUploadZone = document.getElementById('imageUploadZone');
    const imageInput = document.getElementById('imageInput');

    imageUploadZone.addEventListener('click', () => imageInput.click());
    imageUploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadZone.style.borderColor = 'var(--accent-primary)';
    });
    imageUploadZone.addEventListener('dragleave', () => {
        imageUploadZone.style.borderColor = 'var(--border-color)';
    });
    imageUploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadZone.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    });
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });
    document.getElementById('removeImage').addEventListener('click', removeImage);
}

// ============================================================
//  MODAL NUEVA OFERTA
// ============================================================

function openModal() {
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.body.style.overflow = '';
    resetForm();
}

function resetForm() {
    document.getElementById('postForm').reset();
    removeImage();
}

function handleImageFile(file) {
    if (!file.type.match(/image\/(jpeg|png)/)) {
        alert('Solo JPG o PNG');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('Máx 5MB');
        return;
    }
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
        timestamp: Date.now()
    };

    posts.unshift(newPost);
    savePosts();
    renderPosts();
    closeModal();
}

// ============================================================
//  RENDERIZADO
// ============================================================

function renderPosts() {
    const feed = document.getElementById('feed');
    const emptyState = document.getElementById('emptyState');

    let filteredPosts = posts;

    if (currentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.store === currentFilter);
    }

    if (searchQuery) {
        filteredPosts = filteredPosts.filter(p =>
            p.title.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            p.store.toLowerCase().includes(searchQuery)
        );
    }

    if (filteredPosts.length === 0) {
        feed.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    feed.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');

    feed.querySelectorAll('.post-card').forEach(card => {
        const postId = parseInt(card.dataset.id);
        card.querySelector('.action-btn.like-btn').addEventListener('click', () => toggleLike(postId));
        card.querySelector('.action-btn.comment-btn').addEventListener('click', () => toggleComments(postId));
        card.querySelector('.btn-comment').addEventListener('click', () => submitComment(postId));
        const commentInput = card.querySelector('.comment-input');
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitComment(postId);
        });
    });
}

// ✅ Helper para renderizar avatar (foto de Google o inicial)
function renderAvatar(user, userPhoto, size = 'small') {
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

    return `
        <article class="post-card" data-id="${post.id}" data-store="${post.store}">
            <div class="post-header">
                <span class="store-badge">${STORE_NAMES[post.store] || post.store}</span>
                <div class="user-info">
                    ${renderAvatar(post.user, post.userPhoto)}
                    <div>
                        <div class="user-name">${post.user}</div>
                        <div class="post-time">${timeAgo}</div>
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
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.classList.toggle('show');
}

function submitComment(postId) {
    const post = posts.find(p => p.id === postId);
    const commentsSection = document.getElementById(`comments-${postId}`);
    const input = commentsSection.querySelector('.comment-input');
    const text = input.value.trim();

    if (!text) return;

    post.comments.push({
        user: 'Anónimo',
        userPhoto: null,
        text: text,
        time: 'Ahora'
    });

    savePosts();
    renderPosts();

    setTimeout(() => {
        const newCommentsSection = document.getElementById(`comments-${postId}`);
        newCommentsSection.classList.add('show');
    }, 10);
}

function updateStats() {
    document.getElementById('totalPosts').textContent = posts.length;
    const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);
    document.getElementById('totalComments').textContent = totalComments;
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

document.addEventListener('DOMContentLoaded', init);