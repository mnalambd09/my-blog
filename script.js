let allPosts = [];
let displayedPosts = 0;
const postsPerPage = 6;
let currentCategory = 'all';

// ১. ডেটা লোড
fetch('posts.json')
    .then(res => res.json())
    .then(data => {
        allPosts = data;
        loadMore();
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) openPost(parseInt(postId));
    })
    .catch(err => console.error(err));

// ২. রিডিং টাইম
function calculateReadingTime(text) {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
}

// ৩. রেন্ডার পোস্ট
function renderPosts(posts) {
    let container = document.getElementById('blog-posts');
    posts.forEach(post => {
        let plainText = post.content.replace(/<[^>]*>?/gm, '');
        let readTime = calculateReadingTime(plainText);
        let div = document.createElement('div');
        div.className = 'card glass-card';
        div.onclick = () => openPost(post.id);
        div.innerHTML = `
            <div class="card-img" style="background-image: url('${post.image}');"></div>
            <div class="card-content">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span class="category-badge">${post.category}</span>
                    <small style="color:var(--text-muted)">${readTime} min read</small>
                </div>
                <h3>${post.title}</h3>
                <p>${post.summary.substring(0, 80)}...</p>
                <div class="card-footer"><small>Read More <i class="fas fa-arrow-right"></i></small><small>${post.date}</small></div>
            </div>`;
        container.appendChild(div);
    });
}

// ৪. লোড মোর
function loadMore() {
    let filteredPosts = currentCategory === 'all' ? allPosts : allPosts.filter(p => p.category.includes(currentCategory));
    let nextPosts = filteredPosts.slice(displayedPosts, displayedPosts + postsPerPage);
    renderPosts(nextPosts);
    displayedPosts += postsPerPage;
    document.getElementById('loadMoreBtn').style.display = displayedPosts >= filteredPosts.length ? 'none' : 'block';
}

// ৫. ফিল্টার ও সার্চ
function filterPosts(category) {
    currentCategory = category;
    displayedPosts = 0;
    document.getElementById('blog-posts').innerHTML = '';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadMore();
}

document.getElementById('searchInput').addEventListener('keyup', (e) => {
    let query = e.target.value.toLowerCase();
    let container = document.getElementById('blog-posts');
    container.innerHTML = '';
    let searchResults = allPosts.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    if(searchResults.length === 0) container.innerHTML = '<p style="color:white; text-align:center;">কোনো পোস্ট পাওয়া যায়নি!</p>';
    else renderPosts(searchResults);
    if(query === '') { displayedPosts = 0; loadMore(); }
});

// ৬. পোস্ট ওপেন + Giscus
function openPost(id) {
    const post = allPosts.find(p => p.id === id);
    if(post) {
        document.getElementById('modal-title').innerText = post.title;
        document.getElementById('modal-date').innerText = post.date;
        document.getElementById('modal-author').innerText = post.author;
        document.getElementById('modal-category').innerText = post.category;
        document.getElementById('modal-body').innerHTML = post.content;
        document.getElementById('modal-img-bg').style.backgroundImage = `url('${post.image}')`;
        let plainText = post.content.replace(/<[^>]*>?/gm, '');
        document.getElementById('modal-read-time').innerText = calculateReadingTime(plainText);
        document.getElementById('postModal').style.display = "flex";
        document.body.style.overflow = "hidden";
        window.history.pushState({id: id}, '', `?id=${id}`);
        document.title = post.title;

        // কমেন্ট লোড
        loadGiscus(post.title);
    }
}

// ৭. Giscus কনফিগারেশন (আপনার আইডি সহ)
function loadGiscus(term) {
    const container = document.getElementById('comments-container');
    container.innerHTML = ''; 

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'mnalambd09/my-blog');
    script.setAttribute('data-repo-id', 'R_kgDOQy8h-Q');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOQy8h-c4C0hbS');
    script.setAttribute('data-mapping', 'title');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'transparent_dark');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);
}

// ৮. মোডাল বন্ধ
function closeModal() {
    document.getElementById('postModal').style.display = "none";
    document.body.style.overflow = "auto";
    window.history.pushState({}, '', window.location.pathname);
    document.title = "NOORALAM Tech Insights";
    document.getElementById('comments-container').innerHTML = '';
}

// ৯. সোশ্যাল ও থিম
function shareOn(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("লিংক কপি হয়েছে!");
}

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') toggleSwitch.checked = true;
}
toggleSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

window.onclick = function(event) {
    if (event.target == document.getElementById('postModal')) closeModal();
}
