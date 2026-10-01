const { generateWithRetry } = require("./gemini-helper");

const fallbackQuestionsMap = {
    "Software Developer": [
        { question: "Which data structure operates on a Last In First Out (LIFO) basis?", options: ["Stack", "Queue", "Array", "Linked List"], answer: "Stack", explanation: "A stack is a linear data structure that stores items in a Last-In, First-Out (LIFO) manner." },
        { question: "What is the average time complexity of searching in a Hash Table?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: "O(1)", explanation: "With a good hash function, the average time complexity for Hash Table lookups is constant O(1)." },
        { question: "Which sorting algorithm has a worst-case time complexity of O(n log n)?", options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"], answer: "Merge Sort", explanation: "Merge Sort consistently splits the array in half and merges, guaranteeing O(n log n) even in the worst case." },
        { question: "What is the worst-case time complexity of searching in a binary search tree (BST)?", options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], answer: "O(N)", explanation: "If the binary search tree is highly skewed or unbalanced, searching degenerates into a sequential list traversal of O(N)." },
        { question: "Which algorithm is used to find the shortest path in a weighted graph with positive weights?", options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm"], answer: "Dijkstra's Algorithm", explanation: "Dijkstra's is the standard greedy algorithm designed for single-source shortest paths on positive-weighted graphs." },
        { question: "What state represents a process waiting for a CPU scheduler execution turn?", options: ["Ready", "Running", "Blocked", "Terminated"], answer: "Ready", explanation: "A process in the 'Ready' state is completely loaded in main memory and waiting for the CPU scheduler to allocate a core." },
        { question: "Which database anomaly occurs when a transaction reads uncommitted changes written by another transaction?", options: ["Dirty Read", "Non-Repeatable Read", "Phantom Read", "Lost Update"], answer: "Dirty Read", explanation: "A Dirty Read happens when isolation level is Read Uncommitted, letting a transaction see uncommitted records." },
        { question: "In the OSI model, which layer manages logical addressing and packet routing?", options: ["Network Layer", "Transport Layer", "Data Link Layer", "Physical Layer"], answer: "Network Layer", explanation: "The Network Layer handles IP addressing, routing tables, and routing packets between nodes." },
        { question: "Which pointer in C++ automatically deallocates memory when it goes out of scope?", options: ["unique_ptr", "shared_ptr", "weak_ptr", "raw pointer"], answer: "unique_ptr", explanation: "A unique_ptr owns a heap object exclusively and destroys it automatically upon leaving scope." },
        { question: "Which scheduling algorithm can lead to starvation of low-priority processes?", options: ["Priority Scheduling", "Round Robin", "First Come First Served", "Shortest Job First only"], answer: "Priority Scheduling", explanation: "Priority scheduling can starve lower-priority tasks indefinitely if higher-priority tasks continuously arrive." }
    ],
    "Frontend Developer": [
        { question: "Which of the following CSS display properties creates a flex container?", options: ["flex", "block-flex", "grid", "inline-grid"], answer: "flex", explanation: "`display: flex;` initializes the flexbox layout context on the element." },
        { question: "In modern JavaScript, what is the scope of a variable declared with 'const'?", options: ["Block scope", "Function scope", "Global scope", "Lexical scope only"], answer: "Block scope", explanation: "Both `let` and `const` variables are block-scoped (restricted to the enclosing `{}`)." },
        { question: "Which HTTP header is commonly configured to resolve CORS issues?", options: ["Access-Control-Allow-Origin", "Content-Security-Policy", "Authorization", "X-Frame-Options"], answer: "Access-Control-Allow-Origin", explanation: "This header specifies which web origins are permitted to access the server's response." },
        { question: "What is the correct syntax to style all paragraph elements inside a div using a CSS descendant selector?", options: ["div p", "div > p", "div + p", "div ~ p"], answer: "div p", explanation: "A space character represents the descendant selector, targeting all paragraphs nested anywhere inside divs." },
        { question: "Which hook is used to trigger asynchronous side-effects in React?", options: ["useEffect", "useState", "useMemo", "useContext"], answer: "useEffect", explanation: "The `useEffect` hook triggers side effects such as data fetching, subscriptions, and DOM updates." },
        { question: "What is the purpose of 'useCallback' in React?", options: ["Memoize functions", "Memoize values", "Set local state", "Fetch remote APIs"], answer: "Memoize functions", explanation: "The `useCallback` hook memoizes a function reference, preventing unnecessary renders on child components." },
        { question: "Which DOM method is used to retrieve an element by its ID?", options: ["getElementById", "querySelector", "getElementsByClassName", "querySelectorAll"], answer: "getElementById", explanation: "`document.getElementById('id')` is the fastest standard DOM accessor for single unique IDs." },
        { question: "What does the 'npm' command do?", options: ["Manages packages", "Compiles JavaScript", "Renders templates", "Hosts local servers"], answer: "Manages packages", explanation: "Node Package Manager (npm) is the standard registry and package manager for JavaScript Node ecosystems." },
        { question: "Which HTML5 tag is used to embed vector graphics directly?", options: ["svg", "canvas", "img", "iframe"], answer: "svg", explanation: "The `<svg>` tag defines vector-based graphics directly within the HTML page without external file loaders." },
        { question: "Which JavaScript array method creates a new array with all elements that pass a test?", options: ["filter", "map", "forEach", "reduce"], answer: "filter", explanation: "The `filter` method returns a new array containing only elements that return true for the callback test." }
    ],
    "Backend Developer": [
        { question: "Which HTTP status code represents a successful resource creation?", options: ["201 Created", "200 OK", "301 Moved Permanently", "400 Bad Request"], answer: "201 Created", explanation: "201 indicates that the request succeeded and led to the creation of a new resource." },
        { question: "Which SQL clause is used to filter records after aggregation?", options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"], answer: "HAVING", explanation: "The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions." },
        { question: "What is the purpose of database indexes?", options: ["Speed up data retrieval", "Encrypt stored data", "Enforce foreign keys", "Reduce database size"], answer: "Speed up data retrieval", explanation: "Indexes are auxiliary data structures (like B-trees) built to search records extremely fast." },
        { question: "Which architectural style uses Protocol Buffers and runs over HTTP/2?", options: ["gRPC", "REST", "GraphQL", "SOAP"], answer: "gRPC", explanation: "gRPC uses Protocol Buffers for binary payload serialization and HTTP/2 for low-latency streaming." },
        { question: "What does a 403 Forbidden status code signify?", options: ["Unauthorized access", "Page not found", "Server error", "Payload too large"], answer: "Unauthorized access", explanation: "A 403 status code means the server understands the client credentials but refuses access permission." },
        { question: "Which cache strategy writes data directly to both the cache and the database concurrently?", options: ["Write-Through", "Cache-Aside", "Write-Behind", "Read-Through"], answer: "Write-Through", explanation: "Write-Through writes to cache and the underlying database concurrently, ensuring maximum data consistency." },
        { question: "What is the primary role of a Load Balancer?", options: ["Distribute network traffic", "Store cached images", "Compile backend source code", "Manage DB replicas"], answer: "Distribute network traffic", explanation: "A Load Balancer distributes incoming web requests to multiple backend server instances." },
        { question: "Which database normal form ensures that no non-key column is transitively dependent on the primary key?", options: ["Third Normal Form (3NF)", "First Normal Form (1NF)", "Second Normal Form (2NF)", "BCNF"], answer: "Third Normal Form (3NF)", explanation: "3NF requires a table is in 2NF and has no transitive dependencies (non-prime columns depending on other non-prime columns)." },
        { question: "Which HTTP method is idempotent and used to replace an entire resource payload?", options: ["PUT", "POST", "PATCH", "DELETE only"], answer: "PUT", explanation: "PUT requests are idempotent; executing multiple identical PUT calls yields the same state." },
        { question: "What is a major symptom of a SQL database connection pool exhaustion?", options: ["API request timeout", "Database file corruption", "SSL handshake failure", "Data replication drift"], answer: "API request timeout", explanation: "When the connection pool is empty, threads block waiting for connections, leading to API timeouts." }
    ],
    "Full Stack Developer": [
        { question: "Which authentication mechanism is stateless and self-contained?", options: ["JWT (JSON Web Token)", "Session-based auth", "HTTP Basic auth", "OAuth redirect flow"], answer: "JWT (JSON Web Token)", explanation: "JWTs carry signed payloads that servers verify stateless-ly without storing sessions." },
        { question: "What is the main benefit of Single Page Applications (SPAs) over Multi-Page Apps?", options: ["Smoother fluid transitions", "Faster initial load", "Better SEO out of the box", "Lower client-side memory"], answer: "Smoother fluid transitions", explanation: "SPAs rewrite the current page dynamically rather than reloading entire pages from the server." },
        { question: "Which tool is commonly used to cache frequently queried database results?", options: ["Redis", "Elasticsearch", "RabbitMQ", "Apache Spark"], answer: "Redis", explanation: "Redis is an in-memory key-value data structure store used as a high-speed cache database." },
        { question: "What browser setting prevents frontend scripts from reading sensitive session cookies?", options: ["HttpOnly flag", "Secure flag", "SameSite attribute", "CORS policy"], answer: "HttpOnly flag", explanation: "The `HttpOnly` cookie flag blocks client-side JavaScript access, neutralizing XSS session thefts." },
        { question: "What format does a standard JSON-RPC or REST payload utilize?", options: ["Text", "XML only", "Binary", "JSON text format"], answer: "JSON text format", explanation: "REST APIs predominantly transfer structured human-readable text in JSON format." },
        { question: "Which design pattern is best for sending events to multiple subscribers asynchronously?", options: ["Observer Pattern", "Singleton Pattern", "Factory Pattern", "Adapter Pattern"], answer: "Observer Pattern", explanation: "The Observer pattern (Pub-Sub) is ideal for notifying multiple subscriber objects dynamically." },
        { question: "What is the primary role of a Service Worker in a PWA?", options: ["Intercept network requests", "Style user interfaces", "Manage database structures", "Compile TypeScript code"], answer: "Intercept network requests", explanation: "Service Workers act as network proxies, caching assets to enable offline and push capabilities." },
        { question: "Which database model is characterized by a schema-less, document-oriented structure?", options: ["MongoDB", "PostgreSQL", "MySQL", "Oracle"], answer: "MongoDB", explanation: "MongoDB is a NoSQL document database that stores records in flexible, schema-free JSON-like formats." },
        { question: "Which tool executes automated browser tests for web applications?", options: ["Playwright", "Webpack", "Docker", "GitLab"], answer: "Playwright", explanation: "Playwright is a modern end-to-end testing library that automates Chromium, Firefox, and WebKit." },
        { question: "What is the purpose of Docker?", options: ["Containerize applications", "Manage database clusters", "Compile Java bytecode", "Encrypt web traffic"], answer: "Containerize applications", explanation: "Docker packages code and dependencies into standard containers that run identically across any host." }
    ],
    "Java Developer": [
        { question: "Which collection in Java does not allow duplicate elements?", options: ["HashSet", "ArrayList", "LinkedList", "Vector"], answer: "HashSet", explanation: "HashSet implements the Set interface, which stores only unique elements." },
        { question: "Which keyword is used to prevent method overriding in Java?", options: ["final", "static", "private", "abstract"], answer: "final", explanation: "A final method cannot be overridden by subclasses." },
        { question: "Which memory area stores Java objects?", options: ["Heap memory", "Stack memory", "Method area", "Native method stack"], answer: "Heap memory", explanation: "All class instances and arrays in Java are allocated in the heap." },
        { question: "Which collection is fully synchronized and thread-safe by default?", options: ["Vector", "ArrayList", "HashMap", "HashSet"], answer: "Vector", explanation: "Vector is a legacy synchronized array list, making all its modification methods thread-safe." },
        { question: "What is the parent class of all exceptions and errors in Java?", options: ["Throwable", "Exception", "Error", "RuntimeException"], answer: "Throwable", explanation: "The `java.lang.Throwable` class is the ultimate superclass of all Exception and Error classes in Java." },
        { question: "Which Java 8 feature allows pipelines of operations on collections?", options: ["Streams API", "Lambdas", "Optional Class", "Default Methods"], answer: "Streams API", explanation: "The Streams API supports declarative, functional-style transformation pipelines on collections." },
        { question: "What happens if you run 'System.gc()' in Java code?", options: ["Requests GC execution", "Forces instant GC cleanup", "Clears stack memory", "Destroys JVM instance"], answer: "Requests GC execution", explanation: "Calling System.gc() only suggests or requests GC execution; the JVM makes the final decision when to run it." },
        { question: "Which keyword allows checking if a class is an instance of a specific type?", options: ["instanceof", "isinstance", "typeof", "extends"], answer: "instanceof", explanation: "The `instanceof` binary operator compares an object reference against a target type, returning a boolean." },
        { question: "What is the default value of an uninitialized boolean instance variable?", options: ["false", "true", "null", "0"], answer: "false", explanation: "In Java, boolean instance variables are automatically initialized to a default value of `false`." },
        { question: "Which collection supports key-value maps with sorted, ordered keys?", options: ["TreeMap", "HashMap", "LinkedHashMap", "Hashtable"], answer: "TreeMap", explanation: "TreeMap implements the SortedMap interface, keeping keys sorted using their natural order or custom Comparators." }
    ],
    "Python Developer": [
        { question: "Which built-in Python data type is immutable?", options: ["Tuple", "List", "Dictionary", "Set"], answer: "Tuple", explanation: "Tuples are immutable sequences; their values cannot be changed after creation." },
        { question: "Which keyword is used to return a generator in Python?", options: ["yield", "return", "lambda", "global"], answer: "yield", explanation: "The `yield` statement suspends function execution and returns a generator iterator." },
        { question: "What is the output of 'print(type([]))' in Python?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], answer: "<class 'list'>", explanation: "Square brackets `[]` initialize a list object in Python." },
        { question: "Which built-in Python function is used to get the number of items in a list?", options: ["len()", "count()", "size()", "length()"], answer: "len()", explanation: "The `len()` function returns the length (item count) of any sequence or collection." },
        { question: "How is an exception handled in Python?", options: ["try-except", "try-catch", "throw-catch", "try-finally only"], answer: "try-except", explanation: "Python uses `try` and `except` keywords to capture and process script runtime errors." },
        { question: "What does list comprehensions return?", options: ["A list", "A generator", "A tuple", "None"], answer: "A list", explanation: "List comprehensions `[x for x in iterable]` instantly compute and return a compiled list." },
        { question: "Which function converts a JSON string into a Python dictionary?", options: ["json.loads()", "json.dumps()", "json.load()", "json.dump()"], answer: "json.loads()", explanation: "The `json.loads()` (load string) deserializes a JSON-formatted string into a matching Python dict." },
        { question: "Which operator is used to unpack elements of lists or tuples into function arguments?", options: ["*", "**", "&", "unpack"], answer: "*", explanation: "The single asterisk `*` operator unpacks sequence elements; double asterisks `**` unpack dictionaries." },
        { question: "What keyword is used to declare a small anonymous inline function in Python?", options: ["lambda", "def", "func", "anonymous"], answer: "lambda", explanation: "The `lambda` keyword declares small, one-line anonymous functions without full block definitions." },
        { question: "Which library is used to perform high-performance array operations in Python?", options: ["NumPy", "Pandas", "Scikit-Learn", "Matplotlib"], answer: "NumPy", explanation: "NumPy is the core scientific computation library providing multi-dimensional C-optimized array structures." }
    ],
    "Data Analyst": [
        { question: "Which Excel tool is best suited for summarizing and grouping large tables?", options: ["Pivot Table", "VLOOKUP", "Conditional Formatting", "Data Validation"], answer: "Pivot Table", explanation: "Pivot Tables allow rapid grouping, summation, and cross-tabulation of dataset records." },
        { question: "Which SQL function is used to calculate the average value of a numeric column?", options: ["AVG()", "MEAN()", "SUM() / COUNT() only", "MEDIAN()"], answer: "AVG()", explanation: "The AVG() aggregate function returns the average value of a numeric column." },
        { question: "What does a correlation coefficient of -1 indicate?", options: ["Perfect negative relationship", "No relationship", "Perfect positive relationship", "High data skew"], answer: "Perfect negative relationship", explanation: "An 'r' of -1 represents a perfect negative linear correlation (as one variable rises, the other falls proportionally)." },
        { question: "Which Pandas method is used to merge two DataFrames on a key column?", options: ["merge()", "concat()", "join() only", "combine()"], answer: "merge()", explanation: "The `pd.merge()` method performs database-style SQL join operations on target key columns." },
        { question: "Which chart is best suited for displaying the distribution of a single continuous variable?", options: ["Histogram", "Bar Chart", "Line Chart", "Scatter Plot"], answer: "Histogram", explanation: "Histograms group continuous data into bin ranges, visually displaying the distribution frequency." },
        { question: "What does 'dirty data' refer to in data analysis?", options: ["Data with errors/outliers", "Encrypted files", "Database tables with joins", "Data stored in NoSQL formats"], answer: "Data with errors/outliers", explanation: "Dirty data refers to raw, uncleaned data containing formatting anomalies, missing values, or duplicate records." },
        { question: "What is the purpose of the SQL GROUP BY clause?", options: ["Aggregate rows", "Filter rows by value", "Sort rows alphabetically", "Join distinct tables"], answer: "Aggregate rows", explanation: "GROUP BY summarizes rows with identical values into single summary aggregate rows (using SUM, AVG)." },
        { question: "Which metric represents the middle value in a sorted distribution?", options: ["Median", "Mean", "Mode", "Standard Deviation"], answer: "Median", explanation: "The Median is the middle data point when values are sorted, making it robust against extreme outlier skew." },
        { question: "What is the purpose of data visualization?", options: ["Present trends visually", "Store relational tables", "Optimize SQL queries", "Encrypt user passwords"], answer: "Present trends visually", explanation: "Data visualization converts complex datasets into intuitive charts to reveal patterns and insights." },
        { question: "Which SQL statement is used to remove duplicate rows from a select query result?", options: ["SELECT DISTINCT", "SELECT UNIQUE", "GROUP BY only", "DELETE DUPLICATES"], answer: "SELECT DISTINCT", explanation: "The `DISTINCT` keyword filters query output to include only unique row combinations." }
    ],
    "Data Scientist": [
        { question: "In binary classification, what does an ROC Area Under Curve (AUC) of 0.5 represent?", options: ["Random guessing", "Perfect classification", "Terrible classification", "High model variance"], answer: "Random guessing", explanation: "An AUC of 0.5 means the classifier performs no better than random coin flips." },
        { question: "What problem does L1 (Lasso) regularization solve that L2 (Ridge) does not?", options: ["Feature selection", "Gradient explosion", "Multi-collinearity", "Data imbalance"], answer: "Feature selection", explanation: "L1 regularization drives coefficients of non-essential features completely to zero, performing automatic feature selection." },
        { question: "Which probability distribution represents occurrences of independent events within fixed intervals?", options: ["Poisson Distribution", "Normal Distribution", "Binomial Distribution", "Exponential Distribution"], answer: "Poisson Distribution", explanation: "The Poisson distribution models the count of independent events occurring in fixed time/space intervals." },
        { question: "What is the F1-score?", options: ["Harmonic mean of precision and recall", "Simple average of precision and recall", "Geometric mean of precision and recall", "Ratio of true positives to true negatives"], answer: "Harmonic mean of precision and recall", explanation: "F1-score is the harmonic mean of precision and recall, balancing both metrics on skewed classes." },
        { question: "What statistical test evaluates differences between means of three or more groups?", options: ["ANOVA test", "T-test", "Chi-Square test", "Z-test"], answer: "ANOVA test", explanation: "Analysis of Variance (ANOVA) is the standard parametric test evaluating mean differences across 3+ groups." },
        { question: "What is the main objective of Principal Component Analysis (PCA)?", options: ["Dimensionality reduction", "Supervised classification", "Database indexing", "Clustering similar labels"], answer: "Dimensionality reduction", explanation: "PCA is an unsupervised technique that projects features into principal components, reducing dimension count." },
        { question: "What represents the probability of rejecting the null hypothesis when it is actually true?", options: ["Type I Error (Alpha)", "Type II Error (Beta)", "Power of Test", "Confidence Interval"], answer: "Type I Error (Alpha)", explanation: "Type I error represents a false positive: rejecting a true null hypothesis." },
        { question: "Which metric is less sensitive to outliers in regression models?", options: ["Mean Absolute Error (MAE)", "Mean Squared Error (MSE)", "R-Squared", "Root Mean Squared Error (RMSE)"], answer: "Mean Absolute Error (MAE)", explanation: "MAE averages absolute errors linearly, unlike MSE which squares errors, amplifying outlier impacts." },
        { question: "What unsupervised algorithm partitions datasets into 'k' distinct clusters?", options: ["K-Means Clustering", "K-Nearest Neighbors", "Logistic Regression", "Support Vector Machines"], answer: "K-Means Clustering", explanation: "K-Means is a classic unsupervised algorithm that groups records into K clusters using centroid distances." },
        { question: "What does the term 'multicollinearity' refer to in linear regression?", options: ["Highly correlated predictors", "High residual variance", "Imbalanced target classes", "Non-linear data targets"], answer: "Highly correlated predictors", explanation: "Multicollinearity represents high correlation between predictor variables, destabilizing regression coefficients." }
    ],
    "Machine Learning Engineer": [
        { question: "What is the primary objective of a loss function in training neural networks?", options: ["Measure error of predictions", "Initialize weight values", "Normalize input matrices", "Accelerate forward pass"], answer: "Measure error of predictions", explanation: "Loss functions calculate the difference between predicted and actual labels, guiding optimizer updates." },
        { question: "Which activation function is commonly used to prevent vanishing gradients in deep networks?", options: ["ReLU", "Sigmoid", "Tanh", "Linear"], answer: "ReLU", explanation: "ReLU retains constant gradient for positive inputs, minimizing vanishing gradient issues common to Sigmoid/Tanh." },
        { question: "What represents the mathematical query-key attention matrix calculation in Transformers?", options: ["Softmax(QKᵀ / √d_k)V", "Softmax(QVᵀ)K", "Sigmoid(QK)V", "Softmax(KVᵀ)Q"], answer: "Softmax(QKᵀ / √d_k)V", explanation: "This is the core scaled dot-product attention formula formulated in the attention-is-all-you-need paper." },
        { question: "Which optimization algorithm uses first and second moments of gradients dynamically?", options: ["Adam", "SGD with Momentum", "Adagrad", "RMSprop only"], answer: "Adam", explanation: "Adam (Adaptive Moment Estimation) dynamically adjusts learning rates using running averages of gradients and squared gradients." },
        { question: "What is the purpose of Dropout in neural networks?", options: ["Prevent overfitting", "Accelerate forward pass", "Initialize weight matrices", "Force faster learning rates"], answer: "Prevent overfitting", explanation: "Dropout randomly deactivates neural units during training cycles, preventing co-adaptation and overfitting." },
        { question: "Which network layer scales values across a batch to mean 0 and variance 1?", options: ["Batch Normalization", "Layer Normalization", "Softmax Layer", "Fully Connected Layer"], answer: "Batch Normalization", explanation: "Batch Normalization normalizes activations across the mini-batch, accelerating and stabilizing network training." },
        { question: "What parameter dictates the step size taken towards local minima in gradient descent?", options: ["Learning Rate", "Batch Size", "Epoch Count", "Weight Decay"], answer: "Learning Rate", explanation: "The learning rate (alpha) controls the size of weight updates during gradient descent steps." },
        { question: "Which neural network architecture is optimal for processing spatial grid images?", options: ["CNN (Convolutional)", "RNN (Recurrent)", "Transformer", "Perceptron only"], answer: "CNN (Convolutional)", explanation: "CNNs utilize local receptive fields and weight sharing, making them highly efficient for grid-like image matrices." },
        { question: "What represents data leakage in training validation pipelines?", options: ["Contaminating train set with test details", "Server logs leaking user IDs", "Memory leaks in GPUs", "Loss of training records"], answer: "Contaminating train set with test details", explanation: "Contamination occurs when test target information is leaked into features during training phases." },
        { question: "What is model pruning in deep learning optimization?", options: ["Removing non-essential connections", "Pruning dataset records", "Deleting intermediate layers", "Reducing precision to INT8"], answer: "Removing non-essential connections", explanation: "Pruning zeroes out low-weight synaptic connections, reducing model complexity without losing accuracy." }
    ],
    "DevOps Engineer": [
        { question: "Which tool is primarily designed for defining Infrastructure as Code (IaC)?", options: ["Terraform", "Docker", "Jenkins", "Kubernetes"], answer: "Terraform", explanation: "Terraform allows developers to declare cloud resources in declarative HCL files." },
        { question: "What is the smallest deployable unit of execution in Kubernetes?", options: ["Pod", "Container", "Service", "Node"], answer: "Pod", explanation: "A Pod represents a single instance of a running process in Kubernetes, holding one or more containers." },
        { question: "Which model uses Git as the single source of truth for deployment state configurations?", options: ["GitOps", "Agile Scrum", "Monolithic CI", "Serverless Deployment"], answer: "GitOps", explanation: "GitOps manages declarative infrastructure configurations with Git as the centralized source of truth." },
        { question: "What is the main goal of a continuous integration (CI) pipeline?", options: ["Validate and compile code automatically", "Host production websites", "Generate security SSH keys", "Backup relational databases"], answer: "Validate and compile code automatically", explanation: "CI pipelines automatically build, compile, and run test suites on every commit, catching bugs early." },
        { question: "Which deployment strategy switches all public traffic from a v1 environment to an identical v2 environment instantly?", options: ["Blue-Green", "Rolling Update", "Canary Deployment", "Recreate Strategy"], answer: "Blue-Green", explanation: "Blue-Green keeps two identical environments, toggling router mappings instantly to route traffic with zero downtime." },
        { question: "Which tool collects and stores time-series metric logs in production clusters?", options: ["Prometheus", "Grafana", "Kubernetes", "Ansible"], answer: "Prometheus", explanation: "Prometheus is a time-series monitoring system designed to pull and store numerical performance metrics." },
        { question: "Which HTTP header is commonly set by reverse proxies to identify the original client IP?", options: ["X-Forwarded-For", "Authorization", "Host Header", "User-Agent"], answer: "X-Forwarded-For", explanation: "The `X-Forwarded-For` header logs the client IP passing through proxy load balancers." },
        { question: "What is the purpose of Helm in Kubernetes?", options: ["Package manager", "Container engine", "Virtual private network", "Secure key storage"], answer: "Package manager", explanation: "Helm is the de-facto package manager for Kubernetes, packaging manifests into standardized Helm Charts." },
        { question: "Which mechanism isolates Linux container resources (CPU, Memory) at the OS kernel level?", options: ["cgroups", "Namespaces", "Hypervisor", "SSH Tunnel"], answer: "cgroups", explanation: "Control Groups (cgroups) isolate and restrict resource usage; namespaces isolate visibility namespaces (process tree, networking)." },
        { question: "What does 'configuration drift' refer to?", options: ["Manual out-of-sync server edits", "Moving servers to another region", "Data loss during backups", "Varying API payloads"], answer: "Manual out-of-sync server edits", explanation: "Configuration drift represents ad-hoc, untracked changes made manually on servers, making environments inconsistent." }
    ],
    "Cloud Solutions Architect": [
        { question: "Which cloud service offers globally distributed content delivery?", options: ["CDN", "VPC", "Virtual Machine", "Object Storage"], answer: "CDN", explanation: "CDNs replicate static and cached content across edge nodes situated near user locations." },
        { question: "What does high availability guarantee in cloud infrastructure?", options: ["Minimal application downtime", "Fastest database read-writes", "Lowest storage pricing", "Complete security from cyber attacks"], answer: "Minimal application downtime", explanation: "High availability (HA) ensures systems remain reachable even during localized infrastructure failures." },
        { question: "What computing model runs code on-demand without managing host OS servers?", options: ["Serverless (FaaS)", "IaaS (Virtual Machines)", "PaaS (Beanstalk)", "SaaS (Office 365)"], answer: "Serverless (FaaS)", explanation: "Serverless (e.g. AWS Lambda) runs code in transient containers on demand, automatically managed by cloud providers." },
        { question: "Which cloud structure isolates private databases from public internet entry points?", options: ["Private Subnet", "Internet Gateway", "Public Subnet", "Route Table only"], answer: "Private Subnet", explanation: "Private subnets have no direct route to public internet gateways, keeping databases isolated." },
        { question: "What model splits regional cloud resources across physically separate data center zones?", options: ["Multi-AZ", "Multi-Region", "Hybrid Cloud", "Distributed CDN"], answer: "Multi-AZ", explanation: "Multi-AZ (Availability Zone) replicates resources across isolated physical data centers to prevent regional outages." },
        { question: "What represents the target metric of maximum acceptable data loss during disaster recovery?", options: ["Recovery Point Objective (RPO)", "Recovery Time Objective (RTO)", "SLA standard percentage", "MTTR indicator"], answer: "Recovery Point Objective (RPO)", explanation: "RPO measures acceptable data loss thresholds calculated in hours/days of lost transaction history." },
        { question: "Which AWS service is an elastic, serverless object storage bucket?", options: ["S3", "EBS", "RDS", "EC2"], answer: "S3", explanation: "Amazon S3 (Simple Storage Service) is the standard serverless flat object storage bucket." },
        { question: "In public cloud security, what is the client's responsibility?", options: ["Managing OS guest patching & access rules", "Securing physical host server frames", "Managing physical power grids", "Updating hypervisor software"], answer: "Managing OS guest patching & access rules", explanation: "According to the Shared Responsibility Model, clients manage OS configurations, guest software, and credentials." },
        { question: "Which load balancer operates at Layer 7 of the OSI model?", options: ["Application Load Balancer", "Network Load Balancer", "Gateway Load Balancer", "Classic Load Balancer only"], answer: "Application Load Balancer", explanation: "Application Load Balancers (ALB) operate at Layer 7, supporting path-based and cookie-based routing." },
        { question: "How can you instantly lower costs for VM instances running constant workloads for 3+ years?", options: ["Purchase Reserved Instances", "Use spot instances only", "Scale down RAM to minimum", "Replicate resources to Multi-AZ"], answer: "Purchase Reserved Instances", explanation: "Reserved Instances offer steep discounts (up to 72%) in exchange for committing to stable, long-term cloud usage." }
    ],
    "Cyber Security Analyst": [
        { question: "Which attack injects malicious scripts into trusted websites to execute on clients?", options: ["Cross-Site Scripting (XSS)", "SQL Injection", "Distributed Denial of Service (DDoS)", "Buffer Overflow"], answer: "Cross-Site Scripting (XSS)", explanation: "XSS occurs when malicious client-side scripts are injected into web pages and executed." },
        { question: "What does 'salting' represent in secure password storage?", options: ["Appending random bytes to passwords", "Applying double hash functions", "Splitting passwords across DB instances", "Compressing password files"], answer: "Appending random bytes to passwords", explanation: "Salting appends unique random data to inputs prior to hashing, neutralizing dictionary and rainbow-table attacks." },
        { question: "Which cryptographic algorithm relies on a private-public key pair?", options: ["Asymmetric (RSA)", "Symmetric (AES)", "Hashing (SHA-256)", "Salting MD5"], answer: "Asymmetric (RSA)", explanation: "Asymmetric cryptography (such as RSA) uses a mathematically linked public-private key pair." },
        { question: "What security model treats all users and requests as untrusted, regardless of location?", options: ["Zero Trust", "Perimeter Model", "DMZ Zone Setup", "Intranet Security"], answer: "Zero Trust", explanation: "Zero Trust operates on the principle of 'never trust, always verify', continuously validating every query." },
        { question: "What is the primary target of a SQL Injection (SQLi) attack?", options: ["Database backend engine", "Web page stylesheets", "Client browser cookies", "Network DNS routing tables"], answer: "Database backend engine", explanation: "SQLi injects malicious SQL statements into entry inputs to bypass, leak, or destroy database records." },
        { question: "Which security headers instruct browsers to only load site resources over HTTPS?", options: ["Strict-Transport-Security (HSTS)", "Content-Security-Policy (CSP)", "X-Frame-Options", "Access-Control-Allow-Origin"], answer: "Strict-Transport-Security (HSTS)", explanation: "HSTS forces browsers to load connections exclusively using secure HTTPS, blocking downgrade attacks." },
        { question: "Which port is standard for secure web traffic over HTTPS?", options: ["443", "80", "22", "8080"], answer: "443", explanation: "Port 443 handles secure SSL/TLS encrypted web traffic (HTTPS); port 80 handles unsecured HTTP." },
        { question: "What represents a Type I Error in security system detection alarms?", options: ["False Positive", "False Negative", "True Positive", "True Negative"], answer: "False Positive", explanation: "A Type I error is a False Positive: flagging normal, benign traffic as malicious activity." },
        { question: "What attack utilizes multiple infected botnets to crash online web servers?", options: ["DDoS (Distributed Denial of Service)", "Phishing", "Man-in-the-Middle (MITM)", "SQL Injection"], answer: "DDoS (Distributed Denial of Service)", explanation: "DDoS floods target servers with massive traffic spikes from thousands of infected devices (botnets), forcing them offline." },
        { question: "What is the role of salt in bcrypt password hashing?", options: ["Make hashes unique per password", "Speed up hash calculation", "Enforce length boundaries", "Encrypt password in transit"], answer: "Make hashes unique per password", explanation: "Salt guarantees that even if two users share the same password, they will yield completely unique storage hashes." }
    ],
    "QA Automation Engineer": [
        { question: "Which testing phase validates that separate modules operate correctly when combined?", options: ["Integration Testing", "Unit Testing", "System Testing", "Acceptance Testing"], answer: "Integration Testing", explanation: "Integration testing verifies interaction interfaces and data communication between combined program modules." },
        { question: "What annotation is used to designate a setup method that runs before every test in JUnit?", options: ["@BeforeEach", "@Test", "@BeforeAll", "@Setup"], answer: "@BeforeEach", explanation: "The JUnit `@BeforeEach` annotation executes the decorated method prior to launching each test case." },
        { question: "What is regression testing?", options: ["Verifying updates did not break existing features", "Running code checks on compilers", "Testing system performance load limits", "Conducting user usability panels"], answer: "Verifying updates did not break existing features", explanation: "Regression testing re-runs test suites on code bases to ensure recent updates did not degrade old stable pathways." },
        { question: "Which testing model evaluates a compiled system end-to-end without inspecting internal source code?", options: ["Black-box Testing", "White-box Testing", "Grey-box Testing", "Unit Testing"], answer: "Black-box Testing", explanation: "Black-box testing verifies functional capabilities strictly through input-output behavior, with no knowledge of internal code code." },
        { question: "Which automation selector locates elements precisely using XML-like structure paths?", options: ["XPath", "CSS Selector", "ID Selector", "Class Selector"], answer: "XPath", explanation: "XPath (XML Path Language) traverses the DOM structure recursively to query and target elements precisely." },
        { question: "What testing framework uses plain text Gherkin scripts (Given-When-Then)?", options: ["Cucumber", "JUnit", "Jest", "Selenium"], answer: "Cucumber", explanation: "Cucumber is a de-facto BDD framework executing automated tests mapped to Gherkin natural language specs." },
        { question: "What represents mock stubbing?", options: ["Providing hardcoded responses from dependencies", "Asserting exact call counts", "Timing execution speeds", "Tracing thread allocations"], answer: "Providing hardcoded responses from dependencies", explanation: "Stubbing replaces external API or database calls with simple, stable hardcoded return variables." },
        { question: "Which test verifies that the system operates correctly under extreme concurrent load volumes?", options: ["Load Testing", "Sanity Testing", "Regression Testing", "Unit Testing"], answer: "Load Testing", explanation: "Load testing measures system behavior, throughput, and error rates under heavy simulated concurrent user traffic." },
        { question: "Which hook executes cleanup methods after completing all tests in Jest?", options: ["afterAll", "afterEach", "beforeAll", "clearAll"], answer: "afterAll", explanation: "The `afterAll` hook runs a single teardown function after all tests inside the current file complete execution." },
        { question: "What is the purpose of dynamic explicit waits in UI testing?", options: ["Wait for specific element states dynamically", "Pause threads for a fixed duration", "Slow down test execution speed", "Manage database transaction pools"], answer: "Wait for specific element states dynamically", explanation: "Explicit waits pause test threads dynamically until targeted elements satisfy explicit states (like visibility), maximizing speed." }
    ],
    "Product Manager": [
        { question: "What does the 'R' stand for in the RICE feature prioritization framework?", options: ["Reach", "Revenue", "Retention", "ROI"], answer: "Reach", explanation: "RICE features stand for Reach (number of users affected in a time period), Impact, Confidence, and Effort." },
        { question: "What is the main focus of user persona creation in product management?", options: ["Identifying target user needs", "Writing technical API specs", "Calculating monthly developer budgets", "Designing database layout diagrams"], answer: "Identifying target user needs", explanation: "User personas represent fictional profiles of target customers, helping coordinate design work to fit customer needs." },
        { question: "What represents an MVP (Minimum Viable Product)?", options: ["The simplest product to validate learning", "A half-baked draft of features", "A low-cost marketing website", "The final polished enterprise version"], answer: "The simplest product to validate learning", explanation: "An MVP is the simplest execution version that allows collecting maximum validated user learning with minimum effort." },
        { question: "Which metric tracks the percentage of users who stop subscribing or using an app?", options: ["Churn Rate", "Retention Rate", "NPS Score", "Conversion Rate"], answer: "Churn Rate", explanation: "Churn rate measures user loss: the percentage of active accounts cancelled over a defined period." },
        { question: "What represents the 'Sean Ellis' survey question threshold for validating Product-Market Fit?", options: [">= 40% answering 'very disappointed'", ">= 10% answering 'not disappointed'", ">= 90% positive reviews", ">= 50% Net Promoter Score"], answer: ">= 40% answering 'very disappointed'", explanation: "PMF is strong if at least 40% of surveyed customers answer they would be 'very disappointed' if the product vanished." },
        { question: "Which framework categorizes product requirements into Must, Should, Could, and Won't?", options: ["MoSCoW", "RICE", "Kano Model", "OKRs"], answer: "MoSCoW", explanation: "MoSCoW is a prioritization framework grouping features into Must have, Should have, Could have, and Won't have." },
        { question: "What does NPS stand for in customer satisfaction metrics?", options: ["Net Promoter Score", "Net Product Success", "New Product Standard", "Network Performance Scale"], answer: "Net Promoter Score", explanation: "Net Promoter Score (NPS) measures user loyalty based on customer recommendations." },
        { question: "What Agile Scrum role is responsible for curating and prioritizing user stories in the backlog?", options: ["Product Owner", "Scrum Master", "Engineering Lead", "UX Researcher"], answer: "Product Owner", explanation: "The Product Owner owns the backlog, organizing and prioritizing stories to optimize delivered sprint value." },
        { question: "What represents a leading indicator metric?", options: ["An early signal predicting future outcomes", "Historical consolidated data records", "Total revenue generated last year", "Consolidated monthly churn totals"], answer: "An early signal predicting future outcomes", explanation: "Leading indicators (e.g. daily active users) provide early signals predicting lagging outcomes (e.g. monthly revenue)." },
        { question: "What metric calculates the total net value generated by a single customer over their lifespan?", options: ["Customer Lifetime Value (LTV)", "Customer Acquisition Cost (CAC)", "Average Revenue Per User (ARPU)", "Return on Ad Spend (ROAS)"], answer: "Customer Lifetime Value (LTV)", explanation: "LTV quantifies the total financial value a customer contributes throughout their entire relationship with the product." }
    ],
    "UI/UX Designer": [
        { question: "Which design deliverable represents static, high-fidelity visual representations of layouts?", options: ["Mockup", "Wireframe", "User Flow Chart", "Mind Map"], answer: "Mockup", explanation: "Mockups are high-fidelity visual designs showing colors, typography, and precise button assets." },
        { question: "What is the recommended standard text-to-background contrast ratio for WCAG AA standard?", options: ["4.5:1", "2:1", "10:1", "1:1"], answer: "4.5:1", explanation: "WCAG 2.0 AA requires a contrast ratio of at least 4.5:1 for normal text readability." },
        { question: "Which design phase maps out low-fidelity structural schematics of pages?", options: ["Wireframing", "Mockups", "Prototyping", "User Research"], answer: "Wireframing", explanation: "Wireframes are simple structural outlines focusing on layout boundaries and hierarchy without visual styling." },
        { question: "What represents negative space in visual UI design?", options: ["Uncluttered whitespace around elements", "Unused database memory space", "Page load errors", "Black theme background fields"], answer: "Uncluttered whitespace around elements", explanation: "Negative space (whitespace) provides breathing room, structuring margins and preventing visual clutter." },
        { question: "Which Gestalt principle states that items situated close to each other are perceived as grouped?", options: ["Proximity", "Similarity", "Continuity", "Closure"], answer: "Proximity", explanation: "The Proximity principle states that items located close to each other are naturally perceived as a single group." },
        { question: "What is the main objective of responsive design?", options: ["Adapting layouts to varying viewports", "Accelerating image download speeds", "Enabling offline page support", "Minifying client CSS code files"], answer: "Adapting layouts to varying viewports", explanation: "Responsive design uses media queries and fluid grids to adapt layout interfaces cleanly across mobile, tablet, and desktop screens." },
        { question: "Which prototype level supports interactive clicks, simulated inputs, and pages routing?", options: ["High-fidelity Prototype", "Low-fidelity Wireframe", "Customer Journey Map", "Mood Board only"], answer: "High-fidelity Prototype", explanation: "High-fidelity prototypes simulate real interactive features, button triggers, and user flow pathways." },
        { question: "What represents cognitive friction in user interfaces?", options: ["User confusion due to counter-intuitive flows", "Slow page load speeds", "Server-side routing errors", "High client RAM usage"], answer: "User confusion due to counter-intuitive flows", explanation: "Cognitive friction occurs when an interface behaves counter-intuitively, forcing users to think hard to execute standard tasks." },
        { question: "Which research method prompts users to group topics into logical navigation categories?", options: ["Card Sorting", "A/B Testing", "Persona Development", "Heuristic Evaluation"], answer: "Card Sorting", explanation: "Card sorting is a classic UX research method evaluating how users group and classify information taxonomies." },
        { question: "What colors evoke a sense of trust, security, and professional stability?", options: ["Blue shades", "Red shades", "Yellow shades", "Purple shades"], answer: "Blue shades", explanation: "Blue is psychologically associated with security, reliability, and trust, making it popular in finance and tech branding." }
    ],
    "Database Administrator (DBA)": [
        { question: "Which constraint guarantees that every row has a unique identifier in a SQL table?", options: ["Primary Key", "Foreign Key", "Not Null", "Check Constraint"], answer: "Primary Key", explanation: "Primary keys uniquely identify each row, enforcing uniqueness and indexing constraints." },
        { question: "What database lock level offers the highest concurrency for concurrent updates?", options: ["Row-level lock", "Table-level lock", "Page-level lock", "Database-level lock"], answer: "Row-level lock", explanation: "Row-level locking only locks the specific record being edited, letting other transactions edit other rows concurrently." },
        { question: "What database replication model routes all write queries to a single host node?", options: ["Master-Slave Replication", "Multi-Master Replication", "Peer-to-Peer Replication", "Sharded Cluster Setup"], answer: "Master-Slave Replication", explanation: "Master-Slave restricts writes to a single primary Master node, synchronizing updates asynchronously to read-only Slave nodes." },
        { question: "Which SQL command details the database execution pathway of a target query?", options: ["EXPLAIN", "DESCRIBE", "SHOW PLAN", "ANALYZE CODES"], answer: "EXPLAIN", explanation: "The `EXPLAIN` keyword compiles the planner's query execution steps (scans, joins), identifying bottlenecks." },
        { question: "What normal form removes transitive functional dependencies of non-key attributes?", options: ["3NF", "1NF", "2NF", "BCNF"], answer: "3NF", explanation: "3NF requires a table is in 2NF and has no transitive dependencies (where non-prime fields depend on other non-prime fields)." },
        { question: "Which transaction lock type allows multiple concurrent reads but blocks all writes?", options: ["Shared Lock (S)", "Exclusive Lock (X)", "Intent Lock (I)", "Deadlock"], answer: "Shared Lock (S)", explanation: "Shared locks allow concurrent transactions to read records concurrently, blocking exclusive write locks." },
        { question: "What represents a transaction deadlock?", options: ["Two transactions blocking each other indefinitely", "Database running out of connections", "A crashed master instance", "Loss of transaction logs on disk"], answer: "Two transactions blocking each other indefinitely", explanation: "A deadlock is a gridlock where Transaction A waits on B, and Transaction B waits on A, stalling both indefinitely." },
        { question: "What is the primary role of the transaction WAL (Write-Ahead Log) log on disk?", options: ["Enable recovery after crash", "Speed up select query reads", "Compress indices automatically", "Enforce relational foreign keys"], answer: "Enable recovery after crash", explanation: "WAL writes all transaction changes sequentially to disk before updating data tables, securing recovery after crashes." },
        { question: "Which table indexing strategy works best on high-cardinality sorted key ranges?", options: ["B-Tree Index", "Hash Index", "Bitmap Index", "GIST Index"], answer: "B-Tree Index", explanation: "B-tree indexes maintain balanced sorted nodes, optimal for high-cardinality equality and range searches." },
        { question: "Which backup strategy copies only data modified since the absolute last Full Backup?", options: ["Differential Backup", "Incremental Backup", "Full Backup only", "Continuous Replication"], answer: "Differential Backup", explanation: "Differential backups copy all changes made since the last Full Backup; Incremental backups copy changes since the most recent backup of any kind." }
    ]
};

function getNormalizedRoleKey(role) {
    const r = String(role || "").toLowerCase();
    if (r.includes("sde") || r.includes("software development") || r.includes("software developer")) {
        return "Software Developer";
    }
    if (r.includes("frontend")) {
        return "Frontend Developer";
    }
    if (r.includes("backend")) {
        return "Backend Developer";
    }
    if (r.includes("full stack") || r.includes("fullstack")) {
        return "Full Stack Developer";
    }
    if (r.includes("java")) {
        return "Java Developer";
    }
    if (r.includes("python")) {
        return "Python Developer";
    }
    if (r.includes("data analyst") || r.includes("bi") || r.includes("business intelligence")) {
        return "Data Analyst";
    }
    if (r.includes("scientist") || r.includes("data science")) {
        return "Data Scientist";
    }
    if (r.includes("machine learning") || r.includes("ml") || r.includes("ai")) {
        return "Machine Learning Engineer";
    }
    if (r.includes("devops") || r.includes("sre") || r.includes("reliability")) {
        return "DevOps Engineer";
    }
    if (r.includes("cloud") || r.includes("architect")) {
        return "Cloud Solutions Architect";
    }
    if (r.includes("security") || r.includes("cyber")) {
        return "Cyber Security Analyst";
    }
    if (r.includes("qa") || r.includes("test") || r.includes("automation")) {
        return "QA Automation Engineer";
    }
    if (r.includes("product manager") || r.includes("pm")) {
        return "Product Manager";
    }
    if (r.includes("ui") || r.includes("ux") || r.includes("designer")) {
        return "UI/UX Designer";
    }
    if (r.includes("database") || r.includes("dba") || r.includes("administrator")) {
        return "Database Administrator (DBA)";
    }
    return "Software Developer";
}

async function generateCompanyQuiz(company, role) {
    const prompt = `
Generate exactly 10 multiple-choice placement quiz questions (MCQs) for the specified company and role.

Company: ${company}
Role: ${role}

Requirements:
1. Questions must be conceptual or syntax-oriented Multiple Choice Questions (MCQs) testing core computer science and role-specific fundamentals typical of a placement exam at ${company} for the ${role} position.
2. These questions must be strictly distinct from the previous year interview questions and the long-form coding challenges or solutions. They should be quick-logic checks.
3. Each question must have exactly 4 different options.
4. Only one option must be correct and should exactly match one of the string elements in the "options" array.
5. Do not repeat questions.
6. Provide a short, informative explanation of why the correct option is right.
7. Return ONLY valid JSON in this format:

{
  "company": "${company}",
  "role": "${role}",
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Correct option",
      "explanation": "Short explanation"
    }
  ]
}
`;

    try {
        const response = await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (!response || !response.text) {
            const roleKey = getNormalizedRoleKey(role);
            const questions = fallbackQuestionsMap[roleKey] || fallbackQuestionsMap["Software Developer"];
            return {
                company: company,
                role: role,
                questions: questions.slice(0, 10)
            };
        }

        let text = response.text.trim();

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/[\u0000-\u001F\u007F]/g, " ")
            .trim();

        const data = JSON.parse(text);

        if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("AI did not generate quiz questions");
        }

        const slicedQuestions = data.questions.slice(0, 10);

        return {
            company: company,
            role: role,
            questions: slicedQuestions
        };
    } catch (error) {
        console.log("Failed to fetch quiz via AI, falling back to role-specific mapping:", error.message);
        const roleKey = getNormalizedRoleKey(role);
        const questions = fallbackQuestionsMap[roleKey] || fallbackQuestionsMap["Software Developer"];
        return {
            company: company,
            role: role,
            questions: questions.slice(0, 10),
            source: "fallback"
        };
    }
}

module.exports = {
    generateCompanyQuiz
};
