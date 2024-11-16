/////////////////////////////////////////////////////
//    * CompTIA Super Quiz Project                 //
//    * By Eric H. Petross                         //
//    * RI-JJM-6 => The Last Mile Program          //
//    * 2024 Copyright StrayDog Syndications LLC.  //
//    * All Rights Reserved                        //
/////////////////////////////////////////////////////

$(() => {
  "use strict";

  //////////////////////
  //* DOM References *//
  //////////////////////

  let $hintText = document.getElementById("hintText");
  let $question = document.getElementById("question");
  let $feedback = document.getElementById("feedback");
  let $answer1 = document.getElementById("answer1");
  let $answer2 = document.getElementById("answer2");
  let $answer3 = document.getElementById("answer3");
  let $answer4 = document.getElementById("answer4");
  let $start = document.getElementById("start");
  let $score = document.getElementById("score");
  let $timer = document.getElementById("timer");
  let $name = document.getElementById("welcome");
  let $hint = document.getElementById("cheater");

  /////////////////////////////
  //* Default Page Settings *//
  /////////////////////////////

  $('#correct').hide(), $('#wrong').hide(), $('#answers').hide(),
    $('#next').hide(), $('#reset').hide(), $('#cheater').hide(),
    $('#intro').show();
  const quizBank = [];
  let correct;
  let interval;
  let score = 0;
  update($score, score);

  ////////////////////////////
  //* Question constructor *//
  ////////////////////////////

  class Question {
    constructor(questionText, answers, asked, correctAnswer) {
      this.questionText = questionText;
      this.answers = answers;
      this.correctAnswer = correctAnswer;
    }

  }

  ///////////////////////
  //* Event Listeners *//
  ///////////////////////

  $start.addEventListener('click', () => {
    quiz(questionBank);
  }, false);
  $('#answers input').on('click', compareAnswers);
  $('#reset').on('click', resetQuiz);

  $('#confirm').on('click', () => {
    let validName = /(\S+)/gi;
    let userName = $('#user-name').val();
    if (validName.test(userName) === false) {
      userName = prompt('Please enter your name to continue!');
      update($name, `Good Luck on your test, ${userName} !`);
    } else {
      //  RegExp validates name
      update($name, `Good Luck on your test, ${userName} !`);
    }
  });
  $('#confirmQuestions').on('click', userQuestion);
  /// docks one point from score for answers ///
  $('#cheater').on('click', () => {
    score--;
    update($score, score);
  });

  //////////////////////////////
  // Keypress Event Listeners //
  //////////////////////////////

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) {
      return;
      // does nothing if the event was already processed
    }
    switch (event.key) {
      case '1':
        // answer #1
        $('#choice1').click();
        break;
      case '2':
        // answer #2
        $('#choice2').click();
        break;
      case '3':
        // answer #3
        $('#choice3').click();
        break;
      case '4':
        // answer #4
        $('#choice4').click();
        break;
      case '[':
        // start the quiz
        $('#start').click();
        break;
      case ']':
        // change the user name
        let userName = $('#user-name').val();
        update($name, `Good Luck on your test, ${userName} !`);
        break;
      case 'q':
        $('#submit').click();
        break;
      case 'Escape':
        // reset entire page
        alert("This will reset the quiz, are you sure that's what you want? Select Ok to reset or Esc to go back to current quiz.");
        window.location.reload();
        break;
      case '/':
        // reveal/hide keyboard shortcut menu
        $('#toggle').click();
        break;
      default:
        return;
      // quit whenever this fails to handle event
    }
    // cancels the default action to avoid it being handled twice
    event.preventDefault();
  }, true);

  ///////////////////////////
  // Function Declarations //
  ///////////////////////////

  function update(element, content) {
    element.innerText = content;
  }


  /////////////////////////
  //* Question Database *//
  /////////////////////////

  const questionBank =
    // {questionText: "", answers: [0-3], correctAnswer: #x} //
    [

      /////////////////
      //* Security+ *//
      /////////////////

      {
        questionText: 'Your boss thanks you for pictures you sent from the recent company picnic. You ask him what he is talking about, and he says he got an e-mail from you with pictures from the picnic. Knowing you have not sent him that e-mail, what type of attack do you suspect is happening?',
        answers: ['Phishing', 'Spear phishing', 'Reconnaissance', 'Impersonation'],
        correctAnswer: 1
      },
      {
        questionText: 'While waiting in the lobby of your building for a guest, you notice a man in a red shirt standing close to a locked door with a large box in his hands. He waits for someone else to come along and open the locked door and then proceeds to follow her inside. What type of social engineering attack have you just witnessed?',
        answers: ['Impersonation', 'Phishing', 'Boxing', 'Tailgating'],
        correctAnswer: 3
      },
      {
        questionText: "A colleague asks you for advice on why he can't log in to his Gmail account. Looking at his browser, you see he has typed '<a class='text-primary'>www.gmal.com</a>' in the address bar. The screen looks very similar to the Gmail login screen. Your colleague has just fallen victim to what type of attack?",
        answers: ['Jamming', 'Rainbow table', 'Whale phishing', 'Typosquatting'],
        correctAnswer: 3
      },
      {
        questionText: "A user in your organization contacts you to see if there's any update to the 'account compromise' that happened last week. When you ask him to explain what he means, the user tells you he received a phone call earlier in the week from your department and was asked to verify his user ID and password. The user has fallen victim to what specific type of attack?",
        answers: ['Spear phishing', 'Vishing', 'Phishing', 'Replication'],
        correctAnswer: 1
      },
      {
        questionText: "Coming into your office, you overhear a conversation between two security guards. One guard is telling the other how she caught several people digging through the trash behind the building early this morning. The security guard says the people claimed to be looking for aluminum cans, but only had a bag of papers - no cans. What type of attack has this security guard witnessed?",
        answers: ['Spear phishing', 'Pharming', 'Dumpster diving', 'Rolling refuse'],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following are specifically used to spread influence, alter perceptions, and sway people toward a position favored by those spreading it?",
        answers: ['Identity fraud, invoice scams, credential harvesting', 'Hoaxes, eliciting information, urgency', 'Influence campaigns, social media, hybrid warfare', 'Authority, intimidation, consensus'],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is a type of social engineering attack in which an attacker attempts to obtain sensitive information from a user by masquerading as a trusted entity in an e-mail?",
        answers: ['Phishing', 'Pharming', 'Spam', 'Vishing'],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following is/are psychological tools used by social engineers to create false trust with a target?",
        answers: ['Impersonation', 'Urgency or scarcity', 'Authority', 'All of the above'],
        correctAnswer: 3
      },
      {
        questionText: "Once an organization's security policies have been established, what is the single most effective method of countering potential social engineering attacks?",
        answers: ['An active security awareness program', 'A separate physical access control mechanism for each department in the organization', "Frequent testing of both the organization's physical security procedures and employee telephone practices", 'Implementing access control cards and the wearing of security identification badges'],
        correctAnswer: 0
      },
      {
        questionText: "You notice a new custodian in the office, working much earlier than normal, emptying trash cans, and moving very slowly past people working. You ask him where the normal guy is, and in very broken English he says, 'out sick,' indicating a cough. What is happening?",
        answers: ['Watering hole attack', 'Impersonation', 'Prepending', 'Identity fraud'],
        correctAnswer: 1
      },
      {
        questionText: "A disgruntled administrator is fired for negligence at your organization. Thirty days later, your organization's internal file server and backup server crash at exactly the same time. Examining the servers, you determine the critical operating system files were deleted from both systems. If the disgruntled administrator was responsible for administering those servers during her employment, this is most likely an example of what kind of malware?",
        answers: ['Crypto-malware', 'Trojan', 'Worm', 'Logic bomb'],
        correctAnswer: 3
      },
      {
        questionText: "A colleague has been urging you to download a new animated screensaver he has been using for several weeks. While he is showing you the program, the cursor on his screen moves on its own and a command prompt window opens and quickly closes. You can't tell what if anything was displayed in that command prompt window. Your colleague says, 'It's been doing that for a while, but its no big deal.' Based on what you've seen, you suspect the animated screensaver is really what type of malware?",
        answers: ['A worm', 'A trojan', 'Ransomware', 'Spyware'],
        correctAnswer: 1
      },
      {
        questionText: "Several desktops in your organization are displaying a red screen with the message <span class=\"font-monospace\">Your files have been encrypted. Pay 100 <i class=\"fab fa-bitcoin\"></i> to recover them.</span> These desktops have likely been affected by what type of malware?",
        answers: ['Spyware', 'Spraying', 'Ransomware', 'Crypto-malware'],
        correctAnswer: 2
      },
      {
        questionText: "While port-scanning your network for unauthorized systems, you notice one of your file servers has TCP port 31337 open. When you connect to the port with the security tool netcat, you see a prompt that reads, <span class=\"font-monospace\">Enter password for access:_</span>. Your server may be infected with what type of malware?",
        answers: ['Potentially unwanted program (PUP)', 'Fileless virus', 'Backdoor', 'Man in the middle attack'],
        correctAnswer: 2
      },
      {
        questionText: "While port-scanning your network for unauthorized systems, you notice one of your file servers has TCP port 61337 open. When you use Wireshark and examine the packets, you see encypted traffic, in single packets, going back and forth every five minutes. What is this connection?",
        answers: ['Command and control', 'Backdoor', 'External backup location', 'Remote login'],
        correctAnswer: 0
      },
      {
        questionText: "A user in your organization is having issues with her laptop. Every time she opens a web browser, she sees different pop-up ads every few minutes. It doesn't seem to matter which websites are being visited- the pop-ups still appear. What type of attack does this sound like?",
        answers: ['Potentially unwanted program (PUP)', 'Ransomware', 'Worm', 'Virus'],
        correctAnswer: 0
      },
      {
        questionText: "Users at your organization are complaining about slow systems. Examining several of them, you see that CPU utilization is extremely high and a process called <span class=\"font-monospace\">btmine</span> is running on each of the affected systems. You also notice each of the affected systems is communicating with an IP address outside your country on UDP port 43232. If you disconnect the network connections on the affected systems, the CPU utilization drops significantly. Based on what you've observed, you suspect these systems are infected with what type of malware?",
        answers: ['Rainbow table', 'Crypto-malware', 'Dictionary', 'Hybrid attack'],
        correctAnswer: 1
      },
      {
        questionText: "A piece of malware is infecting the desktops in your organization. Every hour, more systems are infected. The infections are happening in different departments and in cases where the users don't share any files, programs, or even e-mails. What type of malware can cause this type of infection?",
        answers: ['Virus', 'Trojan', 'Remote-access trojan (RAT)', 'Worm'],
        correctAnswer: 3
      },
      {
        questionText: "Which are the characteristics of remote-access trojans?",
        answers: ['They can be deployed through malware such as worms.', 'They allow attacks to connect to the system remotely.', 'They give attackers the ability to modify files and change settings.', 'All of the above.'],
        correctAnswer: 3
      },
      {
        questionText: "To test your systems against weak passwords, you as an admin (with proper permissions) test all accounts using the top 100 commonly used passwords. What is this an example of?",
        answers: ['Dictionary', 'Password spraying', 'Rainbow tables', 'Online'],
        correctAnswer: 1
      },
      {
        questionText: "When an attacker captures network traffic and retransmits it at a later time, what type of attack are they attempting?",
        answers: ['Denial-of-service attack', 'Replay attack', 'Bluejacking attack', 'Man in the middle attack'],
        correctAnswer: 1
      },
      {
        questionText: "What type of attack involves an attacker putting a layer of code between an original device driver and the operating system?",
        answers: ['Refactoring', 'Trojan horse', 'Shimming', 'Pass the hash'],
        correctAnswer: 2
      },
      {
        questionText: "You're reviewing a custom web application and accidentally type a number in the text field. The application returns an error message containing variable names, filenames, and the full path of the application. This is an example of which of the following?",
        answers: ['Resource exhaustion', 'Improper error handling', 'Generic error message', 'Common misconfiguration'],
        correctAnswer: 1
      },
      {
        questionText: "Your working with a group testing a new application. You've noticed that when three or more of you click Submit on a specific form at the same time, the application crashes every time. This is most likely an example of which of the following?",
        answers: ['A race condition', 'A nondeterministic error', 'An undocumented feature', 'A DLL injection'],
        correctAnswer: 0
      },
      {
        questionText: "An externally facing web server in your organization keeps crashing. Looking at the server after a reboot, you notice CPU usage is pegged and memory usage is rapidly climbing. The traffic logs show a massive amount of incoming HTTP and HTTPS requests to the server. Which type of attack is this web server experiencing?",
        answers: ['Input validation', 'Distributed error handling', 'Resource exhaustion', 'Race condition'],
        correctAnswer: 2
      },
      {
        questionText: "Your organization is considering a new ticket identifier with your current help desk system. The new identifier would be a 16-digit integer created by combining the date, time, and operator ID. Unfortunately, when you've tried using the new identifier in the 'ticket number' field on your current system, the application crashes every time. The old method of using a five-digit number integer  works just fine. This is most likely an example of which of the following?",
        answers: ['Common misconfiguration', 'Zero-day vulnerablility', 'Memory leak', 'Integer overflow'],
        correctAnswer: 3
      },
      {
        questionText: "While examining a laptop infected with malware, you notice the malware loads on startup and also loads a file called <span class=\"font-monospace\">netutilities.dll</span> each time Microsoft word is opened. This is an example of which of the following?",
        answers: ['Race condition', 'DLL injection', 'System infection', 'Memory overflow'],
        correctAnswer: 1
      },
      {
        questionText: "A web application you are reviewing has an input field for username and indicates that the username should be between 6 and 12 characters. You've discovered that if you input a username that's 150 characters or more in length, the application crashes. What is this an example of?",
        answers: ['Memory leak', 'Buffer overflow', 'Directory traversal', 'Integer overflow'],
        correctAnswer: 1
      },
      {
        questionText: "Your organization is having issues with a custom web application. The application seems to run fine for a while but starts to lock up or crash after seven or ten days of continuous use. Examining the server, you notice that memory usage seems to climb every day until the server runs out of memory. The application is most likely suffering from which of the following?",
        answers: ['Memory leak', 'Overflow leak', 'Zero-day exploit', 'Pointer deference'],
        correctAnswer: 0
      },
      {
        questionText: "Your database server is returning a large dataset to an online user, saturating the network. The normal return of records would be a couple at most. This is an example of what form of attack?",
        answers: ['Memory leak', 'LDAP injection', 'Man in the middle', 'SQL injection'],
        correctAnswer: 3
      },
      {
        questionText: "A user reports 'odd' certificate warnings on her web browser this morning whenever she visits Google. Looking at her browser, you see these certificate warnings. Looking at the network traffic, you notice that all HTTP and HTTPS requests from that system are being routed to the same IP regardless of destination. Which of the following attack types are you seeing in this case?",
        answers: ['Evil twin', 'Man in the middle', 'Disassociation', 'MAC cloning'],
        correctAnswer: 1
      },
      {
        questionText: "Users are reporting that the wireless network on one side of the building is broken. They can connect but can't seem to get to the Internet. While investigating, you notice all of the affected users are connecting to an access point you don't recognize. These users have fallen victim to what type of attack?",
        answers: ['Rogue AP', 'WPS', 'Bluejacking', 'Disassociation'],
        correctAnswer: 0
      },
      {
        questionText: "Your sitting at the airport when your friend gets a mesage on her phone. In the text is a picture of a duck with the word 'Pwnd' as the caption. Your friend is the victim of what type of attack?",
        answers: ['Snarfing', 'Bluejacking', 'Quacking', 'Collision'],
        correctAnswer: 1
      },
      {
        questionText: "All of the wireless users on the third floor  of your building are reporting issues with the network. Every 15 minutes, their devices disconnect from the network. Within a minute or so they are able to reconnect. What type of attack is likely underway in this situation?",
        answers: ['Evil twin', 'Jamming', 'Domain highjacking', 'Disassociation'],
        correctAnswer: 3
      },
      {
        questionText: "Your e-commerce site is crashing under an extremely high traffic volume. Looking at the traffic logs, you see tens of thousands of requests for the same URL coming from hundreds of different IP addresses around the world. What type of attack are you facing?",
        answers: ['Domain highjacking', 'Distributed denial-of-service (DDoS)', 'DNS poisoning', 'URL redirection'],
        correctAnswer: 1
      },
      {
        questionText: "A user wants to know if the network is down because she is unable to connect to anything. While troubleshooting, you notice the MAC address for her default gateway setting doesn't match the MAC address of the organization's router. What type of attack has been used against this user?",
        answers: ['MAC cloning', 'ARP poisoning', 'Disassociation', 'Rogue access point'],
        correctAnswer: 1
      },
      {
        questionText: "You have a help desk ticket for a system that is acting strangely. Looking at the system remotely, you see the following in the browser cache: '<a class='text-primary'>www.micros0ft.com/office</a>'. What type of attack are you seeing?",
        answers: ['PowerShell', 'Domain hijacking', 'URL redirection', 'Disassociation'],
        correctAnswer: 2
      },
      {
        questionText: "You are seeing a bunch of PDFs flood people's inboxes' with titles such as 'New Tax Rates for 2024.' What attack vector is most likely in use?",
        answers: ['Python', 'Macro', 'Man in the middle', 'Distributed denial-of-service (DDoS)'],
        correctAnswer: 1
      },
      {
        questionText: "When you update your browser, you get a warning about a plugin not being compatible with the new version. You do not recognize the plugin, and you aren't sure what it does. Why is it important to understand plugins? What attack vector can be involved with plugins?",
        answers: ['Man in the middle attack', 'Domain hijacking attack', 'Man in the browser attack', 'URL redirection attack'],
        correctAnswer: 2
      },
      {
        questionText: "How does a hypervisor enable multiple guest operating systems to run concurrently on a host computer?",
        answers: ['Via a specialized driver package', 'By abstracting the hardware from the guest operating system', 'By providing specific virtual hardware to each guest OS', 'By hiding the underlying <i class=\"fab fa-linux\"></i> Linux operating system'],
        correctAnswer: 1
      },
      {
        questionText: "You have deployed a network of Internet-connected sensors across a wide geographical area. These sensors are small, low-power Internet-of-Things (IoT) devices, and you need to perform temperature conversions and collect the data into a database. The calculations would be best managed by which architecture?",
        answers: ['Fog computing', 'Edge computing', 'Thin client', 'Decentralized database in the cloud'],
        correctAnswer: 1
      },
      {
        questionText: "Your new application has multiple small processes that provide services to the network. You want to make this application run more efficently by virtualizing it. What is the best approach for virtualization of this application?",
        answers: ['Type II hypervisor', '<i class=\"fab fa-linux\"></i> Linux KVM', 'Containerization', 'Type I hypervisor'],
        correctAnswer: 2
      },
      {
        questionText: "Why is Virtual Machine (VM) sprawl an issue?",
        answers: ['VM sprawl uses too many resources on parallel functions', 'The more virtual machines in use, the harder it is to migrate a VM to a live server', 'Virtual machines are so easy to create, you end up with hundreds of small servers only performing a single function', 'When servers are no longer physical, it can be difficult to locate a specific machine'],
        correctAnswer: 3
      },
      {
        questionText: "When doing an incident response for your company, you review the forensics of several virtual servers and you see the attacker on the web server injecting code into uninitialized memory blocks. What attack is the attacker likely attempting?",
        answers: ['Denial-of-service attack on the hypervisor', 'VM escape', 'Containerization attack', 'Crashing the CASB'],
        correctAnswer: 1
      },
      {
        questionText: "You are planning on moving some applications to the cloud, including your organization's accounting application, which is highly customized and does not scale well. Which cloud deployment model is best for this application?",
        answers: ['Software as a Service (SaaS)', 'Platform as a Service (PaaS)', 'Infrastructure as a Service (IaaS)', 'None of the above'],
        correctAnswer: 2
      },
      {
        questionText: "You need to move to the cloud a specific customer service module that has a web front end. This application is highly scalable and can be provided on demand. Which cloud deployyment model is best for this application?",
        answers: ['Software as a Service (SaaS)', 'Platform as a Service (PaaS)', 'Infrastructure as a Service (IaaS)', 'None of the above'],
        correctAnswer: 0
      },
      {
        questionText: "One of the primary resources in use at your organization is a standard database that many applications tie into. Which cloud deployment model is best for this kind of application?",
        answers: ['Software as a Service (SaaS)', 'Platform as a Service (PaaS)', 'Infrastructure as a Service (IaaS)', 'None of the above'],
        correctAnswer: 1
      },
      {
        questionText: "Which cloud deployment model has the fewest security controls?",
        answers: ['Private', 'Public', 'Hybrid', 'Community'],
        correctAnswer: 1
      },
      {
        questionText: "What is the primary downside of a private cloud model?",
        answers: ['Restrictive access rules', 'Cost', 'Scalability', 'Lack of vendor support'],
        correctAnswer: 1
      },
      {
        questionText: "Which backup strategy includes only the files and software that have changed since the last backup?",
        answers: ['Incremental', 'Full', 'Snapshot', 'Differential'],
        correctAnswer: 3
      },
      {
        questionText: "Which backup strategy focuses on copies of virtual machines?",
        answers: ['Incremental', 'Full', 'Snapshot', 'Differential'],
        correctAnswer: 2
      },
      {
        questionText: "To have easily available quick backup of critical user documents, which of the following is recommended for backing these items up?",
        answers: ['Differential', 'Snapshot', 'Copy', 'NAS'],
        correctAnswer: 2
      },
      {
        questionText: "You have offices in six locations across town and wish to utilize a common backup restore methodology. Which would be the most efficient solution for your small offices?",
        answers: ['SAN', 'NAS', 'Cloud', 'Offline'],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following statements is true about redundancy?",
        answers: ['It prevents failures.', 'It is compicated and expensive to do.', 'It applies only to hardware.', 'It can be done across many systems.'],
        correctAnswer: 3
      },
      {
        questionText: "What distinguishes high availability systems?",
        answers: ['The ability to change with respect to usage conditions', 'The ability to process, even in times of disruption', 'Automated backup and recovery functions', 'The use of diversity to mitigate single threats'],
        correctAnswer: 1
      },
      {
        questionText: "The continual changing of information in a system is referred to as what?",
        answers: ['Nonpersistence', 'Snapshots', 'Differentials', 'Images'],
        correctAnswer: 0
      },
      {
        questionText: "A PDU provides management of what in an enterprise?",
        answers: ['Redundant backup proccessing', 'Power distribution to servers', 'Improved network connection to data storage', 'Load balancing'],
        correctAnswer: 1
      },
      {
        questionText: "A user reports to the help desk that he is getting '<span class=\"font-monospace\">cannot resolve address</span>' error messages from his browser. Which port is likely a problem on his firewall?",
        answers: ['22', '53', '161', '162'],
        correctAnswer: 1
      },
      {
        questionText: "What is a weakness of the DNS protocol?",
        answers: ["Requests and replies are sent in plaintext.", "It doesn't provide billing standardization in cloud infrastructures.", "TCP can be used for large transfers such as zone transfers.", "Its encryption capabilities are slow."],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following a benefit of DNSSEC?",
        answers: ['Scalability', 'Lower expenditure from operations capital (OpsCap) expenditures', 'Enables origin authentication, authenticated denial of existence, and data integrity', 'Availability and confidentiality'],
        correctAnswer: 2
      },
      {
        questionText: "What is Secure Shell (SSH) protocol?",
        answers: ['An encrypted remote terminal connection program used for remote connections to a server.', 'It provides dynamic network address translation.', 'It provides Software as a Service (SaaS).', 'It provides snapshots of physical machines at a point in time.'],
        correctAnswer: 0
      },
      {
        questionText: "What is the purpose of the Secure/Multipurpose Internet Mail Extensions (S/MIME) protocol?",
        answers: ['It is used in audio encryption.', 'It optimizes ports 80 and 443.', 'It encrypts HTTP traffic.', 'It provides cryptographic protection to e-mails.'],
        correctAnswer: 3
      },
      {
        questionText: "What is the purpose of Lightweight Directory Access Protocol Secure (LDAPS)?",
        answers: ['It leverages encryption protections of SSH to secure FTP transfers.', 'It uses an SSL/TLS tunnel to connect LDAP services.', 'It digitally signs DNS records.', 'It provides both symmetric and asymmetric encryption.'],
        correctAnswer: 1
      },
      {
        questionText: "Which port does FTPS use?",
        answers: ['53', '83', '990', '991'],
        correctAnswer: 2
      },
      {
        questionText: "You are a security admin for XYZ company. You suspect that company e-mails using the default POP and IMAP e-mail protocols and ports are getting intercepted while in transit. Which of the following ports should you consider using?",
        answers: ['Ports 995 and 993', 'Ports 53 and 22', 'Ports 110 and 143', 'Ports 161 and 16240'],
        correctAnswer: 0
      },
      {
        questionText: "What is the purpose of the Simple Network Management Protocol version 3 (SNMPv3)?",
        answers: ['It provides asymmetric encryption values.', 'It achieves specific communication goals.', 'It provides a common language for developers.', 'It is used to securely manage devices on IP-based networks.'],
        correctAnswer: 3
      },
      {
        questionText: "What is the purpose of HTTPS?",
        answers: ['To allow enumeration and monitoring of network services.', 'To use SSL or TLS to encrypt a channel over which HTTP traffic is transmitted.', 'To implement Single Sign-On.', 'To enhance communication protocols.'],
        correctAnswer: 1
      },
      {
        questionText: "To secure communications during remote access of a system, one can use which of the following tools?",
        answers: ['OpenSSL', 'SSH', 'dd', 'tcpdump'],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following is not a packet capture/analysis tool?",
        answers: ['Wireshark', 'tcpreplay', 'tcpdump', 'dd'],
        correctAnswer: 3
      },
      {
        questionText: "To capture an image of the memory in a running system, one can use which of the following?",
        answers: ['grep', 'dumpmem', 'memdump', 'logger'],
        correctAnswer: 2
      },
      {
        questionText: "To search through a system to find files containing a phrase, what would the best tool be?",
        answers: ['curl', 'logger', 'chmod', 'grep'],
        correctAnswer: 3
      },
      {
        questionText: "What does chmod do?",
        answers: ['Sets permissions on a file', 'Initiates a change modification entry in a log file', 'Cryptographically hashes a file', 'Lists the files in a working directory'],
        correctAnswer: 0
      },
      {
        questionText: "You need to analyze previously collected packet data on a network, including editing of some of the data. Which is the best tool to use?",
        answers: ['tcpreplay', 'tcpdump', 'netstat', 'Wireshark'],
        correctAnswer: 0
      },
      {
        questionText: "To automate system administration across an enterprise Windows network, including using Windows objects, the best choice would be which of the following?",
        answers: ['Bash scripting', 'Python', 'Wireshark', 'PowerShell'],
        correctAnswer: 3
      },
      {
        questionText: "You think a file is malware. What is the first tool you should invoke?",
        answers: ['Cuckoo', 'WinHex', 'OpenSSL', 'Autopsy'],
        correctAnswer: 0
      },
      {
        questionText: "Your organization needs a system for restricting access to files based on the sensitivity of the information of those files. You might suggest which of the following access control systems?",
        answers: ['Discretionary access control', 'Mandatory access control', 'Confidential access control', 'File-based access control'],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following describes a major difference between NFTS and FAT32 file systems?",
        answers: ['NTFS supports user-level access differentiation.', 'FAT32 supports group-level differentiation.', 'FAT32 natively encrypts files and directories.', 'NTFS logs all file access using secure tokens.'],
        correctAnswer: 0
      },
      {
        questionText: "Your organization has grown too large to support assigning permissions to users individually. Within your organization, you have groups of users who perform the same duties and need the same type and level of access to the same files, Rather than assigning individual permissions, your organization may wish to consider using which of the following access control methods?",
        answers: ['Group-based access control', 'Shift-based access control', 'Role-based access control', 'File-based access control'],
        correctAnswer: 2
      },
      {
        questionText: "A ticket-granting server is an important element in which of the following authentication models?",
        answers: ['802.1X', 'RADIUS', 'TACACS+', 'Kerberos'],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following is an open standard that uses security tokens and assertions and allows you to access multiple websites with one set of credentials?",
        answers: ['PAP', 'CHAP', 'SSO', 'SAML'],
        correctAnswer: 3
      },
      {
        questionText: "What protocol is used for RADIUS?",
        answers: ['UDP', 'NetBIOS', 'TCP', 'Proprietary'],
        correctAnswer: 0
      },
      {
        questionText: "What are accounts with greater than 'normal' access called?",
        answers: ['Privileged accounts', 'System accounts', 'Superuser accounts', 'Audit accounts'],
        correctAnswer: 0
      },
      {
        questionText: "You have to implement an OpenID solution. What is the typical relationship whith existing systems?",
        answers: ['OpenID is used for authentication, OAuth is used for authorization.', 'OpenID is used for authorization, OAuth is used for authentication.', 'OpenID is not compatible with OAuth.', 'OpenID only works with Kerberos.'],
        correctAnswer: 0
      },
      {
        questionText: "You wish to create an access control scheme that enables the CFO to access financial data from his machine, but not from the machine in the reception area of the lobby. Which access control model is best suited for this?",
        answers: ['Role-based access control', 'Conditional access control', 'Mandatory access control', 'Discretionary access control'],
        correctAnswer: 1
      },
      {
        questionText: "You need to design an authentication system where users who have never connected to the system can be identified and authenticated in a single process. Which is the best solution?",
        answers: ['RADIUS', 'Password vault-based authentication', 'TPM-based authentication', 'Knowledge-based authentication'],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following is the name often used to describe the process of addressing the questions associated with sources of risk, their impacts, and the steps taken to mitigate them in the enterprise?",
        answers: ['Risk assessment', 'Business impact analysis', 'Threat assessment', 'Penetration test'],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following terms is used to describe the target time that is set for the resumption of operations after an incident?",
        answers: ['RPO', 'MTBF', 'RTO', 'MTTR'],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is a common measure of how long it takes to fix a given failure?",
        answers: ['MTTR', 'RTO', 'RPO', 'MTBF'],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following is a system component whose failure or malfunctioning could result in the failure of the entire system?",
        answers: ['Mean time between failures', 'Single point of failure', 'Single-loss expectancy', 'Likelihood of occurrence'],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following is the process of subjectively determining the impact of an event that affects a project, program, or business?",
        answers: ['Likelihood of occurence', 'Functional recovery plan', 'Qualitative risk assessment', 'Quantitative risk assessment'],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is the best description of risk?",
        answers: ['The cost associated with a realized risk', 'The chance of something not working as planned', 'Damage that is the result of unmitigated risk', 'The level of concern one places on the well-being of people'],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following impacts is in many ways the final arbiter of all activities because it is how we 'keep score'?",
        answers: ['Reputation', 'Safety', 'Finance', 'Life'],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is a representation of the frequency of an event, measured in a standard year?",
        answers: ['Annual loss expectancy (ALE)', 'Annualized rate of occurence (ARO)', 'Single-loss expectancy (SLE)', 'Annualized expectancy of occurence'],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following represents a method of transferring risk to a third party?",
        answers: ['Applying controls that reduce risk impact', 'Creating a record of information about identified risks', 'Developing and forwarding the results of a risk matrix/heat map', 'Purchasing cybersecurity insurance'],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following is not PII?",
        answers: ['Customer name', 'Customer ID number', 'Customer Social Security number or taxpayer identification number', 'Customer birth date'],
        correctAnswer: 1
      },
      {
        questionText: "What does a privacy impact assessment do?",
        answers: ["It determines the gap between a company's privacy practices and required actions.", "It determines the damage caused by a breach of privacy.", "It determines what companies hold information on a specific person.", "It's a corporate procedure to safeguard PII"],
        correctAnswer: 0
      },
      {
        questionText: "What is privacy?",
        answers: ["One's ability to control information about oneself", "Being able to keep one's information secret", "Making data-sharing illegal without consumer consent", "Something that is outmoded in the Internet age"],
        correctAnswer: 0
      },
      {
        questionText: "Who is responsible for determining what data is needed by the enterprise?",
        answers: ["Data steward", "Data privacy officer", "Data custodian", "Data owner"],
        correctAnswer: 3
      },
      {
        questionText: "Data that is labeled 'private' typically pertains to what category?",
        answers: ["Proprietary data", "Confidential information", "Legal data", "Personal information"],
        correctAnswer: 3
      },
      {
        questionText: "Data that is labeled 'proprietary' typically pertains to what category?",
        answers: ["Information under legal hold", "Information to be safeguarded by business partners because it contains business secrets", "Personal data", "PHI and PII together"],
        correctAnswer: 1
      },
      {
        questionText: "Information that could disclose the identity of a customer is referred to as what?",
        answers: ["Customer identity information (CII)", "Personally identifiable information (PII)", "Privacy protected information (PPI)", "Sensitive customer information (SCI)"],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following is not a privacy-enhancing technology?",
        answers: ["Data minimization", "Data masking", "Data disclosure", "Tokenization"],
        correctAnswer: 2
      },
      {
        questionText: "What is the term for notifying customers of your privacy policy and its effect on their information?",
        answers: ["Impact assessment", "Public notification of disclosure", "Privacy notice", "Terms of agreement"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is important to ensure privacy release concerns are properly handled when discovered by an incident response team?",
        answers: ["Escalation", "Privacy impact analysis", "Privacy-enhancing technologies", "Public disclosure and notification"],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following is a weakness of cellular technology?",
        answers: ["Multiple vendors in a nationwide network", "Less availability in rural areas", "Multiple cell towers in close proximity to urban areas", "Strong signals in areas of reasonable population"],
        correctAnswer: 1
      },
      {
        questionText: "What frequency spectrum does <i class=\"fab fa-bluetooth-b\"></i> Bluetooth use?",
        answers: ["1.7 GHz", "2.4 GHz", "5 GHz", "6.4 GHz"],
        correctAnswer: 1
      },
      {
        questionText: "You need to use crytopgraphic keys between several devices. Which of the following can manage this risk?",
        answers: ["MAM solutions", "Firmware OTA updates", "USB OTG", "MicroSD HSM"],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following are the three modes supported by <i class=\"fab fa-bluetooth-b\"></i> Bluetooth 4.0?",
        answers: ["Classic, Low Speed, High Energy", "Enhanced Data Rate, Backward Compatible, High Energy", "Classic, High Speed, Low Energy", "Synchronous, High Speed, Low Energy"],
        correctAnswer: 2
      },
      {
        questionText: "What is the primary use of near field communication (NFC)?",
        answers: ["Establishing radio communications over a short proximity", "Communication in sparsely populated areas", "Long-distance connectivity", "Communication in noisy industrial environments"],
        correctAnswer: 0
      },
      {
        questionText: "You need to manage a whole host of different endpoints in the enterprise, including mobile devices, <i class=\"fab fa-apple\"></i> iPads, printers, PCs and phones. Which of the following is the most comprehensive solution?",
        answers: ["COPE-based solutions", "MAM solutions", "MDM solutions", "UEM solutions"],
        correctAnswer: 3
      },
      {
        questionText: "What is a disadvantage of infrared (IR) technology?",
        answers: ["It has a high data rate.", "It cannot penetrate solid objects.", "It can penetrate walls.", "It uses slow encryption technology."],
        correctAnswer: 1
      },
      {
        questionText: "What is the main concern with Universal Serial Bus ( <i class=\"fab fa-usb\"></i> USB) technology?",
        answers: ["It connects to cell phones for easy charging.", "It uses proprietary encryption.", "It automounts and acts like a hard drive attached to the computer.", "It uses older encryption technology."],
        correctAnswer: 2
      },
      {
        questionText: "Why is it important to establish policies governing remote wiping of mobile devices?",
        answers: ["Mobile devices typically do not mix personal and business data.", "Mobile devices are more easily secured.", "Thieves cannot decrypt mobile devices.", "They are more susceptible to loss than other devices."],
        correctAnswer: 3
      },
      {
        questionText: "What is the purpose of <i class=\"fa fa-globe-americas\"></i> geofencing?",
        answers: ["It can be used to remotely wipe a lost device.", "It makes securing the mobile device simpler.", "It enables devices to be recognized by location and have action taken.", "It can enforce device locking with a strong password."],
        correctAnswer: 2
      },
      {
        questionText: "What type of threat exploits system and application vulnerablilities that are unknown to software developers and even anti-malware manufacturers?",
        answers: ["An on-premise attack", "A zero-day attack", "A cloud-based attack", "A legacy platform attack"],
        correctAnswer: 1
      },
      {
        questionText: "Which statement is false regarding cryptographic practices and weak encryption?",
        answers: ["Developing your own cryptographic algorithm is considered an insecure practice.", "Cryptographic algorithms become trusted only after years of scrutiny and repelling attacks.", "The ability to use ever-faster hardware has enabled attackers to defeat some cryptographic methods.", "Because TLS is deprecated, SSL should be used instead."],
        correctAnswer: 3
      },
      {
        questionText: "Who assumes the risk associated with a system or product after it has entered end-of-life (EOL) status?",
        answers: ["The original manufacturer", "The vendor", "The organization", "The supply chain manager"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following best describes the exporting of stolen data from an enterprise?",
        answers: ["Data loss", "Data breach", "Data exfiltration", "Identity theft"],
        correctAnswer: 2
      },
      {
        questionText: "If a system sends an alert that a user account is being hacked because of too many password failures, but analysis shows that the person's device has cached an old password, triggering the failures, what is this an example of?",
        answers: ["False negative", "False positive", "Measurement error", "Analysis failure"],
        correctAnswer: 1
      },
      {
        questionText: "Anti-malware software fails to detect a ransomware attack that is supposed to be within its capabilities of detecting. What is this an example of?",
        answers: ["False negative", "False positive", "Measurement error", "Analysis failure"],
        correctAnswer: 0
      },
      {
        questionText: "What is the primary limitation of a credentialed scan on a network?",
        answers: ["Speed", "Examining too deeply into individual boxes", "The inability to scale across multiple systems", "Slowing down your network with ancillary traffic"],
        correctAnswer: 2
      },
      {
        questionText: "You desire to prove a vulnerablility can be a problem. The best method would be to use a(n)________ scan?",
        answers: ["credentialed", "non-intrusive", "non-credentialed", "intrusive"],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following best describes what CVE is?",
        answers: ["A place to report errors and vulnerablilities", "A measure of the severity of a vulnerablility", "A list of known vulnerablilities", "A list of systems that have vulnerablilities"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is not associated typically with SIEM processes?",
        answers: ["Applications", "Syslog", "Log capture", "Log aggregation"],
        correctAnswer: 0
      },
      {
        questionText: "Which process allows log files to be enriched with additional data to provide context?",
        answers: ["Log aggregation", "Log collectors", "Log reviews", "Syslog"],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following is not part of the SIEM process?",
        answers: ["Data collection", "Event correlation", "Alerting/reporting", "Incident investigation"],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following is not a state of data in the enterprise?",
        answers: ["At rest", "In storage", "In processing", "In transit/motion"],
        correctAnswer: 1
      },
      {
        questionText: "Creating fake network traffic to deceive attackers in segments of the network designed to deceive them is called what?",
        answers: ["DNS sinkhole", "Honeytraffic", "Fake telemetry", "Masking"],
        correctAnswer: 2
      },
      {
        questionText: "If end-to-end encryption is used, which of the following technologies facilitates security monitoring of encrypted communication channels?",
        answers: ["Fake telemetry", "Tokenization", "Hashing", "TLS inspections"],
        correctAnswer: 3
      },
      {
        questionText: "Enterprises can employ _________ to block malicious command-and-control traffic from malware.?",
        answers: ["encryption", "honeyfiles", "DNS sinkholes", "honeynets"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following can provide complete traceability to an original transaction without revealing any personal information if disclosed to an outside party?",
        answers: ["Tokenization", "Data sovereignty", "Rights management", "Baseline configuration"],
        correctAnswer: 0
      },
      {
        questionText: "A system that is ready for immediate use in the event of an outage is called what?",
        answers: ["Standby system", "Disaster recovery site", "Backup site", "Hot site"],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following is important to consider when specifically examining configuration management?",
        answers: ["Data loss prevention", "Standard naming conventions", "Rights management", "Hashing"],
        correctAnswer: 1
      },
      {
        questionText: "What is <i class=\"fa fa-theater-masks\"></i> masking?",
        answers: ["The use of stand-in data to replace real-time data", "The marking of regions where data is not allowed by policy", "The use of backups to preserve data during disruptive events", "Redacting portions of data by using a covering symbol such as <i class=\"fa fa-asterisk\"></i> or <i class=\"fa fa-times\"></i>"],
        correctAnswer: 3
      },
      {
        questionText: "To develop secure software that prevents attackers from directly injecting attacks into computer memory and manipulating the application's process, one should employ which method?",
        answers: ["Elasticity", "Dead code", "Normalization", "Software diversity"],
        correctAnswer: 3
      },
      {
        questionText: "Problems in which phase will specifically stop continuous deployment but not necessarily continuous delivery?",
        answers: ["Continuous integration", "Continuous monitoring", "Continuous validation", "Continuous development"],
        correctAnswer: 2
      },
      {
        questionText: "Why is memory management important in software development?",
        answers: ["A program can grow and consume other program spaces.", "Memory is expensive.", "Memory can be a speed issue.", "None of the above."],
        correctAnswer: 0
      },
      {
        questionText: "When a program is installed and needs permissions, what is this called?",
        answers: ["Staging", "Provisioning", "Continuous integration", "Version control"],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following statements concerning elasticity and scalability are true?",
        answers: ["Scalability requires elasticity.", "Elasticity involves enabling software to use more processors to do more work.", "Elasticity means being prepared to take advantage of scalability.", "All of the above."],
        correctAnswer: 3
      },
      {
        questionText: "To protect software from reverse engineering by attackers, developers can use which of the following?",
        answers: ["Dead code", "Obfuscation", "Binary diversity", "Stored procedures"],
        correctAnswer: 1
      },
      {
        questionText: "To manage various releases of software over time, the organization uses which of the following?",
        answers: ["Staging environment", "Provisioning and deprovisioning steps", "Version control", "Continuous integration"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following environments is used to test compatibility against multiple target environments?",
        answers: ["Production", "Test", "Quality assurance", "Staging"],
        correctAnswer: 3
      },
      {
        questionText: "The fact that there are multiple methods of representing an object in a computer system can lead to issues when logical comparisons are needed. What can be used to ensure accuracy of comparison elements?",
        answers: ["Normalization", "Stored procedures", "Third-party libraries", "Third-party software development kits"],
        correctAnswer: 0
      },
      {
        questionText: "What is the only sure method of ensuring input is valid before use on a server?",
        answers: ["Use of third-party libraries and software development kits", "Server-side validation", "Stored procedures", "Client-side validation"],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following statements is <em>not</em> true?",
        answers: ["Embedded systems are designed with a single control purpose in mind and typically have no additional functionality.", "Embedded systems are free of risk and security concerns.", "<em>Embedded</em> is the name given to a computer that is included as an integral part of a larger system.", "Embedded systems can be as complex as the dozens of interconnected embedded systems in a modern automobile."],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following statements is true regarding the risk of next-generation vehicles?",
        answers: ["There are minimal risks when next-generation automobiles share information.", "Passing traffic and other information between vehicles does not increase security risks.", "The sharing of navigation and other inputs between vehicles presents a potential security issue.", "Time-to-market and cost minimization have minimal impact on potential risks being exploited."],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following properly defines supervisory control and data acquisition (SCADA)?",
        answers: ["A scaled-down version of <i class=\"fab fa-linux\"></i> Linux", "The standard  used for communicating between intelligent car systems", "The risk created by connecting control systems in buildings", "A system designed to control automated systems in cyber-physical environments"],
        correctAnswer: 3
      },
      {
        questionText: "Which of the following statements is true about smart devices and the Internet of Things (IoT)?",
        answers: ["The use of a Linux-type kernel as the core engine makes programming more complex.", "Mass production introduces significant security risks.", "The scaling of the software development over large numbers of units makes costs scalable, and functionality is paramount.", "Security or anything that might impact new expanded functionality is considered early and gets the focus and resources necessary."],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following statements is true about HVAC and building automation systems?",
        answers: ["They have not been exploited to any significant degree yet.", "Interconnecting these systems and using Internet-based central control mechanisms increases the risk profile from outside attacks.", "Having a 'smart building' that reduces the use of building resources in accordance with the number and distribution of people inside has not increased efficiency or reduced costs.", "The ris of hyper-connectivity has introduced no additional security concerns."],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following statements is <em>not</em> true about system on a chip?",
        answers: ["It provides the full functionality of a computing platform on a  single chip.", "It typically has low power consumption and efficient design.", "Programming of SoC systems can occur at several different levels, and thus potential risks are easily mitigated.", "Because SoC represents computing platforms with billions of devices worldwide, it has become a significant force in the marketplace."],
        correctAnswer: 2
      },
      {
        questionText: "What distinguishes real-time operating systems (RTOSs) from general-purpose operating systems?",
        answers: ["Unlike RTOSs, most general-purpose operating systems handle interrupts within defined time constraints.", "Unlike general-purpose OSs, most RTOSs are capable of multitasking by design.", "Unlike RTOSs, most general-purpose operating systems are multitasking by design.", "Unlike general-purpose OSs, RTOSs are designed to handle multiple threads."],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is true about printers and multifunction devices?",
        answers: ["They rely on the computer to manage the printing and scanning processes.", "Because of their long history and widespread use, security is designed into these products.", "These devices communicate in a bidirectional fashion, accepting print jobs and sending back job status, printer status, and so forth.", "So far, they have not been shown to be hackable or capable of passing malware to the computer."],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is a very important aspect to always remember when dealing with security of medical devices?",
        answers: ["They are relatively new in their usage.", "They can directly affect human life.", "Security is not related to safety.", "They are almost exclusively stand-alone devices, without Internet connectivity."],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following poses a significant potential risk of unmanned aerial vehicles?",
        answers: ["They have sophisticated autopilot functions.", "They have cameras, sensors, and payloads.", "Some models have a low price.", "Because they are pilotless, their remote-control systems may be networked and therefore vulnerable to potential risks."],
        correctAnswer: 3
      },
      {
        questionText: "During a visit to a hosting center where your organization keeps some offsite servers, you see a door with an odd-looking panel next to it. You see people approaching the panel and placing their eyes into a hooded viewer. A few seconds after they've done this, the door unlocks. What type of biometric scanner might this be?",
        answers: ["Voice recognition scanner", "Retinal scanner", "Fingerprint scanner", "Facial recognition scanner"],
        correctAnswer: 1
      },
      {
        questionText: "You've spent the last week tweaking a fingerprint-scanning solution for your organization. Despite your best efforts, roughly 1 in 50 attempts will fail, even if the user is using the correct finger and their fingerprint is in the system. You supervisor says 1 in 50 is 'good enough' and tells you to move on to the next project. Your supervisor just defined which of the following for your fingerprint-scanning system?",
        answers: ["False rejection rate", "False acceptance rate", "Critical threshold", "Failure acceptance criteria"],
        correctAnswer: 0
      },
      {
        questionText: "Which of the following algorithms uses a secret key with a current timestamp to generate a one-time password?",
        answers: ["Hash-based Message Authentication Code", "Date-Hashed Message Authorization Password", "Time-based One-Time Password", "Single sign-on"],
        correctAnswer: 2
      },
      {
        questionText: "With regard to authentication, an access token falls under which factor category?",
        answers: ["<i class=\"fa fa-user-check\"></i> Something you are", "<i class=\"fa fa-hand-holding-usd\"></i> Something you have", "<i class=\"fa fa-brain\"></i> Something you know", "<i class=\"fa fa-eye\"></i> Something you see"],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following is <em>not</em> a common form of hardware token?",
        answers: ["<i class=\"fa fa-id-card-alt\"></i> Proximity card", "<i class=\"fa fa-address-card\"></i> Common access card", "<i class=\"fab fa-usb\"></i> USB token", "<i class=\"fa fa-eye\"></i> Iris scan"],
        correctAnswer: 3
      },
      {
        questionText: "While depositing cash from a charity fundraiser at a local bank, you notice bank employees are holding up cards next to a panel near a door. A light on the panel turns <b style=\"color:green\">green</b> and the employees are able to open the door. The light on the panel is normally <b style=\"color:red\">red</b>. What type of electronic door is this bank using?",
        answers: ["<i class=\"fa fa-eye\"></i> Iris scanner", "<i class=\"fa fa-tools\"></i> Hardware token", "<i class=\"fa fa-address-card\"></i> Proximity card", "<i class=\"fa fa-key\"></i> Symmetric key token"],
        correctAnswer: 2
      },
      {
        questionText: "Your colleague is telling you a story she heard about a way to trick fingerprint scanners using gummy bears. She heard that if you press a gummy bear against an authorized user's finger, you can then use that gummy bear as their fingerprint to fool a fingerprint scanner. If this works, the result is the example of which of the following?",
        answers: ["False negative", "False positive", "Crossover positive", "Crossover negative"],
        correctAnswer: 1
      },
      {
        questionText: "To ensure customers entering credentials in your website are valid and not someone with stolen credentials, your team is tasked with designing multifactor authentication. Which of the following would <em>not</em> be a good choice?",
        answers: ["Static code", "Phone call", "Authentication application", "Short Message Service (<i class=\"fa fa-sms\"></i> SMS)"],
        correctAnswer: 0
      },
      {
        questionText: "When you're designing and tweaking biometric systems, the point where both the accept and reject error rates are equal is known as which of the following?",
        answers: ["Crossover acceptance rate", "Accept-reject overlap rate", "Crossover error rate", "Overlap acceptance rate"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following in <em>not</em> a term used in multifactor authentication?",
        answers: ["<i class=\"fa fa-user-friends\"></i> Someone you know", "<i class=\"fa fa-globe-africa\"></i> Somewhere you are", "<i class=\"fa fa-hand-holding-heart\"></i> Something you have", "<i class=\"fa fa-eye\"></i> Something you see"],
        correctAnswer: 3
      },
      {
        questionText: "If you need to perform operations such as addition on encrypted elements, what type of encryption scheme would you use?",
        answers: ["Asymmetric", "Homomorphic", "Stream", "Lightweight"],
        correctAnswer: 1
      },
      {
        questionText: "Which of the following is <em>not</em> a limitation associated with cryptographic solutions?",
        answers: ["Speed", "Computational overhead", "Longevity", "Entropy"],
        correctAnswer: 3
      },
      {
        questionText: "What set of algorithms is designed for low-power devices such as the Internet of Things (IoT) and embedded systems?",
        answers: ["Lightweight", "Hashing", "Stream", "Blockchain"],
        correctAnswer: 0
      },
      {
        questionText: "How do you make a short secret, such as a password, become along enough for use?",
        answers: ["Salting", "Key elongation", "Key stretching", "Ephemeral operations"],
        correctAnswer: 2
      },
      {
        questionText: "What is the best way to get plaintext from a hash value?",
        answers: ["Use linear cryptanalysis.", "Use a reverse hash function.", "You cannot get plaintext out of a hash value.", "Use an ephemeral key."],
        correctAnswer: 2
      },
      {
        questionText: "What does a salt provide?",
        answers: ["It tells the algorithm how many digits of primes to use.", "It primes the algorithm by giving it noncritical data.", "It adds additional rounds to the cipher.", "It provides additional entropy."],
        correctAnswer: 3
      },
      {
        questionText: "What makes a digitally signed message different from an encrypted message?",
        answers: ["The digitally signed message has encryption protections for integrity and nonrepudiation.", "The digitally signed message uses much stronger encryption and is harder to break.", "The encrypted message only uses symmetric encryption.", "There is no difference."],
        correctAnswer: 0
      },
      {
        questionText: "Steganography is commonly accomplished using what method?",
        answers: ["Encryption", "Initialization vectors (IVs)", "LSB encoding", "Entropy substitution"],
        correctAnswer: 2
      },
      {
        questionText: "To prevent the loss of a single message due to accidental decryption from affecting other encrypted messages, which of the properties is needed?",
        answers: ["Stream encryption", "Perfect forward secrecy", "Entropy", "Obfuscation"],
        correctAnswer: 1
      },
      {
        questionText: "Given a large quantity of data in the form of a streaming video file, what is the best type of encryption method to protect the content from unauthorized live viewing?",
        answers: ["Symmetric block", "Hashing algorithm", "Stream cipher", "Asymmetric block"],
        correctAnswer: 2
      },
      {
        questionText: "The use of an eight-digit PIN to set up a wireless connection is part of which of the following?",
        answers: ["WPA", "SAE", "WPA3", "WPS"],
        correctAnswer: 3
      },
      {
        questionText: "What is the role of EAP in wireless connections?",
        answers: ["It is a framework for establishing connectivity.", "It is a framework for passing authentication information.", "It is a framwork to secure the authentication process.", "It is an actual encryption method used during authentication."],
        correctAnswer: 2
      },
      {
        questionText: "What is the primary difference between WPA2-Personal and WPA2-Enterprise?",
        answers: ["The use of a pre-shared secret", "The nomber of concurrent supported users", "Licensing costs on a per-user basis", "The use of SAE for connections"],
        correctAnswer: 0
      },
      {
        questionText: "You are setting up a Wi-Fi hotspot for guest visitors. What is the best method of establishing connections?",
        answers: ["Open access", "A posted password visually available on site", "Use of a PSK solution", "Captive portal"],
        correctAnswer: 3
      },
      {
        questionText: "What is the most secure means of establishing connectivity to a Wi-Fi access point?",
        answers: ["CCMP", "SAE protocol", "WPA2", "IEEE 802.1X"],
        correctAnswer: 1
      },
      {
        questionText: "A site survey will reveal all of the following except which one?",
        answers: ["Optimal access point placement", "Captive portal location", "Channel allocations", "Link speeds across the site"],
        correctAnswer: 1
      },
      {
        questionText: "Forward secrecy exists for which of the following protocols?",
        answers: ["WPS", "WPA2", "WPA3", "All of the above"],
        correctAnswer: 2
      },
      {
        questionText: "You are using EAP-TTLS, which includes what unique aspect?",
        answers: ["It cannot be used in WPA3.", "It requires client-side certificates.", "It cannot be used with CHAP.", "It is easier to set up than other EAP schemes."],
        correctAnswer: 3
      },
      {
        questionText: "Which protocol allows the passing of legacy authentication protocols such as PAP, CHAP, and MS-CHAP?",
        answers: ["EAP-TTLS", "EAP-TLS", "SAE", "CCMP"],
        correctAnswer: 0
      },
      {
        questionText: "Which phase of the incident response process occurs before an actual incident?",
        answers: ["Preparation", "Identification", "Containment", "Prevention"],
        correctAnswer: 0
      },
      {
        questionText: "Which phase of the incident response process involves removing the problem?",
        answers: ["Identification", "Eradication", "Recovery", "Mitigation"],
        correctAnswer: 1
      },
      {
        questionText: "What is the term used to describe the steps an organization performs after any situation determined to be abnormal in the operation of a computer system?",
        answers: ["Computer/network penetration incident plan", "Incident response plan", "Backup restoration and reconfiguration", "Cyber event response"],
        correctAnswer: 1
      },
      {
        questionText: "What is the term for the set of steps needed to develop a comprehensive plan to enact during a situation where normal operations are interrupted?",
        answers: ["Disaster recovery", "Continuity of operations planning", "Incident response planning", "Restoration of business functions planning"],
        correctAnswer: 1
      },
      {
        questionText: "In which phase of the incident response process are actions taken to constrain the incident ot the minimal number of machines?",
        answers: ["Eradication", "Identification", "Containment", "Recovery"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following is not part of the Diamond Model of Intrusion Analysis?",
        answers: ["Victim", "Infrastructure", "Adversary", "Vulnerablility"],
        correctAnswer: 3
      },
      {
        questionText: "For organizations that draw a distinction between BCP and DRP, which of the following statements are true?",
        answers: ["The BCP details the functions that are most critical and outlines the order in which critical functions should be returned to service to maintain business operations.", "The BCP is a subset of the DRP.", "The DRP outlines the minimum set of business functions required for the organization to continue functioning.", "The DRP is always developed first, and the BCP normally is an attachment to the document."],
        correctAnswer: 0
      },
      {
        questionText: "Two major elements play a role in determining the level of response to an incident. Information criticality is the primary determinant. What is the other?",
        answers: ["Information sensitivity or the classification of the data", "The value of any data lost in the incident", "How the incident potentially affects the organization's operations", "Whether the organization wishes to pursue legal settlement against the attacker(s)"],
        correctAnswer: 2
      },
      {
        questionText: "What is the best way to deal with large, complex systems that have very expensive and lengthy process elements in an exercise?",
        answers: ["Tabletops", "Walkthroughs", "Simulations", "Just skip this element."],
        correctAnswer: 2
      },
      {
        questionText: "Which ISO standard covers risk management activities?",
        answers: ["ISO 27001", "ISO 27701", "ISO 27002", "ISO 31000"],
        correctAnswer: 3
      },
      {
        questionText: "Which reports are done over a period of time to verify operational efficiency and effectiveness of controls?",
        answers: ["SOC Type I", "PCI DSS audit report", "CSA CCM", "SOC Type II"],
        correctAnswer: 3
      },

      ////////////////////////
      //* A+ Certification *//
      ////////////////////////

      {
        questionText: "While manning the help desk, you get a call from Sharon in accounting. She's lost a file that she knows she saved to her hard drive. Which of the following statements would direct Sharon in the most efficient and professional manner to open her My Documents folder?",
        answers: ["Sharon, check My Documents.", "Sharon, a lot of programs save files to a default folder, often called My Documents. Let's look there first. Click the Start button and move the mouse until the cursor hovers over My Documents. Then press the left mouse button and tell me what you see when My Documents opens.", "Probably just defaulted to My Docs. Why don't you open Excel or whatever program you used to make the file, and then open a document and point it to My Documents?", "Look Sharon, I know you're clueless when it comes to computers, but how could somebody lose a file? Just open up My Documents, and look there for the file."],
        correctAnswer: 1
      },
      {
        questionText: "At the very least, what tool should be in every technician's toolkit <i class=\"fa fa-toolbox\"></i>?",
        answers: ["Pliers", "Hammer", "Straight-slot screwdriver", "Phillips-head screwdriver"],
        correctAnswer: 3
      },
      {
        questionText: "You are at a customer's workstation to install several software and hardware updates, a process that will take a while and require several reboots of the computer. What should you do about the password to the user's account?",
        answers: ["Require the customer to sit with you throughout the process so she can type in her password each time.", "Ask her to write down her password for you to use.", "Ask the user to change her password temporarily for you to use.", "Call your supervisor."],
        correctAnswer: 2
      },
      {
        questionText: "Which is the following is a good practice after completing a troubleshooting call at someone's office?",
        answers: ["Follow up with a call within a couple of days to make sure everything is going well with the fixed computer.", "Make copies of any passwords you used at the site for future reference.", "Document any particularly important people you met for future reference.", "Do nothing. Your work is finished there."],
        correctAnswer: 0
      },
      {
        questionText: "Which tool helps you avoid accidental static discharge by keeping you at the same electric potential as the computer on which you are working on?",
        answers: ["Anti-static spray", "Anti-static bag", "Anti-static wrist wrap", "Phillips-head screwdriver"],
        correctAnswer: 2
      },
      {
        questionText: "Which of the following helps prevent electromagnetic interference?",
        answers: ["Use an anti-static bag.", "Use an anti-static wrist strap.", "Keep magnets away from computer components.", "Keep computers away from monitors."],
        correctAnswer: 2
      },

    ];
  let length = questionBank.length;

  ///////////////////////////
  //* Main Quiz Functions *//
  ///////////////////////////

  function quiz(questionBank) {
    $('#start').hide(), $('#submit').hide(), $('#intro').hide(),
      $('#credits').hide(), $('#reset').hide(), $('#cheater').show(),
      $('#answers').show();
    score = 0;
    update($score, score);
    // set time for 20 minutes //
    let time = 1220;
    update($timer, time);
    interval = window.setInterval(countDown, 1000);
    chooseQuestion(questionBank);

    function countDown() {
      // decrease time by 1
      time--;
      // update the time displayed
      update($timer, time);
      if (time <= 0) {
        quizOver();
      }
      /// end of countDown ///
    }
  }

  function chooseQuestion(questions) {
    if (questionBank.length === 0) {
      quizOver();
    } else {
      askQuestion(questions.pop());
    }
    function askQuestion(question) {

      // sets correct value for comparison //
      correct = question.correctAnswer;
      // updates HTML with question //
      update($question, question.questionText);
      update($answer1, question.answers[0]);
      update($answer2, question.answers[1]);
      update($answer3, question.answers[2]);
      update($answer4, question.answers[3]);
      update($hintText, `${question.answers[correct]}`);
    }
    return correct;
  }

  function compareAnswers() {
    $('#correct').hide(), $('#wrong').hide();
    // takes correct from callback function //
    correct;
    let choice = Number($("input:radio[name='answers-group']:checked").val());
    if (correct === choice) {
      score++;
      update($score, score);
      $('#correct').show();
    } else {
      $('#wrong').show();
    }
    // clears the radio buttons for next question //
    $('#next').click(),
      chooseQuestion(questionBank);
  }

  function quizOver() {
    $('#correct').hide(), $('#question').hide(),
      $('#reset').show(), $('#answers').hide(), $('#cheater').hide(), $('#wrong').hide();
    update($feedback, `Quiz over, you scored ${score} out of ${length} total points, resulting in a ${Number((score / length) * 100).toFixed(2)}% &excl;`);
    window.clearInterval(interval);
  }

  function resetQuiz() {
    // resets the browser for a new quiz to run //
    window.location.reload();
  }

  function userQuestion() {
    let userQuest = $('#question-text').val();
    let responseOne = $('#first-response').val();
    let responseTwo = $('#second-response').val();
    let responseThree = $('#third-response').val();
    let responseFour = $('#fourth-response').val();
    let correctResponse = $('#select-answer').val();
    // push user question into array upon submission //
    let question = new Question(userQuest, [responseOne, responseTwo, responseThree, responseFour], correctResponse);
    questionBank.push(question);
    // clear the form for next question submission //
    $('#question-text').val('');
    $('#first-response').val('');
    $('#second-response').val('');
    $('#third-response').val('');
    $('#fourth-response').val('');

  }

});

  ///////////////////////////////
  // => end ready / use strict //
  // => see readme.md          //
  // => works cited page       //
  ///////////////////////////////
