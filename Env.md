$env:PATH += ";C:\Users\danny\ffmpeg\ffmpeg-7.1-essentials_build\bin"
python api.py

Testing post:
"""
$url = "http://localhost:5000/generate_video"
$body = @{
text = "The remarkable advancements in AI development have transformed the way we live, work, and interact with technology, showcasing the incredible potential of human ingenuity and innovation. From revolutionizing healthcare to enhancing creativity and enabling seamless communication, AI continues to redefine the boundaries of possibility and inspire a brighter, more efficient future."
}
$bodyJson = $body | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri $url -Method Post -Body $bodyJson -ContentType "application/json"
"""
