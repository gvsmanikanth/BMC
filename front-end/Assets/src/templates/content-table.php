<?php
	$pageTitle = 'Content table';
	$bodyClass = 'content-table';
	include 'php-inc/head.php';
?>

<section class="bg-white">
	<div class="layout-inner-wrap">
        <div class="jumbotron">
            <h1>Some page title</h1>
            <p>Eu aliquip dolore deserunt est minim. Excepteur pariatur ut culpa incididunt. Est nulla labore consequat ea culpa exercitation veniam aliquip labore. Excepteur sint ea ullamco aliquip eiusmod exercitation in.</p>
        </div>       
        <div class="generic-table non-responsive-table content-modal-table">
            <!--<h3>Windows Matix Non Responsive Table</h3>-->
            <table>
                <thead>
                    <tr>
                        <th>Initial Access</th>
                        <th>Execution</th>
                        <th>Persistence</th>
                        <th>Privilege Escalation</th>
                        <th>Defense Evasion</th>
                        <th>Credential Access</th>
                        <th>Discovery</th>
                        <th>Lateral Movement</th>
                        <th>Collection</th>
                        <th>Command And Control</th>
                        <th>Exfiltration</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                        <div><a href="#initAcc1" class="modal-inline">Exploit Public-Facing Application</a></div>
                        <div id="initAcc1" style="display:none;">
                            <section class="section p3" style="margin:5px;"> 
                            <h2  class="content-table-modal-title">Exploit Public-Facing Application</h2>
                            Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended or unanticipated behavior. The weakness in the system can be a bug, a glitch, or a design vulnerability. These applications are often websites, but can include databases (like Db2/IMS), CICS, standard services (like 3270 or SSH), network device administration and management protocols (like NJE and z/OS Connect), and any other applications with Internet accessible open sockets, such as web servers and related services.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec1" class="modal-inline">Command and Scripting Interpreter</a></div>
                        <div id="exec1" style="display:none;">
                            <section class="section p3">
                                <h2 class="content-table-modal-title">Command and Scripting Interpreter</h2>
                            Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms. The mainframe includes standard 3270, Telnet, SSH, and Unix Shell command lines. It also supports REXX, Javascript, Python and other scripting languages  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per1" class="modal-inline">Account Manipulation</a></div>
                        <div id="per1" style="display:none;">
                            <section class="section p3">
                                <h2 class="content-table-modal-title">Account Manipulation</h2>
                            Adversaries may manipulate accounts to maintain access to victim systems. Account manipulation may consist of any action that preserves adversary access to a compromised account, such as modifying credentials or permission groups. These actions could also include account activity designed to subvert security policies, such as performing iterative password updates to bypass password duration policies and preserve the life of compromised credentials. In order to create or manipulate accounts, the adversary must already have sufficient permissions on systems or the domain. Examples of this are modifying Setuid, Setgid, BPX.Superuser, or through adding systems special/operations through the external security manager. 
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="priv1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">Modal Title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="defe1" style="display:none;">
                            <section class="section p3">
                            <h2 class="content-table-modal-title">Modal Title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred1" class="modal-inline">Brute Force</a></div>
                        <div id="cred1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained. Without knowledge of the password for an account or set of accounts, an adversary may systematically guess the password using a repetitive or iterative mechanism. Brute forcing passwords can take place via interaction with a service that will check the validity of those credentials or offline against previously acquired credential data, such as password hashes. Examples of this can include testing against common passwords with password spraying, cracking password hashes, or using credentials found in other breaches with credential stuffing   
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco1" class="modal-inline">Account Discovery</a></div>
                        <div id="disco1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM1" class="modal-inline">Exploitation of Remote Services</a></div>
                        <div id="LeterM1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exploit remote services to gain unauthorized access to internal systems once inside of a network. Exploitation of a software vulnerability occurs when an adversary takes advantage of a programming error in a program, service, or within the operating system software or kernel itself to execute adversary-controlled code. A common goal for post-compromise exploitation of remote services is for lateral movement to enable access to a remote system.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect1" class="modal-inline">Automated Collection</a></div>
                        <div id="collect1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Once established within a system or network, an adversary may use automated techniques for collecting internal data. Methods for performing this technique could include use of a Command and Scripting Interpreter to search for and copy information fitting set criteria such as file type, location, or name at specific time intervals. This functionality could also be built into remote access tools.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command1" class="modal-inline">Commonly Used Port</a></div>
                        <div id="command1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil1" class="modal-inline">Automated Exfiltration</a></div>
                        <div id="exfil1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exfiltrate data, such as sensitive documents, through the use of automated processing after being gathered during Collection.When automated exfiltration is used, other exfiltration techniques likely apply as well to transfer the information out of the network, such as Exfiltration Over C2 Channel and Exfiltration Over Alternative Protocol.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact1" class="modal-inline">Data Destruction</a></div>
                        <div id="impact1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.   
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc2" class="modal-inline">External Remote Services</a></div>
                        <div id="initAcc2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as CICS / HTTP / NJE / FTP are often attacked directly or through valid accounts or trusted transactions  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec2" class="modal-inline">Exploitation for Client Execution</a></div>
                        <div id="exec2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may exploit software vulnerabilities in client applications to execute code. Vulnerabilities can exist in software due to unsecure coding practices that can lead to unanticipated behavior. Adversaries can take advantage of certain vulnerabilities through targeted exploitation for the purpose of arbitrary code execution. Oftentimes the most valuable exploits to an offensive toolkit are those that can be used to obtain code execution on a remote system because they can be used to gain access to that system. Users will expect to see files related to the applications they commonly used to do work, so they are a useful target for exploit research and development because of their high utility.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="per2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during system IPL to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="priv2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during IPL or logon to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information, such as the Windows Registry. An adversary may achieve the same goal by modifying or extending features of the kernel. An example would be to change the logon process for the security administrator to change your user credentials when they log in using Command Proc or Sys Exec
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe2" class="modal-inline">Direct Volume Access</a></div>
                        <div id="defe2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may directly access a volume to bypass file access controls and file system monitoring.  Ditto, default TAPE configuration, DFSMSdss, FDR,  EMC enablers and some other system monitoring tools can be used to access data on disks and tapes bypassing security controls unless they are mitigated against at the tool/operating system level
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred2" class="modal-inline">Credentials from Password Stores</a></div>
                        <div id="cred2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may search for common password storage locations to obtain user credentials. Passwords are stored in several places on a system, depending on the operating system or application holding the credentials. There are also specific applications that store passwords to make it easier for users manage and maintain. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco2" class="modal-inline">File and Directory Discovery</a></div>
                        <div id="disco2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system. Adversaries may use the information from File and Directory Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM2" class="modal-inline">Lateral Tool Transfer</a></div>
                        <div id="LeterM2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may transfer tools or other files between systems in a compromised environment. Files may be copied from one system to another to stage adversary tools or other files over the course of an operation. Adversaries may copy files laterally between internal victim systems to support lateral movement using inherent file sharing protocols such as file sharing over SFTP, Connect-Direct, IND$File, NFS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect2" class="modal-inline">Archive Collected Data</a></div>
                        <div id="collect2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                An adversary may compress and/or encrypt data that is collected prior to exfiltration. Compressing the data can help to obfuscate the collected data and minimize the amount of data sent over the network. Encryption can be used to hide information that is being exfiltrated from detection or make exfiltration less conspicuous upon inspection by a defender.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command2" class="modal-inline">Application Layer Protocol</a></div>
                        <div id="command2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may communicate using application layer protocols to avoid detection/network filtering by blending in with existing traffic. Commands to the remote system, and often the results of those commands, will be embedded within the protocol traffic between the client and server.  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil2" class="modal-inline">Data Transfer Size Limits</a></div>
                        <div id="exfil2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            An adversary may exfiltrate data in fixed size chunks instead of whole files or limit packet sizes below certain thresholds. This approach may be used to avoid triggering network data transfer threshold alerts.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact2" class="modal-inline">Data Encrypted for Impact</a></div>
                        <div id="impact2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may encrypt data to interrupt availability to system and network resources. They can attempt to render stored data inaccessible by encrypting files or data on local and remote drives and withholding access to a decryption key. This may be done in order to extract monetary compensation from a victim in exchange for decryption or a decryption key (ransomware) or to render data permanently inaccessible in cases where the key is not saved or transmitted.
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc1" class="modal-inline">Exploit Public-Facing Application</a></div>
                        <div id="initAcc1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title"> modal title content</h2>
                            Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended or unanticipated behavior. The weakness in the system can be a bug, a glitch, or a design vulnerability. These applications are often websites, but can include databases (like Db2/IMS), CICS, standard services (like 3270 or SSH), network device administration and management protocols (like NJE and z/OS Connect), and any other applications with Internet accessible open sockets, such as web servers and related services.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec1" class="modal-inline">Command and Scripting Interpreter</a></div>
                        <div id="exec1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms. The mainframe includes standard 3270, Telnet, SSH, and Unix Shell command lines. It also supports REXX, Javascript, Python and other scripting languages  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per1" class="modal-inline">Account Manipulation</a></div>
                        <div id="per1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may manipulate accounts to maintain access to victim systems. Account manipulation may consist of any action that preserves adversary access to a compromised account, such as modifying credentials or permission groups. These actions could also include account activity designed to subvert security policies, such as performing iterative password updates to bypass password duration policies and preserve the life of compromised credentials. In order to create or manipulate accounts, the adversary must already have sufficient permissions on systems or the domain. Examples of this are modifying Setuid, Setgid, BPX.Superuser, or through adding systems special/operations through the external security manager. 
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="priv1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="defe1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred1" class="modal-inline">Brute Force</a></div>
                        <div id="cred1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained. Without knowledge of the password for an account or set of accounts, an adversary may systematically guess the password using a repetitive or iterative mechanism. Brute forcing passwords can take place via interaction with a service that will check the validity of those credentials or offline against previously acquired credential data, such as password hashes. Examples of this can include testing against common passwords with password spraying, cracking password hashes, or using credentials found in other breaches with credential stuffing   
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco1" class="modal-inline">Account Discovery</a></div>
                        <div id="disco1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM1" class="modal-inline">Exploitation of Remote Services</a></div>
                        <div id="LeterM1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exploit remote services to gain unauthorized access to internal systems once inside of a network. Exploitation of a software vulnerability occurs when an adversary takes advantage of a programming error in a program, service, or within the operating system software or kernel itself to execute adversary-controlled code. A common goal for post-compromise exploitation of remote services is for lateral movement to enable access to a remote system.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect1" class="modal-inline">Automated Collection</a></div>
                        <div id="collect1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Once established within a system or network, an adversary may use automated techniques for collecting internal data. Methods for performing this technique could include use of a Command and Scripting Interpreter to search for and copy information fitting set criteria such as file type, location, or name at specific time intervals. This functionality could also be built into remote access tools.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command1" class="modal-inline">Commonly Used Port</a></div>
                        <div id="command1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil1" class="modal-inline">Automated Exfiltration</a></div>
                        <div id="exfil1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exfiltrate data, such as sensitive documents, through the use of automated processing after being gathered during Collection.When automated exfiltration is used, other exfiltration techniques likely apply as well to transfer the information out of the network, such as Exfiltration Over C2 Channel and Exfiltration Over Alternative Protocol.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact1" class="modal-inline">Data Destruction</a></div>
                        <div id="impact1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.   
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc2" class="modal-inline">External Remote Services</a></div>
                        <div id="initAcc2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as CICS / HTTP / NJE / FTP are often attacked directly or through valid accounts or trusted transactions  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec2" class="modal-inline">Exploitation for Client Execution</a></div>
                        <div id="exec2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may exploit software vulnerabilities in client applications to execute code. Vulnerabilities can exist in software due to unsecure coding practices that can lead to unanticipated behavior. Adversaries can take advantage of certain vulnerabilities through targeted exploitation for the purpose of arbitrary code execution. Oftentimes the most valuable exploits to an offensive toolkit are those that can be used to obtain code execution on a remote system because they can be used to gain access to that system. Users will expect to see files related to the applications they commonly used to do work, so they are a useful target for exploit research and development because of their high utility.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="per2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during system IPL to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="priv2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during IPL or logon to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information, such as the Windows Registry. An adversary may achieve the same goal by modifying or extending features of the kernel. An example would be to change the logon process for the security administrator to change your user credentials when they log in using Command Proc or Sys Exec
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe2" class="modal-inline">Direct Volume Access</a></div>
                        <div id="defe2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may directly access a volume to bypass file access controls and file system monitoring.  Ditto, default TAPE configuration, DFSMSdss, FDR,  EMC enablers and some other system monitoring tools can be used to access data on disks and tapes bypassing security controls unless they are mitigated against at the tool/operating system level
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred2" class="modal-inline">Credentials from Password Stores</a></div>
                        <div id="cred2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may search for common password storage locations to obtain user credentials. Passwords are stored in several places on a system, depending on the operating system or application holding the credentials. There are also specific applications that store passwords to make it easier for users manage and maintain. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco2" class="modal-inline">File and Directory Discovery</a></div>
                        <div id="disco2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system. Adversaries may use the information from File and Directory Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM2" class="modal-inline">Lateral Tool Transfer</a></div>
                        <div id="LeterM2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may transfer tools or other files between systems in a compromised environment. Files may be copied from one system to another to stage adversary tools or other files over the course of an operation. Adversaries may copy files laterally between internal victim systems to support lateral movement using inherent file sharing protocols such as file sharing over SFTP, Connect-Direct, IND$File, NFS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect2" class="modal-inline">Archive Collected Data</a></div>
                        <div id="collect2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                An adversary may compress and/or encrypt data that is collected prior to exfiltration. Compressing the data can help to obfuscate the collected data and minimize the amount of data sent over the network. Encryption can be used to hide information that is being exfiltrated from detection or make exfiltration less conspicuous upon inspection by a defender.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command2" class="modal-inline">Application Layer Protocol</a></div>
                        <div id="command2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may communicate using application layer protocols to avoid detection/network filtering by blending in with existing traffic. Commands to the remote system, and often the results of those commands, will be embedded within the protocol traffic between the client and server.  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil2" class="modal-inline">Data Transfer Size Limits</a></div>
                        <div id="exfil2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            An adversary may exfiltrate data in fixed size chunks instead of whole files or limit packet sizes below certain thresholds. This approach may be used to avoid triggering network data transfer threshold alerts.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact2" class="modal-inline">Data Encrypted for Impact</a></div>
                        <div id="impact2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may encrypt data to interrupt availability to system and network resources. They can attempt to render stored data inaccessible by encrypting files or data on local and remote drives and withholding access to a decryption key. This may be done in order to extract monetary compensation from a victim in exchange for decryption or a decryption key (ransomware) or to render data permanently inaccessible in cases where the key is not saved or transmitted.
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc1" class="modal-inline">Exploit Public-Facing Application</a></div>
                        <div id="initAcc1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended or unanticipated behavior. The weakness in the system can be a bug, a glitch, or a design vulnerability. These applications are often websites, but can include databases (like Db2/IMS), CICS, standard services (like 3270 or SSH), network device administration and management protocols (like NJE and z/OS Connect), and any other applications with Internet accessible open sockets, such as web servers and related services.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec1" class="modal-inline">Command and Scripting Interpreter</a></div>
                        <div id="exec1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms. The mainframe includes standard 3270, Telnet, SSH, and Unix Shell command lines. It also supports REXX, Javascript, Python and other scripting languages  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per1" class="modal-inline">Account Manipulation</a></div>
                        <div id="per1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may manipulate accounts to maintain access to victim systems. Account manipulation may consist of any action that preserves adversary access to a compromised account, such as modifying credentials or permission groups. These actions could also include account activity designed to subvert security policies, such as performing iterative password updates to bypass password duration policies and preserve the life of compromised credentials. In order to create or manipulate accounts, the adversary must already have sufficient permissions on systems or the domain. Examples of this are modifying Setuid, Setgid, BPX.Superuser, or through adding systems special/operations through the external security manager. 
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="priv1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="defe1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred1" class="modal-inline">Brute Force</a></div>
                        <div id="cred1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained. Without knowledge of the password for an account or set of accounts, an adversary may systematically guess the password using a repetitive or iterative mechanism. Brute forcing passwords can take place via interaction with a service that will check the validity of those credentials or offline against previously acquired credential data, such as password hashes. Examples of this can include testing against common passwords with password spraying, cracking password hashes, or using credentials found in other breaches with credential stuffing   
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco1" class="modal-inline">Account Discovery</a></div>
                        <div id="disco1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM1" class="modal-inline">Exploitation of Remote Services</a></div>
                        <div id="LeterM1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exploit remote services to gain unauthorized access to internal systems once inside of a network. Exploitation of a software vulnerability occurs when an adversary takes advantage of a programming error in a program, service, or within the operating system software or kernel itself to execute adversary-controlled code. A common goal for post-compromise exploitation of remote services is for lateral movement to enable access to a remote system.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect1" class="modal-inline">Automated Collection</a></div>
                        <div id="collect1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Once established within a system or network, an adversary may use automated techniques for collecting internal data. Methods for performing this technique could include use of a Command and Scripting Interpreter to search for and copy information fitting set criteria such as file type, location, or name at specific time intervals. This functionality could also be built into remote access tools.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command1" class="modal-inline">Commonly Used Port</a></div>
                        <div id="command1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil1" class="modal-inline">Automated Exfiltration</a></div>
                        <div id="exfil1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exfiltrate data, such as sensitive documents, through the use of automated processing after being gathered during Collection.When automated exfiltration is used, other exfiltration techniques likely apply as well to transfer the information out of the network, such as Exfiltration Over C2 Channel and Exfiltration Over Alternative Protocol.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact1" class="modal-inline">Data Destruction</a></div>
                        <div id="impact1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.   
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc2" class="modal-inline">External Remote Services</a></div>
                        <div id="initAcc2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as CICS / HTTP / NJE / FTP are often attacked directly or through valid accounts or trusted transactions  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec2" class="modal-inline">Exploitation for Client Execution</a></div>
                        <div id="exec2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may exploit software vulnerabilities in client applications to execute code. Vulnerabilities can exist in software due to unsecure coding practices that can lead to unanticipated behavior. Adversaries can take advantage of certain vulnerabilities through targeted exploitation for the purpose of arbitrary code execution. Oftentimes the most valuable exploits to an offensive toolkit are those that can be used to obtain code execution on a remote system because they can be used to gain access to that system. Users will expect to see files related to the applications they commonly used to do work, so they are a useful target for exploit research and development because of their high utility.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="per2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during system IPL to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="priv2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during IPL or logon to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information, such as the Windows Registry. An adversary may achieve the same goal by modifying or extending features of the kernel. An example would be to change the logon process for the security administrator to change your user credentials when they log in using Command Proc or Sys Exec
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe2" class="modal-inline">Direct Volume Access</a></div>
                        <div id="defe2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may directly access a volume to bypass file access controls and file system monitoring.  Ditto, default TAPE configuration, DFSMSdss, FDR,  EMC enablers and some other system monitoring tools can be used to access data on disks and tapes bypassing security controls unless they are mitigated against at the tool/operating system level
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred2" class="modal-inline">Credentials from Password Stores</a></div>
                        <div id="cred2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may search for common password storage locations to obtain user credentials. Passwords are stored in several places on a system, depending on the operating system or application holding the credentials. There are also specific applications that store passwords to make it easier for users manage and maintain. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco2" class="modal-inline">File and Directory Discovery</a></div>
                        <div id="disco2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system. Adversaries may use the information from File and Directory Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM2" class="modal-inline">Lateral Tool Transfer</a></div>
                        <div id="LeterM2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may transfer tools or other files between systems in a compromised environment. Files may be copied from one system to another to stage adversary tools or other files over the course of an operation. Adversaries may copy files laterally between internal victim systems to support lateral movement using inherent file sharing protocols such as file sharing over SFTP, Connect-Direct, IND$File, NFS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect2" class="modal-inline">Archive Collected Data</a></div>
                        <div id="collect2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                An adversary may compress and/or encrypt data that is collected prior to exfiltration. Compressing the data can help to obfuscate the collected data and minimize the amount of data sent over the network. Encryption can be used to hide information that is being exfiltrated from detection or make exfiltration less conspicuous upon inspection by a defender.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command2" class="modal-inline">Application Layer Protocol</a></div>
                        <div id="command2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may communicate using application layer protocols to avoid detection/network filtering by blending in with existing traffic. Commands to the remote system, and often the results of those commands, will be embedded within the protocol traffic between the client and server.  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil2" class="modal-inline">Data Transfer Size Limits</a></div>
                        <div id="exfil2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            An adversary may exfiltrate data in fixed size chunks instead of whole files or limit packet sizes below certain thresholds. This approach may be used to avoid triggering network data transfer threshold alerts.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact2" class="modal-inline">Data Encrypted for Impact</a></div>
                        <div id="impact2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may encrypt data to interrupt availability to system and network resources. They can attempt to render stored data inaccessible by encrypting files or data on local and remote drives and withholding access to a decryption key. This may be done in order to extract monetary compensation from a victim in exchange for decryption or a decryption key (ransomware) or to render data permanently inaccessible in cases where the key is not saved or transmitted.
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc1" class="modal-inline">Exploit Public-Facing Application</a></div>
                        <div id="initAcc1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended or unanticipated behavior. The weakness in the system can be a bug, a glitch, or a design vulnerability. These applications are often websites, but can include databases (like Db2/IMS), CICS, standard services (like 3270 or SSH), network device administration and management protocols (like NJE and z/OS Connect), and any other applications with Internet accessible open sockets, such as web servers and related services.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec1" class="modal-inline">Command and Scripting Interpreter</a></div>
                        <div id="exec1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms. The mainframe includes standard 3270, Telnet, SSH, and Unix Shell command lines. It also supports REXX, Javascript, Python and other scripting languages  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per1" class="modal-inline">Account Manipulation</a></div>
                        <div id="per1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may manipulate accounts to maintain access to victim systems. Account manipulation may consist of any action that preserves adversary access to a compromised account, such as modifying credentials or permission groups. These actions could also include account activity designed to subvert security policies, such as performing iterative password updates to bypass password duration policies and preserve the life of compromised credentials. In order to create or manipulate accounts, the adversary must already have sufficient permissions on systems or the domain. Examples of this are modifying Setuid, Setgid, BPX.Superuser, or through adding systems special/operations through the external security manager. 
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="priv1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="defe1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred1" class="modal-inline">Brute Force</a></div>
                        <div id="cred1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained. Without knowledge of the password for an account or set of accounts, an adversary may systematically guess the password using a repetitive or iterative mechanism. Brute forcing passwords can take place via interaction with a service that will check the validity of those credentials or offline against previously acquired credential data, such as password hashes. Examples of this can include testing against common passwords with password spraying, cracking password hashes, or using credentials found in other breaches with credential stuffing   
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco1" class="modal-inline">Account Discovery</a></div>
                        <div id="disco1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM1" class="modal-inline">Exploitation of Remote Services</a></div>
                        <div id="LeterM1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exploit remote services to gain unauthorized access to internal systems once inside of a network. Exploitation of a software vulnerability occurs when an adversary takes advantage of a programming error in a program, service, or within the operating system software or kernel itself to execute adversary-controlled code. A common goal for post-compromise exploitation of remote services is for lateral movement to enable access to a remote system.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect1" class="modal-inline">Automated Collection</a></div>
                        <div id="collect1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Once established within a system or network, an adversary may use automated techniques for collecting internal data. Methods for performing this technique could include use of a Command and Scripting Interpreter to search for and copy information fitting set criteria such as file type, location, or name at specific time intervals. This functionality could also be built into remote access tools.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command1" class="modal-inline">Commonly Used Port</a></div>
                        <div id="command1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil1" class="modal-inline">Automated Exfiltration</a></div>
                        <div id="exfil1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exfiltrate data, such as sensitive documents, through the use of automated processing after being gathered during Collection.When automated exfiltration is used, other exfiltration techniques likely apply as well to transfer the information out of the network, such as Exfiltration Over C2 Channel and Exfiltration Over Alternative Protocol.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact1" class="modal-inline">Data Destruction</a></div>
                        <div id="impact1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.   
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc2" class="modal-inline">External Remote Services</a></div>
                        <div id="initAcc2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as CICS / HTTP / NJE / FTP are often attacked directly or through valid accounts or trusted transactions  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec2" class="modal-inline">Exploitation for Client Execution</a></div>
                        <div id="exec2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may exploit software vulnerabilities in client applications to execute code. Vulnerabilities can exist in software due to unsecure coding practices that can lead to unanticipated behavior. Adversaries can take advantage of certain vulnerabilities through targeted exploitation for the purpose of arbitrary code execution. Oftentimes the most valuable exploits to an offensive toolkit are those that can be used to obtain code execution on a remote system because they can be used to gain access to that system. Users will expect to see files related to the applications they commonly used to do work, so they are a useful target for exploit research and development because of their high utility.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="per2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during system IPL to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="priv2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during IPL or logon to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information, such as the Windows Registry. An adversary may achieve the same goal by modifying or extending features of the kernel. An example would be to change the logon process for the security administrator to change your user credentials when they log in using Command Proc or Sys Exec
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe2" class="modal-inline">Direct Volume Access</a></div>
                        <div id="defe2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may directly access a volume to bypass file access controls and file system monitoring.  Ditto, default TAPE configuration, DFSMSdss, FDR,  EMC enablers and some other system monitoring tools can be used to access data on disks and tapes bypassing security controls unless they are mitigated against at the tool/operating system level
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred2" class="modal-inline">Credentials from Password Stores</a></div>
                        <div id="cred2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may search for common password storage locations to obtain user credentials. Passwords are stored in several places on a system, depending on the operating system or application holding the credentials. There are also specific applications that store passwords to make it easier for users manage and maintain. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco2" class="modal-inline">File and Directory Discovery</a></div>
                        <div id="disco2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system. Adversaries may use the information from File and Directory Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM2" class="modal-inline">Lateral Tool Transfer</a></div>
                        <div id="LeterM2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may transfer tools or other files between systems in a compromised environment. Files may be copied from one system to another to stage adversary tools or other files over the course of an operation. Adversaries may copy files laterally between internal victim systems to support lateral movement using inherent file sharing protocols such as file sharing over SFTP, Connect-Direct, IND$File, NFS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect2" class="modal-inline">Archive Collected Data</a></div>
                        <div id="collect2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                An adversary may compress and/or encrypt data that is collected prior to exfiltration. Compressing the data can help to obfuscate the collected data and minimize the amount of data sent over the network. Encryption can be used to hide information that is being exfiltrated from detection or make exfiltration less conspicuous upon inspection by a defender.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command2" class="modal-inline">Application Layer Protocol</a></div>
                        <div id="command2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may communicate using application layer protocols to avoid detection/network filtering by blending in with existing traffic. Commands to the remote system, and often the results of those commands, will be embedded within the protocol traffic between the client and server.  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil2" class="modal-inline">Data Transfer Size Limits</a></div>
                        <div id="exfil2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            An adversary may exfiltrate data in fixed size chunks instead of whole files or limit packet sizes below certain thresholds. This approach may be used to avoid triggering network data transfer threshold alerts.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact2" class="modal-inline">Data Encrypted for Impact</a></div>
                        <div id="impact2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may encrypt data to interrupt availability to system and network resources. They can attempt to render stored data inaccessible by encrypting files or data on local and remote drives and withholding access to a decryption key. This may be done in order to extract monetary compensation from a victim in exchange for decryption or a decryption key (ransomware) or to render data permanently inaccessible in cases where the key is not saved or transmitted.
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc1" class="modal-inline">Exploit Public-Facing Application</a></div>
                        <div id="initAcc1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended or unanticipated behavior. The weakness in the system can be a bug, a glitch, or a design vulnerability. These applications are often websites, but can include databases (like Db2/IMS), CICS, standard services (like 3270 or SSH), network device administration and management protocols (like NJE and z/OS Connect), and any other applications with Internet accessible open sockets, such as web servers and related services.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec1" class="modal-inline">Command and Scripting Interpreter</a></div>
                        <div id="exec1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms. The mainframe includes standard 3270, Telnet, SSH, and Unix Shell command lines. It also supports REXX, Javascript, Python and other scripting languages  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per1" class="modal-inline">Account Manipulation</a></div>
                        <div id="per1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may manipulate accounts to maintain access to victim systems. Account manipulation may consist of any action that preserves adversary access to a compromised account, such as modifying credentials or permission groups. These actions could also include account activity designed to subvert security policies, such as performing iterative password updates to bypass password duration policies and preserve the life of compromised credentials. In order to create or manipulate accounts, the adversary must already have sufficient permissions on systems or the domain. Examples of this are modifying Setuid, Setgid, BPX.Superuser, or through adding systems special/operations through the external security manager. 
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="priv1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe1" class="modal-inline">Abuse Elevation Control Mechanism</a></div>
                        <div id="defe1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system. This can include using Sudo, Setuid, and Setgid in USS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred1" class="modal-inline">Brute Force</a></div>
                        <div id="cred1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained. Without knowledge of the password for an account or set of accounts, an adversary may systematically guess the password using a repetitive or iterative mechanism. Brute forcing passwords can take place via interaction with a service that will check the validity of those credentials or offline against previously acquired credential data, such as password hashes. Examples of this can include testing against common passwords with password spraying, cracking password hashes, or using credentials found in other breaches with credential stuffing   
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco1" class="modal-inline">Account Discovery</a></div>
                        <div id="disco1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM1" class="modal-inline">Exploitation of Remote Services</a></div>
                        <div id="LeterM1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exploit remote services to gain unauthorized access to internal systems once inside of a network. Exploitation of a software vulnerability occurs when an adversary takes advantage of a programming error in a program, service, or within the operating system software or kernel itself to execute adversary-controlled code. A common goal for post-compromise exploitation of remote services is for lateral movement to enable access to a remote system.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect1" class="modal-inline">Automated Collection</a></div>
                        <div id="collect1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Once established within a system or network, an adversary may use automated techniques for collecting internal data. Methods for performing this technique could include use of a Command and Scripting Interpreter to search for and copy information fitting set criteria such as file type, location, or name at specific time intervals. This functionality could also be built into remote access tools.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command1" class="modal-inline">Commonly Used Port</a></div>
                        <div id="command1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil1" class="modal-inline">Automated Exfiltration</a></div>
                        <div id="exfil1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            Adversaries may exfiltrate data, such as sensitive documents, through the use of automated processing after being gathered during Collection.When automated exfiltration is used, other exfiltration techniques likely apply as well to transfer the information out of the network, such as Exfiltration Over C2 Channel and Exfiltration Over Alternative Protocol.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact1" class="modal-inline">Data Destruction</a></div>
                        <div id="impact1" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.   
                            </section>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <div><a href="#initAcc2" class="modal-inline">External Remote Services</a></div>
                        <div id="initAcc2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as CICS / HTTP / NJE / FTP are often attacked directly or through valid accounts or trusted transactions  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exec2" class="modal-inline">Exploitation for Client Execution</a></div>
                        <div id="exec2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                    Adversaries may exploit software vulnerabilities in client applications to execute code. Vulnerabilities can exist in software due to unsecure coding practices that can lead to unanticipated behavior. Adversaries can take advantage of certain vulnerabilities through targeted exploitation for the purpose of arbitrary code execution. Oftentimes the most valuable exploits to an offensive toolkit are those that can be used to obtain code execution on a remote system because they can be used to gain access to that system. Users will expect to see files related to the applications they commonly used to do work, so they are a useful target for exploit research and development because of their high utility.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#per2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="per2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during system IPL to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#priv2" class="modal-inline">Boot or Logon Autostart Execution</a></div>
                        <div id="priv2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may configure system settings to automatically execute a program during IPL or logon to maintain persistence or gain higher-level privileges on compromised systems. Operating systems may have mechanisms for automatically running a program on system boot or account logon.  These mechanisms may include automatically executing programs that are placed in specially designated directories or are referenced by repositories that store configuration information, such as the Windows Registry. An adversary may achieve the same goal by modifying or extending features of the kernel. An example would be to change the logon process for the security administrator to change your user credentials when they log in using Command Proc or Sys Exec
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#defe2" class="modal-inline">Direct Volume Access</a></div>
                        <div id="defe2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may directly access a volume to bypass file access controls and file system monitoring.  Ditto, default TAPE configuration, DFSMSdss, FDR,  EMC enablers and some other system monitoring tools can be used to access data on disks and tapes bypassing security controls unless they are mitigated against at the tool/operating system level
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#cred2" class="modal-inline">Credentials from Password Stores</a></div>
                        <div id="cred2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may search for common password storage locations to obtain user credentials. Passwords are stored in several places on a system, depending on the operating system or application holding the credentials. There are also specific applications that store passwords to make it easier for users manage and maintain. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#disco2" class="modal-inline">File and Directory Discovery</a></div>
                        <div id="disco2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system. Adversaries may use the information from File and Directory Discovery during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#LeterM2" class="modal-inline">Lateral Tool Transfer</a></div>
                        <div id="LeterM2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may transfer tools or other files between systems in a compromised environment. Files may be copied from one system to another to stage adversary tools or other files over the course of an operation. Adversaries may copy files laterally between internal victim systems to support lateral movement using inherent file sharing protocols such as file sharing over SFTP, Connect-Direct, IND$File, NFS
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#collect2" class="modal-inline">Archive Collected Data</a></div>
                        <div id="collect2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                An adversary may compress and/or encrypt data that is collected prior to exfiltration. Compressing the data can help to obfuscate the collected data and minimize the amount of data sent over the network. Encryption can be used to hide information that is being exfiltrated from detection or make exfiltration less conspicuous upon inspection by a defender.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#command2" class="modal-inline">Application Layer Protocol</a></div>
                        <div id="command2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may communicate using application layer protocols to avoid detection/network filtering by blending in with existing traffic. Commands to the remote system, and often the results of those commands, will be embedded within the protocol traffic between the client and server.  
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#exfil2" class="modal-inline">Data Transfer Size Limits</a></div>
                        <div id="exfil2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                            An adversary may exfiltrate data in fixed size chunks instead of whole files or limit packet sizes below certain thresholds. This approach may be used to avoid triggering network data transfer threshold alerts.
                            </section>
                        </div>
                        </td>
                        <td>
                        <div><a href="#impact2" class="modal-inline">Data Encrypted for Impact</a></div>
                        <div id="impact2" style="display:none;">
                            <section class="section p3">
                                    <h2 class="content-table-modal-title">modal title content</h2>
                                Adversaries may encrypt data to interrupt availability to system and network resources. They can attempt to render stored data inaccessible by encrypting files or data on local and remote drives and withholding access to a decryption key. This may be done in order to extract monetary compensation from a victim in exchange for decryption or a decryption key (ransomware) or to render data permanently inaccessible in cases where the key is not saved or transmitted.
                            </section>
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
<?php include 'php-inc/foot.php'; ?>
