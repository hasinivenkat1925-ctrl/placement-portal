const { generateWithRetry } = require("./gemini-helper");

const fallbackCompanyQuestions = {
    "Software Developer": [
        { question: "How would you design a rate limiter for an API?", answer: "By using algorithms like Token Bucket, Leaky Bucket, or Fixed Window Counter depending on the distributed environment.", explanation: "Tests system design, API optimization, and scalability knowledge." },
        { question: "What is the difference between Dynamic Programming and Memoization?", answer: "Dynamic Programming is a general optimization technique that solves subproblems; memoization is the specific top-down caching approach.", explanation: "Tests algorithm design and optimization efficiency." },
        { question: "Explain the CAP theorem in distributed systems.", answer: "A distributed system can guarantee at most two out of three: Consistency, Availability, and Partition Tolerance.", explanation: "Essential for distributed systems design and databases." },
        { question: "What is the difference between process and thread?", answer: "A process is an independent execution unit with its own address space; a thread is a lightweight execution unit sharing the process memory.", explanation: "Tests fundamental OS resource management concepts." },
        { question: "How does a B-tree index differ from a Hash index in a database?", answer: "B-tree index supports range queries and sorted traversal in O(log N) time, whereas a Hash index only supports exact equality lookups in O(1) time.", explanation: "Tests database indexing systems and efficiency analysis." },
        { question: "What is the difference between TCP and UDP?", answer: "TCP is connection-oriented, reliable, guarantees packet ordering, and has flow control; UDP is connectionless, fast, and has no delivery guarantee.", explanation: "Tests networking layers, protocols, and communication design." },
        { question: "How do you detect a cycle in a directed graph?", answer: "Using Depth First Search (DFS) with a recursion stack / visiting set, or Kahn's algorithm (indegree-based BFS).", explanation: "Tests fundamental graph traversal algorithms." },
        { question: "Explain the difference between optimistic and pessimistic locking.", answer: "Optimistic locking assumes collisions are rare and verifies changes on write (using version fields); pessimistic locking locks the record immediately upon read.", explanation: "Tests concurrent transactions and database state management." },
        { question: "What is a memory leak and how do you find and prevent it?", answer: "A memory leak is when allocated memory is no longer needed but not freed. Prevented using automated garbage collection, smart pointers, and profiling tools.", explanation: "Tests memory management, performance profiling, and language internals." },
        { question: "What is the difference between a mutex and a semaphore?", answer: "A mutex is a locking mechanism for a single thread to secure a resource; a semaphore is a signaling mechanism using counter tokens for multiple threads.", explanation: "Tests low-level OS concurrency controls." }
    ],
    "Frontend Developer": [
        { question: "What is the Virtual DOM and how does React use it?", answer: "It is a lightweight programming representation of the real DOM. React updates the Virtual DOM first, then performs 'reconciliation' to update only the changed elements in the real DOM.", explanation: "Tests modern frontend framework internals and performance rendering." },
        { question: "Explain event delegation, event bubbling, and capturing.", answer: "Event delegation binds a single event listener to a parent to manage child triggers; bubbling propagates events upwards; capturing goes downwards.", explanation: "Tests core browser DOM event mechanics." },
        { question: "What are the ways to optimize web page loading speed?", answer: "By lazy loading assets, using WebP formats, minifying CSS/JS, leveraging CDN caching, and deferring non-essential scripts.", explanation: "Tests critical rendering path and web performance engineering." },
        { question: "What is CORS and how does the browser handle it?", answer: "Cross-Origin Resource Sharing is a browser security mechanism that uses HTTP headers to determine if cross-origin resource requests are authorized.", explanation: "Tests browser security policies and communication configuration." },
        { question: "Explain the difference between server-side rendering (SSR) and client-side rendering (CSR).", answer: "SSR sends fully-rendered HTML from the server to the browser, while CSR sends a blank HTML page with JavaScript that builds the DOM locally.", explanation: "Tests modern web rendering paradigms and SEO performance." },
        { question: "What are CSS pseudo-classes and pseudo-elements?", answer: "Pseudo-classes represent a special state of elements (e.g., :hover), while pseudo-elements style specific parts of an element (e.g., ::before).", explanation: "Tests advanced CSS styling conventions." },
        { question: "How does the 'this' keyword behave differently in arrow functions versus standard functions?", answer: "Arrow functions bind 'this' lexically from their enclosing context, whereas standard functions bind 'this' dynamically based on how they are called.", explanation: "Tests JavaScript scope, context binding, and ES6 specs." },
        { question: "What is a closure in JavaScript?", answer: "A closure is a function that remembers and accesses its outer scope variables even when executed outside that outer scope.", explanation: "Tests JavaScript function execution contexts and scope chains." },
        { question: "How do you optimize state management in a large React application?", answer: "By using local state where possible, memoization (useMemo, useCallback), context splitting, or external libraries like Redux or Zustand.", explanation: "Tests frontend system design and React state performance." },
        { question: "What is the difference between localstorage, sessionstorage, and cookies?", answer: "LocalStorage persists until cleared; sessionStorage persists for the tab session; cookies persist until expiration and are sent to the server.", explanation: "Tests browser data persistence mechanisms." }
    ],
    "Backend Developer": [
        { question: "What is database connection pooling and why is it used?", answer: "It maintains a cache of database connections so connections can be reused, avoiding the high overhead of establishing a new connection on every request.", explanation: "Tests backend scalability and database handling principles." },
        { question: "Explain the difference between SQL joins and subqueries in terms of execution cost.", answer: "Joins are generally optimized better by query compilers using hash joins or index lookups, whereas nested subqueries might execute repeatedly (O(n²)).", explanation: "Tests database indexing, compiler logic, and efficiency." },
        { question: "What is a message broker (e.g. Kafka, RabbitMQ) and when would you use it?", answer: "An intermediary that enables asynchronous, decoupled communication between microservices by queuing messages safely.", explanation: "Tests modern distributed architecture and microservice communication patterns." },
        { question: "How do SQL databases ensure ACID properties?", answer: "Using transaction logs (Write-Ahead Logging), locking mechanisms, multi-version concurrency control (MVCC), and recovery subsystems.", explanation: "Tests fundamental database design and reliability patterns." },
        { question: "What is the difference between REST, GraphQL, and gRPC?", answer: "REST uses resource-oriented HTTP verbs; GraphQL uses single endpoint queries; gRPC uses protocol buffers over HTTP/2 for low-latency streaming RPC.", explanation: "Tests API communication styles and protocol standards." },
        { question: "Explain the concept of database Sharding.", answer: "Splitting a database horizontally across multiple server instances to distribute data and read/write load.", explanation: "Tests database scaling mechanisms for large datasets." },
        { question: "How do you secure a REST API backend?", answer: "By using HTTPS, JWT/OAuth token verification, rate limiting, input validation, and secure password hashing algorithms like bcrypt.", explanation: "Tests backend security, authorization, and sanitization basics." },
        { question: "What is the N+1 query problem and how do you solve it?", answer: "It occurs when a query retrieves N records and triggers N additional queries for associated relations. Solved by eager loading or join queries.", explanation: "Tests database querying efficiency and ORM optimization." },
        { question: "What is cache invalidation and what are the common strategies?", answer: "The process of declaring cached data stale. Strategies include Cache-Aside, Write-Through, Write-Behind, and TTL-based expiry.", explanation: "Tests caching mechanisms and data consistency models." },
        { question: "Explain the difference between horizontal and vertical scaling for servers.", answer: "Vertical scaling increases the RAM/CPU of a single machine; horizontal scaling adds more server instances behind a load balancer.", explanation: "Tests cloud scalability and deployment standards." }
    ],
    "Full Stack Developer": [
        { question: "Explain the difference between Session-based and Token-based (JWT) authentication.", answer: "Session-based is stateful (stored on server memory/session store); JWT is stateless, self-contained, signed cryptographically, and verified client-side.", explanation: "Tests end-to-end user security and session management architecture." },
        { question: "What is CORS (Cross-Origin Resource Sharing) and how do you resolve it?", answer: "A browser security mechanism that restricts cross-origin HTTP requests. Resolved by configuring Access-Control-Allow-Origin headers on the backend server.", explanation: "Tests common web environment setup and security protocols." },
        { question: "How would you design a scalable search autocomplete system?", answer: "By using a Trie data structure for prefix lookup, backed by Redis for quick prefix key queries and Elasticsearch for complex indexing.", explanation: "Tests full stack system design and indexing storage combinations." },
        { question: "What are WebSockets and when should you use them over HTTP?", answer: "WebSockets provide persistent, bi-directional, full-duplex communication over a single TCP connection. Best for chat apps or live dashboards.", explanation: "Tests full stack communication protocols and real-time updates." },
        { question: "Explain the Model-View-Controller (MVC) architectural pattern.", answer: "MVC divides applications into: Model (data logic), View (display representation), and Controller (user inputs and request handling).", explanation: "Tests classic software engineering patterns." },
        { question: "What is an ORM and what are its trade-offs?", answer: "An Object-Relational Mapper translates DB tables to code classes. Trade-offs: increases developer speed but can lead to unoptimized, hidden DB queries.", explanation: "Tests database interaction abstraction layers." },
        { question: "How do you debug a production memory leak in a full stack JavaScript application?", answer: "By generating heap dumps, inspecting memory trends using Chrome DevTools/Node profiler, and analyzing garbage collection cycles.", explanation: "Tests production-level troubleshooting and system diagnosis." },
        { question: "What is a Progressive Web App (PWA) and what makes it installable?", answer: "A web application that behaves like a native app. Installable via a Service Worker, a Web App Manifest file, and secure HTTPS protocol.", explanation: "Tests advanced web technologies and native integration concepts." },
        { question: "Explain the difference between SQL and NoSQL databases.", answer: "SQL is relational, schema-restricted, ACID compliant, and scales vertically; NoSQL is non-relational, flexible-schema, eventually consistent, and scales horizontally.", explanation: "Tests storage model selection criteria." },
        { question: "How do you protect your web application against Cross-Site Request Forgery (CSRF)?", answer: "Using anti-CSRF tokens, configuring SameSite cookies, verifying referrer/origin headers, and avoiding storing session keys in cookies directly.", explanation: "Tests full stack web security controls." }
    ],
    "Java Developer": [
        { question: "What is the difference between Comparable and Comparator in Java?", answer: "Comparable provides single natural ordering with compareTo(); Comparator provides multiple custom sort orders with compare().", explanation: "Tests core sorting design pattern usage in Java collection libraries." },
        { question: "How does HashMap work internally in Java?", answer: "It uses an array of buckets, hashing the key to determine bucket index, and uses linked lists or red-black trees for collision resolution.", explanation: "Tests JVM internal data structure management and hashcode collision algorithms." },
        { question: "Explain the difference between String, StringBuilder, and StringBuffer.", answer: "String is immutable; StringBuilder is mutable and not thread-safe (fastest); StringBuffer is mutable and thread-safe (synchronized).", explanation: "Tests Java memory allocation, immutability, and thread safety optimization." },
        { question: "What is Java Garbage Collection and how does it determine dead objects?", answer: "It is an automated JVM system that reclaims heap memory by tracing root-references (GC Roots) and destroying unreachable objects.", explanation: "Tests JVM memory reclamation and object lifecycle management." },
        { question: "Explain the difference between exception propagation in Checked vs Unchecked exceptions.", answer: "Checked exceptions are checked at compile-time and must be declared or caught; Unchecked exceptions (Runtime) propagate automatically up the stack.", explanation: "Tests Java error handling and robust software compile checks." },
        { question: "What is the volatile keyword in Java and when is it used?", answer: "It ensures variable value changes are written directly to and read from main memory, preventing CPU caching in multi-threaded environments.", explanation: "Tests Java memory model and concurrent thread synchronization." },
        { question: "What are functional interfaces and lambda expressions in Java 8?", answer: "A functional interface has exactly one abstract method (e.g., Runnable). Lambdas provide clean, inline implementations of these interfaces.", explanation: "Tests modern Java functional programming paradigms." },
        { question: "How do you implement thread safety in a Java class?", answer: "Using synchronized methods/blocks, volatile fields, Atomic wrappers (AtomicInteger), or explicit ReentrantLocks.", explanation: "Tests concurrent Java coding and multi-threading models." },
        { question: "What is the difference between Abstract Class and Interface in Java 8+?", answer: "Abstract classes can hold instance state and constructors; Interfaces are stateless contracts, but both can hold concrete methods (default/static in interfaces).", explanation: "Tests object-oriented abstraction design criteria in Java." },
        { question: "Explain JVM architecture and the role of JIT Compiler.", answer: "The JVM runs Java bytecode. The Just-In-Time (JIT) compiler compiles frequently executed bytecode segments into native machine code at runtime.", explanation: "Tests low-level JVM compilation and performance mechanics." }
    ],
    "Python Developer": [
        { question: "What is the Global Interpreter Lock (GIL) in Python?", answer: "A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.", explanation: "Tests concurrency limitations and execution design of CPython." },
        { question: "Explain decorators in Python and write a simple one.", answer: "A decorator is a function that takes another function as an argument, extends its behavior, and returns a modified wrapper function.", explanation: "Tests functional programming concepts and code readability techniques." },
        { question: "How is memory managed internally in Python?", answer: "Using private heaps managed by Python's memory manager, using reference counting and a cyclic garbage collector to destroy unreachable variables.", explanation: "Tests Python core memory runtime and cyclic dependency solvers." },
        { question: "What is the difference between list and tuple in Python?", answer: "Lists are mutable and take slightly more memory overhead; tuples are immutable and can be used as dictionary keys because they are hashable.", explanation: "Tests core Python list collections and immutability advantages." },
        { question: "Explain generator functions and the yield keyword in Python.", answer: "Generators return an iterator lazily, yielding one value at a time on demand, avoiding loading the entire collection into memory.", explanation: "Tests memory-efficient iteration patterns and lazy loading." },
        { question: "What is the difference between deepcopy and shallowcopy in Python?", answer: "Shallow copy duplicates the object but references nested objects; deep copy recursively duplicates the object and all nested items completely.", explanation: "Tests object duplication, memory references, and mutability risks." },
        { question: "How does exception handling propagate in Python with try-except-finally?", answer: "Try blocks run code; except captures matching exceptions; finally runs cleanup code unconditionally before leaving the function context.", explanation: "Tests Python script robustness and resource cleanups." },
        { question: "Explain list comprehensions and their syntax benefits.", answer: "They provide a concise way to create lists in a single line, executing faster than standard loops because they run at C-speed internally.", explanation: "Tests Pythonic syntax patterns and list loop optimizations." },
        { question: "What are Python metaclasses and when are they used?", answer: "Metaclasses are 'classes of classes' that define how classes behave and are constructed, typically used in ORM development or API verification.", explanation: "Tests advanced object-oriented mechanics and reflection." },
        { question: "How do you achieve parallelism in Python for CPU-bound tasks?", answer: "By using the multiprocessing module instead of threading to spawn separate processes with their own independent GIL runtimes.", explanation: "Tests multi-core computation workarounds in Python." }
    ],
    "Data Analyst": [
        { question: "What is a Window Function in SQL and how does it differ from GROUP BY?", answer: "A window function performs calculations across a set of table rows related to the current row, maintaining individual row identities instead of collapsing them.", explanation: "Tests advanced analytical SQL query capabilities." },
        { question: "What is data wrangling and what Pandas functions are used for it?", answer: "Data wrangling is cleaning, structuring, and transforming raw data. Pandas uses merge(), groupby(), pivot_table(), fillna(), and drop_duplicates().", explanation: "Tests data pipeline, structuring, and cleaning workflows." },
        { question: "Explain the difference between descriptive and inferential statistics.", answer: "Descriptive statistics summarize and describe data characteristics; inferential statistics use samples to make generalizations/predictions about populations.", explanation: "Tests analytical statistics and data modeling foundations." },
        { question: "How do you handle missing values in a dataset?", answer: "By deleting rows (if sparse), imputing values (using mean, median, mode, or kNN), or using default indicator values.", explanation: "Tests data cleaning strategies and pipeline integrity." },
        { question: "What is a correlation matrix and how do you interpret its coefficients?", answer: "A table showing correlation coefficients between variables, ranging from -1 (perfect negative), 0 (no correlation), to +1 (perfect positive).", explanation: "Tests dataset relationship mapping and analysis." },
        { question: "Explain the difference between inner join, left join, and outer join in SQL.", answer: "Inner join returns matching rows in both tables; left join returns all from left + matching right; outer join returns all rows from both tables.", explanation: "Tests relational querying mechanics." },
        { question: "What is an outlier and how do you detect it in a dataset?", answer: "An anomaly far from other values, detected using standard deviation thresholds, z-scores, boxplots, or Interquartile Range (IQR).", explanation: "Tests statistical anomaly detection." },
        { question: "How do you optimize a slow-running SQL analytical query?", answer: "By creating indices, avoiding SELECT *, filtering early using WHERE instead of HAVING, and optimizing joins using explain plans.", explanation: "Tests analytical query performance optimizations." },
        { question: "What is a Pivot Table and when is it best used?", answer: "A data summarization tool that automatically aggregates, sorts, counts, or averages table records to reveal structural summaries.", explanation: "Tests key spreadsheet and analytical modeling concepts." },
        { question: "Explain the difference between structured, semi-structured, and unstructured data.", answer: "Structured data fits tidy relational schemas; semi-structured has markers but no rigid layout (JSON, XML); unstructured lacks regular form (video, audio).", explanation: "Tests database classification and storage models." }
    ],
    "Data Scientist": [
        { question: "What is the difference between Overfitting and Underfitting and how do you fix them?", answer: "Overfitting is high variance (memorizing noise); fixed by regularization or more data. Underfitting is high bias (oversimplified model); fixed by increasing model complexity.", explanation: "Tests fundamental machine learning training and generalization theory." },
        { question: "What is the purpose of an ROC curve and AUC score?", answer: "ROC plots True Positive Rate vs False Positive Rate at various thresholds. AUC measures the entire two-dimensional area underneath, evaluating classifier quality.", explanation: "Tests classification model performance evaluation metrics." },
        { question: "What is the central limit theorem (CLT) and why is it important?", answer: "The CLT states that the sampling distribution of the mean approaches normal as sample size increases, allowing parametric statistical testing.", explanation: "Tests foundational statistical inference theories." },
        { question: "Explain the difference between L1 (Lasso) and L2 (Ridge) regularization.", answer: "L1 adds absolute value penalty forcing coefficients to zero (feature selection); L2 adds squared penalty shrinking coefficients smoothly.", explanation: "Tests machine learning overfit prevention mathematics." },
        { question: "What is cross-validation and why do we use it?", answer: "A technique where data is split into partitions, training models iteratively on subset combinations to ensure robust model generalizability.", explanation: "Tests model training validation methodologies." },
        { question: "How does the Naive Bayes classifier apply probability rules?", answer: "It calculates class probabilities using Bayes' Theorem, making a 'naive' assumption that all input features are independent of each other.", explanation: "Tests classical machine learning mathematical fundamentals." },
        { question: "Explain precision, recall, and F1-score.", answer: "Precision is true positives out of predicted positives; recall is true positives out of actual positives; F1-score is their harmonic mean.", explanation: "Tests classification error evaluation criteria." },
        { question: "What is the difference between supervised and unsupervised learning?", answer: "Supervised uses labeled datasets with target outputs; unsupervised finds hidden structures in unlabeled datasets (e.g., clustering).", explanation: "Tests basic ML paradigm categorization." },
        { question: "Explain how a Decision Tree determines its splits.", answer: "By calculating metric changes like Information Gain (Entropy reduction) or Gini Impurity reduction to maximize group purity.", explanation: "Tests logic flow of recursive partition estimators." },
        { question: "How does Random Forest improve on standard Decision Trees?", answer: "It is an ensemble method that trains multiple trees using bagging (bootstrap aggregating) and random feature selection, reducing overall variance.", explanation: "Tests bagging ensemble architectures." }
    ],
    "Machine Learning Engineer": [
        { question: "Explain the self-attention mechanism in Transformer architectures.", answer: "It computes a weighted representation of inputs, allowing each token to dynamically focus on relevant other tokens regardless of distance.", explanation: "Tests modern state-of-the-art NLP and sequence model structures." },
        { question: "How does gradient descent optimization find local minima?", answer: "By iteratively adjusting parameters in the opposite direction of the gradient of the loss function, scaled by the learning rate.", explanation: "Tests mathematical optimization algorithms behind model parameter updates." },
        { question: "What is the vanishing gradient problem and how do you resolve it?", answer: "In deep networks, backpropagated gradients shrink exponentially, stopping learning. Solved using ReLU activation, residual connections, and batch normalization.", explanation: "Tests deep learning structural issues and optimization." },
        { question: "Explain the difference between batch normalization and layer normalization.", answer: "Batch normalization normalizes activations across the batch dimension; layer normalization normalizes activations across the feature channel dimension.", explanation: "Tests deep learning regularization and training stabilizers." },
        { question: "What is transfer learning and when should you use it?", answer: "Reusing a pre-trained model on a new related task, saving computation and training data requirements (e.g., fine-tuning BERT).", explanation: "Tests modern deep learning deployment efficiency." },
        { question: "How does convolutional operations (CNNs) process spatial images?", answer: "Using learnable sliding filters (kernels) that perform dot products over local receptive fields to detect hierarchical spatial patterns.", explanation: "Tests computer vision neural architecture." },
        { question: "Explain the trade-offs of using Adam optimizer vs SGD.", answer: "Adam adapts learning rates dynamically for faster convergence; Stochastic Gradient Descent (SGD) with momentum generalized better in some deep tasks.", explanation: "Tests optimization parameter convergence behaviors." },
        { question: "What is model quantization and why is it used?", answer: "Reducing model weight precision (e.g., FP32 to INT8) to optimize execution speed and fit models onto edge devices.", explanation: "Tests model compilation and edge device deployment constraints." },
        { question: "Explain data leakage in machine learning datasets.", answer: "When information from the target label or future test set accidentally contaminates the training set, giving misleadingly high accuracy.", explanation: "Tests predictive validation best-practices." },
        { question: "What is hyperparameter tuning and what are the main methods?", answer: "Finding optimal settings not learned directly. Methods include Grid Search, Random Search, and Bayesian Optimization.", explanation: "Tests automated model tuning practices." }
    ],
    "DevOps Engineer": [
        { question: "What is Infrastructure as Code (IaC) and its primary benefit?", answer: "Managing infrastructure through machine-readable configuration files (like Terraform, Ansible), ensuring repeatable and error-free deployments.", explanation: "Tests modern infrastructure automation and orchestration." },
        { question: "Explain the differences between virtual machines and Docker containers.", answer: "VMs virtualize the underlying hardware and pack a full guest OS; Docker containers virtualize only the OS kernel, making them lightweight.", explanation: "Tests modern cloud isolation systems and resource utilization knowledge." },
        { question: "What is GitOps and how does it relate to CI/CD pipelines?", answer: "An operational model that uses Git as the single source of truth for declarative infrastructure and continuous delivery changes.", explanation: "Tests modern deployment paradigms and automated synchronizations." },
        { question: "How does blue-green deployment work and what is its benefit?", answer: "Running two identical production environments (Blue and Green). Traffic is routed to one while deploying to the other, guaranteeing zero downtime.", explanation: "Tests production release management strategies." },
        { question: "What is a rolling update in deployment architectures?", answer: "Gradually replacing old service containers or instances with new ones to ensure application availability is never interrupted.", explanation: "Tests deployment zero-downtime tactics." },
        { question: "Explain the role of Prometheus and Grafana in production observability.", answer: "Prometheus polls and stores time-series metric data; Grafana queries Prometheus to render beautiful visual analytics dashboards.", explanation: "Tests production metrics, telemetry, and system dashboards." },
        { question: "What is a reverse proxy and how does it differ from a forward proxy?", answer: "A reverse proxy acts on behalf of backend servers to receive public client traffic; a forward proxy acts on behalf of private clients to access public web pages.", explanation: "Tests cloud routing and secure gateway structures." },
        { question: "How do you handle secrets securely in automated deployment pipelines?", answer: "Using secure secret vaults (Vault, AWS Secrets Manager) and passing them via runtime environment variables rather than committing keys to Git.", explanation: "Tests secure deployment principles." },
        { question: "What is container orchestration and why is Kubernetes used?", answer: "Automating the deployment, scaling, routing, and lifecycle of containerized services at scale.", explanation: "Tests cluster orchestration and service scale structures." },
        { question: "What is a canary deployment strategy?", answer: "Releasing updates gradually to a tiny fraction of users first (the canary) to verify stability before rolling it out to everyone.", explanation: "Tests risk-minimized deployment patterns." }
    ],
    "Cloud Solutions Architect": [
        { question: "Explain the difference between horizontal and vertical scaling in the cloud.", answer: "Horizontal scaling adds more machine instances to the pool (scaling out); vertical scaling increases the RAM/CPU of existing machines (scaling up).", explanation: "Tests cost-effective, high-availability architecture standards." },
        { question: "What is a Content Delivery Network (CDN) and how does it improve app latency?", answer: "CDNs cache static web pages and files on distributed edge servers worldwide, serving content from locations closest to users.", explanation: "Tests web speed optimizations and serverless distributed distribution." },
        { question: "What is serverless computing (e.g., AWS Lambda, Cloud Functions)?", answer: "A cloud-execution model where cloud providers dynamically manage physical machine allocation, charging only for active query executions.", explanation: "Tests modern serverless execution and cost optimization paradigms." },
        { question: "Explain the concept of Multi-AZ (Availability Zone) deployment.", answer: "Deploying cloud resources across distinct isolated physical data centers within a region to ensure instant failover during physical failures.", explanation: "Tests cloud disaster recovery and high availability designs." },
        { question: "What is a Virtual Private Cloud (VPC) and how does it secure servers?", answer: "An isolated private network in a public cloud, allowing architects to isolate databases in private subnets unreachable from the internet.", explanation: "Tests cloud boundary security configurations." },
        { question: "How do you design a database for disaster recovery (DR)?", answer: "By setting up automated snapshotting, multi-region database replication, and planning for RTO (Recovery Time Objective) goals.", explanation: "Tests storage system durability plans." },
        { question: "What is object storage and how does it differ from block storage?", answer: "Object storage (e.g. S3) stores unstructured assets via unique keys; block storage acts like a physical hard drive mapped to a virtual machine.", explanation: "Tests cloud storage selection models." },
        { question: "Explain the 'Shared Responsibility Model' in public cloud security.", answer: "Cloud providers secure physical infrastructure (security of the cloud); clients secure their OS settings, configurations, and data (security in the cloud).", explanation: "Tests public cloud security principles." },
        { question: "What is a Load Balancer and what are the main types?", answer: "A routing mechanism distributing incoming app traffic. Main types: Application Load Balancers (HTTP/Layer 7) and Network Load Balancers (TCP/Layer 4).", explanation: "Tests cloud traffic routing designs." },
        { question: "How would you optimize cloud spend for an idle development environment?", answer: "By setting up scaling rules to scale down to zero during off-hours, using spot instances, and deleting orphaned block storage drives.", explanation: "Tests cloud cost optimization principles." }
    ],
    "Cyber Security Analyst": [
        { question: "What is SQL Injection (SQLi) and how do you prevent it?", answer: "A vulnerability where malicious SQL commands are injected into input fields. Prevented by using parameterized queries and prepared statements.", explanation: "Tests web security awareness and secure programming patterns." },
        { question: "What is the difference between symmetric and asymmetric encryption?", answer: "Symmetric uses the same key for both encryption and decryption; asymmetric uses a public key to encrypt and a private key to decrypt.", explanation: "Tests core cryptographic protocol setups." },
        { question: "Explain Cross-Site Scripting (XSS) and the three main types.", answer: "XSS injects malicious client-side scripts into trusted web pages. Three types: Reflected (immediate request), Stored (saved in DB), and DOM-based.", explanation: "Tests browser and frontend security concepts." },
        { question: "What is the purpose of salting passwords before hashing them?", answer: "Salting appends unique random bytes to passwords before hashing, rendering pre-computed rainbow table attacks completely useless.", explanation: "Tests authentication backend security standards." },
        { question: "Explain the concept of Zero Trust security.", answer: "A security framework that assumes threats exist everywhere, strictly requiring continuous verification of every device, user, and transaction.", explanation: "Tests modern network architecture security principles." },
        { question: "What is a Man-in-the-Middle (MITM) attack and how is it prevented?", answer: "An attacker intercepts communication between two parties. Prevented by using HTTPS, SSL/TLS certificates, and robust cryptographic protocols.", explanation: "Tests communication security layer standards." },
        { question: "What is the difference between vulnerability scanning and penetration testing?", answer: "Vulnerability scanning is an automated tool scan for known flaws; penetration testing is a hands-on manual attack simulation to compromise systems.", explanation: "Tests security auditing workflows." },
        { question: "Explain multi-factor authentication (MFA) and the three factors of authentication.", answer: "Securing log-ins using combinations of: Something you know (password), Something you have (token), and Something you are (biometrics).", explanation: "Tests identity verification mechanisms." },
        { question: "What is Cross-Site Request Forgery (CSRF) and how is it blocked?", answer: "An attack that forces users to run unwanted actions on a web app where they are authenticated. Prevented by using anti-CSRF tokens.", explanation: "Tests session authorization protections." },
        { question: "Explain the role of a firewall and the difference between stateless and stateful filtering.", answer: "A firewall blocks unauthorized network traffic. Stateless checks packets individually; stateful monitors packet history context in the active connection.", explanation: "Tests perimeter security controls." }
    ],
    "QA Automation Engineer": [
        { question: "Explain the Page Object Model (POM) design pattern in automation.", answer: "It structures test scripts by creating a separate class file for each web page to hold locators and user actions, enhancing maintainability.", explanation: "Tests test framework organization and clean automation scripting." },
        { question: "What are assertions in unit testing frameworks?", answer: "Validation verification checks that compare expected results against actual outcomes to flag test failures instantly.", explanation: "Tests fundamental software verification mechanisms." },
        { question: "Explain the difference between regression testing and smoke testing.", answer: "Smoke testing verifies if the core critical pathways of an app run cleanly; regression testing verifies if recent code additions broke old features.", explanation: "Tests software release validation strategies." },
        { question: "What is continuous testing in CI/CD pipeline structures?", answer: "Automating test runs on every code commit or deployment stage, catching software defects immediately.", explanation: "Tests DevOps integrated QA frameworks." },
        { question: "What is the difference between unit testing, integration testing, and system testing?", answer: "Unit tests check isolated functions; integration tests check interacting combined modules; system tests verify end-to-end user flows.", explanation: "Tests test level classifications." },
        { question: "How do you handle dynamic elements in UI automation (like Selenium)?", answer: "Using explicit wait conditions (waiting for elements to be visible/clickable) instead of static sleep thread timers.", explanation: "Tests UI automation timing stability." },
        { question: "What is boundary value analysis in test case design?", answer: "A technique that tests extreme edge input values (exactly on, below, and above boundaries), as systems frequently fail at margins.", explanation: "Tests black-box test design methodologies." },
        { question: "What is test coverage and how is it measured?", answer: "The metric indicating the percentage of code lines, branches, or paths executed during test runs.", explanation: "Tests metrics of software test completeness." },
        { question: "Explain mock testing and stubbing.", answer: "Stubs are simple hardcoded data providers; Mocks simulate active component behavior with assertions verifying specific interaction pathways.", explanation: "Tests unit isolation practices." },
        { question: "What is behavior-driven development (BDD) and what tools support it?", answer: "An agile methodology writing tests in plain natural language (Gherkin syntax) using Cucumber or SpecFlow.", explanation: "Tests product-aligned agile test setups." }
    ],
    "Product Manager": [
        { question: "How do you prioritize features using frameworks?", answer: "By using structured models like RICE (Reach, Impact, Confidence, Effort) or MoSCoW (Must, Should, Could, Won't) to rank business value.", explanation: "Tests objective roadmap prioritization and feature lifecycle strategy." },
        { question: "Explain the concept of an MVP (Minimum Viable Product).", answer: "The version of a new product that allows a team to collect the maximum amount of validated customer learning with the least feature effort.", explanation: "Tests lean product design and user validation principles." },
        { question: "What is product-market fit (PMF) and how do you track it?", answer: "The scenario where a product successfully satisfies a strong target market need. Tracked via retention rates, NPS scores, and customer surveys.", explanation: "Tests growth metrics and strategy." },
        { question: "Explain the difference between a product roadmap and a product backlog.", answer: "A roadmap is a high-level visual timeline of product vision and strategy; a backlog is a granular list of prioritized engineering tasks.", explanation: "Tests agile management models." },
        { question: "How do you handle feature requests from key enterprise clients that conflict with product vision?", answer: "By listening to understand underlying pain points, evaluating overall user segment impact, and declining if it creates custom code creep.", explanation: "Tests client communications and roadmap control." },
        { question: "What is A/B testing and when should it be conducted?", answer: "Running user split-tests showing variations (A and B) to different segments to statistically measure which one optimizes key target metrics.", explanation: "Tests experiment-driven user design optimizations." },
        { question: "Explain user retention rate and churn rate.", answer: "Retention rate is the percentage of active returning users; churn rate is the percentage of users who stop using the product.", explanation: "Tests fundamental product growth metrics." },
        { question: "How do you define a North Star Metric?", answer: "The single key metric that best captures the core value your product delivers to its customers.", explanation: "Tests alignment of product success criteria." },
        { question: "What is agile scrum methodology and the role of a product owner?", answer: "An iterative development framework where the product owner curates the user stories backlog, prioritizing feature deliverables for sprints.", explanation: "Tests agile development management frameworks." },
        { question: "Explain the customer acquisition cost (CAC) and customer lifetime value (LTV) ratio.", answer: "CAC measures cost to win a user; LTV measures total value they spend. A healthy software PM target is an LTV:CAC ratio > 3:1.", explanation: "Tests unit economics of software products." }
    ],
    "UI/UX Designer": [
        { question: "What is accessibility (WCAG) and why is it vital in interface design?", answer: "Web Content Accessibility Guidelines guarantee that web interfaces are usable for disabled individuals via high color contrasts and clean layout patterns.", explanation: "Tests inclusive user experience and design compliance standards." },
        { question: "What is the difference between a wireframe, a mockup, and a prototype?", answer: "Wireframes are low-fidelity layouts; mockups are static high-fidelity visuals; prototypes are interactive user-flow simulations.", explanation: "Tests software design workflow stages and interactive prototyping." },
        { question: "Explain visual hierarchy and how to create it on a webpage.", answer: "Arranging design elements in order of importance, using size contrasts, whitespace padding, color highlights, and typography weights.", explanation: "Tests graphic layout and typography fundamentals." },
        { question: "What is user testing and what are the main methodologies?", answer: "Evaluating interfaces with real users. Methodologies include moderated user usability tests, card sorting, tree testing, and eye tracking.", explanation: "Tests design research validation workflows." },
        { question: "What is the difference between UI design and UX design?", answer: "UI (User Interface) focuses on visual aesthetics, grids, colors, and layout; UX (User Experience) focuses on system architecture, user journeys, and utility.", explanation: "Tests basic product design classifications." },
        { question: "Explain the rule of whitespace (negative space) in clean UI layouts.", answer: "Uncluttered negative space prevents visual fatigue, groups adjacent elements logically, and guides user focus to key CTAs.", explanation: "Tests visual design standards." },
        { question: "What are design systems and why are they maintained in software teams?", answer: "A unified library of reusable UI components, design tokens, and style rules ensuring brand consistency across platforms.", explanation: "Tests team collaboration design workflows." },
        { question: "Explain cognitive load in product design.", answer: "The mental processing effort required for users to interact with an interface, which UX designers minimize by simplifying choices.", explanation: "Tests interaction design cognitive psychology." },
        { question: "What is mobile-first design and why is it prioritised?", answer: "Designing the interface for mobile viewports first, then scaling up to desktop screens, which forces clean, minimal layout focus.", explanation: "Tests viewport adaptive styling standards." },
        { question: "Explain color theory and how it impacts brand psychology.", answer: "Using color relationships to evoke emotional responses (e.g., blue suggests security; red alerts urgency) while maintaining contrast accessibility.", explanation: "Tests visual communications and color physics." }
    ],
    "Database Administrator (DBA)": [
        { question: "What is database normalization and what are 1NF, 2NF, and 3NF?", answer: "Structuring tables to remove redundancy. 1NF removes duplicates; 2NF ensures all fields depend on key; 3NF removes transitive dependencies.", explanation: "Tests relational database integrity and design layouts." },
        { question: "How does Master-Slave replication function in a production database?", answer: "All write queries route to the Master node, which synchronizes records to Slave nodes that exclusively serve read queries, boosting scale.", explanation: "Tests high throughput read/write database scaling design." },
        { question: "What is database clustering and how does it prevent downtime?", answer: "Linking multiple database server nodes to operate as a single virtual system, ensuring instant failovers if a physical server node crashes.", explanation: "Tests enterprise storage system high-availability." },
        { question: "Explain database transactions and the WAL (Write-Ahead Logging) protocol.", answer: "Transactions are logical units of database modifications. WAL writes log details to disk before modifying actual data pages, ensuring durability.", explanation: "Tests database recovery system internals." },
        { question: "What is query optimization and how do you analyze a slow query?", answer: "Evaluating index layouts and running EXPLAIN commands to read execution pathways, finding table scans or slow nested loops.", explanation: "Tests SQL execution diagnostic processes." },
        { question: "What is a deadlock in database concurrency and how is it resolved?", answer: "When two transactions hold locks on resources needed by the other, stalling both. Solved when the DB engine rolls back one transaction.", explanation: "Tests transaction lock resolution algorithms." },
        { question: "Explain the difference between a primary key, a unique key, and a foreign key.", answer: "A primary key uniquely identifies rows and cannot be null; a unique key ensures unique values but allows null; a foreign key links tables.", explanation: "Tests relational structural constraints." },
        { question: "What is database backup strategy and the difference between full, differential, and incremental backups?", answer: "Full backs up all database data; incremental backs up only changes since last backup; differential backs up changes since last full backup.", explanation: "Tests database durability management." },
        { question: "What is table partitioning and how does it improve query performance?", answer: "Dividing large physical database tables into smaller virtual partitions based on key ranges, allowing queries to prune non-essential slices.", explanation: "Tests scale-out storage management." },
        { question: "Explain Multi-Version Concurrency Control (MVCC).", answer: "A technique that allows concurrent read-writes without locking out, by writing historical data versions for different transactions.", explanation: "Tests advanced relational database concurrency architectures." }
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
    return "Software Developer"; // Default back to SDE instead of global core default
}

async function generateCompanyQuestions(company, role) {
    if (!company) {
        throw new Error("Company is required");
    }

    if (!role) {
        throw new Error("Role is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation assistant.

Generate exactly 10 real-world PREVIOUS YEAR placement questions that were actually asked in real historical interview/test drives for the company and role specified.

Company: ${company}
Role: ${role}

Requirements:
1. Focus strictly on real historical previous year questions (PYQs) asked during placement drives at ${company} for the ${role} position.
2. These questions must be highly role-specific. For example, if the role is a Java Developer, ask about core Java, Spring, JVM internals, or multithreading questions typical of ${company}. If it is a Data Analyst, ask about SQL joins, analytics concepts, or data cleaning questions typical of ${company}.
3. Frame these as "Previously Asked Question in Placement Drive".
4. Do not repeat questions. Make sure they are distinct from simple conceptual quiz MCQs or long system-design scenarios.
5. Give a clear answer for every question.
6. Give a short explanation of why ${company} asks this question for this role.
7. Return ONLY valid JSON.

Use exactly this format:

{
    "company": "${company}",
    "role": "${role}",
    "questions": [
        {
            "question": "Question text",
            "answer": "Correct answer",
            "explanation": "Short explanation of why company asks this or how to answer it"
        }
    ]
}
`;

    try {
        const response = await generateWithRetry({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (!response || !response.text) {
            const roleKey = getNormalizedRoleKey(role);
            const questions = fallbackCompanyQuestions[roleKey] || fallbackCompanyQuestions["Software Developer"];
            return {
                company: company,
                role: role,
                questions: questions.slice(0, 10),
                source: "role_mapping"
            };
        }

        let text = response.text.trim();

        if (text.startsWith("```")) {
            text = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
        }

        text = text.replace(/[\u0000-\u001F\u007F]/g, " ");

        const data = JSON.parse(text);

        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
            const slicedQuestions = data.questions.slice(0, 10);
            return {
                company: company,
                role: role,
                questions: slicedQuestions,
                source: "ai"
            };
        }

        throw new Error("Invalid questions structure");
    } catch (error) {
        console.log("Failed to fetch questions via AI, falling back to role-specific mapping:", error.message);
        const roleKey = getNormalizedRoleKey(role);
        const questions = fallbackCompanyQuestions[roleKey] || fallbackCompanyQuestions["Software Developer"];
        return {
            company: company,
            role: role,
            questions: questions.slice(0, 10),
            source: "fallback"
        };
    }
}

module.exports = {
    generateCompanyQuestions
};
