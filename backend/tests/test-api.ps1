# SI Film Archive API Testing Script
$baseUrl = "http://localhost:3000/api"
$origin = @{Origin="http://localhost:5173"}

Write-Host "=== Health Check ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/health" -Method GET

Write-Host "`n=== Login ===" -ForegroundColor Cyan
$loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/sign-in/email" `
    -Method POST `
    -ContentType "application/json" `
    -Headers $origin `
    -Body '{"email":"testuser@example.com","password":"password123"}' `
    -SessionVariable session

Write-Host "Login Response:" ($loginResponse.Content | ConvertFrom-Json | ConvertTo-Json)

Write-Host "`n=== Get Profile ===" -ForegroundColor Cyan
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/auth/profile" `
        -Method GET `
        -Headers $origin `
        -WebSession $session
    Write-Host ($profile | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n=== Get Categories ===" -ForegroundColor Cyan
$categories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET
Write-Host ($categories | ConvertTo-Json -Depth 3)

Write-Host "`n=== Create Category (Admin) ===" -ForegroundColor Cyan
try {
    $newCategory = Invoke-RestMethod -Uri "$baseUrl/categories" `
        -Method POST `
        -ContentType "application/json" `
        -WebSession $session `
        -Body '{"nama_kategori":"Film Pendek","deskripsi":"Film durasi pendek"}'
    Write-Host ($newCategory | ConvertTo-Json)
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Get Films ===" -ForegroundColor Cyan
$films = Invoke-RestMethod -Uri "$baseUrl/films" -Method GET
Write-Host ($films | ConvertTo-Json -Depth 3)

Write-Host "`n=== Get Trending ===" -ForegroundColor Cyan
$trending = Invoke-RestMethod -Uri "$baseUrl/votes/trending?period=week" -Method GET
Write-Host ($trending | ConvertTo-Json -Depth 3)

Write-Host "`nDone!" -ForegroundColor Green
