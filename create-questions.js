const fs = require("fs");

const companies = [
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Cognizant",
    "NatWest"
];

const banks = {

"Java Developer": [
["Java","Which keyword is used to create an object in Java?",["new","create","object","instance"],"new"],
["Java","Which keyword is used to inherit a class?",["extends","implements","inherits","super"],"extends"],
["Java","Which method is the entry point of a Java program?",["start()","run()","main()","execute()"],"main()"],
["Java","Which keyword refers to the current object?",["this","self","current","object"],"this"],
["Java","Which keyword prevents method overriding?",["final","static","private","constant"],"final"],
["OOP","Which concept hides implementation details?",["Abstraction","Inheritance","Compilation","Overloading"],"Abstraction"],
["OOP","Which concept allows a subclass to redefine a method?",["Overriding","Overloading","Encapsulation","Compilation"],"Overriding"],
["Collections","Which collection stores key-value pairs?",["HashMap","ArrayList","HashSet","LinkedList"],"HashMap"],
["Collections","Which collection does not allow duplicate elements?",["HashSet","ArrayList","LinkedList","Vector"],"HashSet"],
["Exception Handling","Which construct handles exceptions?",["try-catch","if-else","switch","for"],"try-catch"]
],

"Python Developer": [
["Python","Which keyword defines a function?",["def","func","function","define"],"def"],
["Python","Which type stores key-value pairs?",["List","Tuple","Dictionary","Set"],"Dictionary"],
["Python","Which collection is immutable?",["List","Tuple","Dictionary","Set"],"Tuple"],
["Python","Which keyword exits a loop?",["continue","pass","break","stop"],"break"],
["Python","Which method adds an item to a list?",["add()","append()","push()","insertEnd()"],"append()"],
["Python","Which keyword skips the current iteration?",["skip","pass","continue","break"],"continue"],
["Python","Which function converts a string to integer?",["str()","float()","int()","number()"],"int()"],
["Exception Handling","Which keyword handles exceptions?",["catch","except","error","handle"],"except"],
["Python","Which collection stores unique values?",["List","Tuple","Set","String"],"Set"],
["Python","Which keyword defines a class?",["class","struct","object","define"],"class"]
],

"Data Analyst": [
["SQL","Which function counts rows?",["COUNT()","SUM()","AVG()","MAX()"],"COUNT()"],
["SQL","Which clause filters rows?",["WHERE","GROUP BY","ORDER BY","HAVING"],"WHERE"],
["SQL","Which clause groups rows?",["GROUP BY","ORDER BY","WHERE","SELECT"],"GROUP BY"],
["SQL","Which clause sorts results?",["ORDER BY","GROUP BY","WHERE","HAVING"],"ORDER BY"],
["SQL","Which function calculates average?",["SUM()","AVG()","COUNT()","MAX()"],"AVG()"],
["DBMS","Which key uniquely identifies a record?",["Primary Key","Foreign Key","Candidate Key","Alternate Key"],"Primary Key"],
["DBMS","Which key connects two tables?",["Foreign Key","Primary Key","Super Key","Alternate Key"],"Foreign Key"],
["Excel","Which feature summarizes large datasets?",["PivotTable","WordArt","Spell Check","Page Layout"],"PivotTable"],
["Statistics","Which measure represents the middle value?",["Mean","Median","Mode","Range"],"Median"],
["Power BI","What is Power BI mainly used for?",["Data visualization","Video editing","Web browsing","Text editing"],"Data visualization"]
],

"Tester": [
["Testing","Which testing checks individual units?",["Unit Testing","System Testing","Acceptance Testing","Load Testing"],"Unit Testing"],
["Testing","Which testing is performed after software changes?",["Regression Testing","Load Testing","Security Testing","Usability Testing"],"Regression Testing"],
["Testing","Which testing checks performance under workload?",["Load Testing","Unit Testing","Smoke Testing","Acceptance Testing"],"Load Testing"],
["Testing","Which testing quickly checks build stability?",["Smoke Testing","Stress Testing","Unit Testing","Recovery Testing"],"Smoke Testing"],
["Testing","Which testing verifies business requirements?",["Acceptance Testing","Unit Testing","Load Testing","Mutation Testing"],"Acceptance Testing"],
["Testing","Which testing focuses on security vulnerabilities?",["Security Testing","Unit Testing","Smoke Testing","Regression Testing"],"Security Testing"],
["Testing","Which testing checks different browsers and operating systems?",["Compatibility Testing","Unit Testing","Stress Testing","Recovery Testing"],"Compatibility Testing"],
["Testing","Which testing checks recovery after failure?",["Recovery Testing","Unit Testing","Smoke Testing","Compatibility Testing"],"Recovery Testing"],
["Testing","Which testing verifies the complete system?",["System Testing","Unit Testing","Component Testing","Code Review"],"System Testing"],
["Testing","What is the main purpose of software testing?",["Find defects","Design hardware","Increase file size","Create operating systems"],"Find defects"]
],

"Software Developer": [
["DSA","Which data structure follows LIFO?",["Stack","Queue","Tree","Graph"],"Stack"],
["DSA","Which data structure follows FIFO?",["Queue","Stack","Tree","Heap"],"Queue"],
["Algorithms","What is binary search complexity?",["O(n)","O(log n)","O(n²)","O(1)"],"O(log n)"],
["Algorithms","Which sorting algorithm uses divide and conquer?",["Merge Sort","Bubble Sort","Selection Sort","Linear Search"],"Merge Sort"],
["OOP","Which concept hides implementation details?",["Abstraction","Inheritance","Encapsulation","Compilation"],"Abstraction"],
["OOP","Which concept allows a child class to acquire parent properties?",["Inheritance","Encapsulation","Abstraction","Compilation"],"Inheritance"],
["DSA","Which structure represents hierarchical data?",["Tree","Stack","Queue","Array"],"Tree"],
["Algorithms","Which search checks elements one by one?",["Linear Search","Binary Search","Merge Sort","Quick Sort"],"Linear Search"],
["DSA","Which structure is commonly used for priority queues?",["Heap","Stack","Array","Linked List"],"Heap"],
["Algorithms","What is the worst-case complexity of linear search?",["O(1)","O(log n)","O(n)","O(n log n)"],"O(n)"]
]
};

const questions = [];

for (const company of companies) {
    for (const role of Object.keys(banks)) {
        banks[role].forEach((q, index) => {
            questions.push({
                company: company,
                role: role,
                category: q[0],
                year: 2025,
                type: "Practice",
                question: q[1],
                options: q[2],
                answer: q[3]
            });
        });
    }
}

const dataFolder = __dirname + "/data";

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

fs.writeFileSync(
    dataFolder + "/questions.json",
    JSON.stringify(questions, null, 2)
);

console.log("Questions database created!");
console.log("Companies:", companies.length);
console.log("Roles:", Object.keys(banks).length);
console.log("Total Questions:", questions.length);