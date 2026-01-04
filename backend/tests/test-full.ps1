# SI Film Archive - Full API Test
$baseUrl = "http://localhost:3000/api"
$origin = @{Origin="http://localhost:5173"}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "SI Film Archive - Full API Test" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

# Login
Write-Host "`n=== LOGIN ===" -ForegroundColor Cyan
$login = Invoke-WebRequest -Uri "$baseUrl/auth/sign-in/email" `
    -Method POST -ContentType "application/json" -Headers $origin `
    -Body '{"email":"testuser@example.com","password":"password123"}' `
    -SessionVariable session -UseBasicParsing
$user = ($login.Content | ConvertFrom-Json).user
Write-Host "Logged in as: $($user.name) (role_id: $($user.role_id))" -ForegroundColor Green

# ========== FILMS ==========
Write-Host "`n=== CREATE FILM 1 ===" -ForegroundColor Cyan
$filmBody = @{
    judul = "Film Pendek Pertama"
    category_id = 1
    sinopsis = "Ini adalah sinopsis film pendek pertama saya."
    tahun_karya = 2024
    link_video_utama = "https://youtube.com/watch?v=abc123"
    gambar_poster = "/uploads/poster1.jpg"
    crew = @(
        @{ jabatan = "Sutradara"; anggota = @("John Doe") }
        @{ jabatan = "Penulis"; anggota = @("Jane Doe") }
    )
} | ConvertTo-Json -Depth 3

try {
    $film1 = Invoke-RestMethod -Uri "$baseUrl/films" -Method POST `
        -ContentType "application/json" -WebSession $session -Body $filmBody
    Write-Host "Created: $($film1.data.judul) (film_id: $($film1.data.film_id))" -ForegroundColor Green
    $film1Id = $film1.data.film_id
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $film1Id = $null
}

Write-Host "`n=== CREATE FILM 2 ===" -ForegroundColor Cyan
$filmBody2 = '{"judul":"Dokumenter Kampus","category_id":2,"sinopsis":"Dokumenter tentang kehidupan kampus","tahun_karya":2024}'
try {
    $film2 = Invoke-RestMethod -Uri "$baseUrl/films" -Method POST `
        -ContentType "application/json" -WebSession $session -Body $filmBody2
    Write-Host "Created: $($film2.data.judul) (film_id: $($film2.data.film_id))" -ForegroundColor Green
    $film2Id = $film2.data.film_id
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $film2Id = $null
}

Write-Host "`n=== GET PENDING FILMS ===" -ForegroundColor Cyan
$pending = Invoke-RestMethod -Uri "$baseUrl/films/pending" -Method GET -WebSession $session
Write-Host "Pending films: $($pending.data.Count)" -ForegroundColor Yellow
foreach ($p in $pending.data) {
    Write-Host "  - $($p.judul) (id: $($p.film_id))" -ForegroundColor Gray
}

# Approve films
if ($film1Id) {
    Write-Host "`n=== APPROVE FILM 1 ===" -ForegroundColor Cyan
    $approved = Invoke-RestMethod -Uri "$baseUrl/films/$film1Id/approve" -Method PATCH -WebSession $session
    Write-Host "Approved: $($approved.data.judul) -> $($approved.data.status)" -ForegroundColor Green
}

if ($film2Id) {
    Write-Host "`n=== APPROVE FILM 2 ===" -ForegroundColor Cyan
    $approved2 = Invoke-RestMethod -Uri "$baseUrl/films/$film2Id/approve" -Method PATCH -WebSession $session
    Write-Host "Approved: $($approved2.data.judul) -> $($approved2.data.status)" -ForegroundColor Green
}

Write-Host "`n=== GET PUBLISHED FILMS ===" -ForegroundColor Cyan
$films = Invoke-RestMethod -Uri "$baseUrl/films" -Method GET
Write-Host "Published films: $($films.data.Count)"
foreach ($f in $films.data) {
    Write-Host "  - $($f.judul) (id: $($f.film_id))" -ForegroundColor Gray
}

# Use first published film for testing
$testFilmId = if ($films.data.Count -gt 0) { $films.data[0].film_id } else { 1 }

# ========== VOTES ==========
Write-Host "`n=== VOTE FILM ===" -ForegroundColor Cyan
try {
    $vote = Invoke-RestMethod -Uri "$baseUrl/votes/film/$testFilmId" `
        -Method POST -ContentType "application/json" -WebSession $session -Body '{}'
    Write-Host "$($vote.message) - vote_count: $($vote.data.vote_count)" -ForegroundColor Green
} catch {
    Write-Host "Error or already voted: $_" -ForegroundColor Yellow
}

Write-Host "`n=== GET VOTE COUNT ===" -ForegroundColor Cyan
$voteCount = Invoke-RestMethod -Uri "$baseUrl/votes/film/$testFilmId" -Method GET -WebSession $session
Write-Host "Film $testFilmId - votes: $($voteCount.data.vote_count), has_voted: $($voteCount.data.has_voted)"

Write-Host "`n=== TOGGLE VOTE ===" -ForegroundColor Cyan
try {
    $toggle = Invoke-RestMethod -Uri "$baseUrl/votes/film/$testFilmId/toggle" `
        -Method POST -ContentType "application/json" -WebSession $session -Body '{}'
    Write-Host "$($toggle.message) - voted: $($toggle.data.voted), count: $($toggle.data.vote_count)" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n=== GET TRENDING ===" -ForegroundColor Cyan
$trending = Invoke-RestMethod -Uri "$baseUrl/votes/trending?period=all&limit=5" -Method GET
Write-Host "Trending films:"
foreach ($t in $trending.data) {
    Write-Host "  - $($t.judul) (votes: $($t.vote_count))" -ForegroundColor Gray
}

# ========== DISCUSSIONS ==========
Write-Host "`n=== POST COMMENT ===" -ForegroundColor Cyan
try {
    $comment1 = Invoke-RestMethod -Uri "$baseUrl/discussions/film/$testFilmId" `
        -Method POST -ContentType "application/json" -WebSession $session `
        -Body '{"isi_pesan":"Film yang sangat bagus! Suka banget."}'
    Write-Host "Comment: '$($comment1.data.isi_pesan)' (id: $($comment1.data.diskusi_id))" -ForegroundColor Green
    $commentId = $comment1.data.diskusi_id
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $commentId = $null
}

Write-Host "`n=== POST COMMENT 2 ===" -ForegroundColor Cyan
try {
    $comment2 = Invoke-RestMethod -Uri "$baseUrl/discussions/film/$testFilmId" `
        -Method POST -ContentType "application/json" -WebSession $session `
        -Body '{"isi_pesan":"Ceritanya menarik!"}'
    Write-Host "Comment: '$($comment2.data.isi_pesan)'" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

if ($commentId) {
    Write-Host "`n=== REPLY TO COMMENT ===" -ForegroundColor Cyan
    $replyBody = "{`"isi_pesan`":`"Setuju banget!`",`"parent_id`":$commentId}"
    try {
        $reply = Invoke-RestMethod -Uri "$baseUrl/discussions/film/$testFilmId" `
            -Method POST -ContentType "application/json" -WebSession $session -Body $replyBody
        Write-Host "Reply: '$($reply.data.isi_pesan)' (parent: $($reply.data.parent_id))" -ForegroundColor Green
        $replyId = $reply.data.diskusi_id
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        $replyId = $null
    }

    if ($replyId) {
        Write-Host "`n=== NESTED REPLY ===" -ForegroundColor Cyan
        $replyBody2 = "{`"isi_pesan`":`"Iya bener!`",`"parent_id`":$replyId}"
        try {
            $reply2 = Invoke-RestMethod -Uri "$baseUrl/discussions/film/$testFilmId" `
                -Method POST -ContentType "application/json" -WebSession $session -Body $replyBody2
            Write-Host "Nested reply: '$($reply2.data.isi_pesan)'" -ForegroundColor Green
        } catch {
            Write-Host "Error: $_" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== GET COMMENTS (Nested Tree) ===" -ForegroundColor Cyan
$comments = Invoke-RestMethod -Uri "$baseUrl/discussions/film/$testFilmId" -Method GET
Write-Host "Root comments: $($comments.data.Count)"
foreach ($c in $comments.data) {
    Write-Host "  - $($c.isi_pesan) [replies: $($c.reply_count)]" -ForegroundColor Gray
    foreach ($r in $c.replies) {
        Write-Host "    - $($r.isi_pesan)" -ForegroundColor DarkGray
        foreach ($r2 in $r.replies) {
            Write-Host "      - $($r2.isi_pesan)" -ForegroundColor DarkGray
        }
    }
}

Write-Host "`n=== GET COMMENT COUNT ===" -ForegroundColor Cyan
$count = Invoke-RestMethod -Uri "$baseUrl/discussions/film/$testFilmId/count" -Method GET
Write-Host "Total comments: $($count.data.comment_count)"

if ($commentId) {
    Write-Host "`n=== UPDATE COMMENT ===" -ForegroundColor Cyan
    try {
        $updated = Invoke-RestMethod -Uri "$baseUrl/discussions/$commentId" `
            -Method PUT -ContentType "application/json" -WebSession $session `
            -Body '{"isi_pesan":"Film yang sangat bagus! (edited)"}'
        Write-Host "Updated: '$($updated.data.isi_pesan)'" -ForegroundColor Green
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== GET ALL COMMENTS (Flat) ===" -ForegroundColor Cyan
$allComments = Invoke-RestMethod -Uri "$baseUrl/discussions/all" -Method GET -WebSession $session
Write-Host "All comments: $($allComments.data.Count)"

# ========== SUMMARY ==========
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "TEST COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
