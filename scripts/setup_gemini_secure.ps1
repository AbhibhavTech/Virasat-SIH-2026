$ErrorActionPreference = 'Stop'
$secureKey = Read-Host 'Enter your Gemini API key (input is hidden)' -AsSecureString
$keyPointer = [IntPtr]::Zero
$plainKey = $null

try {
  $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  if ([string]::IsNullOrWhiteSpace($plainKey)) {
    throw 'No Gemini API key was entered. Configuration was not changed.'
  }
  $env:GEMINI_API_KEY = $plainKey
  & npm run setup:ai-gemini
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
  Remove-Item Env:GEMINI_API_KEY -ErrorAction SilentlyContinue
  $plainKey = $null
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
}
