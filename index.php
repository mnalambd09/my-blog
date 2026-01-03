<?php include 'db.php'; ?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>আমার ডাইনামিক ব্লগ</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <h1>আমার ডাইনামিক ব্লগ</h1>
    <p>PHP ও MySQL দিয়ে তৈরি</p>
</header>

<nav>
    <a href="index.php">হোম</a>
    <a href="admin.php">পোস্ট লিখুন (Admin)</a>
</nav>

<div class="row">
    <div class="leftcolumn">
        
        <?php
        // ডেটাবেস থেকে পোস্টগুলো নিয়ে আসা হচ্ছে
        $sql = "SELECT * FROM posts ORDER BY id DESC";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                echo '<div class="card">';
                echo '<h2>' . $row["title"] . '</h2>';
                echo '<h5>প্রকাশের সময়: ' . $row["date"] . '</h5>';
                echo '<div class="fakeimg" style="height:200px;">ছবি</div>';
                echo '<p>' . $row["content"] . '</p>';
                echo '</div>';
            }
        } else {
            echo "<p>কোনো পোস্ট পাওয়া যায়নি।</p>";
        }
        ?>

    </div>

    <div class="rightcolumn">
        <div class="card">
            <h3>আমার সম্পর্কে</h3>
            <p>এটি একটি ডাইনামিক ব্লগ সাইট।</p>
        </div>
    </div>
</div>

<div class="footer">
    <h2>কপিরাইট © ২০২৬</h2>
</div>

</body>
</html>
