ShowOptions = function(options, msg)
    print("<color=#428ae9ff>"+msg)
    i = 1
    for option in options
        print("<color=#760792ff>[<color=white>"+i+"<color=#760792ff>]</color> <color=yellow>"+option)
        i = i+1
    end for
    inputOk = false
    option = 0
    while(true)
        option = user_input("<color=#e78e09ff>[default = "+options.len+"]<color=white>: ").to_int
        if typeof(option) == "number" and option <=i and option >= 1 then
            return option
        else if option.len == 0 then
            return
        else
            Error("Not a valid choice")
        end if
    end while
end function
clog = function(comp)
    comp.host_computer.touch("/var", "system.temp")
    comp.host_computer.File("/var/system.temp").move("/var", "system.log")
end function
Deserialize=function(array=null) // Преобразует string to map
    if not array or not array isa string then return 0
    type=null
    if array[0] == "[" then type="list"
    if array[0] == "{" then type="map"
    if not type then return 0

    if type == "list" then
        newArray=[]
    else
        newArray={}
    end if

    array=array.split(char(10)).join("")
    array=array[1:-1]
    if not array then return newArray
    a=[]
    b=[]
    c=0
    for v in array
        i=__v_idx
        if v == "{" or v == "[" then c=c+1
        if v == "}" or v == "]" then c=c-1
        if v == "," and c == 0 then
            a.push(b.join(""))
            b=[]
            continue
        end if
        b.push(v)
        if i == array.len-1 then
            a.push(b.join(""))
            b=[]
            continue
        end if
    end for
    array=a

    for i in array
        i=i.trim
        if type == "list" then
            if not i then continue
            if i[0] == """" and i[-1] == """" then
                i=i[1:-1]
            else
                if i == "null" then
                    i=null
                else if i == "true" then
                    i=1
                else if i == "false" then
                    i=0
                else if i[0] == "{" or i[0] == "[" then
                    i=Deserialize(i)
                else
                    nv=""
                    dc=0
                    for l in i
                        if l == "." then
                            if dc == 1 then break
                            nv=nv+"."
                        end if
                        if "0123456789E-".indexOf(l) != null then nv=nv+l
                    end for
                    if nv != "" then i=nv.val
                end if
            end if

            newArray.push(i)
        else
            k=i[0:i.indexOf(":")]
            if not k then continue
            if k[0] == """" then k=k[1:-1]
            v=i[i.indexOf(":")+1:]
            if not v then continue
            v=v.trim
            if not v then continue
            if v[0] == """" then
                v=v[1:-1]
            else
                if v == "null" then
                    v=null
                else if v == "true" then
                    v=1
                else if v == "false" then
                    v=0
                else if v[0] == "{" or v[0] == "[" then
                    v=Deserialize(v)
                else
                    nv=""
                    dc=0
                    for l in v
                        if l == "." then
                            if dc == 1 then break
                            nv=nv+"."
                        end if
                        if "0123456789E-".indexOf(l) != null then nv=nv+l
                    end for
                    if nv != "" then v=nv.val
                end if
            end if

            newArray[k]=v
        end if
    end for

    return newArray
end function

globals.server = get_shell.connect_service("ip",22,"root","pass","ssh")
globals.proxy = {"accounts": []}
local = get_shell.host_computer

Menu = function
    Options = function
        return ShowOptions(["Add a new Server.","Connect to a server.","<b><i>Exit.</i></b>"], "AnonVPN")
    end function
    option = Options
    if option == 1 then
        ip = user_input("[Enter the server IP]: ")
        user = user_input("[Enter login use name]: ")
        pass = user_input("[Enter server Password]: ")
        con = get_shell.connect_service(ip, 22, user, pass)
        clog(con)
        if not con then
            print("Invalid server data")
            return Menu
        else
            print("A new server has benn added!")
            globals.proxy.accounts.push({"user": user, "ip": ip, "password": pass})

            mapconf = local.File(home_dir+"/Config/Map.conf")
            if not mapconf then local.touch(home_dir+"/Config", "Map.conf")
            mapconf = local.File(home_dir+"/Config/Map.conf")
            cont = mapconf.get_content
            if cont then
                mapconf.set_content(cont[:-2]+", "+str(proxy.accounts[0]+"]}"))
            else
                mapconf.set_content(str(proxy))
            end if

            Servmapconf = server.host_computer.File("/root/server/Map.conf")
            if not Servmapconf then server.host_computer.create_folder("/root", "server"); server.host_computer.touch("/root/server", "Map.conf")
            Servmapconf = server.host_computer.File("/root/server/Map.conf")
            Servmapconf.set_content(str(proxy))
            return Menu
        end if
    else if option == 2 then

    end if
end function
Menu
