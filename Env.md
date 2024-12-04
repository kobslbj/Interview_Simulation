$env:PATH += ";C:\Users\danny\ffmpeg\ffmpeg-7.1-essentials_build\bin"
python api.py

Testing post:
"""
$url = "http://localhost:5000/generate_video"
$body = @{
text = "Why does the result of the generated video perform so bad? What's wrong with the model? Should I finetune with my own data? Hope it'll get better!"
}
$bodyJson = $body | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri $url -Method Post -Body $bodyJson -ContentType "application/json"
"""
