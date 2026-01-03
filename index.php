<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>আমার গিটহাব ব্লগ</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <h1>আমার পার্সোনাল ব্লগ</h1>
    <p>GitHub Pages এ হোস্ট করা</p>
</header>

<div class="row">
    <div class="leftcolumn" id="blog-posts">
        <!-- এখানে জাভাস্ক্রিপ্ট দিয়ে পোস্ট লোড হবে -->
    </div>

    <div class="rightcolumn">
        <div class="card">
            <h3>আমার সম্পর্কে</h3>
            <p>আমি কোডিং শিখছি এবং গিটহাবে প্রজেক্ট আপলোড করছি।</p>
        </div>
    </div>
</div>

<div class="footer">
    <h2>কপিরাইট © ২০২৬</h2>
</div>

<!-- জাভাস্ক্রিপ্ট কোড -->
<script>
    fetch('posts.json')
        .then(response => response.json())
        .then(posts => {
            let output = '';
            posts.forEach(post => {
                output += `
                    <div class="card">
                        <h2>${post.title}</h2>
                        <h5>প্রকাশের তারিখ: ${post.date}</h5>
                        <div class="fakeimg" style="background-image: url('${post.image}'); height:200px; background-size: cover;"></div>
                        <p>${post.content}</p>
                    </div>
                `;
            });
            document.getElementById('blog-posts').innerHTML = output;
        })
        .catch(error => console.error('Error loading posts:', error));
</script>

</body>
</html>
