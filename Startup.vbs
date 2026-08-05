Set WshShell = CreateObject("WScript.Shell")

WshShell.Run _
"powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command ""& 'C:\Users\whitegold\AppData\Local\Lyricify 4\Startup.ps1'""", _
0, _
False