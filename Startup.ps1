$p=Start-Process "C:\Users\whitegold\AppData\Local\Lyricify 4\Lyricify for Spotify.exe" -PassThru
while($p.MainWindowHandle -eq 0){Start-Sleep 0.1;$p.Refresh()}
Add-Type 'using System;using System.Runtime.InteropServices;public static class W{[DllImport("user32.dll")]public static extern bool ShowWindow(IntPtr hWnd,int nCmdShow);}'
[W]::ShowWindow($p.MainWindowHandle,6)|Out-Null