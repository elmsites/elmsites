$root = $PSScriptRoot
$port = if ($env:PORT) { $env:PORT } else { 5173 }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"

$mime = @{
  ".html" = "text/html"; ".css" = "text/css"; ".js" = "application/javascript";
  ".svg" = "image/svg+xml"; ".png" = "image/png"; ".jpg" = "image/jpeg"; ".ico" = "image/x-icon"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/"))

    # Match Cloudflare Workers Assets: an extensionless path such as
    # /about resolves to about.html. Without this, local dev 404s on
    # every link while production works, or vice versa.
    if (-not (Test-Path $file -PathType Leaf)) {
      $withHtml = "$file.html"
      if (Test-Path $withHtml -PathType Leaf) { $file = $withHtml }
    }

    if (Test-Path $file -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($file)
      $ct = $mime[$ext]
      if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $res.OutputStream.Close()
  } catch {
    Write-Host "Request error: $_"
    try { $context.Response.OutputStream.Close() } catch {}
  }
}
