const fs = require("fs");
const path = require("path");

const companies = [
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Cognizant",
    "NatWest"
];

const roles = [
    "Software Developer",
    "Java Developer",
    "Python Developer",
    "Data Analyst",
    "Tester"
];

const questionBank = {

    "SQL": [
        {
            question: "Which SQL command retrieves data?",
            options: ["SELECT", "INSERT", "UPDATE", "DELETE"],
            answer: "SELECT",
            explanation: "SELECT is used to retrieve data from database tables."
        },
        {
            question: "Which clause filters rows?",
            options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"],
            answer: "WHERE",
            explanation: "WHERE filters rows according to a condition."
        },
        {
            question: "Which keyword removes duplicate results?",
            options: ["DISTINCT", "UNIQUE", "REMOVE", "DELETE"],
            answer: "DISTINCT",
            explanation: "DISTINCT removes duplicate rows from query results."
        },
        {
            question: "Which JOIN returns matching rows from both tables?",
            options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
            answer: "INNER JOIN",
            explanation: "INNER JOIN returns rows having matching values in both tables."
        },
        {
            question: "Which function counts rows?",
            options: ["COUNT()", "SUM()", "AVG()", "MAX()"],
            answer: "COUNT()",
            explanation: "COUNT() returns the number of rows or non-null values."
        }
    ],

    "DBMS": [
        {
            question: "What does DBMS stand for?",
            options: [
                "Database Management System",
                "Data Backup Management System",
                "Database Monitoring Service",
                "Data Management Software"
            ],
            answer: "Database Management System",
            explanation: "DBMS is software used to create, store and manage databases."
        },
        {
            question: "Which key uniquely identifies a record?",
            options: ["Primary Key", "Foreign Key", "Candidate Key", "Super Key"],
            answer: "Primary Key",
            explanation: "A primary key uniquely identifies each record in a table."
        },
        {
            question: "Which key creates a relationship between tables?",
            options: ["Foreign Key", "Primary Key", "Candidate Key", "Super Key"],
            answer: "Foreign Key",
            explanation: "A foreign key references a key in another table."
        },
        {
            question: "Which ACID property means all or nothing?",
            options: ["Atomicity", "Consistency", "Isolation", "Durability"],
            answer: "Atomicity",
            explanation: "Atomicity ensures that a transaction is completely performed or completely rolled back."
        },
        {
            question: "Which normal form removes repeating groups?",
            options: ["1NF", "2NF", "3NF", "BCNF"],
            answer: "1NF",
            explanation: "First Normal Form requires atomic values and removes repeating groups."
        }
    ],

    "Java": [
        {
            question: "Which keyword declares a class in Java?",
            options: ["class", "struct", "define", "object"],
            answer: "class",
            explanation: "The class keyword is used to declare a Java class."
        },
        {
            question: "Which keyword is used for inheritance?",
            options: ["extends", "inherits", "super", "implements"],
            answer: "extends",
            explanation: "extends allows a class to inherit from another class."
        },
        {
            question: "What is the entry point of a Java program?",
            options: ["main()", "start()", "run()", "execute()"],
            answer: "main()",
            explanation: "The main() method is the standard entry point of a Java application."
        },
        {
            question: "Which keyword creates an object?",
            options: ["new", "create", "object", "make"],
            answer: "new",
            explanation: "The new keyword creates an instance of a class."
        },
        {
            question: "Which collection does not allow duplicate elements?",
            options: ["Set", "List", "ArrayList", "Vector"],
            answer: "Set",
            explanation: "A Set does not allow duplicate elements."
        }
    ],

    "Python": [
        {
            question: "Which keyword defines a function?",
            options: ["def", "function", "func", "define"],
            answer: "def",
            explanation: "The def keyword is used to define a Python function."
        },
        {
            question: "Which data type stores key-value pairs?",
            options: ["Dictionary", "List", "Tuple", "Set"],
            answer: "Dictionary",
            explanation: "A dictionary stores data using key-value pairs."
        },
        {
            question: "Which symbol starts a Python comment?",
            options: ["#", "//", "/*", "--"],
            answer: "#",
            explanation: "The # symbol starts a single-line comment in Python."
        },
        {
            question: "Which collection is ordered and mutable?",
            options: ["List", "Tuple", "Set", "Frozen Set"],
            answer: "List",
            explanation: "A Python list is ordered and can be modified."
        },
        {
            question: "Which keyword handles exceptions?",
            options: ["try", "catch", "error", "handle"],
            answer: "try",
            explanation: "The try block contains code that may raise an exception."
        }
    ],

    "HTML": [
        {
            question: "What does HTML stand for?",
            options: [
                "HyperText Markup Language",
                "HighText Machine Language",
                "Hyper Transfer Markup Language",
                "Home Tool Markup Language"
            ],
            answer: "HyperText Markup Language",
            explanation: "HTML is used to structure content on web pages."
        },
        {
            question: "Which tag creates the largest heading?",
            options: ["<h1>", "<h6>", "<head>", "<title>"],
            answer: "<h1>",
            explanation: "The h1 element represents the highest-level heading."
        },
        {
            question: "Which tag creates a hyperlink?",
            options: ["<a>", "<link>", "<href>", "<url>"],
            answer: "<a>",
            explanation: "The anchor tag creates hyperlinks."
        },
        {
            question: "Which tag displays an image?",
            options: ["<img>", "<image>", "<picture>", "<src>"],
            answer: "<img>",
            explanation: "The img element embeds an image in an HTML page."
        },
        {
            question: "Which tag creates an unordered list?",
            options: ["<ul>", "<ol>", "<li>", "<list>"],
            answer: "<ul>",
            explanation: "The ul element creates an unordered list."
        }
    ],

    "CSS": [
        {
            question: "What does CSS stand for?",
            options: [
                "Cascading Style Sheets",
                "Computer Style Sheets",
                "Creative Style System",
                "Colorful Style Sheets"
            ],
            answer: "Cascading Style Sheets",
            explanation: "CSS controls the appearance and layout of web pages."
        },
        {
            question: "Which property changes text color?",
            options: ["color", "font-color", "text-color", "foreground"],
            answer: "color",
            explanation: "The color property changes the text color."
        },
        {
            question: "Which property changes background color?",
            options: ["background-color", "bg-color", "background-style", "color-background"],
            answer: "background-color",
            explanation: "background-color sets the background color of an element."
        },
        {
            question: "Which layout system is mainly one-dimensional?",
            options: ["Flexbox", "Grid", "Table", "Float"],
            answer: "Flexbox",
            explanation: "Flexbox is mainly designed for one-dimensional layouts."
        },
        {
            question: "Which property controls space inside an element?",
            options: ["padding", "margin", "border", "spacing"],
            answer: "padding",
            explanation: "Padding controls space between content and border."
        }
    ],

    "JavaScript": [
        {
            question: "Which keyword declares a reassignable block-scoped variable?",
            options: ["let", "const", "static", "define"],
            answer: "let",
            explanation: "let declares a block-scoped variable that can be reassigned."
        },
        {
            question: "Which method converts JSON text into an object?",
            options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
            answer: "JSON.parse()",
            explanation: "JSON.parse() converts JSON text into a JavaScript value."
        },
        {
            question: "Which keyword declares an asynchronous function?",
            options: ["async", "await", "promise", "defer"],
            answer: "async",
            explanation: "The async keyword declares an asynchronous function."
        },
        {
            question: "Which method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "add()"],
            answer: "push()",
            explanation: "push() adds elements to the end of an array."
        },
        {
            question: "Which method selects an element by ID?",
            options: ["getElementById()", "selectById()", "findElement()", "getById()"],
            answer: "getElementById()",
            explanation: "getElementById() returns an element having the specified ID."
        }
    ],

    "Data Structures": [
        {
            question: "Which data structure follows LIFO?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            answer: "Stack",
            explanation: "Stack follows Last In, First Out."
        },
        {
            question: "Which data structure follows FIFO?",
            options: ["Queue", "Stack", "Tree", "Heap"],
            answer: "Queue",
            explanation: "Queue follows First In, First Out."
        },
        {
            question: "Which structure consists of linked nodes?",
            options: ["Linked List", "Array", "Stack", "Queue"],
            answer: "Linked List",
            explanation: "A linked list consists of nodes connected through references."
        },
        {
            question: "Which structure is commonly used for priority queues?",
            options: ["Heap", "Stack", "Array", "Linked List"],
            answer: "Heap",
            explanation: "A heap efficiently maintains priority elements."
        },
        {
            question: "Which structure contains vertices and edges?",
            options: ["Graph", "Stack", "Queue", "Array"],
            answer: "Graph",
            explanation: "A graph consists of vertices connected by edges."
        }
    ],

    "Algorithms": [
        {
            question: "Which search is efficient for a sorted array?",
            options: ["Binary Search", "Linear Search", "Bubble Sort", "DFS"],
            answer: "Binary Search",
            explanation: "Binary Search repeatedly divides the sorted search range in half."
        },
        {
            question: "Which sorting algorithm compares adjacent elements?",
            options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort"],
            answer: "Bubble Sort",
            explanation: "Bubble Sort compares adjacent elements and swaps them when needed."
        },
        {
            question: "Which notation represents an upper bound?",
            options: ["Big O", "Big Omega", "Big Theta", "Little o"],
            answer: "Big O",
            explanation: "Big O describes an asymptotic upper bound."
        },
        {
            question: "Which technique divides a problem into smaller problems?",
            options: ["Divide and Conquer", "Greedy", "Hashing", "Sorting"],
            answer: "Divide and Conquer",
            explanation: "Divide and Conquer divides a problem into smaller subproblems."
        },
        {
            question: "Which technique stores results of subproblems?",
            options: ["Dynamic Programming", "Binary Search", "Greedy", "Linear Search"],
            answer: "Dynamic Programming",
            explanation: "Dynamic Programming stores previous results to avoid repeated calculations."
        }
    ],

    "OOP": [
        {
            question: "Which OOP concept hides implementation details?",
            options: ["Abstraction", "Inheritance", "Polymorphism", "Encapsulation"],
            answer: "Abstraction",
            explanation: "Abstraction hides unnecessary implementation details."
        },
        {
            question: "Which concept bundles data and methods together?",
            options: ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism"],
            answer: "Encapsulation",
            explanation: "Encapsulation combines data and methods inside a class."
        },
        {
            question: "Which concept allows one class to acquire another class's features?",
            options: ["Inheritance", "Abstraction", "Encapsulation", "Overloading"],
            answer: "Inheritance",
            explanation: "Inheritance allows a class to acquire properties and methods from another class."
        },
        {
            question: "Which concept means one interface with many forms?",
            options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"],
            answer: "Polymorphism",
            explanation: "Polymorphism allows the same interface to have different implementations."
        },
        {
            question: "What is a blueprint for creating objects?",
            options: ["Class", "Method", "Variable", "Package"],
            answer: "Class",
            explanation: "A class acts as a blueprint for creating objects."
        }
    ],

    "Aptitude": [
        {
            question: "What is 20% of 200?",
            options: ["20", "40", "60", "80"],
            answer: "40",
            explanation: "20% of 200 is 200 × 20/100 = 40."
        },
        {
            question: "If a product costs ₹500 and has 10% discount, what is the selling price?",
            options: ["₹450", "₹460", "₹480", "₹490"],
            answer: "₹450",
            explanation: "10% of ₹500 is ₹50, so the selling price is ₹450."
        },
        {
            question: "What is the average of 10, 20 and 30?",
            options: ["15", "20", "25", "30"],
            answer: "20",
            explanation: "Average = (10 + 20 + 30) / 3 = 20."
        },
        {
            question: "If 5 workers complete a job in 10 days, the total work is?",
            options: ["15 worker-days", "30 worker-days", "50 worker-days", "100 worker-days"],
            answer: "50 worker-days",
            explanation: "Total work = workers × days = 5 × 10 = 50 worker-days."
        },
        {
            question: "What is the next number: 2, 4, 6, 8, ?",
            options: ["9", "10", "11", "12"],
            answer: "10",
            explanation: "The sequence increases by 2 each time."
        }
    ],

    "Excel": [
        {
            question: "Which function adds numbers in Excel?",
            options: ["SUM()", "ADD()", "TOTAL()", "PLUS()"],
            answer: "SUM()",
            explanation: "SUM() adds numbers in selected cells."
        },
        {
            question: "Which function calculates the average?",
            options: ["AVERAGE()", "MEAN()", "AVG()", "MID()"],
            answer: "AVERAGE()",
            explanation: "AVERAGE() calculates the arithmetic mean."
        },
        {
            question: "Which symbol begins an Excel formula?",
            options: ["=", "#", "@", "$"],
            answer: "=",
            explanation: "Excel formulas normally begin with the equals sign."
        },
        {
            question: "Which feature summarizes data quickly?",
            options: ["PivotTable", "WordArt", "Header", "Page Break"],
            answer: "PivotTable",
            explanation: "PivotTable summarizes and analyzes large datasets."
        },
        {
            question: "Which function finds the largest value?",
            options: ["MAX()", "HIGH()", "LARGE()", "TOP()"],
            answer: "MAX()",
            explanation: "MAX() returns the largest value in a range."
        }
    ],

    "Power BI": [
        {
            question: "What is Power BI mainly used for?",
            options: ["Data visualization", "Video editing", "Programming", "Gaming"],
            answer: "Data visualization",
            explanation: "Power BI is primarily used for data analysis and visualization."
        },
        {
            question: "Which language is used for Power BI calculations?",
            options: ["DAX", "HTML", "CSS", "Java"],
            answer: "DAX",
            explanation: "DAX is used for calculations and measures in Power BI."
        },
        {
            question: "What is a dashboard?",
            options: ["Visual summary of data", "Database", "Programming language", "Compiler"],
            answer: "Visual summary of data",
            explanation: "A dashboard presents important data through visualizations."
        },
        {
            question: "Which feature connects Power BI to data sources?",
            options: ["Get Data", "Get Code", "Run Data", "Import Text"],
            answer: "Get Data",
            explanation: "Get Data allows users to connect Power BI to different data sources."
        },
        {
            question: "Which chart is useful for comparing categories?",
            options: ["Bar Chart", "Pie Chart", "Map", "Gauge"],
            answer: "Bar Chart",
            explanation: "Bar charts are useful for comparing values across categories."
        }
    ],

    "Software Testing": [
        {
            question: "What is software testing?",
            options: [
                "Finding defects",
                "Writing only code",
                "Designing hardware",
                "Installing an OS"
            ],
            answer: "Finding defects",
            explanation: "Software testing evaluates software to identify defects and verify requirements."
        },
        {
            question: "Which testing is performed without executing the program?",
            options: ["Static Testing", "Dynamic Testing", "System Testing", "Load Testing"],
            answer: "Static Testing",
            explanation: "Static testing examines code or documents without executing the software."
        },
        {
            question: "Which testing checks individual units?",
            options: ["Unit Testing", "System Testing", "Acceptance Testing", "Performance Testing"],
            answer: "Unit Testing",
            explanation: "Unit testing verifies individual components or functions."
        },
        {
            question: "Which testing checks the complete system?",
            options: ["System Testing", "Unit Testing", "Smoke Testing", "Unit Integration"],
            answer: "System Testing",
            explanation: "System testing evaluates the complete integrated software system."
        },
        {
            question: "Which testing checks whether new changes broke existing features?",
            options: ["Regression Testing", "Unit Testing", "Alpha Testing", "Usability Testing"],
            answer: "Regression Testing",
            explanation: "Regression testing checks that existing functionality still works after changes."
        }
    ],

    "Cloud Computing": [
        {
            question: "What is cloud computing?",
            options: [
                "Internet-based computing services",
                "Offline storage only",
                "Computer manufacturing",
                "Operating system"
            ],
            answer: "Internet-based computing services",
            explanation: "Cloud computing provides computing resources and services over the internet."
        },
        {
            question: "Which is a cloud service model?",
            options: ["IaaS", "HTML", "CPU", "RAM"],
            answer: "IaaS",
            explanation: "IaaS stands for Infrastructure as a Service."
        },
        {
            question: "Which model provides software over the internet?",
            options: ["SaaS", "IaaS", "LAN", "RAM"],
            answer: "SaaS",
            explanation: "SaaS provides ready-to-use software through the internet."
        },
        {
            question: "What does PaaS stand for?",
            options: [
                "Platform as a Service",
                "Program as a System",
                "Platform as a System",
                "Process as a Service"
            ],
            answer: "Platform as a Service",
            explanation: "PaaS provides a platform for developing and deploying applications."
        },
        {
            question: "Which is an advantage of cloud computing?",
            options: ["Scalability", "No internet required", "Fixed resources", "No security"],
            answer: "Scalability",
            explanation: "Cloud resources can be increased or decreased according to demand."
        }
    ],

    "DevOps": [
        {
            question: "What does DevOps combine?",
            options: [
                "Development and Operations",
                "Design and Output",
                "Database and Operations",
                "Development and Security only"
            ],
            answer: "Development and Operations",
            explanation: "DevOps combines development and IT operations practices."
        },
        {
            question: "Which tool is commonly used for version control?",
            options: ["Git", "Excel", "PowerPoint", "Photoshop"],
            answer: "Git",
            explanation: "Git is a distributed version control system."
        },
        {
            question: "What does CI stand for?",
            options: [
                "Continuous Integration",
                "Code Installation",
                "Computer Integration",
                "Continuous Inspection"
            ],
            answer: "Continuous Integration",
            explanation: "CI means frequently integrating code changes into a shared repository."
        },
        {
            question: "What does CD commonly mean in DevOps?",
            options: [
                "Continuous Delivery",
                "Code Development",
                "Computer Deployment",
                "Central Database"
            ],
            answer: "Continuous Delivery",
            explanation: "Continuous Delivery automates preparing software for release."
        },
        {
            question: "Which tool is used for containerization?",
            options: ["Docker", "Git", "Jenkins", "Maven"],
            answer: "Docker",
            explanation: "Docker is widely used to create and run containers."
        }
    ]
    ,

    "Operating Systems": [

    {
        topic: "OS Basics",
        question: "What is the main purpose of an operating system?",
        options: [
            "Manage computer hardware and software resources",
            "Create web pages",
            "Design databases",
            "Compile only Java programs"
        ],
        answer: "Manage computer hardware and software resources",
        explanation: "An operating system manages hardware resources and provides services for application programs."
    },

    {
        topic: "Processes",
        question: "What is a process?",
        options: [
            "A program in execution",
            "A stored file",
            "A hardware device",
            "A network cable"
        ],
        answer: "A program in execution",
        explanation: "A process is a program that is currently being executed by the operating system."
    },

    {
        topic: "Threads",
        question: "What is a thread?",
        options: [
            "The smallest unit of CPU execution within a process",
            "A type of database",
            "A storage device",
            "A network protocol"
        ],
        answer: "The smallest unit of CPU execution within a process",
        explanation: "A thread is a lightweight unit of execution within a process."
    },

    {
        topic: "CPU Scheduling",
        question: "Which scheduling algorithm selects the process with the smallest CPU burst time?",
        options: [
            "Shortest Job First",
            "First Come First Serve",
            "Round Robin",
            "Priority Scheduling"
        ],
        answer: "Shortest Job First",
        explanation: "Shortest Job First selects the process with the smallest CPU burst time."
    },

    {
        topic: "Deadlocks",
        question: "What is a deadlock?",
        options: [
            "A situation where processes wait indefinitely for resources",
            "A method of memory allocation",
            "A type of file system",
            "A CPU scheduling algorithm"
        ],
        answer: "A situation where processes wait indefinitely for resources",
        explanation: "Deadlock occurs when processes are permanently waiting for resources held by each other."
    }

],

"Computer Networks": [

    {
        topic: "Network Basics",
        question: "What is a computer network?",
        options: [
            "A collection of connected computers",
            "A single computer",
            "A type of software",
            "A database"
        ],
        answer: "A collection of connected computers",
        explanation: "A computer network is a group of connected computers that can communicate and share resources."
    },

    {
        topic: "Network Devices",
        question: "Which device connects different networks together?",
        options: [
            "Router",
            "Keyboard",
            "Monitor",
            "Printer"
        ],
        answer: "Router",
        explanation: "A router connects different networks and forwards data packets between them."
    },

    {
        topic: "Network Protocols",
        question: "Which protocol is commonly used to transfer web pages?",
        options: [
            "HTTP",
            "FTP",
            "SMTP",
            "SSH"
        ],
        answer: "HTTP",
        explanation: "HTTP is commonly used to transfer web pages between web browsers and web servers."
    },

    {
        topic: "OSI Model",
        question: "Which OSI layer is responsible for routing packets?",
        options: [
            "Network Layer",
            "Transport Layer",
            "Session Layer",
            "Physical Layer"
        ],
        answer: "Network Layer",
        explanation: "The Network Layer handles logical addressing and routing of packets."
    },

    {
        topic: "IP Addressing",
        question: "What does IP stand for?",
        options: [
            "Internet Protocol",
            "Internet Process",
            "Internal Protocol",
            "Internet Program"
        ],
        answer: "Internet Protocol",
        explanation: "IP stands for Internet Protocol and is used for addressing and routing data across networks."
    }

],

"Computer Organization & Architecture": [

    {
        topic: "CPU Organization",
        question: "What is the main function of the CPU?",
        options: [
            "Execute instructions",
            "Store files permanently",
            "Display images",
            "Connect to the internet"
        ],
        answer: "Execute instructions",
        explanation: "The CPU executes instructions and performs calculations required by computer programs."
    },

    {
        topic: "ALU",
        question: "Which unit performs arithmetic and logical operations?",
        options: [
            "ALU",
            "Control Unit",
            "Memory Unit",
            "Input Unit"
        ],
        answer: "ALU",
        explanation: "The Arithmetic Logic Unit performs arithmetic and logical operations."
    },

    {
        topic: "Memory Organization",
        question: "What does RAM stand for?",
        options: [
            "Random Access Memory",
            "Read Access Memory",
            "Rapid Access Machine",
            "Random Application Memory"
        ],
        answer: "Random Access Memory",
        explanation: "RAM is temporary memory used to store data and instructions currently being used by the computer."
    },

    {
        topic: "Cache Memory",
        question: "Which memory is closest to the CPU?",
        options: [
            "Cache Memory",
            "Hard Disk",
            "CD-ROM",
            "Pen Drive"
        ],
        answer: "Cache Memory",
        explanation: "Cache memory is located close to the CPU and provides faster access to frequently used data."
    },

    {
        topic: "Control Unit",
        question: "What is the main purpose of the Control Unit?",
        options: [
            "Control and coordinate CPU operations",
            "Store permanent files",
            "Perform only arithmetic operations",
            "Display output"
        ],
        answer: "Control and coordinate CPU operations",
        explanation: "The Control Unit directs and coordinates the activities of the CPU and other components."
    }

],

"Theory of Computation": [

    {
        topic: "Finite Automata",
        question: "What does DFA stand for?",
        options: [
            "Deterministic Finite Automaton",
            "Digital Finite Algorithm",
            "Deterministic Function Automaton",
            "Data Flow Automaton"
        ],
        answer: "Deterministic Finite Automaton",
        explanation: "DFA stands for Deterministic Finite Automaton."
    },

    {
        topic: "Regular Languages",
        question: "Which automaton is used to recognize regular languages?",
        options: [
            "Finite Automaton",
            "Turing Machine",
            "Stack Machine",
            "Compiler"
        ],
        answer: "Finite Automaton",
        explanation: "Finite automata recognize regular languages."
    },

    {
        topic: "Context-Free Grammar",
        question: "What is the full form of CFG?",
        options: [
            "Context-Free Grammar",
            "Computer Formal Grammar",
            "Context Function Graph",
            "Common Format Grammar"
        ],
        answer: "Context-Free Grammar",
        explanation: "CFG stands for Context-Free Grammar."
    },

    {
        topic: "Turing Machine",
        question: "Which machine has an infinite tape and a read/write head?",
        options: [
            "Turing Machine",
            "DFA",
            "NFA",
            "Finite Automaton"
        ],
        answer: "Turing Machine",
        explanation: "A Turing Machine uses a tape and a read/write head to process symbols."
    },

    {
        topic: "Formal Languages",
        question: "Which language class is recognized by a finite automaton?",
        options: [
            "Regular Languages",
            "Context-Free Languages",
            "Context-Sensitive Languages",
            "Recursive Languages"
        ],
        answer: "Regular Languages",
        explanation: "Finite automata recognize exactly the class of regular languages."
    }

],
"Compiler Design": [

    {
        topic: "Compiler Basics",
        question: "What is the main purpose of a compiler?",
        options: [
            "Convert source code into machine or target code",
            "Store files permanently",
            "Connect computers",
            "Manage network devices"
        ],
        answer: "Convert source code into machine or target code",
        explanation: "A compiler translates a high-level source program into target code."
    },

    {
        topic: "Syntax Analysis",
        question: "Which phase of a compiler checks the grammar of a program?",
        options: [
            "Syntax Analysis",
            "Lexical Analysis",
            "Code Generation",
            "Optimization"
        ],
        answer: "Syntax Analysis",
        explanation: "Syntax analysis checks whether tokens follow the grammar of the programming language."
    },

    {
        topic: "Lexical Analysis",
        question: "Which phase converts source code into tokens?",
        options: [
            "Lexical Analysis",
            "Syntax Analysis",
            "Semantic Analysis",
            "Code Generation"
        ],
        answer: "Lexical Analysis",
        explanation: "The lexical analyzer reads source code and converts it into tokens."
    },

    {
        topic: "Intermediate Code",
        question: "Why is intermediate code used in a compiler?",
        options: [
            "To provide a representation between source and target code",
            "To store passwords",
            "To connect networks",
            "To display graphics"
        ],
        answer: "To provide a representation between source and target code",
        explanation: "Intermediate code provides a machine-independent representation that can be translated into target code."
    },

    {
        topic: "Code Generation",
        question: "Which phase generates the target code?",
        options: [
            "Code Generation",
            "Lexical Analysis",
            "Syntax Analysis",
            "Semantic Analysis"
        ],
        answer: "Code Generation",
        explanation: "The code generation phase produces the final target or machine code."
    }

],
"Software Engineering": [

    {
        topic: "Software Engineering Basics",
        question: "What is software engineering?",
        options: [
            "A systematic approach to software development",
            "A computer hardware design method",
            "A networking protocol",
            "A database language"
        ],
        answer: "A systematic approach to software development",
        explanation: "Software engineering applies systematic methods to design, develop, test, and maintain software."
    },

    {
        topic: "SDLC",
        question: "What does SDLC stand for?",
        options: [
            "Software Development Life Cycle",
            "System Design Language Code",
            "Software Data Link Control",
            "System Development Logic Cycle"
        ],
        answer: "Software Development Life Cycle",
        explanation: "SDLC stands for Software Development Life Cycle and describes the stages involved in developing software."
    },

    {
        topic: "Software Development Models",
        question: "Which model follows sequential development phases?",
        options: [
            "Waterfall Model",
            "Agile Model",
            "Spiral Model",
            "Prototype Model"
        ],
        answer: "Waterfall Model",
        explanation: "The Waterfall model follows a sequence of development phases."
    },

    {
        topic: "Agile Methodology",
        question: "Which methodology emphasizes frequent delivery and customer feedback?",
        options: [
            "Agile",
            "Waterfall",
            "Big Bang",
            "V-Model"
        ],
        answer: "Agile",
        explanation: "Agile development uses iterative development, frequent delivery, and continuous customer feedback."
    },

    {
        topic: "Software Requirements",
        question: "What is a software requirement?",
        options: [
            "A documented need or expected behavior of the software",
            "A computer hardware component",
            "A network cable",
            "A programming language"
        ],
        answer: "A documented need or expected behavior of the software",
        explanation: "A software requirement describes what the system should do or what constraints it must satisfy."
    }

],
"Software Testing": [

    {
        topic: "Testing Basics",
        question: "What is software testing?",
        options: [
            "The process of finding defects in software",
            "The process of designing hardware",
            "The process of creating a network",
            "The process of storing files"
        ],
        answer: "The process of finding defects in software",
        explanation: "Software testing checks whether software works correctly and helps identify defects."
    },

    {
        topic: "Unit Testing",
        question: "Which testing checks individual units of code?",
        options: [
            "Unit Testing",
            "System Testing",
            "Acceptance Testing",
            "Integration Testing"
        ],
        answer: "Unit Testing",
        explanation: "Unit testing tests individual functions, methods, or components of a software application."
    },

    {
        topic: "Integration Testing",
        question: "Which testing checks the interaction between modules?",
        options: [
            "Integration Testing",
            "Unit Testing",
            "Acceptance Testing",
            "Performance Testing"
        ],
        answer: "Integration Testing",
        explanation: "Integration testing verifies that different modules work correctly when combined."
    },

    {
        topic: "Regression Testing",
        question: "What is regression testing?",
        options: [
            "Testing after changes to ensure existing features still work",
            "Testing only the user interface",
            "Testing computer hardware",
            "Testing network cables"
        ],
        answer: "Testing after changes to ensure existing features still work",
        explanation: "Regression testing checks that new changes have not broken previously working functionality."
    },

    {
        topic: "Static Testing",
        question: "Which testing is performed without executing the program?",
        options: [
            "Static Testing",
            "Dynamic Testing",
            "System Testing",
            "Performance Testing"
        ],
        answer: "Static Testing",
        explanation: "Static testing examines code or documents without executing the software."
    }

],

"C Programming": [

    {
        topic: "C Basics",
        question: "Which symbol is used to end a statement in C?",
        options: [
            ";",
            ":",
            ".",
            ","
        ],
        answer: ";",
        explanation: "A semicolon is used to terminate most statements in C."
    },

    {
        topic: "Functions",
        question: "Which function is the starting point of a C program?",
        options: [
            "main()",
            "start()",
            "begin()",
            "run()"
        ],
        answer: "main()",
        explanation: "Execution of a C program begins from the main() function."
    },

    {
        topic: "Data Types",
        question: "Which data type is used to store whole numbers in C?",
        options: [
            "int",
            "float",
            "char",
            "double"
        ],
        answer: "int",
        explanation: "The int data type is commonly used to store integer values."
    },

    {
        topic: "Pointers",
        question: "Which operator is used to get the address of a variable?",
        options: [
            "&",
            "*",
            "%",
            "#"
        ],
        answer: "&",
        explanation: "The address-of operator (&) returns the memory address of a variable."
    },

    {
        topic: "Loops",
        question: "Which loop executes its body at least once?",
        options: [
            "do-while",
            "for",
            "while",
            "if"
        ],
        answer: "do-while",
        explanation: "A do-while loop executes its body before checking the condition."
    }

],
"C++": [

    {
        topic: "C++ Basics",
        question: "Which feature allows the same function name with different parameters?",
        options: [
            "Function Overloading",
            "Inheritance",
            "Encapsulation",
            "Abstraction"
        ],
        answer: "Function Overloading",
        explanation: "Function overloading allows multiple functions to have the same name with different parameter lists."
    },

    {
        topic: "Inheritance",
        question: "Which concept allows a class to acquire properties of another class?",
        options: [
            "Inheritance",
            "Polymorphism",
            "Encapsulation",
            "Constructor"
        ],
        answer: "Inheritance",
        explanation: "Inheritance allows a derived class to acquire properties and behaviors of a base class."
    },

    {
        topic: "Scope Resolution",
        question: "Which symbol is used for the scope resolution operator in C++?",
        options: [
            "::",
            "->",
            ".",
            "&&"
        ],
        answer: "::",
        explanation: "The scope resolution operator (::) is used to access members of a class, namespace, or global scope."
    },

    {
        topic: "Polymorphism",
        question: "Which feature allows one interface to be used for different implementations?",
        options: [
            "Polymorphism","inherits",
            "implements",
            "super"
        ],
        answer: "extends",
        explanation: "The extends keyword is used when one class inherits from another class."
    },

    {
        topic: "Methods",
        question: "Which method is the entry point of a Java application?",
        options: [
            "main()",
            "start()",
            "run()",
            "execute()"
        ],
        answer: "main()",
        explanation: "The main() method is the standard entry point of a Java application."
    },

    {
        topic: "Objects",
        question: "Which keyword is used to create an object in Java?",
        options: [
            "new",
            "create",
            "object",
   
            "Inheritance",
            "Encapsulation",
            "Compilation"
        ],
        answer: "Polymorphism",
        explanation: "Polymorphism allows the same interface or function call to behave differently."
    },

    {
        topic: "Dynamic Memory",
        question: "Which keyword is used to allocate memory dynamically in C++?",
        options: [
            "new",
            "create",
            "malloc",
            "object"
        ],
        answer: "new",
        explanation: "The new keyword dynamically allocates memory in C++."
    }

],



"Java": [

    {
        topic: "Java Basics",
        question: "Which keyword is used to create a class in Java?",
        options: [
            "class",
            "struct",
            "object",
            "define"
        ],
        answer: "class",
        explanation: "The class keyword is used to declare a class in Java."
    },

    {
        topic: "Polymorphism",
        question: "Which concept allows the same method to behave differently?",
        options: [
            "Polymorphism",
            "Inheritance",
            "Encapsulation",
            "Abstraction"
        ],
        answer: "Polymorphism",
        explanation: "Polymorphism allows the same method or interface to have different implementations."
    },

    {
        topic: "Inheritance",
        question: "Which keyword is used to inherit a class in Java?",
        options: [
            "extends",
                     "class"
        ],
        answer: "new",
        explanation: "The new keyword is used to create objects in Java."
    }

],


"Python": [

    {
        topic: "Python Basics",
        question: "Which symbol is used to create a comment in Python?",
        options: [
            "#",
            "//",
            "/*",
            "--"
        ],
        answer: "#",
        explanation: "The # symbol is used to write a single-line comment in Python."
    },

    {
        topic: "Lists",
        question: "Which data type is used to store multiple ordered values in Python?",
        options: [
            "List",
            "Set",
            "Dictionary",
            "Boolean"
        ],
        answer: "List",
        explanation: "A Python list stores multiple values in an ordered and changeable collection."
    },

    {
        topic: "Functions",
        question: "Which keyword is used to define a function in Python?",
        options: [
            "def",
            "function",
            "fun",
            "define"
        ],
        answer: "def",
        explanation: "The def keyword is used to define a function in Python."
    },

    {
        topic: "Dictionaries",
        question: "Which data structure stores key-value pairs in Python?",
        options: [
            "Dictionary",
            "List",
            "Tuple",
            "Set"
        ],
        answer: "Dictionary",
        explanation: "A Python dictionary stores data as key-value pairs."
    },

    {
        topic: "Classes & Objects",
        question: "Which keyword is used to create a class in Python?",
        options: [
            "class",
            "object",
            "struct",
            "define"
        ],
        answer: "class",
        explanation: "The class keyword is used to define a class in Python."
    }

],


"OOP": [

    {
        topic: "OOP Basics",
        question: "What does OOP stand for?",
        options: [
            "Object-Oriented Programming",
            "Object-Operating Program",
            "Object-Oriented Process",
            "Operating Object Program"
        ],
        answer: "Object-Oriented Programming",
        explanation: "OOP stands for Object-Oriented Programming, a programming approach based on objects and classes."
    },

    {
        topic: "Abstraction",
        question: "Which OOP concept hides internal implementation details?",
        options: [
            "Abstraction",
            "Inheritance",
            "Polymorphism",
            "Overloading"
        ],
        answer: "Abstraction",
        explanation: "Abstraction hides unnecessary implementation details and exposes only essential features."
    },

    {
        topic: "Encapsulation",
        question: "Which OOP concept combines data and methods into a single unit?",
        options: [
            "Encapsulation",
            "Inheritance",
            "Polymorphism",
            "Abstraction"
        ],
        answer: "Encapsulation",
        explanation: "Encapsulation combines data and methods inside a class and controls access to the data."
    },

    {
        topic: "Inheritance",
        question: "Which concept allows a child class to acquire properties of a parent class?",
        options: [
            "Inheritance",
            "Encapsulation",
            "Abstraction",
            "Overloading"
        ],
        answer: "Inheritance",
        explanation: "Inheritance allows a child class to reuse properties and methods of a parent class."
    },

    {
        topic: "Polymorphism",
        question: "Which OOP concept allows one method to behave differently for different objects?",
        options: [
            "Polymorphism",
            "Encapsulation",
            "Inheritance",
            "Abstraction"
        ],
        answer: "Polymorphism",
        explanation: "Polymorphism allows the same method or interface to have different implementations."
    }

],



"Data Structures": [

    {
        topic: "Arrays",
        question: "Which data structure stores elements in contiguous memory locations?",
        options: [
            "Array",
            "Linked List",
            "Tree",
            "Graph"
        ],
        answer: "Array",
        explanation: "An array stores elements in contiguous memory locations and allows access using an index."
    },

    {
        topic: "Stacks",
        question: "Which data structure follows LIFO?",
        options: [
            "Stack",
            "Queue",
            "Array",
            "Linked List"
        ],
        answer: "Stack",
        explanation: "A stack follows the Last In, First Out (LIFO) principle."
    },

    {
        topic: "Queues",
        question: "Which data structure follows FIFO?",
        options: [
            "Queue",
            "Stack",
            "Tree",
            "Graph"
        ],
        answer: "Queue",
        explanation: "A queue follows the First In, First Out (FIFO) principle."
    },

    {
        topic: "Trees",
        question: "Which data structure is commonly used to represent hierarchical data?",
        options: [
            "Tree",
            "Array",
            "Queue",
            "Stack"
        ],
        answer: "Tree",
        explanation: "A tree is a hierarchical data structure consisting of nodes connected by edges."
    },

    {
        topic: "Graphs",
        question: "Which data structure consists of vertices connected by edges?",
        options: [
            "Graph",
            "Array",
            "Stack",
            "Queue"
        ],
        answer: "Graph",
        explanation: "A graph consists of vertices connected by edges."
    }

],


"DBMS": [

    {
        topic: "DBMS Basics",
        question: "What does DBMS stand for?",
        options: [
            "Database Management System",
            "Data Backup Management System",
            "Database Monitoring Service",
            "Data Management Software"
        ],
        answer: "Database Management System",
        explanation: "DBMS stands for Database Management System and is used to create, store, manage, and retrieve data."
    },

    {
        topic: "Keys",
        question: "Which key uniquely identifies each record in a table?",
        options: [
            "Primary Key",
            "Foreign Key",
            "Candidate Key",
            "Composite Key"
        ],
        answer: "Primary Key",
        explanation: "A primary key uniquely identifies each record in a database table."
    },

    {
        topic: "Normalization",
        question: "What is the main purpose of normalization?",
        options: [
            "Reduce data redundancy",
            "Increase duplicate data",
            "Delete all data",
            "Increase network speed"
        ],
        answer: "Reduce data redundancy",
        explanation: "Normalization organizes database tables to reduce redundancy and improve data consistency."
    },

    {
        topic: "SQL in DBMS",
        question: "Which command is used to retrieve data from a database?",
        options: [
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE"
        ],
        answer: "SELECT",
        explanation: "The SELECT statement is used to retrieve data from one or more database tables."
    },

    {
        topic: "Relationships",
        question: "Which key creates a relationship between two tables?",
        options: [
            "Foreign Key",
            "Primary Key",
            "Unique Key",
            "Super Key"
        ],
        answer: "Foreign Key",
        explanation: "A foreign key references a key in another table and helps establish a relationship between tables."
    }

],


"SQL": [

    {
        topic: "SQL Basics",
        question: "Which SQL command is used to retrieve data from a table?",
        options: [
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE"
        ],
        answer: "SELECT",
        explanation: "The SELECT statement is used to retrieve data from one or more tables."
    },

    {
        topic: "WHERE Clause",
        question: "Which clause is used to filter rows in SQL?",
        options: [
            "WHERE",
            "GROUP BY",
            "ORDER BY",
            "HAVING"
        ],
        answer: "WHERE",
        explanation: "The WHERE clause filters rows based on a specified condition."
    },

    {
        topic: "GROUP BY",
        question: "Which clause is used to group rows with the same values?",
        options: [
            "GROUP BY",
            "ORDER BY",
            "WHERE",
            "JOIN"
        ],
        answer: "GROUP BY",
        explanation: "GROUP BY combines rows having the same values in specified columns."
    },

    {
        topic: "INSERT",
        question: "Which command is used to add a new record to a table?",
        options: [
            "INSERT",
            "UPDATE",
            "ALTER",
            "CREATE"
        ],
        answer: "INSERT",
        explanation: "The INSERT statement is used to add new records to a table."
    },

    {
        topic: "UPDATE",
        question: "Which SQL command is used to change existing data?",
        options: [
            "UPDATE",
            "INSERT",
            "ALTER",
            "CREATE"
        ],
        answer: "UPDATE",
        explanation: "The UPDATE statement modifies existing records in a table."
    }

],


"Data Warehousing & Data Mining": [

    {
        topic: "Data Warehouse Basics",
        question: "What is a data warehouse?",
        options: [
            "A centralized repository of data",
            "A programming language",
            "A computer network",
            "A web browser"
        ],
        answer: "A centralized repository of data",
        explanation: "A data warehouse stores integrated data from different sources for reporting and analysis."
    },

    {
        topic: "Data Mining",
        question: "Which process extracts useful patterns from large datasets?",
        options: [
            "Data Mining",
            "Data Entry",
            "Data Storage",
            "Data Backup"
        ],
        answer: "Data Mining",
        explanation: "Data mining discovers useful patterns and relationships in large datasets."
    },

    {
        topic: "Data Warehouse Schema",
        question: "Which schema is commonly used in data warehouses?",
        options: [
            "Star Schema",
            "Binary Schema",
            "Linear Schema",
            "Circular Schema"
        ],
        answer: "Star Schema",
        explanation: "A star schema contains a central fact table connected to multiple dimension tables."
    },

    {
        topic: "ETL",
        question: "What does ETL stand for?",
        options: [
            "Extract, Transform, Load",
            "Enter, Transfer, Link",
            "Extract, Test, Launch",
            "Execute, Transform, Link"
        ],
        answer: "Extract, Transform, Load",
        explanation: "ETL extracts data, transforms it into a suitable format, and loads it into a target system."
    },

    {
        topic: "Clustering",
        question: "Which technique groups similar data objects together?",
        options: [
            "Clustering",
            "Sorting",
            "Indexing",
            "Encryption"
        ],
        answer: "Clustering",
        explanation: "Clustering groups similar data objects into clusters based on their characteristics."
    }

],


"Big Data": [

    {
        topic: "Big Data Basics",
        question: "What does Big Data refer to?",
        options: [
            "Very large and complex datasets",
            "A small database",
            "A programming language",
            "A computer processor"
        ],
        answer: "Very large and complex datasets",
        explanation: "Big Data refers to datasets that are too large or complex for traditional data-processing methods."
    },

    {
        topic: "Characteristics of Big Data",
        question: "Which is one of the main characteristics of Big Data?",
        options: [
            "Volume",
            "Compiler",
            "Inheritance",
            "Encapsulation"
        ],
        answer: "Volume",
        explanation: "Volume refers to the huge amount of data generated and stored."
    },

    {
        topic: "Hadoop",
        question: "Which technology is commonly associated with distributed Big Data processing?",
        options: [
            "Hadoop",
            "HTML",
            "CSS",
            "Photoshop"
        ],
        answer: "Hadoop",
        explanation: "Apache Hadoop is a framework used for distributed storage and processing of large datasets."
    },

    {
        topic: "Data Velocity",
        question: "What does Velocity represent in Big Data?",
        options: [
            "Speed of data generation and processing",
            "Size of data",
            "Type of data",
            "Security of data"
        ],
        answer: "Speed of data generation and processing",
        explanation: "Velocity refers to how quickly data is generated, collected, and processed."
    },

    {
        topic: "Distributed Computing",
        question: "Which system processes large datasets across multiple computers?",
        options: [
            "Distributed Computing",
            "Single-thread Computing",
            "Local Storage",
            "Standalone Computing"
        ],
        answer: "Distributed Computing",
        explanation: "Distributed computing divides processing tasks among multiple connected computers."
    }

],



"Data Science": [

    {
        topic: "Data Science Basics",
        question: "What is Data Science?",
        options: [
            "The process of extracting useful insights from data",
            "A programming language",
            "A computer network",
            "A hardware component"
        ],
        answer: "The process of extracting useful insights from data",
        explanation: "Data Science combines statistics, programming, and data analysis to extract useful insights from data."
    },

    {
        topic: "Python for Data Science",
        question: "Which programming language is widely used in Data Science?",
        options: [
            "Python",
            "HTML",
            "CSS",
            "JavaScript"
        ],
        answer: "Python",
        explanation: "Python is widely used in Data Science because of its libraries for data analysis and machine learning."
    },

    {
        topic: "Pandas",
        question: "Which Python library is commonly used for data manipulation?",
        options: [
            "Pandas",
            "React",
            "Express",
            "Bootstrap"
        ],
        answer: "Pandas",
        explanation: "Pandas provides data structures and functions for manipulating and analyzing tabular data."
    },

    {
        topic: "Data Visualization",
        question: "Which graph is commonly used to show the relationship between two numerical variables?",
        options: [
            "Scatter Plot",
            "Pie Chart",
            "Bar Chart",
            "Flowchart"
        ],
        answer: "Scatter Plot",
        explanation: "A scatter plot displays pairs of numerical values and helps visualize relationships between variables."
    },

    {
        topic: "Data Cleaning",
        question: "What is data cleaning?",
        options: [
            "Removing or correcting inaccurate and inconsistent data",
            "Deleting the entire database",
            "Creating a programming language",
            "Connecting two computers"
        ],
        answer: "Removing or correcting inaccurate and inconsistent data",
        explanation: "Data cleaning involves identifying and correcting missing, duplicate, incorrect, or inconsistent data."
    }

],



"Artificial Intelligence": [

    {
        topic: "AI Basics",
        question: "What is Artificial Intelligence?",
        options: [
            "The ability of machines to perform tasks that normally require human intelligence",
            "A type of computer hardware",
            "A database system",
            "A programming language"
        ],
        answer: "The ability of machines to perform tasks that normally require human intelligence",
        explanation: "Artificial Intelligence enables machines to perform tasks such as learning, reasoning, and decision-making."
    },

    {
        topic: "AI Applications",
        question: "Which of the following is an application of AI?",
        options: [
            "Speech Recognition",
            "Keyboard Typing",
            "File Storage",
            "Screen Display"
        ],
        answer: "Speech Recognition",
        explanation: "Speech recognition uses AI techniques to understand and process human speech."
    },

    {
        topic: "Machine Learning",
        question: "What is Machine Learning?",
        options: [
            "A method where computers learn from data",
            "A method of repairing hardware",
            "A database management technique",
            "A networking protocol"
        ],
        answer: "A method where computers learn from data",
        explanation: "Machine Learning allows computers to learn patterns from data and make predictions or decisions."
    },

    {
        topic: "Types of AI",
        question: "Which type of AI is designed to perform a specific task?",
        options: [
            "Narrow AI",
            "General AI",
            "Super AI",
            "Universal AI"
        ],
        answer: "Narrow AI",
        explanation: "Narrow AI is designed to perform a specific task or a limited set of related tasks."
    },

    {
        topic: "AI Learning",
        question: "Which technique allows an AI system to improve through experience?",
        options: [
            "Machine Learning",
            "Data Entry",
            "File Compression",
            "Network Routing"
        ],
        answer: "Machine Learning",
        explanation: "Machine Learning enables systems to learn from data and improve their performance."
    }

],


"Machine Learning": [

    {
        topic: "ML Basics",
        question: "What is Machine Learning?",
        options: [
            "A technique where computers learn from data",
            "A method for designing hardware",
            "A database language",
            "A networking device"
        ],
        answer: "A technique where computers learn from data",
        explanation: "Machine Learning enables computers to learn patterns from data and make predictions or decisions."
    },

    {
        topic: "Supervised Learning",
        question: "Which type of Machine Learning uses labeled data?",
        options: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Reinforcement Learning",
            "Random Learning"
        ],
        answer: "Supervised Learning",
        explanation: "Supervised Learning trains a model using labeled input data and corresponding outputs."
    },

    {
        topic: "Unsupervised Learning",
        question: "Which type of Machine Learning finds patterns without labeled data?",
        options: [
            "Unsupervised Learning",
            "Supervised Learning",
            "Reinforcement Learning",
            "Rule-Based Learning"
        ],
        answer: "Unsupervised Learning",
        explanation: "Unsupervised Learning discovers patterns or structures in data without predefined labels."
    },

    {
        topic: "Classification",
        question: "Which algorithm can be used for classification?",
        options: [
            "Decision Tree",
            "Linear Search",
            "Bubble Sort",
            "Binary Search"
        ],
        answer: "Decision Tree",
        explanation: "Decision Trees can be used to classify data into different categories."
    },

    {
        topic: "Overfitting",
        question: "What is overfitting?",
        options: [
            "When a model learns the training data too closely",
            "When a model has no training data",
            "When data is completely deleted",
            "When a computer runs slowly"
        ],
        answer: "When a model learns the training data too closely",
        explanation: "Overfitting occurs when a model performs very well on training data but poorly on unseen data."
    }

],



"Excel": [

    {
        topic: "Excel Basics",
        question: "Which function is used to calculate the total of numbers in Excel?",
        options: [
            "SUM()",
            "COUNT()",
            "AVERAGE()",
            "MAX()"
        ],
        answer: "SUM()",
        explanation: "The SUM() function adds numbers in selected cells."
    },

    {
        topic: "Excel Functions",
        question: "Which function calculates the average of numbers?",
        options: [
            "AVERAGE()",
            "SUM()",
            "COUNT()",
            "MIN()"
        ],
        answer: "AVERAGE()",
        explanation: "The AVERAGE() function calculates the arithmetic mean of selected values."
    },

    {
        topic: "Pivot Tables",
        question: "Which Excel feature is used to summarize and analyze large amounts of data?",
        options: [
            "Pivot Table",
            "Text Box",
            "Page Layout",
            "Header"
        ],
        answer: "Pivot Table",
        explanation: "Pivot Tables help summarize, organize, and analyze large datasets."
    },

    {
        topic: "VLOOKUP",
        question: "Which function searches for a value in the first column of a table?",
        options: [
            "VLOOKUP()",
            "SUM()",
            "COUNT()",
            "ROUND()"
        ],
        answer: "VLOOKUP()",
        explanation: "VLOOKUP() searches for a value in the first column of a table and returns a related value."
    },

    {
        topic: "COUNT Function",
        question: "Which function counts cells containing numbers?",
        options: [
            "COUNT()",
            "SUM()",
            "AVERAGE()",
            "CONCAT()"
        ],
        answer: "COUNT()",
        explanation: "The COUNT() function counts cells that contain numerical values."
    }

],


"Power BI": [

    {
        topic: "Power BI Basics",
        question: "What is Power BI?",
        options: [
            "A business intelligence and data visualization tool",
            "A programming language",
            "A database server",
            "An operating system"
        ],
        answer: "A business intelligence and data visualization tool",
        explanation: "Power BI is a Microsoft tool used to analyze data and create interactive reports and dashboards."
    },

    {
        topic: "DAX",
        question: "Which language is commonly used for calculations in Power BI?",
        options: [
            "DAX",
            "HTML",
            "CSS",
            "Java"
        ],
        answer: "DAX",
        explanation: "DAX (Data Analysis Expressions) is used to create calculations and measures in Power BI."
    },

    {
        topic: "Dashboards",
        question: "What is a Power BI dashboard?",
        options: [
            "A visual page containing data insights",
            "A programming editor",
            "A database table",
            "A computer network"
        ],
        answer: "A visual page containing data insights",
        explanation: "A Power BI dashboard presents important data and insights using visualizations."
    },

    {
        topic: "Power Query",
        question: "Which feature is used to clean and transform data in Power BI?",
        options: [
            "Power Query",
            "PowerPoint",
            "DAX Editor",
            "Visual Studio"
        ],
        answer: "Power Query",
        explanation: "Power Query is used to connect, clean, transform, and prepare data before analysis."
    },

    {
        topic: "Visualizations",
        question: "Which of these is a Power BI visualization?",
        options: [
            "Bar Chart",
            "Compiler",
            "Keyboard",
            "Operating System"
        ],
        answer: "Bar Chart",
        explanation: "Bar charts are one of the many visualizations available in Power BI."
    }

],


"HTML": [

    {
        topic: "HTML Basics",
        question: "What does HTML stand for?",
        options: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        answer: "HyperText Markup Language",
        explanation: "HTML stands for HyperText Markup Language and is used to structure web pages."
    },

    {
        topic: "HTML Elements",
        question: "Which HTML tag is used to create a paragraph?",
        options: [
            "<p>",
            "<para>",
            "<text>",
            "<pg>"
        ],
        answer: "<p>",
        explanation: "The <p> tag is used to define a paragraph in HTML."
    },

    {
        topic: "HTML Links",
        question: "Which tag is used to create a hyperlink?",
        options: [
            "<a>",
            "<link>",
            "<href>",
            "<url>"
        ],
        answer: "<a>",
        explanation: "The <a> tag is used to create hyperlinks in HTML."
    },

    {
        topic: "HTML Images",
        question: "Which tag is used to display an image?",
        options: [
            "<img>",
            "<image>",
            "<pic>",
            "<src>"
        ],
        answer: "<img>",
        explanation: "The <img> tag is used to embed an image in an HTML page."
    },

    {
        topic: "HTML Headings",
        question: "Which tag is used for the largest heading?",
        options: [
            "<h1>",
            "<h6>",
            "<heading>",
            "<head>"
        ],
        answer: "<h1>",
        explanation: "The <h1> tag represents the largest and most important heading level."
    }

],


"CSS": [

    {
        topic: "CSS Basics",
        question: "What does CSS stand for?",
        options: [
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Creative Style System",
            "Colorful Style Sheets"
        ],
        answer: "Cascading Style Sheets",
        explanation: "CSS stands for Cascading Style Sheets and is used to style HTML elements."
    },

    {
        topic: "CSS Colors",
        question: "Which property is used to change text color?",
        options: [
            "color",
            "text-color",
            "font-color",
            "foreground"
        ],
        answer: "color",
        explanation: "The color property is used to set the text color of an element."
    },

    {
        topic: "CSS Backgrounds",
        question: "Which property changes the background color?",
        options: [
            "background-color",
            "bg-color",
            "background",
            "color-background"
        ],
        answer: "background-color",
        explanation: "The background-color property sets the background color of an HTML element."
    },

    {
        topic: "CSS Fonts",
        question: "Which CSS property changes the size of text?",
        options: [
            "font-size",
            "text-size",
            "font-height",
            "size"
        ],
        answer: "font-size",
        explanation: "The font-size property controls the size of text."
    },

    {
        topic: "CSS Selectors",
        question: "Which symbol is used for an ID selector in CSS?",
        options: [
            "#",
            ".",
            "*",
            "@"
        ],
        answer: "#",
        explanation: "The # symbol is used to select an HTML element by its ID."
    }

],



"JavaScript": [

    {
        topic: "JavaScript Basics",
        question: "What is JavaScript mainly used for?",
        options: [
            "Adding interactivity to web pages",
            "Creating hardware",
            "Managing databases only",
            "Designing computer processors"
        ],
        answer: "Adding interactivity to web pages",
        explanation: "JavaScript is commonly used to make web pages interactive and dynamic."
    },

    {
        topic: "Variables",
        question: "Which keyword declares a variable that can be reassigned?",
        options: [
            "let",
            "constant",
            "define",
            "varname"
        ],
        answer: "let",
        explanation: "The let keyword declares a block-scoped variable whose value can be changed."
    },

    {
        topic: "Functions",
        question: "Which keyword is used to define a function in JavaScript?",
        options: [
            "function",
            "def",
            "fun",
            "method"
        ],
        answer: "function",
        explanation: "The function keyword is used to declare a traditional JavaScript function."
    },

    {
        topic: "Console",
        question: "Which method displays a message in the browser console?",
        options: [
            "console.log()",
            "print()",
            "display()",
            "show()"
        ],
        answer: "console.log()",
        explanation: "console.log() prints information to the browser's developer console."
    },

    {
        topic: "Data Types",
        question: "Which data type represents true or false?",
        options: [
            "Boolean",
            "String",
            "Number",
            "Object"
        ],
        answer: "Boolean",
        explanation: "The Boolean data type has two values: true and false."
    }

],



"Web Technologies": [

    {
        topic: "Web Basics",
        question: "Which technology is used to structure web pages?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        answer: "HTML",
        explanation: "HTML provides the structure and content of web pages."
    },

    {
        topic: "CSS",
        question: "Which technology is mainly used for web page styling?",
        options: [
            "CSS",
            "HTML",
            "SQL",
            "Python"
        ],
        answer: "CSS",
        explanation: "CSS is used to control the appearance and layout of web pages."
    },

    {
        topic: "JavaScript",
        question: "Which technology is commonly used to add dynamic behavior to web pages?",
        options: [
            "JavaScript",
            "HTML",
            "CSS",
            "XML"
        ],
        answer: "JavaScript",
        explanation: "JavaScript adds dynamic behavior and interactivity to web pages."
    },

    {
        topic: "URLs",
        question: "What does URL stand for?",
        options: [
            "Uniform Resource Locator",
            "Universal Resource Link",
            "Uniform Reference Link",
            "User Resource Locator"
        ],
        answer: "Uniform Resource Locator",
        explanation: "URL stands for Uniform Resource Locator and identifies the location of a resource on the web."
    },

    {
        topic: "HTTP and HTTPS",
        question: "Which protocol is commonly used for secure web communication?",
        options: [
            "HTTPS",
            "HTTP",
            "FTP",
            "SMTP"
        ],
        answer: "HTTPS",
        explanation: "HTTPS provides encrypted communication between a browser and a web server."
    }

],


"Full Stack Development": [

    {
        topic: "Full Stack Basics",
        question: "What does full stack development involve?",
        options: [
            "Frontend and backend development",
            "Only database design",
            "Only frontend design",
            "Only hardware development"
        ],
        answer: "Frontend and backend development",
        explanation: "Full stack development involves working with both the frontend and backend parts of an application."
    },

    {
        topic: "Frontend Development",
        question: "Which technology is commonly used for frontend development?",
        options: [
            "HTML",
            "Node.js",
            "MongoDB",
            "MySQL"
        ],
        answer: "HTML",
        explanation: "HTML is one of the core technologies used to build the frontend structure of web applications."
    },

    {
        topic: "Backend Development",
        question: "Which technology allows JavaScript to run on the server?",
        options: [
            "Node.js",
            "HTML",
            "CSS",
            "Bootstrap"
        ],
        answer: "Node.js",
        explanation: "Node.js is a runtime environment that allows JavaScript to execute outside the browser, including on servers."
    },

    {
        topic: "Databases",
        question: "Which component is responsible for storing application data?",
        options: [
            "Database",
            "HTML",
            "CSS",
            "Browser"
        ],
        answer: "Database",
        explanation: "A database stores and manages the data used by an application."
    },

    {
        topic: "APIs",
        question: "What is an API used for?",
        options: [
            "Communication between software components",
            "Changing screen brightness",
            "Formatting a hard disk",
            "Designing hardware"
        ],
        answer: "Communication between software components",
        explanation: "An API provides a way for different software components or applications to communicate with each other."
    }

],



"Cloud Computing": [

    {
        topic: "Cloud Basics",
        question: "What is cloud computing?",
        options: [
            "Delivery of computing services over the internet",
            "A type of computer hardware",
            "A programming language",
            "A database table"
        ],
        answer: "Delivery of computing services over the internet",
        explanation: "Cloud computing provides services such as servers, storage, databases, and software through the internet."
    },

    {
        topic: "IaaS",
        question: "What does IaaS stand for?",
        options: [
            "Infrastructure as a Service",
            "Internet as a Service",
            "Information as a System",
            "Infrastructure and Software"
        ],
        answer: "Infrastructure as a Service",
        explanation: "IaaS provides virtualized computing resources such as servers, storage, and networking."
    },

    {
        topic: "SaaS",
        question: "What does SaaS stand for?",
        options: [
            "Software as a Service",
            "System as a Service",
            "Storage as a System",
            "Software and Server"
        ],
        answer: "Software as a Service",
        explanation: "SaaS provides software applications to users over the internet."
    },

    {
        topic: "Cloud Deployment Models",
        question: "Which cloud deployment model is dedicated to a single organization?",
        options: [
            "Private Cloud",
            "Public Cloud",
            "Hybrid Cloud",
            "Community Cloud"
        ],
        answer: "Private Cloud",
        explanation: "A private cloud is dedicated to the use of a single organization."
    },

    {
        topic: "Cloud Storage",
        question: "What is cloud storage used for?",
        options: [
            "Storing data on remote servers",
            "Increasing CPU speed",
            "Writing source code",
            "Creating computer networks"
        ],
        answer: "Storing data on remote servers",
        explanation: "Cloud storage allows users to store and access data on remote servers through the internet."
    }

],


"DevOps": [

    {
        topic: "DevOps Basics",
        question: "What does DevOps combine?",
        options: [
            "Development and Operations",
            "Design and Programming",
            "Database and Networking",
            "Testing and Hardware"
        ],
        answer: "Development and Operations",
        explanation: "DevOps combines software development and IT operations to improve software delivery."
    },

    {
        topic: "Continuous Integration",
        question: "What does CI stand for in DevOps?",
        options: [
            "Continuous Integration",
            "Computer Integration",
            "Code Installation",
            "Continuous Installation"
        ],
        answer: "Continuous Integration",
        explanation: "Continuous Integration automatically integrates code changes into a shared repository."
    },

    {
        topic: "Continuous Delivery",
        question: "What does CD commonly stand for in DevOps?",
        options: [
            "Continuous Delivery",
            "Computer Design",
            "Code Development",
            "Cloud Database"
        ],
        answer: "Continuous Delivery",
        explanation: "Continuous Delivery keeps software in a releasable state through automated processes."
    },

    {
        topic: "Git",
        question: "Which tool is commonly used for version control?",
        options: [
            "Git",
            "Excel",
            "Power BI",
            "Photoshop"
        ],
        answer: "Git",
        explanation: "Git is a distributed version control system used to track changes in source code."
    },

    {
        topic: "CI/CD Pipeline",
        question: "Which practice automatically builds and tests code after changes?",
        options: [
            "Continuous Integration",
            "Manual Testing",
            "Data Mining",
            "Database Normalization"
        ],
        answer: "Continuous Integration",
        explanation: "Continuous Integration automatically builds and tests code whenever changes are integrated."
    }

],



"Cyber Security": [

    {
        topic: "Cyber Security Basics",
        question: "What is cyber security?",
        options: [
            "Protection of computer systems and data",
            "Designing websites",
            "Creating databases",
            "Writing only Java programs"
        ],
        answer: "Protection of computer systems and data",
        explanation: "Cyber security protects systems, networks, applications, and data from unauthorized access and attacks."
    },

    {
        topic: "Phishing",
        question: "What is phishing?",
        options: [
            "A fraudulent attempt to obtain sensitive information",
            "A data compression technique",
            "A programming method",
            "A database operation"
        ],
        answer: "A fraudulent attempt to obtain sensitive information",
        explanation: "Phishing uses deceptive messages or websites to trick users into revealing sensitive information."
    },

    {
        topic: "Encryption",
        question: "Which technique converts readable data into an unreadable form?",
        options: [
            "Encryption",
            "Compilation",
            "Compression",
            "Sorting"
        ],
        answer: "Encryption",
        explanation: "Encryption converts readable information into an encoded form to help protect it from unauthorized access."
    },

    {
        topic: "Malware",
        question: "What does malware mean?",
        options: [
            "Malicious Software",
            "Managed Software",
            "Machine Learning Software",
            "Main Language"
        ],
        answer: "Malicious Software",
        explanation: "Malware is software designed to harm systems, steal information, or perform unauthorized activities."
    },

    {
        topic: "Security Principles",
        question: "Which security principle ensures information is accessible when needed?",
        options: [
            "Availability",
            "Confidentiality",
            "Integrity",
            "Authentication"
        ],
        answer: "Availability",
        explanation: "Availability ensures that authorized users can access information and systems when required."
    }

],


"Internet of Things": [

    {
        topic: "IoT Basics",
        question: "What does IoT stand for?",
        options: [
            "Internet of Things",
            "Internet of Technology",
            "Input Output Technology",
            "Integrated Online Tools"
        ],
        answer: "Internet of Things",
        explanation: "IoT stands for Internet of Things and refers to connected physical devices that collect and exchange data."
    },

    {
        topic: "Sensors",
        question: "Which component can detect physical conditions in an IoT system?",
        options: [
            "Sensor",
            "Monitor",
            "Keyboard",
            "Printer"
        ],
        answer: "Sensor",
        explanation: "Sensors collect information such as temperature, light, motion, or humidity from the environment."
    },

    {
        topic: "Smart Home",
        question: "What is a smart home an example of?",
        options: [
            "IoT",
            "Compiler Design",
            "Database Management",
            "Operating System"
        ],
        answer: "IoT",
        explanation: "Smart homes use connected devices and sensors to monitor and control home functions."
    },

    {
        topic: "IoT Communication",
        question: "Which communication method can be used by IoT devices?",
        options: [
            "Wi-Fi",
            "Keyboard",
            "Monitor",
            "Printer"
        ],
        answer: "Wi-Fi",
        explanation: "Wi-Fi is commonly used to connect IoT devices to networks and the internet."
    },

    {
        topic: "Actuators",
        question: "What is the role of an actuator in IoT?",
        options: [
            "Perform an action based on a control signal",
            "Store database records",
            "Write program code",
            "Display web pages"
        ],
        answer: "Perform an action based on a control signal",
        explanation: "An actuator converts a control signal into a physical action, such as moving a motor or switching a device."
    }

],


"Blockchain": [

    {
        topic: "Blockchain Basics",
        question: "What is blockchain?",
        options: [
            "A distributed digital ledger",
            "A programming language",
            "A computer processor",
            "A web browser"
        ],
        answer: "A distributed digital ledger",
        explanation: "Blockchain is a distributed ledger technology that records transactions in linked blocks."
    },

    {
        topic: "Blocks",
        question: "What is a block in a blockchain?",
        options: [
            "A collection of recorded transactions",
            "A computer monitor",
            "A programming function",
            "A network cable"
        ],
        answer: "A collection of recorded transactions",
        explanation: "A blockchain block contains recorded transactions and information linking it to previous blocks."
    },

    {
        topic: "Cryptography",
        question: "Which technology is strongly associated with blockchain?",
        options: [
            "Cryptography",
            "HTML",
            "CSS",
            "Spreadsheet"
        ],
        answer: "Cryptography",
        explanation: "Cryptography helps secure blockchain transactions and maintain data integrity."
    },

    {
        topic: "Cryptocurrency",
        question: "What is a cryptocurrency?",
        options: [
            "A digital form of currency",
            "A computer virus",
            "A database system",
            "A programming language"
        ],
        answer: "A digital form of currency",
        explanation: "Cryptocurrency is a digital or virtual form of currency that commonly uses cryptographic techniques."
    },

    {
        topic: "Smart Contracts",
        question: "What is a smart contract?",
        options: [
            "A program that automatically executes predefined rules",
            "A paper agreement",
            "A computer network",
            "A database table"
        ],
        answer: "A program that automatically executes predefined rules",
        explanation: "A smart contract is program code that can automatically execute actions when predefined conditions are met."
    }

],


"Computer Graphics": [

    {
        topic: "Graphics Basics",
        question: "What is computer graphics?",
        options: [
            "The creation and manipulation of images using computers",
            "The study of computer networks",
            "The management of databases",
            "The design of operating systems"
        ],
        answer: "The creation and manipulation of images using computers",
        explanation: "Computer graphics deals with creating, displaying, and manipulating images using computers."
    },

    {
        topic: "2D Transformation",
        question: "Which transformation moves an object from one position to another?",
        options: [
            "Translation",
            "Rotation",
            "Scaling",
            "Reflection"
        ],
        answer: "Translation",
        explanation: "Translation changes the position of an object without changing its shape or size."
    },

    {
        topic: "Rotation",
        question: "Which transformation rotates an object around a fixed point?",
        options: [
            "Rotation",
            "Translation",
            "Scaling",
            "Clipping"
        ],
        answer: "Rotation",
        explanation: "Rotation turns an object around a specified point or origin."
    },

    {
        topic: "Scaling",
        question: "Which transformation changes the size of an object?",
        options: [
            "Scaling",
            "Translation",
            "Rotation",
            "Clipping"
        ],
        answer: "Scaling",
        explanation: "Scaling increases or decreases the size of an object."
    },

    {
        topic: "Clipping",
        question: "What is clipping in computer graphics?",
        options: [
            "Removing portions outside the viewing area",
            "Increasing image size",
            "Rotating an image",
            "Changing the image color"
        ],
        answer: "Removing portions outside the viewing area",
        explanation: "Clipping removes parts of objects that lie outside the defined viewing region."
    }

],


"Digital Logic Design": [

    {
        topic: "Logic Gates",
        question: "Which logic gate produces an output of 1 only when all inputs are 1?",
        options: [
            "AND gate",
            "OR gate",
            "NOT gate",
            "XOR gate"
        ],
        answer: "AND gate",
        explanation: "An AND gate gives an output of 1 only when all its inputs are 1."
    },

    {
        topic: "Boolean Algebra",
        question: "Which operator represents logical AND in Boolean algebra?",
        options: [
            "·",
            "+",
            "'",
            "⊕"
        ],
        answer: "·",
        explanation: "The dot (·) is commonly used to represent the AND operation."
    },

    {
        topic: "Combinational Circuits",
        question: "Which of the following is a combinational circuit?",
        options: [
            "Multiplexer",
            "Flip-flop",
            "Counter",
            "Register"
        ],
        answer: "Multiplexer",
        explanation: "A multiplexer is a combinational circuit that selects one input from multiple inputs."
    },

    {
        topic: "Sequential Circuits",
        question: "Which circuit stores one bit of information?",
        options: [
            "Flip-flop",
            "Multiplexer",
            "Encoder",
            "Decoder"
        ],
        answer: "Flip-flop",
        explanation: "A flip-flop is a sequential circuit capable of storing one bit of information."
    },

    {
        topic: "Number Systems",
        question: "Which number system uses only 0 and 1?",
        options: [
            "Binary",
            "Decimal",
            "Octal",
            "Hexadecimal"
        ],
        answer: "Binary",
        explanation: "The binary number system uses two digits: 0 and 1."
    }

],


"Microprocessors & Microcontrollers": [

    {
        topic: "Microprocessor Basics",
        question: "What is a microprocessor?",
        options: [
            "A CPU implemented on a single integrated circuit",
            "A storage device",
            "A network device",
            "A programming language"
        ],
        answer: "A CPU implemented on a single integrated circuit",
        explanation: "A microprocessor is a central processing unit implemented on a single integrated circuit."
    },

    {
        topic: "Microcontroller Basics",
        question: "What is a microcontroller?",
        options: [
            "A single chip containing CPU, memory and peripherals",
            "Only a CPU",
            "Only a memory device",
            "Only an input device"
        ],
        answer: "A single chip containing CPU, memory and peripherals",
        explanation: "A microcontroller combines a CPU, memory and input/output peripherals on a single chip."
    },

    {
        topic: "8086 Microprocessor",
        question: "Which microprocessor has a 16-bit architecture?",
        options: [
            "8086",
            "8051",
            "8085",
            "4004"
        ],
        answer: "8086",
        explanation: "The Intel 8086 is a 16-bit microprocessor."
    },

    {
        topic: "8051 Microcontroller",
        question: "The 8051 is commonly classified as which type of microcontroller?",
        options: [
            "8-bit microcontroller",
            "16-bit microcontroller",
            "32-bit microcontroller",
            "64-bit microcontroller"
        ],
        answer: "8-bit microcontroller",
        explanation: "The classic Intel 8051 is an 8-bit microcontroller."
    },

    {
        topic: "I/O Ports",
        question: "What is the purpose of I/O ports in a microcontroller?",
        options: [
            "To communicate with external devices",
            "To store only programs",
            "To perform mathematical calculations only",
            "To cool the processor"
        ],
        answer: "To communicate with external devices",
        explanation: "Input/output ports allow a microcontroller to communicate with sensors, displays and other external devices."
    }

],



"Discrete Mathematics" :[

    {
        topic: "Sets",
        question: "What is a set?",
        options: [
            "A well-defined collection of objects",
            "A type of computer network",
            "A programming language",
            "A database table"
        ],
        answer: "A well-defined collection of objects",
        explanation: "A set is a well-defined collection of distinct objects."
    },

    {
        topic: "Relations",
        question: "A relation is a connection between elements of which structures?",
        options: [
            "Sets",
            "Processors",
            "Files",
            "Networks"
        ],
        answer: "Sets",
        explanation: "A relation describes a relationship between elements of one or more sets."
    },

    {
        topic: "Functions",
        question: "What is a function?",
        options: [
            "A relation where each input has exactly one output",
            "A collection of unrelated elements",
            "A type of computer memory",
            "A network protocol"
        ],
        answer: "A relation where each input has exactly one output",
        explanation: "A function maps every input element to exactly one output element."
    },

    {
        topic: "Graph Theory",
        question: "What are the basic components of a graph?",
        options: [
            "Vertices and edges",
            "Rows and columns",
            "Keys and values",
            "Bits and bytes"
        ],
        answer: "Vertices and edges",
        explanation: "A graph consists of vertices (nodes) and edges connecting them."
    },

    {
        topic: "Logic",
        question: "Which operator represents logical AND?",
        options: [
            "∧",
            "∨",
            "¬",
            "→"
        ],
        answer: "∧",
        explanation: "The symbol ∧ represents the logical AND operation."
    }

],


"Probability & Statistics": [

    {
        topic: "Probability Basics",
        question: "What is the probability of an event that is certain to occur?",
        options: [
            "1",
            "0",
            "0.5",
            "2"
        ],
        answer: "1",
        explanation: "The probability of a certain event is 1."
    },

    {
        topic: "Mean",
        question: "What is the arithmetic mean?",
        options: [
            "Sum of values divided by the number of values",
            "Largest value in a dataset",
            "Smallest value in a dataset",
            "Middle value only"
        ],
        answer: "Sum of values divided by the number of values",
        explanation: "The arithmetic mean is calculated by dividing the sum of all values by the number of values."
    },

    {
        topic: "Median",
        question: "What is the median of an ordered dataset?",
        options: [
            "The middle value",
            "The largest value",
            "The smallest value",
            "The average of all values"
        ],
        answer: "The middle value",
        explanation: "The median is the middle value when the data is arranged in ascending or descending order."
    },

    {
        topic: "Mode",
        question: "What does the mode represent in statistics?",
        options: [
            "The most frequently occurring value",
            "The average value",
            "The middle value",
            "The smallest value"
        ],
        answer: "The most frequently occurring value",
        explanation: "The mode is the value that occurs most frequently in a dataset."
    },

    {
        topic: "Standard Deviation",
        question: "What does standard deviation measure?",
        options: [
            "Spread or dispersion of data",
            "Number of data values",
            "Middle value of data",
            "Total of all values"
        ],
        answer: "Spread or dispersion of data",
        explanation: "Standard deviation measures how much data values vary or spread around the mean."
    }

],


"Engineering Mathematics": [

    {
        topic: "Matrices",
        question: "What is a matrix?",
        options: [
            "A rectangular arrangement of numbers",
            "A type of graph",
            "A programming language",
            "A network protocol"
        ],
        answer: "A rectangular arrangement of numbers",
        explanation: "A matrix is an arrangement of numbers or elements in rows and columns."
    },

    {
        topic: "Differentiation",
        question: "What does differentiation generally represent?",
        options: [
            "Rate of change",
            "Total accumulation",
            "Probability",
            "Data storage"
        ],
        answer: "Rate of change",
        explanation: "Differentiation is used to find the rate at which a quantity changes."
    },

    {
        topic: "Integration",
        question: "What is integration commonly used to find?",
        options: [
            "Accumulation or area",
            "Only maximum values",
            "Only minimum values",
            "Network speed"
        ],
        answer: "Accumulation or area",
        explanation: "Integration is commonly used to calculate accumulated quantities and areas."
    },

    {
        topic: "Differential Equations",
        question: "What does a differential equation contain?",
        options: [
            "A function and its derivatives",
            "Only constants",
            "Only matrices",
            "Only probabilities"
        ],
        answer: "A function and its derivatives",
        explanation: "A differential equation relates an unknown function to one or more of its derivatives."
    },

    {
        topic: "Numerical Methods",
        question: "What are numerical methods mainly used for?",
        options: [
            "Finding approximate solutions to mathematical problems",
            "Designing web pages",
            "Managing computer networks",
            "Creating databases"
        ],
        answer: "Finding approximate solutions to mathematical problems",
        explanation: "Numerical methods provide approximate solutions when exact mathematical solutions are difficult or impossible to obtain."
    }

],



"Aptitude": [

    {
        topic: "Number System",
        question: "What is the smallest prime number?",
        options: [
            "2",
            "1",
            "3",
            "0"
        ],
        answer: "2",
        explanation: "2 is the smallest prime number and the only even prime number."
    },

    {
        topic: "Percentages",
        question: "What is 20% of 200?",
        options: [
            "40",
            "20",
            "30",
            "50"
        ],
        answer: "40",
        explanation: "20% of 200 = (20/100) × 200 = 40."
    },

    {
        topic: "Profit and Loss",
        question: "If an item is bought for ₹100 and sold for ₹120, what is the profit?",
        options: [
            "₹20",
            "₹10",
            "₹15",
            "₹25"
        ],
        answer: "₹20",
        explanation: "Profit = Selling Price − Cost Price = ₹120 − ₹100 = ₹20."
    },

    {
        topic: "Time and Work",
        question: "If a person completes a work in 10 days, what fraction of the work is completed in one day?",
        options: [
            "1/10",
            "1/5",
            "1/20",
            "10"
        ],
        answer: "1/10",
        explanation: "If the complete work takes 10 days, one day's work is 1/10 of the total work."
    },

    {
        topic: "Time Speed Distance",
        question: "A car travels at 60 km/h for 2 hours. What distance does it cover?",
        options: [
            "120 km",
            "30 km",
            "100 km",
            "150 km"
        ],
        answer: "120 km",
        explanation: "Distance = Speed × Time = 60 × 2 = 120 km."
    }

],
};


// ========================================
// CREATE ALL QUESTIONS
// ========================================
const allQuestions = [];

for (const company of companies) {

    for (const role of roles) {

        for (const subject of Object.keys(questionBank)) {

            for (const item of questionBank[subject]) {

                allQuestions.push({
                    company: company,
                    role: role,
                    subject: subject,
                    topic: item.topic || subject,
                    question: item.question,
                    options: item.options,
                    answer: item.answer,
                    explanation: item.explanation,
                    type: "Practice"
                });

            }
        }
    }
}



// ========================================
// SAVE FILE
// ========================================

const outputFile = path.join(
    __dirname,
    "data",
    "topic-questions.json"
);

fs.writeFileSync(
    outputFile,
    JSON.stringify(allQuestions, null, 4)
);


// ========================================
// RESULT
// ========================================

console.log("========================================");
console.log("Topic questions created successfully!");
console.log("========================================");

console.log("Companies:", companies.length);
console.log("Roles:", roles.length);
console.log("Topics:", Object.keys(questionBank).length);
console.log("Questions per topic: 5");
console.log("Total questions:", allQuestions.length);

console.log("Output file:", outputFile);

console.log("========================================");