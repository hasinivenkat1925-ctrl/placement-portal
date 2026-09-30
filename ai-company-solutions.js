const { generateWithRetry } = require("./gemini-helper");

const fallbackCompanySolutions = {
    "Software Developer": [
        {
            question: "How would you design a rate limiter for an API?",
            answer: "By using algorithms like Token Bucket, Leaky Bucket, or Fixed Window Counter depending on the distributed environment.",
            solution: "To implement a robust rate limiter, you can use a Token Bucket algorithm backed by Redis. For every incoming request, fetch the token count for the client's IP. If tokens > 0, decrement by 1 and allow the request. Redis provides atomic operations (like DECRBY) and key expiration (TTL) to replenish tokens automatically, making it ideal for distributed environments with multiple server instances."
        },
        {
            question: "What is the difference between Dynamic Programming and Memoization?",
            answer: "Dynamic Programming is a general optimization technique that solves subproblems; memoization is the specific top-down caching approach.",
            solution: "Memoization is a 'top-down' technique where you solve the main problem recursively and cache the results of subproblems to avoid redundant calculations. Dynamic Programming (often implemented as Tabulation) is a 'bottom-up' approach where you solve smaller subproblems first, filling a table iteratively, which removes recursion stack overhead."
        },
        {
            question: "Explain the CAP theorem in distributed systems.",
            answer: "A distributed system can guarantee at most two out of three: Consistency, Availability, and Partition Tolerance.",
            solution: "Consistency (C) means every read receives the most recent write or an error. Availability (A) means every non-failing node returns a non-error response. Partition Tolerance (P) means the system continues to operate despite arbitrary message loss. Since physical networks will inevitably experience partitions (P), a distributed system must choose between Consistency (CP, e.g. MongoDB) and Availability (AP, e.g. Cassandra)."
        },
        {
            question: "What is the difference between process and thread?",
            answer: "A process is an independent execution unit with its own address space; a thread is a lightweight execution unit sharing the process memory.",
            solution: "A process has its own PCB (Process Control Block), memory space, and isolated virtual address heap. A thread is the smallest schedulable execution unit inside a process. Multiple threads share the same program segment, data segments, open files, and system resources of their parent process. Since they share address space, switching between threads is much faster than inter-process context switching, but they require careful thread-safety synchronization (like Mutex or Semaphores) to prevent data corruption."
        },
        {
            question: "How does a B-tree index differ from a Hash index in a database?",
            answer: "B-tree index supports range queries and sorted traversal in O(log N) time, whereas a Hash index only supports exact equality lookups in O(1) time.",
            solution: "B-tree indices maintain a sorted balanced search tree, meaning searching for ranges (e.g. `age BETWEEN 20 AND 30`) can be quickly found by executing a binary search traversal to the minimum node and reading sequentially across sibling pointers. Hash indices calculate a cryptographic hash code of the index value to search in a buckets array. While extremely fast for equality checks (e.g. `id = 45`), they have no concept of sorting or range bounds, rendering range queries incredibly slow (reverting to full table scans)."
        },
        {
            question: "What is the difference between TCP and UDP?",
            answer: "TCP is connection-oriented, reliable, guarantees packet ordering, and has flow control; UDP is connectionless, fast, and has no delivery guarantee.",
            solution: "TCP starts communication with a 3-way handshake (SYN, SYN-ACK, ACK), assigns unique sequence numbers to every packet to guarantee in-order delivery, and retransmits lost packets dynamically. It also uses sliding windows for congestion and flow control. UDP does not establish a connection, does not track packets, and sends them instantly to the socket address. This lack of overhead makes UDP optimal for speed-critical real-time applications like multiplayer gaming, DNS lookups, and video streaming."
        },
        {
            question: "How do you detect a cycle in a directed graph?",
            answer: "Using Depth First Search (DFS) with a recursion stack / visiting set, or Kahn's algorithm (indegree-based BFS).",
            solution: "With DFS, maintain three states for each node: Unvisited, Visiting (in active recursion path), and Visited. During traversal, if you attempt to visit a neighbor that is in the 'Visiting' state, a back-edge exists, proving a cycle exists. With BFS (Kahn's Algorithm), calculate the indegree of all vertices, enqueue nodes with indegree=0, continuously pop nodes, decrement their neighbors' indegrees, and enqueue any neighbor that hits indegree=0. If the count of popped nodes is less than total vertices, a cycle is present."
        },
        {
            question: "Explain the difference between optimistic and pessimistic locking.",
            answer: "Optimistic locking assumes collisions are rare and verifies changes on write (using version fields); pessimistic locking locks the record immediately upon read.",
            solution: "Optimistic locking does not put actual locks on the database. Instead, each row contains a `version` integer. When a user updates a row, the query is executed as: `UPDATE users SET name = 'X', version = version + 1 WHERE id = 1 AND version = 3`. If another transaction edited it first, the version would be 4, the update fails (0 rows affected), and the application triggers a retry. Pessimistic locking runs a select query like `SELECT * FROM users WHERE id = 1 FOR UPDATE`, locking the row at the DB level, forcing other transactions to wait."
        },
        {
            question: "What is a memory leak and how do you find and prevent it?",
            answer: "A memory leak is when allocated memory is no longer needed but not freed. Prevented using automated garbage collection, smart pointers, and profiling tools.",
            solution: "In lower-level languages like C/C++, a leak happens if you run `malloc` but fail to run `free`, solved by using RAII patterns and smart pointers (unique_ptr, shared_ptr). In managed languages like Java/JavaScript, a leak happens if objects are no longer logically needed but remain anchored to a GC Root (such as an unused static map, active listeners, or global event subscriptions). These are detected using profiling tools (like Chrome DevTools, Java VisualVM) that track heap generation cycles over time."
        },
        {
            question: "What is the difference between a mutex and a semaphore?",
            answer: "A mutex is a locking mechanism for a single thread to secure a resource; a semaphore is a signaling mechanism using counter tokens for multiple threads.",
            solution: "A Mutex (Mutual Exclusion) is a binary lock that can only be unlocked by the exact same thread that locked it. It protects shared memory write-collisions. A Semaphore maintains a thread-safe counter representing available units of a shared resource. Threads acquire a unit by calling `wait()` (decrementing counter) and release by calling `signal()` (incrementing counter). Crucially, semaphores can be used for task synchronization, where one thread can trigger `signal()` to wake up another thread waiting on `wait()`."
        }
    ],
    "Frontend Developer": [
        {
            question: "What is the Virtual DOM and how does React use it?",
            answer: "It is a lightweight programming representation of the real DOM. React updates the Virtual DOM first, then performs 'reconciliation' to update only the changed elements in the real DOM.",
            solution: "React keeps a virtual copy of the user interface in memory. When state updates, a new Virtual DOM tree is constructed. React then executes its 'diffing' algorithm (Reconciliation) to compare the new virtual tree against the old virtual tree. It calculates the most efficient, minimal set of DOM operations needed and applies those precise updates directly to the real browser DOM in a single batch, minimizing slow layout re-flows."
        },
        {
            question: "Explain event delegation, event bubbling, and capturing.",
            answer: "Event delegation binds a single event listener to a parent to manage child triggers; bubbling propagates events upwards; capturing goes downwards.",
            solution: "Event Bubbling means when an event triggers on an element, the browser runs handlers on it first, then propagates up through its parent elements up to the document root. Event Capturing is the opposite phase (downwards from root). Event Delegation leverages bubbling: instead of adding 1,000 separate click event listeners to 1,000 list rows, you add a single listener to the parent `<ul>` element. When a row is clicked, the event bubbles up, and the parent reads `event.target` to execute the correct row handler."
        },
        {
            question: "What are the ways to optimize web page loading speed?",
            answer: "By lazy loading assets, using WebP formats, minifying CSS/JS, leveraging CDN caching, and deferring non-essential scripts.",
            solution: "To optimize web speed: 1) Minify and bundle CSS/JS assets to shrink payloads; 2) Compress and convert images to WebP/AVIF formats; 3) Lazy load below-the-fold media using `loading='lazy'`; 4) Serve assets via distributed Content Delivery Networks (CDNs); 5) Add `async` or `defer` tags to script files to ensure they do not block the critical HTML rendering parser path."
        },
        {
            question: "What is CORS and how does the browser handle it?",
            answer: "Cross-Origin Resource Sharing is a browser security mechanism that uses HTTP headers to determine if cross-origin resource requests are authorized.",
            solution: "When a frontend app at `http://domain-a.com` calls an API at `http://api-b.com`, the browser sends an automatic preflight request using the OPTIONS method. The backend must respond with CORS authorization headers, such as `Access-Control-Allow-Origin: http://domain-a.com` and allowed methods. If these headers are missing or do not match, the browser intercepts and blocks the response payload from reaching the frontend JavaScript sandbox."
        },
        {
            question: "Explain the difference between server-side rendering (SSR) and client-side rendering (CSR).",
            answer: "SSR sends fully-rendered HTML from the server to the browser, while CSR sends a blank HTML page with JavaScript that builds the DOM locally.",
            solution: "In CSR, the initial load is slow because the browser must download, parse, and execute a large bundle of JavaScript before anything is rendered on screen, which is also bad for search engine scrapers. In SSR, the server processes the page data and converts it into fully compiled HTML. The browser displays this HTML instantly, allowing extremely fast First Contentful Paint (FCP) and perfect search engine indexing (SEO)."
        },
        {
            question: "What are CSS pseudo-classes and pseudo-elements?",
            answer: "Pseudo-classes represent a special state of elements (e.g., :hover), while pseudo-elements style specific parts of an element (e.g., ::before).",
            solution: "A Pseudo-class is written with a single colon (e.g., `:hover`, `:focus`, `:active`) and matches specific interaction states of DOM nodes. A Pseudo-element is written with a double colon (e.g., `::before`, `::after`, `::first-letter`) and allows developers to style specific parts of a node, or generate virtual content directly inside the CSS stylesheet without injecting physical DOM elements."
        },
        {
            question: "How does the 'this' keyword behave differently in arrow functions versus standard functions?",
            answer: "Arrow functions bind 'this' lexically from their enclosing context, whereas standard functions bind 'this' dynamically based on how they are called.",
            solution: "A standard function dynamically determines its `this` value based on how it is executed (e.g. as an object method, as a standalone function, or bound explicitly using `.bind()`, `.call()`, or `.apply()`). Arrow functions do not declare their own `this` context. Instead, they capture the lexical `this` of their surrounding parent scope at creation time. This is why arrow functions are highly popular as asynchronous callbacks inside class methods."
        },
        {
            question: "What is a closure in JavaScript?",
            answer: "A closure is a function that remembers and accesses its outer scope variables even when executed outside that outer scope.",
            solution: "Every time a function is created in JavaScript, a closure is born. It binds the function block together with its enclosing lexical scope reference environment. This allows inner functions to persist and reference variables declared in their outer parent functions even long after the parent function has completed execution, which is fundamental for creating private variables and module patterns."
        },
        {
            question: "How do you optimize state management in a large React application?",
            answer: "By using local state where possible, memoization (useMemo, useCallback), context splitting, or external libraries like Redux or Zustand.",
            solution: "To prevent unnecessary render cascading: 1) Keep state as close to consumption nodes as possible; 2) Split React Contexts into separate logical states so consumers only re-render when their specific context updates; 3) Use `useMemo` and `useCallback` to prevent reference changes of objects and callback functions; 4) Use lightweight external libraries like Zustand or Redux Toolkit which implement optimized selector-based subscriptions to prevent global components from re-rendering."
        },
        {
            question: "What is the difference between localstorage, sessionstorage, and cookies?",
            answer: "LocalStorage persists until cleared; sessionStorage persists for the tab session; cookies persist until expiration and are sent to the server.",
            solution: "LocalStorage and SessionStorage are modern client-side storage objects with a generous limit of ~5MB. LocalStorage remains persisted even when the browser is closed, whereas SessionStorage is cleared the moment the browser tab is closed. Cookies are limited to 4KB and are automatically appended to the headers of every single outgoing HTTP request to that domain, making them perfect for session keys when combined with the `HttpOnly` and `Secure` flags."
        }
    ],
    "Backend Developer": [
        {
            question: "What is database connection pooling and why is it used?",
            answer: "It maintains a cache of database connections so connections can be reused, avoiding the high overhead of establishing a new connection on every request.",
            solution: "Establishing a new SQL database connection requires a complete TCP socket handshake, cryptographic authentication, and system resource allocation, which adds significant latency (~50-100ms per connection). A connection pool (like HikariCP or pg-pool) maintains a pool of active, warm connections. When the backend receives an API query, it borrows an existing database connection from the pool, executes the query, and releases the connection back to the pool instantly, keeping response latency minimal."
        },
        {
            question: "Explain the difference between SQL joins and subqueries in terms of execution cost.",
            answer: "Joins are generally optimized better by query compilers using hash joins or index lookups, whereas nested subqueries might execute repeatedly (O(n²)).",
            solution: "SQL compilers optimize JOIN queries by loading target rows into memory and performing efficient Hash Joins or Merge Joins. However, with correlated subqueries, the database engine must execute the inner subquery repeatedly for every single row returned by the outer query. This nested loop structure escalates execution costs from O(N) linear time to O(N²) quadratic time, creating massive performance bottlenecks on larger datasets."
        },
        {
            question: "What is a message broker (e.g. Kafka, RabbitMQ) and when would you use it?",
            answer: "An intermediary that enables asynchronous, decoupled communication between microservices by queuing messages safely.",
            solution: "A message broker receives messages from a producer microservice, writes them safely to a queue, and distributes them to consumer services. This allows services to communicate asynchronously. For example, during an e-commerce order checkout, the main checkout API publishes an 'OrderCreated' event to RabbitMQ and responds to the user immediately. RabbitMQ queues the message for separate background services (e.g. Payment Gateway, Inventory Updater, Email Dispatcher) to process at their own pace without slowing down the primary user transaction flow."
        },
        {
            question: "How do SQL databases ensure ACID properties?",
            answer: "Using transaction logs (Write-Ahead Logging), locking mechanisms, multi-version concurrency control (MVCC), and recovery subsystems.",
            solution: "Atomicity is guaranteed via the transaction rollback log. Consistency is enforced by integrity constraints. Isolation is managed by lock managers or MVCC, which serve isolated data versions so concurrent queries do not leak dirty data. Durability is achieved using Write-Ahead Logging (WAL): the database engine writes all transactions to a persistent transaction log file on disk before committing changes to physical database tables, allowing recovery after crashes."
        },
        {
            question: "What is the difference between REST, GraphQL, and gRPC?",
            answer: "REST uses resource-oriented HTTP verbs; GraphQL uses single endpoint queries; gRPC uses protocol buffers over HTTP/2 for low-latency streaming RPC.",
            solution: "REST is simple and utilizes standard HTTP verbs (GET, POST) but suffers from over-fetching/under-fetching data. GraphQL solves this by allowing clients to submit a customized JSON-like query to a single `/graphql` endpoint, fetching only requested fields. gRPC is designed for microservice communication, utilizing Protocol Buffers (compact binary serialization) and HTTP/2 multiplexing, delivering ultra-low latency, bidirectional streaming, and static code generation across different languages."
        },
        {
            question: "Explain the concept of database Sharding.",
            answer: "Splitting a database horizontally across multiple server instances to distribute data and read/write load.",
            solution: "Sharding involves partitioning a single table across separate physical database instances based on a shard key (e.g. `user_id % 4`). Each database instance operates independently. This distributes storage and read/write operations across multiple database servers, enabling databases to scale horizontally beyond the storage and computing limits of a single machine."
        },
        {
            question: "How do you secure a REST API backend?",
            answer: "By using HTTPS, JWT/OAuth token verification, rate limiting, input validation, and secure password hashing algorithms like bcrypt.",
            solution: "Secure backend steps: 1) Force SSL/TLS (HTTPS) to encrypt data in transit; 2) Implement stateless authentication using signed JWT tokens passed via Bearer headers; 3) Rate limit incoming IPs to block DOS attacks; 4) Validate and sanitize all incoming payloads to prevent SQL Injection and command injection; 5) Hash passwords in storage using bcrypt or Argon2 to protect against hash-cracking."
        },
        {
            question: "What is the N+1 query problem and how do you solve it?",
            answer: "It occurs when a query retrieves N records and triggers N additional queries for associated relations. Solved by eager loading or join queries.",
            solution: "If you query 10 blogs and then run a separate query to fetch comments for each blog inside a loop, you run 1 initial query + 10 separate queries, totaling 11 queries. This slow relational loop can be optimized using eager loading or Joins: execute a single SQL query with a JOIN statement (`SELECT * FROM blogs JOIN comments ON blogs.id = comments.blog_id`) to pull all necessary rows into memory in a single database round-trip."
        },
        {
            question: "What is cache invalidation and what are the common strategies?",
            answer: "The process of declaring cached data stale. Strategies include Cache-Aside, Write-Through, Write-Behind, and TTL-based expiry.",
            solution: "Strategies include: 1) Cache-Aside (Lazy loading): read database on cache miss and write to cache; 2) Write-Through: write to cache and database concurrently, guaranteeing consistency; 3) Write-Behind (Write-Back): write to cache instantly, then run asynchronous background queries to sync database, maximizing performance; 4) TTL-based: associate keys with explicit Time-To-Live limits to auto-expire cached records."
        },
        {
            question: "Explain the difference between horizontal and vertical scaling for servers.",
            answer: "Vertical scaling increases the RAM/CPU of a single machine; horizontal scaling adds more server instances behind a load balancer.",
            solution: "Vertical scaling is simple but has a hard physical ceiling and requires hardware downtime. Horizontal scaling involves spinning up multiple server instances (e.g., using Kubernetes or Auto-Scaling Groups) behind a Load Balancer. Traffic is distributed evenly across all instances using algorithms like Round Robin, allowing applications to scale infinitely and provide high fault tolerance if a single server crashes."
        }
    ],
    "Full Stack Developer": [
        {
            question: "Explain the difference between Session-based and Token-based (JWT) authentication.",
            answer: "Session-based is stateful (stored on server memory/session store); JWT is stateless, self-contained, signed cryptographically, and verified client-side.",
            solution: "In Session-based auth, the server creates a unique session ID, stores it in memory (or Redis), and writes it as a cookie on the client browser. The backend must query the session store on every single request. In Token-based auth, the server signs a JSON Web Token containing client claims and sends it back. The client attaches this token in its Authorization Bearer headers. The server can verify the cryptographic signature stateless-ly without querying any session database, enabling stateless microservice scale."
        },
        {
            question: "What is CORS (Cross-Origin Resource Sharing) and how do you resolve it?",
            answer: "A browser security mechanism that restricts cross-origin HTTP requests. Resolved by configuring Access-Control-Allow-Origin headers on the backend server.",
            solution: "CORS is a browser security mechanism, not a backend restriction. It checks whether web domains are authorized to fetch data from another domain. To resolve CORS issues, you must configure the backend API server to return explicit headers: `Access-Control-Allow-Origin: http://your-frontend-domain.com` along with allowed methods (GET, POST, OPTIONS) and authorization credential permissions."
        },
        {
            question: "How would you design a scalable search autocomplete system?",
            answer: "By using a Trie data structure for prefix lookup, backed by Redis for quick prefix key queries and Elasticsearch for complex indexing.",
            solution: "Store matching search phrases inside a Trie (Prefix Tree) data structure. To handle autocomplete at scale: 1) Cache top prefix results in Redis; 2) Index terms in Elasticsearch to support fuzzy matching and phonetic spelling; 3) Record analytics of search queries and aggregate search trends asynchronously using a message queue, updating prefix lookup structures without impacting live user search speeds."
        },
        {
            question: "What are WebSockets and when should you use them over HTTP?",
            answer: "WebSockets provide persistent, bi-directional, full-duplex communication over a single TCP connection. Best for chat apps or live dashboards.",
            solution: "HTTP is unidirectional; clients must initiate requests. WebSockets use a handshake to upgrade an existing HTTP connection to a persistent TCP socket. This allows both client and server to push data instantly in real-time. Best used for collaborative workspaces, multi-player games, live auction platforms, or instant chat systems."
        },
        {
            question: "Explain the Model-View-Controller (MVC) architectural pattern.",
            answer: "MVC divides applications into: Model (data logic), View (display representation), and Controller (user inputs and request handling).",
            solution: "Model-View-Controller splits code bases: 1) Model: maintains application state and database logic; 2) View: renders user interfaces; 3) Controller: receives HTTP requests, processes request validation, queries the Model, and passes output parameters to compile the View. This structure decouples user interfaces from backend database systems."
        },
        {
            question: "What is an ORM and what are its trade-offs?",
            answer: "An Object-Relational Mapper translates DB tables to code classes. Trade-offs: increases developer speed but can lead to unoptimized, hidden DB queries.",
            solution: "An ORM (Object-Relational Mapper like Hibernate or Sequelize) maps relational database rows to object-oriented classes. Trade-offs: 1) Pros: increases coding speed, handles SQL sanitation automatically, and abstracts different database engines; 2) Cons: can generate extremely inefficient, hidden query loops (like the N+1 problem) and restricts direct control over database index configurations."
        },
        {
            question: "How do you debug a production memory leak in a full stack JavaScript application?",
            answer: "By generating heap dumps, inspecting memory trends using Chrome DevTools/Node profiler, and analyzing garbage collection cycles.",
            solution: "Debug steps: 1) Profile Node.js memory consumption trends over time; 2) Force garbage collection and take a baseline memory heap snapshot; 3) Perform several actions typical of the memory leak on the frontend or trigger backend endpoints; 4) Take a second heap snapshot and execute a comparison diff to find nested closures, arrays, or event listeners that failed to get garbage collected."
        },
        {
            question: "What is a Progressive Web App (PWA) and what makes it installable?",
            answer: "A web application that behaves like a native app. Installable via a Service Worker, a Web App Manifest file, and secure HTTPS protocol.",
            solution: "PWA requirements: 1) A Web App Manifest file (`manifest.json`) specifying application names, splash screens, and launch icons; 2) A Service Worker that implements network request intercepting and caching to enable offline functionality; 3) Secure HTTPS protocol; 4) Proper responsive layout designs that scale across mobile and tablet devices."
        },
        {
            question: "Explain the difference between SQL and NoSQL databases.",
            answer: "SQL is relational, schema-restricted, ACID compliant, and scales vertically; NoSQL is non-relational, flexible-schema, eventually consistent, and scales horizontally.",
            solution: "SQL databases use structured tables, strict schemas, foreign key relationships, and enforce ACID properties, making them perfect for financial systems. NoSQL databases (like MongoDB) utilize flexible document formats, support nested arrays, operate on eventual consistency models, and scale out horizontally via built-in partitioning, optimal for large, unstructured datasets."
        },
        {
            question: "How do you protect your web application against Cross-Site Request Forgery (CSRF)?",
            answer: "Using anti-CSRF tokens, configuring SameSite cookies, verifying referrer/origin headers, and avoiding storing session keys in cookies directly.",
            solution: "CSRF forces users to run unauthorized actions on a site where they are authenticated. Protections: 1) Use the `SameSite=Strict` cookie attribute; 2) Generate and validate random anti-CSRF cryptographic tokens inside form fields or headers on every post request; 3) Verify Referrer and Origin headers on incoming API requests to block cross-origin post triggers."
        }
    ],
    "Java Developer": [
        {
            question: "What is the difference between Comparable and Comparator in Java?",
            answer: "Comparable provides single natural ordering with compareTo(); Comparator provides multiple custom sort orders with compare().",
            solution: "Comparable is implemented directly on the target model class (overriding compareTo(obj)). Comparator is a separate utility interface (overriding compare(obj1, obj2)), typically declared via anonymous lambdas. This is crucial for enabling multiple dynamic sort orders (sorting by Name vs Age vs Salary) without cluttering domain classes."
        },
        {
            question: "How does HashMap work internally in Java?",
            answer: "It uses an array of buckets, hashing the key to determine bucket index, and uses linked lists or red-black trees for collision resolution.",
            solution: "HashMap hashes the key's hashcode using a bitwise distribution function to map it to a specific index in its entry array bucket. If multiple keys map to the same bucket (collision), they are chained in a LinkedList. In Java 8, if a bucket's collision chain exceeds 8 nodes and the map's total capacity exceeds 64, the list is auto-converted into a balanced Red-Black Tree, reducing lookup time from O(n) to O(log n)."
        },
        {
            question: "Explain the difference between String, StringBuilder, and StringBuffer.",
            answer: "String is immutable; StringBuilder is mutable and not thread-safe (fastest); StringBuffer is mutable and thread-safe (synchronized).",
            solution: "String is immutable; StringBuilder is mutable and not thread-safe (fastest); StringBuffer is mutable and thread-safe (synchronized)."
        },
        {
            question: "What is Java Garbage Collection and how does it determine dead objects?",
            answer: "It is an automated JVM system that reclaims heap memory by tracing root-references (GC Roots) and destroying unreachable objects.",
            solution: "Garbage collection tracks objects starting from GC Roots (threads, static variables, local stack variables). If an object has no reachable path from these roots, it is declared garbage. The JVM divides heap memory into Young Generation (Eden, Survivor spaces) and Old Generation, executing quick Minor GCs on younger allocations and slower Major GCs on long-lived objects to maintain optimal memory."
        },
        {
            question: "Explain the difference between exception propagation in Checked vs Unchecked exceptions.",
            answer: "Checked exceptions are checked at compile-time and must be declared or caught; Unchecked exceptions (Runtime) propagate automatically up the stack.",
            solution: "Checked exceptions (e.g. IOException, SQLException) inherit from Exception and must be handled using try-catch blocks or declared in the method throws signature, enforcing safety checks at compile-time. Unchecked exceptions (e.g. NullPointerException, ArithmeticException) inherit from RuntimeException and propagate automatically up the execution stack, allowing clean code separation."
        },
        {
            question: "What is the volatile keyword in Java and when is it used?",
            answer: "It ensures variable value changes are written directly to and read from main memory, preventing CPU caching in multi-threaded environments.",
            solution: "In multi-core CPUs, threads might cache fields locally in CPU registers. If thread A updates a field, thread B might read its outdated cached value. Declaring a field `volatile` guarantees that all writes are flushed directly to main memory immediately and all reads are fetched from main memory directly, resolving visibility issues in multithreading."
        },
        {
            question: "What are functional interfaces and lambda expressions in Java 8?",
            answer: "A functional interface has exactly one abstract method (e.g., Runnable). Lambdas provide clean, inline implementations of these interfaces.",
            solution: "Functional interfaces have a single abstract method (SAM) and can be annotated with `@FunctionalInterface`. Lambda expressions provide a concise syntax (`(parameters) -> expression`) to implement these methods without declaring verbose anonymous inner classes, paving the way for Java Streams API and functional programming pipelines."
        },
        {
            question: "How do you implement thread safety in a Java class?",
            answer: "Using synchronized methods/blocks, volatile fields, Atomic wrappers (AtomicInteger), or explicit ReentrantLocks.",
            solution: "Options include: 1) Synchronized keyword: serializes execution access to a method or code block; 2) Atomic variables: utilizes low-level CPU Compare-And-Swap (CAS) operations to update variables without locking; 3) ReentrantLocks: provides advanced lock polling, timing, and conditions; 4) Concurrent Collections: uses thread-safe maps like ConcurrentHashMap."
        },
        {
            question: "What is the difference between Abstract Class and Interface in Java 8+?",
            answer: "Abstract classes can hold instance state and constructors; Interfaces are stateless contracts, but both can hold concrete methods (default/static in interfaces).",
            solution: "Abstract classes model strong identity relationships ('is-a') and can hold instance state variables and constructors. Interfaces model behavioral capabilities ('can-do') and are stateless contracts. With Java 8, interfaces can declare concrete default and static methods, and Java 9 added private methods, minimizing the gap between the two structures."
        },
        {
            question: "Explain JVM architecture and the role of JIT Compiler.",
            answer: "The JVM runs Java bytecode. The Just-In-Time (JIT) compiler compiles frequently executed bytecode segments into native machine code at runtime.",
            solution: "The JVM contains ClassLoader, JVM Memory (Heap, Stack, Method Area, PC Registers), and Execution Engine. During execution, JVM interprets bytecode. The Just-In-Time (JIT) compiler analyzes execution traces at runtime (finding 'hotspots') and compiles hot bytecode segments directly into optimized native CPU machine code, significantly boosting execution speeds."
        }
    ],
    "Python Developer": [
        {
            question: "What is the Global Interpreter Lock (GIL) in Python?",
            answer: "A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.",
            solution: "The GIL is a mutex lock used in CPython (the primary Python implementation) to prevent race conditions during memory reference counting. This means even on a multi-core CPU, only one thread can execute Python bytecode at any given time. While multithreading is still effective for I/O-bound tasks, parallel execution of CPU-bound tasks requires using the `multiprocessing` library to spawn separate OS processes."
        },
        {
            question: "Explain decorators in Python and write a simple one.",
            answer: "A decorator is a function that takes another function as an argument, extends its behavior, and returns a modified wrapper function.",
            solution: "Decorators are syntactic sugar to modify functions. A simple execution-time decorator is written as: \n```python\ndef my_decorator(func):\n    def wrapper(*args, **kwargs):\n        print('Starting')\n        result = func(*args, **kwargs)\n        print('Done')\n        return result\n    return wrapper\n```\nApply this to a target function using `@my_decorator` to dynamically wrap execution."
        },
        {
            question: "How is memory managed internally in Python?",
            answer: "Using private heaps managed by Python's memory manager, using reference counting and a cyclic garbage collector to destroy unreachable variables.",
            solution: "Python allocates memory on a private heap, inaccessible to user code. Python tracks references: when an object's reference counter drops to zero, the memory is freed instantly. To handle circular reference loops (e.g. object A referencing B, and B referencing A), Python runs a generational garbage collector in the background that detects and destroys isolated cycles."
        },
        {
            question: "What is the difference between list and tuple in Python?",
            answer: "Lists are mutable and take slightly more memory overhead; tuples are immutable and can be used as dictionary keys because they are hashable.",
            solution: "Lists are mutable (can be changed in place) and use dynamic over-allocation, leaving empty memory slots to make appending O(1) time. Tuples are immutable, have a static memory footprint, take less space, are faster to construct, and are hashable, meaning they can be used as keys in a Python dictionary."
        },
        {
            question: "Explain generator functions and the yield keyword in Python.",
            answer: "Generators return an iterator lazily, yielding one value at a time on demand, avoiding loading the entire collection into memory.",
            solution: "A generator function uses the `yield` keyword instead of `return`. When called, it does not execute the function. Instead, it returns an iterator. When `next()` is called on this iterator, the function runs until it hits `yield`, freezes state, and returns the yielded value. This allows infinite sequences or processing of large log files without consuming excessive RAM."
        },
        {
            question: "What is the difference between deepcopy and shallowcopy in Python?",
            answer: "Shallow copy duplicates the object but references nested objects; deep copy recursively duplicates the object and all nested items completely.",
            solution: "A shallow copy (`copy.copy()`) creates a new top-level object, but inserts references to the original nested elements. A deep copy (`copy.deepcopy()`) recursively duplicates the parent object and all nested items completely. This is vital to prevent accidental modifications to nested structures in shared objects."
        },
        {
            question: "How does exception handling propagate in Python with try-except-finally?",
            answer: "Try blocks run code; except captures matching exceptions; finally runs cleanup code unconditionally before leaving the function context.",
            solution: "The `try` block contains potentially failing code. If an exception triggers, execution stops instantly, and shifts to matching `except` blocks. If no matching block is found, it propagates up. The `finally` block runs unconditionally, even if an exception is unhandled or a return statement is triggered, making it optimal for close-file operations."
        },
        {
            question: "Explain list comprehensions and their syntax benefits.",
            answer: "They provide a concise way to create lists in a single line, executing faster than standard loops because they run at C-speed internally.",
            solution: "Syntax: `[expr for item in iterable if condition]`. Beyond readability, list comprehensions are optimized because the looping and appending execute inside the C-compiled core of Python, bypassing the slower bytecode execution loop overhead of standard Python for-loops."
        },
        {
            question: "What are Python metaclasses and when are they used?",
            answer: "Metaclasses are 'classes of classes' that define how classes behave and are constructed, typically used in ORM development or API verification.",
            solution: "In Python, classes are objects themselves. A metaclass (inheriting from `type`) defines how these class objects are constructed. By overriding `__new__` or `__init__`, developers can automatically inject methods, modify field names, or enforce strict API contracts at class definition time. This is used extensively in ORM frameworks like Django."
        },
        {
            question: "How do you achieve parallelism in Python for CPU-bound tasks?",
            answer: "By using the multiprocessing module instead of threading to spawn separate processes with their own independent GIL runtimes.",
            solution: "CPython's GIL restricts multithreading from parallelizing CPU-bound operations. To utilize multi-core processors, Python developers use the `multiprocessing` library. This spawns separate OS processes, each with its own memory copy and separate independent interpreter instance (and individual GIL), allowing true parallel CPU computations."
        }
    ],
    "Data Analyst": [
        {
            question: "What is a Window Function in SQL and how does it differ from GROUP BY?",
            answer: "A window function performs calculations across a set of table rows related to the current row, maintaining individual row identities instead of collapsing them.",
            solution: "Unlike GROUP BY which aggregates multiple rows into a single summary output row, Window Functions (using the OVER clause, e.g. RANK() or SUM() OVER(PARTITION BY...)) perform aggregations while preserving the unique identity of each source row, allowing side-by-side comparative analysis."
        },
        {
            question: "What is data wrangling and what Pandas functions are used for it?",
            answer: "Data wrangling is cleaning, structuring, and transforming raw data. Pandas uses merge(), groupby(), pivot_table(), fillna(), and drop_duplicates().",
            solution: "Pandas functions include: 1) `merge()` or `join()` for linking tables; 2) `groupby()` and `agg()` for summarizing groups; 3) `pivot_table()` for complex cross-tabulation; 4) `fillna()` and `dropna()` for clean missing value replacement; 5) `drop_duplicates()` to prune repeat records."
        },
        {
            question: "Explain the difference between descriptive and inferential statistics.",
            answer: "Descriptive statistics summarize and describe data characteristics; inferential statistics use samples to make generalizations/predictions about populations.",
            solution: "Descriptive statistics (mean, median, standard deviation, variance) summarize the attributes of a specific dataset. Inferential statistics (hypothesis testing, t-tests, ANOVA, confidence intervals) utilize sample metrics to make probabilistic predictions and draw conclusions about a wider, unobserved population."
        },
        {
            question: "How do you handle missing values in a dataset?",
            answer: "By deleting rows (if sparse), imputing values (using mean, median, mode, or kNN), or using default indicator values.",
            solution: "Analysis steps: 1) Identify density of missing records; 2) If < 5% are missing at random, drop them; 3) For numerical values, impute using the median (if skewed) or mean; 4) For categorical values, impute using the most frequent mode; 5) For time-series, use forward-fill or linear interpolation to maintain trends."
        },
        {
            question: "What is a correlation matrix and how do you interpret its coefficients?",
            answer: "A table showing correlation coefficients between variables, ranging from -1 (perfect negative), 0 (no correlation), to +1 (perfect positive).",
            solution: "The matrix displays Pearson correlation coefficients (r). A value of +1 represents perfect positive correlation (as X grows, Y grows); -1 represents perfect negative correlation (as X grows, Y shrinks); 0 represents no linear correlation. Analysts use this to prune redundant variables and detect relationships."
        },
        {
            question: "Explain the difference between inner join, left join, and outer join in SQL.",
            answer: "Inner join returns matching rows in both tables; left join returns all from left + matching right; outer join returns all rows from both tables.",
            solution: "Inner Join returns only rows where the join predicate is satisfied in both datasets. Left Join preserves all rows of the left table, inserting NULLs for right table columns if no match is found. Full Outer Join combines both, returning all rows and filling NULLs wherever matches are absent in either table."
        },
        {
            question: "What is an outlier and how do you detect it in a dataset?",
            answer: "An anomaly far from other values, detected using standard deviation thresholds, z-scores, boxplots, or Interquartile Range (IQR).",
            solution: "Outliers are data anomalies. Detection methods: 1) Z-Score: values with z-score > 3 or < -3; 2) Boxplots: visual representation of outliers; 3) IQR Method: find Interquartile Range (Q3 - Q1), define lower bound = Q1 - 1.5*IQR, upper bound = Q3 + 1.5*IQR. Any data outside these bounds is flagged."
        },
        {
            question: "How do you optimize a slow-running SQL analytical query?",
            answer: "By creating indices, avoiding SELECT *, filtering early using WHERE instead of HAVING, and optimizing joins using explain plans.",
            solution: "Optimization checklist: 1) Replace `SELECT *` with explicit columns; 2) Ensure join fields are indexed; 3) Filter rows early using `WHERE` before grouping, rather than using `HAVING` after; 4) Avoid using unindexed functions inside filter conditions (e.g. `WHERE YEAR(date) = 2026`)."
        },
        {
            question: "What is a Pivot Table and when is it best used?",
            answer: "A data summarization tool that automatically aggregates, sorts, counts, or averages table records to reveal structural summaries.",
            solution: "A Pivot Table takes tabular records and allows rapid grouping, aggregating, and cross-tabulating columns. Best used to quickly analyze sales metrics by region, compare product categories across distinct periods, or summarize high-density raw transaction sheets without writing SQL code."
        },
        {
            question: "Explain the difference between structured, semi-structured, and unstructured data.",
            answer: "Structured data fits tidy relational schemas; semi-structured has markers but no rigid layout (JSON, XML); unstructured lacks regular form (video, audio).",
            solution: "Structured data resides in defined row-column tables (SQL). Semi-structured data contains self-describing markers or tags but no strict relational layout (JSON, XML). Unstructured data lacks any pre-defined data model or structural metadata, comprising video files, audio recordings, images, and long-form raw text documents."
        }
    ],
    "Data Scientist": [
        {
            question: "What is the difference between Overfitting and Underfitting and how do you fix them?",
            answer: "Overfitting is high variance (memorizing noise); fixed by regularization or more data. Underfitting is high bias (oversimplified model); fixed by increasing model complexity.",
            solution: "Overfitting occurs when a model fits training data perfectly but fails to generalize to test data. Solve by L1/L2 regularization, dropout, pruning decision trees, or adding training samples. Underfitting happens when a model is too simple to capture patterns. Solve by adding input features, engineering polynomial interactions, or choosing non-linear model classifiers."
        },
        {
            question: "What is the purpose of an ROC curve and AUC score?",
            answer: "ROC plots True Positive Rate vs False Positive Rate at various thresholds. AUC measures the entire two-dimensional area underneath, evaluating classifier quality.",
            solution: "ROC plots True Positive Rate vs False Positive Rate at various thresholds. AUC measures the entire two-dimensional area underneath, evaluating classifier quality."
        },
        {
            question: "What is the central limit theorem (CLT) and why is it important?",
            answer: "The CLT states that the sampling distribution of the mean approaches normal as sample size increases, allowing parametric statistical testing.",
            solution: "The CLT states that regardless of the shape of the underlying population distribution, the sampling distribution of the sample mean will tend toward a normal distribution as the sample size becomes large (typically N >= 30). This is fundamental because it permits parametric statistical hypothesis tests (Z-tests, t-tests) on non-normal datasets."
        },
        {
            question: "Explain the difference between L1 (Lasso) and L2 (Ridge) regularization.",
            answer: "L1 adds absolute value penalty forcing coefficients to zero (feature selection); L2 adds squared penalty shrinking coefficients smoothly.",
            solution: "L1 regularization adds a penalty equal to the absolute value of coefficients. This can drive non-essential coefficients completely to zero, performing automatic feature selection. L2 regularization adds a penalty equal to the square of the coefficients. This shrinks all coefficients proportionally near zero but never completely to zero, maintaining all features."
        },
        {
            question: "What is cross-validation and why do we use it?",
            answer: "A technique where data is split into partitions, training models iteratively on subset combinations to ensure robust model generalizability.",
            solution: "In K-Fold cross-validation, the dataset is split into K equal partitions. The model is trained on K-1 partitions and tested on the remaining single fold. This process is repeated K times so every data point is used for validation once. This provides a robust, low-variance estimate of model generalization performance, minimizing overfitting risks."
        },
        {
            question: "How does the Naive Bayes classifier apply probability rules?",
            answer: "It calculates class probabilities using Bayes' Theorem, making a 'naive' assumption that all input features are independent of each other.",
            solution: "Naive Bayes calculates target class probabilities using: `P(Class|Features) = (P(Features|Class) * P(Class)) / P(Features)`. It makes a 'naive' assumption that the presence of a particular feature in a class is completely unrelated to the presence of any other feature, drastically simplifying calculation complexity."
        },
        {
            question: "Explain precision, recall, and F1-score.",
            answer: "Precision is true positives out of predicted positives; recall is true positives out of actual positives; F1-score is their harmonic mean.",
            solution: "Precision = TP / (TP + FP). Recall = TP / (TP + FN). F1-Score = 2 * (Precision * Recall) / (Precision + Recall). Precision focuses on minimizing false alarms; recall focuses on minimizing missed targets. F1-Score represents their harmonic mean, balancing both metrics when datasets are highly imbalanced."
        },
        {
            question: "What is the difference between supervised and unsupervised learning?",
            answer: "Supervised uses labeled datasets with target outputs; unsupervised finds hidden structures in unlabeled datasets (e.g., clustering).",
            solution: "Supervised learning algorithms are trained on input-output label pairs (e.g., predicting housing price based on size). Unsupervised learning algorithms are fed unlabeled datasets and search for hidden structures, groupings, or clusters (e.g., grouping customers into distinct demographic clusters using K-Means)."
        },
        {
            question: "Explain how a Decision Tree determines its splits.",
            answer: "By calculating metric changes like Information Gain (Entropy reduction) or Gini Impurity reduction to maximize group purity.",
            solution: "At each node, the decision tree tests splitting features. For classification, it calculates the reduction in Gini Impurity or Entropy (Information Gain). For regression, it minimizes the sum of squared errors. The feature split that yields the highest reduction in impurity (maximum sub-group purity) is selected as the split node."
        },
        {
            question: "How does Random Forest improve on standard Decision Trees?",
            answer: "It is an ensemble method that trains multiple trees using bagging (bootstrap aggregating) and random feature selection, reducing overall variance.",
            solution: "A standard decision tree has high variance and overfits easily. Random Forest constructs an ensemble of hundreds of decision trees. It uses Bagging: training each tree on a random bootstrap sample of the dataset, and Random Feature Selection: restricting each node split to a random subset of features. The final prediction is a majority vote, minimizing overall variance."
        }
    ],
    "Machine Learning Engineer": [
        {
            question: "Explain the self-attention mechanism in Transformer architectures.",
            answer: "It computes a weighted representation of inputs, allowing each token to dynamically focus on relevant other tokens regardless of distance.",
            solution: "Given an input sequence, self-attention maps each token to three vectors: Query (Q), Key (K), and Value (V). It calculates attention scores by taking the dot product of Q and K, scales them, and applies softmax. These scores weight the Value vector, allowing the model to establish contextual links between words like 'it' and 'dog' dynamically."
        },
        {
            question: "How does gradient descent optimization find local minima?",
            answer: "By iteratively adjusting parameters in the opposite direction of the gradient of the loss function, scaled by the learning rate.",
            solution: "The gradient of the loss function represents the direction of steepest ascent. Gradient Descent updates model weights by subtracting the gradient scaled by a small 'learning rate' parameter: `W = W - alpha * dL/dW`. This pushes the weights down the loss curve iteratively until reaching a local minimum."
        },
        {
            question: "What is the vanishing gradient problem and how do you resolve it?",
            answer: "In deep networks, backpropagated gradients shrink exponentially, stopping learning. Solved using ReLU activation, residual connections, and batch normalization.",
            solution: "During backpropagation, gradients are multiplied recursively through layers. If activation function derivatives are small (like Sigmoid or Tanh, bounded < 0.25), the gradient shrinks exponentially as it travels backward, leaving early layers untrained. Resolved by using ReLU (derivative of 1 for positive inputs), Skip Connections (in ResNets), and Batch Normalization."
        },
        {
            question: "Explain the difference between batch normalization and layer normalization.",
            answer: "Batch normalization normalizes activations across the batch dimension; layer normalization normalizes activations across the feature channel dimension.",
            solution: "Batch Normalization computes mean and variance across the mini-batch for each individual feature, which makes it dependent on batch sizes and unsuited for recurrent networks (RNNs). Layer Normalization computes mean and variance across all features of a single input sequence, making it batch-size independent and perfect for RNNs and Transformers."
        },
        {
            question: "What is transfer learning and when should you use it?",
            answer: "Reusing a pre-trained model on a new related task, saving computation and training data requirements (e.g., fine-tuning BERT).",
            solution: "Instead of training a model from scratch, Transfer Learning loads weights from an extremely large, pre-trained model (e.g. ResNet for computer vision or BERT/GPT for NLP). The base feature-extractor layers are frozen, and only the final classification layers are fine-tuned on the user's small custom dataset, reducing training compute requirements."
        },
        {
            question: "How does convolutional operations (CNNs) process spatial images?",
            answer: "Using learnable sliding filters (kernels) that perform dot products over local receptive fields to detect hierarchical spatial patterns.",
            solution: "A convolutional layer slides small matrices (filters, e.g. 3x3) across the image width and height. At each step, a mathematical dot product is performed between the filter and the underlying pixel window. These operations detect spatial patterns (edges in early layers, complex shapes in later layers) while maintaining parameter sharing."
        },
        {
            question: "Explain the trade-offs of using Adam optimizer vs SGD.",
            answer: "Adam adapts learning rates dynamically for faster convergence; Stochastic Gradient Descent (SGD) with momentum generalized better in some deep tasks.",
            solution: "Adam calculates adaptive learning rates for each parameter based on first and second moments of the gradient, making it robust to initial settings and converging extremely fast. SGD with momentum uses a constant learning rate but incorporates historical gradient velocity. While slower to converge, SGD often achieves superior generalization."
        },
        {
            question: "What is model quantization and why is it used?",
            answer: "Reducing model weight precision (e.g., FP32 to INT8) to optimize execution speed and fit models onto edge devices.",
            solution: "Model Quantization converts floating-point weights (32-bit float) to lower-precision representations (such as 8-bit integers). This shrinks the physical model storage footprint, accelerates mathematical execution times on specialized neural processors, and lowers CPU power draw, crucial for running deep learning models on mobile devices."
        },
        {
            question: "Explain data leakage in machine learning datasets.",
            answer: "When information from the target label or future test set accidentally contaminates the training set, giving misleadingly high accuracy.",
            solution: "Data Leakage happens when target details are mixed into training features (e.g., including future hospital discharge records when predicting current patient stay durations). Prevented by strictly splitting train/test datasets before performing any data cleaning, scaling, or feature engineering transformations."
        },
        {
            question: "What is hyperparameter tuning and what are the main methods?",
            answer: "Finding optimal settings not learned directly. Methods include Grid Search, Random Search, and Bayesian Optimization.",
            solution: "Hyperparameters (learning rate, depth) are settings not optimized by training. Tuning methods: 1) Grid Search: exhaustively evaluates all combinations; 2) Random Search: evaluates random selections, often finding optimal settings much faster; 3) Bayesian Optimization: models hyperparameter performance probabilistically to choose the best next settings."
        }
    ],
    "DevOps Engineer": [
        {
            question: "What is Infrastructure as Code (IaC) and its primary benefit?",
            answer: "Managing infrastructure through machine-readable configuration files (like Terraform, Ansible), ensuring repeatable and error-free deployments.",
            solution: "IaC treats servers, networks, and databases as software definitions. Configurations are version-controlled in Git. This guarantees environment consistency between staging and production, prevents configuration drift, and allows automated rolling deployments without manual dashboard clicking."
        },
        {
            question: "Explain the differences between virtual machines and Docker containers.",
            answer: "VMs virtualize the underlying hardware and pack a full guest OS; Docker containers virtualize only the OS kernel, making them lightweight.",
            solution: "Virtual Machines use a Hypervisor to slice physical hardware, running separate guest operating systems on top, which has high memory overhead. Docker containers run directly on the host machine's OS kernel, isolating process namespaces. Containers are extremely lightweight (~megabytes), spin up instantly, and deliver high compute density."
        },
        {
            question: "What is GitOps and how does it relate to CI/CD pipelines?",
            answer: "An operational model that uses Git as the single source of truth for declarative infrastructure and continuous delivery changes.",
            solution: "In GitOps, the entire infrastructure state (such as Kubernetes manifests) is defined in a Git repository. A continuous reconciliation agent (like ArgoCD) runs inside the cluster. If Git changes, ArgoCD automatically deploys the difference. If manual changes are made inside the cluster, ArgoCD overwrites and pulls them back to Git configurations, preventing drift."
        },
        {
            question: "How does blue-green deployment work and what is its benefit?",
            answer: "Running two identical production environments (Blue and Green). Traffic is routed to one while deploying to the other, guaranteeing zero downtime.",
            solution: "Blue-green deployment keeps two identical active server environments. At baseline, all public traffic routes to 'Blue' (running version 1.0). The developer deploys version 2.0 to 'Green', running verification tests. Once ready, the load balancer configuration is toggled to route traffic to 'Green' instantly, offering zero-downtime releases."
        },
        {
            question: "What is a rolling update in deployment architectures?",
            answer: "Gradually replacing old service containers or instances with new ones to ensure application availability is never interrupted.",
            solution: "A Rolling Update gradually replaces active application instances. The orchestrator spawns a new version 2.0 container, verifies its health check, routes traffic to it, and then terminates a single version 1.0 container. This incremental process repeats across the cluster, ensuring that some percentage of healthy instances are active to serve incoming requests."
        },
        {
            question: "Explain the role of Prometheus and Grafana in production observability.",
            answer: "Prometheus polls and stores time-series metric data; Grafana queries Prometheus to render beautiful visual analytics dashboards.",
            solution: "Prometheus operates on a pull-model, hitting server endpoints (`/metrics`) periodically to record time-series logs (CPU usage, memory, request latency). Grafana queries this backend database and compiles dashboards, configuring real-time notifications (Slack, PagerDuty) if latency metrics or server errors exceed thresholds."
        },
        {
            question: "What is a reverse proxy and how does it differ from a forward proxy?",
            answer: "A reverse proxy acts on behalf of backend servers to receive public client traffic; a forward proxy acts on behalf of private clients to access public web pages.",
            solution: "A forward proxy sits in front of clients, masking their identity as they access external sites (common in corporate firewalls). A reverse proxy (like Nginx) sits in front of backend servers, receiving all incoming client queries. It manages SSL/TLS decryption, caches static pages, handles compression, and distributes load."
        },
        {
            question: "How do you handle secrets securely in automated deployment pipelines?",
            answer: "Using secure secret vaults (Vault, AWS Secrets Manager) and passing them via runtime environment variables rather than committing keys to Git.",
            solution: "Never commit API keys or passwords to Git. Instead, store them in secure vault stores like AWS Secrets Manager or HashiCorp Vault. During CI/CD pipelines (such as GitHub Actions), fetch these secrets securely at runtime and pass them to the application containers via isolated, transient environment variables."
        },
        {
            question: "What is container orchestration and why is Kubernetes used?",
            answer: "Automating the deployment, scaling, routing, and lifecycle of containerized services at scale.",
            solution: "Kubernetes coordinates a cluster of virtual machines. It automates container deployments, schedules workloads, scales instances based on CPU limits, sets up load balancers, and implements automated self-healing (restarting crashed containers instantly), allowing microservices to operate reliably at enterprise scale."
        },
        {
            question: "What is a canary deployment strategy?",
            answer: "Releasing updates gradually to a tiny fraction of users first (the canary) to verify stability before rolling it out to everyone.",
            solution: "The Load Balancer is configured to route 95% of incoming public traffic to production version 1.0, and 5% to version 2.0. DevOps teams monitor error rates and latency on the 5% segment. If any regressions are detected, traffic is toggled back to 1.0 instantly. If stable, the updated version is rolled out to 100% of the cluster."
        }
    ],
    "Cloud Solutions Architect": [
        {
            question: "Explain the difference between horizontal and vertical scaling in the cloud.",
            answer: "Horizontal scaling adds more machine instances to the pool (scaling out); vertical scaling increases the RAM/CPU of existing machines (scaling up).",
            solution: "Vertical scaling has hard hardware limits and requires downtime during upgrades. Horizontal scaling (adding VM instances behind an Auto-Scaling Group and Load Balancer) provides elastic scaling capabilities that can grow dynamically during spikes and scale back to zero during idle hours, delivering high availability."
        },
        {
            question: "What is a Content Delivery Network (CDN) and how does it improve app latency?",
            answer: "CDNs cache static web pages and files on distributed edge servers worldwide, serving content from locations closest to users.",
            solution: "Instead of routing all user requests back to a central server region, CDNs (like Cloudflare or CloudFront) replicate static assets (images, HTML, JS) to hundreds of physical 'Edge Locations' globally. When a user requests a file, the CDN serves it from the edge server physically closest to them, bypassing network latency."
        },
        {
            question: "What is serverless computing (e.g., AWS Lambda, Cloud Functions)?",
            answer: "A cloud-execution model where cloud providers dynamically manage physical machine allocation, charging only for active query executions.",
            solution: "In serverless, the cloud provider manages infrastructure entirely. Code is uploaded as functions (AWS Lambda). The function is completely idle, consuming zero costs. When an event triggers (like an HTTP call), the provider spins up a transient container, runs the function, and destroys it, charging only for active computing milliseconds."
        },
        {
            question: "Explain the concept of Multi-AZ (Availability Zone) deployment.",
            answer: "Deploying cloud resources across distinct isolated physical data centers within a region to ensure instant failover during physical failures.",
            solution: "Availability Zones are physically separate data centers within a region, equipped with independent power and networking. Setting up Multi-AZ deployments (e.g. running redundant databases in separate AZs) ensures that if an entire physical data center suffers a power grid failure, traffic is immediately failed over to the other AZ."
        },
        {
            question: "What is a Virtual Private Cloud (VPC) and how does it secure servers?",
            answer: "An isolated private network in a public cloud, allowing architects to isolate databases in private subnets unreachable from the internet.",
            solution: "A VPC provides network isolation. Architects organize resources into Public Subnets (routing public internet traffic to web gateways) and Private Subnets (blocking external traffic entirely). Databases are placed in private subnets, only allowing connections from web servers, neutralizing external hacking vectors."
        },
        {
            question: "How do you design a database for disaster recovery (DR)?",
            answer: "By setting up automated snapshotting, multi-region database replication, and planning for RTO (Recovery Time Objective) goals.",
            solution: "Design standard: 1) Configure automated multi-region replication so if an entire cloud region goes offline, a secondary regional copy can be promoted; 2) Set up continuous automated snapshotting with high retention; 3) Clearly define and test RTO (restore speed limits) and RPO (acceptable data loss thresholds)."
        },
        {
            question: "What is object storage and how does it differ from block storage?",
            answer: "Object storage (e.g. S3) stores unstructured assets via unique keys; block storage acts like a physical hard drive mapped to a virtual machine.",
            solution: "Block storage (e.g. AWS EBS) acts as a high-speed hard drive mapped to a single virtual machine instance, optimal for databases. Object storage (e.g. AWS S3) is a serverless, highly-durable flat bucket where files are saved as independent objects with unique keys, scaling infinitely and perfect for media assets."
        },
        {
            question: "Explain the 'Shared Responsibility Model' in public cloud security.",
            answer: "Cloud providers secure physical infrastructure (security of the cloud); clients secure their OS settings, configurations, and data (security in the cloud).",
            solution: "The cloud provider secures physical data centers, host hardware, and virtualization hypervisors (Security 'of' the Cloud). The client is responsible for configuring access policies, setting up firewall rules (security groups), maintaining OS security patches, and encrypting their data (Security 'in' the Cloud)."
        },
        {
            question: "What is a Load Balancer and what are the main types?",
            answer: "A routing mechanism distributing incoming app traffic. Main types: Application Load Balancers (HTTP/Layer 7) and Network Load Balancers (TCP/Layer 4).",
            solution: "Load Balancers distribute incoming traffic across healthy target servers. 1) Application Load Balancer (ALB, Layer 7) routes traffic based on HTTP headers, cookies, or path targets (e.g. routing `/api` to different backend servers); 2) Network Load Balancer (NLB, Layer 4) handles raw TCP/UDP, delivering ultra-high speed routing."
        },
        {
            question: "How would you optimize cloud spend for an idle development environment?",
            answer: "By setting up scaling rules to scale down to zero during off-hours, using spot instances, and deleting orphaned block storage drives.",
            solution: "Cost optimizations: 1) Auto-scale servers to zero or single instances during off-hours (nights and weekends); 2) Use Spot/Ad-hoc VM instances (offering up to 90% savings over on-demand); 3) Track and delete orphaned block storage volumes; 4) Use serverless databases that charge only per request."
        }
    ],
    "Cyber Security Analyst": [
        {
            question: "What is SQL Injection (SQLi) and how do you prevent it?",
            answer: "A vulnerability where malicious SQL commands are injected into input fields. Prevented by using parameterized queries and prepared statements.",
            solution: "SQL Injection happens when untrusted user input is directly concatenated into SQL strings. This allows hackers to bypass login pages or drop tables. Use Prepared Statements: the SQL query structure is pre-compiled by the DB engine, and user inputs are strictly treated as parameters, never as executable code."
        },
        {
            question: "What is the difference between symmetric and asymmetric encryption?",
            answer: "Symmetric uses the same key for both encryption and decryption; asymmetric uses a public key to encrypt and a private key to decrypt.",
            solution: "Symmetric encryption (e.g., AES) is extremely fast and computationally lightweight but requires secure key sharing. Asymmetric encryption (e.g., RSA) uses two mathematically linked keys: a public key (shareable with anyone to encrypt payloads) and a private key (kept secret to decrypt), resolving key distribution issues."
        },
        {
            question: "Explain Cross-Site Scripting (XSS) and the three main types.",
            answer: "XSS injects malicious client-side scripts into trusted web pages. Three types: Reflected (immediate request), Stored (saved in DB), and DOM-based.",
            solution: "XSS allows attackers to execute scripts in a victim's browser. 1) Stored XSS: malicious scripts are saved to the database and displayed to visitors; 2) Reflected XSS: scripts are embedded in a link and reflected instantly by the server; 3) DOM-based XSS: payload modifies the DOM locally. Prevented using HTML escaping and sanitization."
        },
        {
            question: "What is the purpose of salting passwords before hashing them?",
            answer: "Salting appends unique random bytes to passwords before hashing, rendering pre-computed rainbow table attacks completely useless.",
            solution: "Without salt, identical passwords yield identical hash outputs, allowing hackers to look up matches using pre-computed directories (Rainbow Tables). Salting appends a unique random byte sequence to each password before passing it to modern hashing algorithms like bcrypt, ensuring identical passwords yield completely unique hashes."
        },
        {
            question: "Explain the concept of Zero Trust security.",
            answer: "A security framework that assumes threats exist everywhere, strictly requiring continuous verification of every device, user, and transaction.",
            solution: "Traditional security uses a 'perimeter model' (trusting everything inside). Zero Trust operates on the principle of 'never trust, always verify'. Every single access request is authenticated, authorized, and cryptographically validated, restricting access to the absolute minimum privilege needed."
        },
        {
            question: "What is a Man-in-the-Middle (MITM) attack and how is it prevented?",
            answer: "An attacker intercepts communication between two parties. Prevented by using HTTPS, SSL/TLS certificates, and robust cryptographic protocols.",
            solution: "Attackers intercept communication on public networks (such as rogue Wi-Fi hotspots) to read password hashes or steal sessions. Prevention requires enforcing end-to-end encryption using HTTPS and TLS certificates, combined with HTTP Strict Transport Security (HSTS) headers to block downgrade attacks."
        },
        {
            question: "What is the difference between vulnerability scanning and penetration testing?",
            answer: "Vulnerability scanning is an automated tool scan for known flaws; penetration testing is a hands-on manual attack simulation to compromise systems.",
            solution: "Vulnerability scanning is a passive, automated scan checking servers against databases of known software CVEs. Penetration testing is an active, manual ethical hack simulation where analysts attempt to actively bypass security controls, escalate system privileges, and compromise databases, testing both tech and process."
        },
        {
            question: "Explain multi-factor authentication (MFA) and the three factors of authentication.",
            answer: "Securing log-ins using combinations of: Something you know (password), Something you have (token), and Something you are (biometrics).",
            solution: "MFA enforces validation across distinct categories: 1) Knowledge factor: something you know (password, pin); 2) Possession factor: something you have (physical key, authenticator app OTP); 3) Inherence factor: something you are (fingerprint, face recognition). If one factor is stolen, the account remains protected."
        },
        {
            question: "What is Cross-Site Request Forgery (CSRF) and how is it blocked?",
            answer: "An attack that forces users to run unwanted actions on a web app where they are authenticated. Prevented by using anti-CSRF tokens.",
            solution: "If a user is logged into their bank and visits a malicious page, that page can trigger a post request to transfer funds. Since the browser automatically appends session cookies, the bank processes it. Blocked using `SameSite=Strict` cookie settings and validating random cryptographic anti-CSRF tokens on all modifying post endpoints."
        },
        {
            question: "Explain the role of a firewall and the difference between stateless and stateful filtering.",
            answer: "A firewall blocks unauthorized network traffic. Stateless checks packets individually; stateful monitors packet history context in the active connection.",
            solution: "A stateless firewall inspects packets individually, filtering strictly by port and IP addresses. A stateful firewall tracks active connections. It understands whether a packet is part of an ongoing, authorized TCP session, automatically blocking rogue external packets attempting to simulate session answers."
        }
    ],
    "QA Automation Engineer": [
        {
            question: "Explain the Page Object Model (POM) design pattern in automation.",
            answer: "It structures test scripts by creating a separate class file for each web page to hold locators and user actions, enhancing maintainability.",
            solution: "In standard test scripts, UI elements are hardcoded, making maintenance difficult if elements change. In POM, each web page has an associated Page Class. The test script calls methods on these classes (e.g. `LoginPage.login(user, pass)`), separating test logic from specific DOM locators."
        },
        {
            question: "What are assertions in unit testing frameworks?",
            answer: "Validation verification checks that compare expected results against actual outcomes to flag test failures instantly.",
            solution: "Assertions are structural checks. When a test script executes code (e.g. `calculator.add(2, 3)`), an assertion statement like `assertEquals(5, result)` verifies the correctness. If the value matches, the test passes; if not, an AssertionFailed exception is thrown, halting execution and logging detailed tracebacks."
        },
        {
            question: "Explain the difference between regression testing and smoke testing.",
            answer: "Smoke testing verifies if the core critical pathways of an app run cleanly; regression testing verifies if recent code additions broke old features.",
            solution: "Smoke testing consists of a quick suite of tests executing basic operations (e.g., verifying if the app loads, login page works). Regression testing is a comprehensive suite run before production releases, ensuring that new features or bug fixes did not accidentally break existing stable code."
        },
        {
            question: "What is continuous testing in CI/CD pipeline structures?",
            answer: "Automating test runs on every code commit or deployment stage, catching software defects immediately.",
            solution: "Continuous testing integrates QA scripts directly into DevOps CI/CD pipelines (e.g. Jenkins, GitHub Actions). Every time a developer commits code, unit tests, integration tests, and headless browser tests are run automatically. If any test fails, the build is blocked, preventing bug leakage to production."
        },
        {
            question: "What is the difference between unit testing, integration testing, and system testing?",
            answer: "Unit tests check isolated functions; integration tests check interacting combined modules; system tests verify end-to-end user flows.",
            solution: "Unit testing isolates individual code functions or methods using mocks. Integration testing tests the data communication interfaces between multiple combined modules (such as verifying if the API talks to the DB). System testing is end-to-end, testing the entire compiled application flow from a user perspective."
        },
        {
            question: "How do you handle dynamic elements in UI automation (like Selenium)?",
            answer: "Using explicit wait conditions (waiting for elements to be visible/clickable) instead of static sleep thread timers.",
            solution: "Avoid using static timers like `Thread.sleep(5000)`, which make test suites slow and flaky. Instead, implement Explicit Waits (e.g., waiting for an element to satisfy explicit conditions like visibility or clickability) or Fluent Waits with defined polling intervals, ensuring tests run as fast as possible."
        },
        {
            question: "What is boundary value analysis in test case design?",
            answer: "A technique that tests extreme edge input values (exactly on, below, and above boundaries), as systems frequently fail at margins.",
            solution: "If an input field accepts integers between 1 and 100, boundary value analysis designs tests for: 0 and 1 (lower boundary), 100 and 101 (upper boundary), along with standard mid-range values. Software logic errors frequently trigger at these exact edge transitions."
        },
        {
            question: "What is test coverage and how is it measured?",
            answer: "The metric indicating the percentage of code lines, branches, or paths executed during test runs.", explanation: "Tests metrics of software test completeness.",
            solution: "Test coverage is calculated using analysis engines (like Istanbul/NYC for JS or JaCoCo for Java). It tracks which lines of code were executed during test suites, identifying uncovered paths or missing branch conditions (e.g., verifying if the exception handler block was ever executed during testing)."
        },
        {
            question: "Explain mock testing and stubbing.",
            answer: "Stubs are simple hardcoded data providers; Mocks simulate active component behavior with assertions verifying specific interaction pathways.",
            solution: "A Stub is an object that provides predefined, hardcoded inputs to bypass slow network calls. A Mock is an advanced verification object that registers and asserts interactions (e.g., verifying that a notification service method was called exactly once with specific parameter strings during the test flow)."
        },
        {
            question: "What is behavior-driven development (BDD) and what tools support it?",
            answer: "An agile methodology writing tests in plain natural language (Gherkin syntax) using Cucumber or SpecFlow.",
            solution: "BDD structures collaboration using Gherkin syntax (Given-When-Then): `Given a user is on login page / When they enter valid credentials / Then they should see the dashboard`. Automation engineers use frameworks like Cucumber to parse this plain text and map each line to specific browser automation commands."
        }
    ],
    "Product Manager": [
        {
            question: "How do you prioritize features using frameworks?",
            answer: "By using structured models like RICE (Reach, Impact, Confidence, Effort) to rank business value.",
            solution: "Frameworks prevent feature creep and emotional decision-making. RICE calculates priority score = (Reach × Impact × Confidence) / Effort. This quantifies features based on user size and engineering constraints, ensuring products deliver high user value per developer hour spent."
        },
        {
            question: "Explain the concept of an MVP (Minimum Viable Product).",
            answer: "The version of a new product that allows a team to collect the maximum amount of validated customer learning with the least feature effort.",
            solution: "An MVP is not a half-baked product; it is the simplest version of a feature that delivers immediate core value to a user. It allows product teams to launch fast, test assumptions, measure real user engagement, and gather validation before investing heavy development budget into full scaling."
        },
        {
            question: "What is product-market fit (PMF) and how do you track it?",
            answer: "The scenario where a product successfully satisfies a strong target market need. Tracked via retention rates, NPS scores, and customer surveys.",
            solution: "PMF occurs when users love and adopt a product. Tracked using the 'Sean Ellis' survey question: if >= 40% of surveyed users answer they would be 'very disappointed' if your product disappeared, PMF is strong, accompanied by high retention plateau curves and positive Net Promoter Scores (NPS)."
        },
        {
            question: "Explain the difference between a product roadmap and a product backlog.",
            answer: "A roadmap is a high-level visual timeline of product vision and strategy; a backlog is a granular list of prioritized engineering tasks.",
            solution: "A product roadmap is a strategic, high-level vision document that communicates major milestones, goals, and 'themes' over quarterly timelines. The product backlog is a granular, living document managed by the product owner, consisting of detailed user stories, tasks, and bug fixes prioritized for upcoming sprints."
        },
        {
            question: "How do you handle feature requests from key enterprise clients that conflict with product vision?",
            answer: "By listening to understand underlying pain points, evaluating overall user segment impact, and declining if it creates custom code creep.",
            solution: "PM strategy: 1) Have a detailed call to uncover the root user problem (avoid agreeing to specific solutions immediately); 2) Quantify how many other users have this pain point; 3) If it diverges from core vision, decline politely and explain how it conflicts with the product's standardized roadmap."
        },
        {
            question: "What is A/B testing and when should it be conducted?",
            answer: "Running user split-tests showing variations (A and B) to different segments to statistically measure which one optimizes key target metrics.",
            solution: "A/B testing serves variation A to 50% of users and variation B to 50% of users. Conduct this when you have sufficient traffic to establish statistical significance. By isolating a single variable change (e.g. CTA button color or pricing text), you can measure which variation achieves a higher conversion rate."
        },
        {
            question: "Explain user retention rate and churn rate.",
            answer: "Retention rate is the percentage of active returning users; churn rate is the percentage of users who stop using the product.",
            solution: "Retention Rate measures the percentage of users who remain active over defined periods (e.g. Day 30 Retention). Churn Rate is the inverse: the percentage of users who cancel subscriptions or stop using the app. High churn indicates a leaky bucket, requiring product usability focus before spending budget on marketing acquisition."
        },
        {
            question: "How do you define a North Star Metric?",
            answer: "The single key metric that best captures the core value your product delivers to its customers.",
            solution: "The North Star Metric must align company vision with value. For Spotify, it is 'Time Spent Listening'; for Airbnb, it is 'Nights Booked'. It must be a leading indicator of customer value, team execution, and business revenue growth."
        },
        {
            question: "What is agile scrum methodology and the role of a product owner?",
            answer: "An iterative development framework where the product owner curates the user stories backlog, prioritizing feature deliverables for sprints.",
            solution: "Agile Scrum splits work into 2-4 week sprint cycles. The Product Owner acts as the bridge between stakeholders and developers. They write detailed user stories with strict acceptance criteria, prioritize the backlog, and participate in sprint planning to ensure the engineering team works on high-value features."
        },
        {
            question: "Explain the customer acquisition cost (CAC) and customer lifetime value (LTV) ratio.",
            answer: "CAC measures cost to win a user; LTV measures total value they spend. A healthy software PM target is an LTV:CAC ratio > 3:1.",
            solution: "Customer Acquisition Cost (CAC) is total marketing/sales spend divided by customers won. Customer Lifetime Value (LTV) is the total net revenue a user generates. A healthy SaaS product targets an LTV:CAC ratio of 3:1 or higher. A 1:1 ratio indicates that the product spends too much on marketing relative to the value it delivers."
        }
    ],
    "UI/UX Designer": [
        {
            question: "What is accessibility (WCAG) and why is it vital in interface design?",
            answer: "Web Content Accessibility Guidelines guarantee that web interfaces are usable for disabled individuals via high color contrasts and clean layout patterns.",
            solution: "Accessibility compliance ensures that visual elements use WCAG-compliant color contrast ratios (typically 4.5:1), features are fully keyboard-navigable, and HTML structures utilize semantic ARIA labels, allowing screen-readers to parse application flows correctly for visually impaired users."
        },
        {
            question: "What is the difference between a wireframe, a mockup, and a prototype?",
            answer: "Wireframes are low-fidelity layouts; mockups are static high-fidelity visuals; prototypes are interactive user-flow simulations.",
            solution: "A Wireframe is a black-and-white low-fidelity schematic focusing on content structure and layout. A Mockup is a static high-fidelity visual design introducing colors, grids, typography, and precise icon assets. A Prototype is an interactive simulation of these mockups, linking buttons to pages to test user flows."
        },
        {
            question: "Explain visual hierarchy and how to create it on a webpage.",
            answer: "Arranging design elements in order of importance, using size contrasts, whitespace padding, color highlights, and typography weights.",
            solution: "Visual hierarchy guides the user's eyes across a page. It is established by: 1) Size: making key headings larger; 2) Contrast: using bold primary colors on CTAs; 3) Proximity: grouping related items; 4) Whitespace: leaving negative space around critical items to make them stand out."
        },
        {
            question: "What is user testing and what are the main methodologies?",
            answer: "Evaluating interfaces with real users. Methodologies include moderated user usability tests, card sorting, tree testing, and eye tracking.",
            solution: "Methodologies include: 1) Moderated Usability Testing: watching users execute tasks while thinking aloud; 2) Unmoderated Testing: users run automated scripts remotely; 3) Card Sorting: users group topics to test navigation structure; 4) A/B Testing: comparing visual variants with live traffic metrics."
        },
        {
            question: "What is the difference between UI design and UX design?",
            answer: "UI (User Interface) focuses on visual aesthetics, grids, colors, and layout; UX (User Experience) focuses on system architecture, user journeys, and utility.",
            solution: "UI design is about the look and feel—including color schemes, button styles, typography, spacing, and animations. UX design is about the overall user flow, mapping user journeys, conducting research, optimizing navigation layouts, and ensuring the product is intuitive, useful, and satisfying to navigate."
        },
        {
            question: "Explain the rule of whitespace (negative space) in clean UI layouts.",
            answer: "Uncluttered negative space prevents visual fatigue, groups adjacent elements logically, and guides user focus to key CTAs.",
            solution: "Whitespace is a critical design tool. It is not empty space; it provides breathing room for design layouts. Proper whitespace separates non-adjacent sections, groups related items naturally (Gestalt principles), reduces cognitive strain, and increases the readability of long-form text content."
        },
        {
            question: "What are design systems and why are they maintained in software teams?",
            answer: "A unified library of reusable UI components, design tokens, and style rules ensuring brand consistency across platforms.",
            solution: "A Design System (e.g. Material Design or Tailwind) is a shared collection of reusable components (buttons, cards, forms), design tokens (colors, font sizes), and strict usage guidelines. It bridges design and code, ensuring visual consistency, and drastically accelerating development cycles."
        },
        {
            question: "Explain cognitive load in product design.",
            answer: "The mental processing effort required for users to interact with an interface, which UX designers minimize by simplifying choices.",
            solution: "Cognitive load is the brainpower required to use an interface. Designers minimize this by using standard UI conventions (e.g., placing the cart icon top-right), reducing the number of form fields, organizing long checklists into multi-step wizards, and presenting clear error messages."
        },
        {
            question: "What is mobile-first design and why is it prioritised?",
            answer: "Designing the interface for mobile viewports first, then scaling up to desktop screens, which forces clean, minimal layout focus.",
            solution: "Over 50% of global web traffic is mobile. Mobile-first design forces designers to prioritize essential content and simple interactions due to limited screen real estate. It ensures that when scaling layouts up to desktop monitors, the user interface remains clean, focused, and free of unnecessary clutter."
        },
        {
            question: "Explain color theory and how it impacts brand psychology.",
            answer: "Using color relationships to evoke emotional responses (e.g., blue suggests security; red alerts urgency) while maintaining contrast accessibility.",
            solution: "Color theory combines the physics of light with psychological triggers. Blue evokes trust and security (common in banks); green suggests health and growth; red communicates urgency. UX designers must balance brand psychology with accessibility contrast guidelines (WCAG standards)."
        }
    ],
    "Database Administrator (DBA)": [
        {
            question: "What is database normalization and what are 1NF, 2NF, and 3NF?",
            answer: "Structuring tables to remove redundancy. 1NF removes duplicates; 2NF ensures all fields depend on key; 3NF removes transitive dependencies.",
            solution: "Normalization eliminates anomalies during insertions or deletions: \n- 1NF requires tabular structure with atomic cells.\n- 2NF requires 1NF and ensures all non-key columns depend fully on the primary key.\n- 3NF requires 2NF and removes any transitive dependencies (where a non-key column depends on another non-key column)."
        },
        {
            question: "How does Master-Slave replication function in a production database?",
            answer: "All write queries route to the Master node, which synchronizes records to Slave nodes that exclusively serve read queries, boosting scale.",
            solution: "All database modification queries (INSERT, UPDATE, DELETE) route exclusively to a single primary 'Master' database instance. The master writes changes to its transaction log and replicates them asynchronously to multiple secondary 'Slave' instances. Read operations are distributed across the slaves, significantly increasing read scale."
        },
        {
            question: "What is database clustering and how does it prevent downtime?",
            answer: "Linking multiple database server nodes to operate as a single virtual system, ensuring instant failovers if a physical server node crashes.",
            solution: "A Database Cluster links multiple physical database servers. Active-Passive clustering configures a primary node with a standby standby node; if the primary crashes, a heart-beat monitor detects failure and automatically promotes the standby to primary in seconds, ensuring near-zero downtime."
        },
        {
            question: "Explain database transactions and the WAL (Write-Ahead Logging) protocol.",
            answer: "Transactions are logical units of database modifications. WAL writes log details to disk before modifying actual data pages, ensuring durability.",
            solution: "To guarantee durability in ACID transactions, databases use Write-Ahead Logging. Every database operation is written to a sequential, append-only WAL log file on disk before any changes are written to the main table indexes in memory, allowing recovery during sudden power cuts."
        },
        {
            question: "What is query optimization and how do you analyze a slow query?",
            answer: "Evaluating index layouts and running EXPLAIN commands to read execution pathways, finding table scans or slow nested loops.",
            solution: "Run `EXPLAIN ANALYZE` before the slow query. The output shows the execution plan compiled by the database planner, highlighting costly operations like Sequential Table Scans (lack of indices), Hash Joins, nested loops, or temp disk writes, guiding index placement."
        },
        {
            question: "What is a deadlock in database concurrency and how is it resolved?",
            answer: "When two transactions hold locks on resources needed by the other, stalling both. Solved when the DB engine rolls back one transaction.",
            solution: "A deadlock occurs when Transaction A locks row 1 and requests row 2, while Transaction B locks row 2 and requests row 1. Both wait indefinitely. Database lock managers run background deadlock detection algorithms. When a loop is found, the engine terminates and rolls back one transaction, freeing its locks."
        },
        {
            question: "Explain the difference between a primary key, a unique key, and a foreign key.",
            answer: "A primary key uniquely identifies rows and cannot be null; a unique key ensures unique values but allows null; a foreign key links tables.",
            solution: "Primary Key: a unique identifier for a row, automatically indexed, and cannot contain NULL values. Unique Key: enforces uniqueness on a column (e.g. user emails) but permits NULLs. Foreign Key: a constraint referencing a primary key in another table, enforcing referential integrity."
        },
        {
            question: "What is database backup strategy and the difference between full, differential, and incremental backups?",
            answer: "Full backs up all database data; incremental backs up only changes since last backup; differential backs up changes since last full backup.",
            solution: "1) Full Backup: copies the entire database, slow and costly; 2) Incremental Backup: copies only the changes written since the most recent backup (full or incremental), fastest to run; 3) Differential Backup: copies all changes written since the last Full Backup, simplifying recovery."
        },
        {
            question: "What is table partitioning and how does it improve query performance?",
            answer: "Dividing large physical database tables into smaller virtual partitions based on key ranges, allowing queries to prune non-essential slices.",
            solution: "Table partitioning splits a single massive logical table into smaller, manageable physical child tables based on ranges (e.g. partition by year). When a query filters by date, the planner executes 'partition pruning', searching only the physical partition matching that year, bypassing billions of other rows."
        },
        {
            question: "Explain Multi-Version Concurrency Control (MVCC).",
            answer: "A technique that allows concurrent read-writes without locking out, by writing historical data versions for different transactions.",
            solution: "MVCC allows readers and writers to operate concurrently without locking each other out. When a row is updated, the database does not overwrite it. Instead, it creates a new version of the row with transaction timestamps. Each transaction sees a consistent snapshot of the database at its start time, boosting concurrency."
        }
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

async function generateCompanySolutions(company, role) {
    if (!company) {
        throw new Error("Company is required");
    }

    if (!role) {
        throw new Error("Role is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation director.

Generate exactly 10 real-world placement questions, concise answers, and highly detailed technical explanations/solutions for:
Company: ${company}
Role: ${role}

Requirements:
1. Questions must be highly specific to the ${role} role at ${company}. For SDE, ask DSA, System Design, or OS questions. For Frontend, ask browser, CSS, and framework internals.
2. The "solution" field must contain a detailed step-by-step technical explanation, code snippet explanation, or structural architectural detail on how to solve it correctly.
3. Return ONLY valid JSON in this exact structure:

{
    "company": "${company}",
    "role": "${role}",
    "solutions": [
        {
            "question": "Question text",
            "answer": "Concise direct answer",
            "solution": "Highly detailed technical solution and explanation"
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
            const solutions = fallbackCompanySolutions[roleKey] || fallbackCompanySolutions["Software Developer"];
            return {
                company: company,
                role: role,
                solutions: solutions.slice(0, 10),
                source: "fallback"
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

        if (data && Array.isArray(data.solutions) && data.solutions.length > 0) {
            const slicedSolutions = data.solutions.slice(0, 10);
            return {
                company: company,
                role: role,
                solutions: slicedSolutions,
                source: "ai"
            };
        }

        throw new Error("Invalid solutions structure");
    } catch (error) {
        console.log("Failed to fetch solutions via AI, falling back to role-specific mapping:", error.message);
        const roleKey = getNormalizedRoleKey(role);
        const solutions = fallbackCompanySolutions[roleKey] || fallbackCompanySolutions["Software Developer"];
        return {
            company: company,
            role: role,
            solutions: solutions.slice(0, 10),
            source: "fallback"
        };
    }
}

module.exports = {
    generateCompanySolutions
};
