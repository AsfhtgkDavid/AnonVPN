proxyes = {}

go = function(sh, ip, pass)
    return sh.connect_service(ip, 22, "root", pass)
end function

shell = get_shell
for ip, pass in proxyes
    nextShell = go(shell, ip, pass)
    if not nextShell then exit("fail")
    nextShell.host_computer.touch("/var", "system.tmp")
    nextShell.host_computer.File("/var/system.tmp").move("/var", "system.log")
    shell = nextShell
end for

nextShell.start_terminal
