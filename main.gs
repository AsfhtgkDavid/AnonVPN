proxyes = {}
host_shell = get_shell
curr_shell = get_shell
comps = []

for ip, pass in proxyes
    curr_shell = curr_shell.connect_service(ip, 22, root, pass)
    comps.push(curr_shell.host_computer)
end for

for comp in comps
    comp.touch("/var", "system.tmp")
    comp.File("/var/system.tmp").move("/var", "system.log")
end for