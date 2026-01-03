let allPosts = [];
let displayedPosts = 0;
const postsPerPage = 6;
let currentCategory = 'all';

// ১. ডেটা লোড এবং URL চেক করা
fetch('posts.json')
    .then(res => res.json())
    .then(data => {
        allPosts = data;
        loadMore();
        
        // যদি লিংকে কোনো পোস্ট আইডি থাকে (যেমন: ?id=5), সেটা অটো ওপেন হবে
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            openPost(parseInt(postId));
        }
    })
    .catch(err => console.error("Data Load Error:", err));

// ২. রিডিং টাইম ক্যালকুলেটর
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

// ৩. পোস্ট রেন্ডার ফাংশন
function renderPosts(posts) {
    let container = document.getElementById('blog-posts');
    
    posts.forEach(post => {
        // রিডিং টাইম বের করা
        let plainText = post.content.replace(/<[^>]*>?/gm, ''); // HTML ট্যাগ সরানো
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
                <div class="card-footer">
                    <small>Read More <i class="fas fa-arrow-right"></i></small>
                    <small>${post.date}</small>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// ৪. লোড মোর ফাংশন
function loadMore() {
    // বর্তমান ক্যাটাগরি অনুযায়ী ফিল্টার করা পোস্ট
    let filteredPosts = currentCategory === 'all' 
        ? allPosts 
        : allPosts.filter(p => p.category.includes(currentCategory));

    let nextPosts = filteredPosts.slice(displayedPosts, displayedPosts + postsPerPage);
    renderPosts(nextPosts);
    displayedPosts += postsPerPage;

    // বাটন লুকানো
    if (displayedPosts >= filteredPosts.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    } else {
        document.getElementById('loadMoreBtn').style.display = 'block';
    }
}

// ৫. ক্যাটাগরি ফিল্টার ফাংশন
function filterPosts(category) {
    currentCategory = category;
    displayedPosts = 0;
    document.getElementById('blog-posts').innerHTML = ''; // আগের পোস্ট ক্লিয়ার
    
    // বাটন একটিভ ক্লাস চেঞ্জ
    let buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    loadMore();
}

// ৬. সার্চ ফাংশন
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    let query = e.target.value.toLowerCase();
    let container = document.getElementById('blog-posts');
    container.innerHTML = ''; 

    let searchResults = allPosts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );

    if(searchResults.length === 0) {
        container.innerHTML = '<p style="color:var(--text); text-align:center; width:100%;">কোনো পোস্ট পাওয়া যায়নি!</p>';
        document.getElementById('loadMoreBtn').style.display = 'none';
    } else {
        renderPosts(searchResults);
        document.getElementById('loadMoreBtn').style.display = 'none';
    }

    if(query === '') {
        displayedPosts = 0;
        loadMore();
    }
});

// ৭. মোডাল ওপেন এবং ডাইনামিক ইউআরএল
function openPost(id) {
    const post = allPosts.find(p => p.id === id);
    if(post) {
        // ডেটা সেট করা
        document.getElementById('modal-title').innerText = post.title;
        document.getElementById('modal-date').innerText = post.date;
        document.getElementById('modal-author').innerText = post.author;
        document.getElementById('modal-category').innerText = post.category;
        document.getElementById('modal-body').innerHTML = post.content;
        document.getElementById('modal-img-bg').style.backgroundImage = `url('${post.image}')`;
        
        // রিডিং টাইম
        let plainText = post.content.replace(/<[^>]*>?/gm, '');
        document.getElementById('modal-read-time').innerText = calculateReadingTime(plainText);

        // মোডাল দেখানো
        document.getElementById('postModal').style.display = "flex";
        document.body.style.overflow = "hidden";

        // URL পরিবর্তন করা (যাতে শেয়ার করা যায়)
        window.history.pushState({id: id}, '', `?id=${id}`);
        document.title = `${post.title} | NOORALAM Blog`; // ব্রাউজার ট্যাব টাইটেল চেঞ্জ
    }
}

// মোডাল বন্ধ করা
function closeModal() {
    document.getElementById('postModal').style.display = "none";
    document.body.style.overflow = "auto";
    
    // URL রিসেট
    window.history.pushState({}, '', window.location.pathname);
    document.title = "NOORALAM Tech Insights";
}

// ৮. সোশ্যাল শেয়ার লজিক
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

// ৯. ডার্ক/লাইট মোড টগল
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
    }
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

// বাইরের ক্লিকে মোডাল বন্ধ
window.onclick = function(event) {
    if (event.target == document.getElementById('postModal')) {
        closeModal();
    }
}
