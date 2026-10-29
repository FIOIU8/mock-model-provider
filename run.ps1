$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $ScriptDir
try {
    if (-not (Test-Path ".venv\Scripts\python.exe")) {
        python -m venv .venv
    }
    & .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    & .\.venv\Scripts\python.exe app.py
}
finally {
    Pop-Location
}
