proxyes = {}

go = function(sh, ip, pass)
    return sh.connect_service(ip, 22, "root", pass)
end function

shell = get_shell
for ip, pass in proxyes
    nextShell = go(shell, ip, pass)
    if not nextShell then 
        print("<color=#FF0000>Proxy "+ip+" doesn't respond</color>")
        continue
    end if
    nextShell.host_computer.touch("/var", "system.tmp")
    nextShell.host_computer.File("/var/system.tmp").move("/var", "system.log")
    shell = nextShell
    print("Connected to "+ip)
end for

shell.start_terminal
