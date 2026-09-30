// Shared Global Navbar & Top-Right Profile Header Component
(function () {
    function initNavbar() {
        if (document.getElementById("portalNavbar")) return;

        // Check user session
        let userRaw = localStorage.getItem("loggedInUser");
        let userEmail = "guest@student.com";
        let userName = "Student User";

        if (userRaw) {
            try {
                if (userRaw.startsWith("{")) {
                    let parsed = JSON.parse(userRaw);
                    userEmail = parsed.email || userRaw;
                    userName = parsed.name || userEmail.split("@")[0];
                } else {
                    userEmail = userRaw;
                    userName = userEmail.split("@")[0];
                }
            } catch (e) {
                userEmail = userRaw;
                userName = userEmail.split("@")[0];
            }
        }

        // Capitalize Name
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
        let firstInitial = userName.charAt(0).toUpperCase();

        // Path detection for active link
        let currentPath = window.location.pathname.toLowerCase();

        let isDashActive = currentPath.includes("dashboard.html") || currentPath === "/" || currentPath.endsWith("/");
        let isCompActive = currentPath.includes("preparation.html") || currentPath.includes("company") || currentPath.includes("questions.html") || currentPath.includes("solutions.html");
        let isInterActive = currentPath.includes("interview.html") || currentPath.includes("hr-interview") || currentPath.includes("technical-interview");
        let isResActive = currentPath.includes("resources.html");
        let isTopActive = currentPath.includes("topics.html") || currentPath.includes("topic-");
        let isProgActive = currentPath.includes("progress.html");

        // Navbar HTML
        let navbarHTML = `
            <nav class="portal-navbar" id="portalNavbar">
                <div class="navbar-container">
                    <a href="dashboard.html" class="navbar-brand">
                        <span class="logo-icon">🎓</span>
                        <span>Placement Portal</span>
                    </a>

                    <ul class="navbar-menu">
                        <li><a href="dashboard.html" class="nav-link ${isDashActive ? 'active' : ''}">🏠 Dashboard</a></li>
                        <li><a href="preparation.html" class="nav-link ${isCompActive ? 'active' : ''}">🏢 Company Prep</a></li>
                        <li><a href="interview.html" class="nav-link ${isInterActive ? 'active' : ''}">🎤 Interview Prep</a></li>
                        <li><a href="resources.html" class="nav-link ${isResActive ? 'active' : ''}">📚 Resources</a></li>
                        <li><a href="topics.html" class="nav-link ${isTopActive ? 'active' : ''}">🔍 Search Topics</a></li>
                    </ul>

                    <!-- TOP RIGHT MY PROFILE -->
                    <div class="profile-menu-container">
                        <button class="profile-trigger-btn" id="profileTriggerBtn" onclick="toggleProfileDropdown(event)">
                            <div class="profile-avatar">${firstInitial}</div>
                            <span class="profile-name-text">${userName}</span>
                            <span class="profile-caret">▼</span>
                        </button>

                        <div class="profile-dropdown-card" id="profileDropdownCard">
                            <div class="profile-header-info">
                                <div class="profile-header-avatar">${firstInitial}</div>
                                <div style="overflow: hidden;">
                                    <div class="profile-header-name" title="${userName}">${userName}</div>
                                    <div class="profile-header-email" title="${userEmail}">${userEmail}</div>
                                </div>
                            </div>

                            <div class="profile-section-title">📊 Performance & Progress</div>

                            <div class="profile-stats-grid">
                                <div class="profile-stat-box">
                                    <div class="profile-stat-value" id="navCompanyQuizzes">0</div>
                                    <div class="profile-stat-label">Company Quizzes</div>
                                </div>
                                <div class="profile-stat-box">
                                    <div class="profile-stat-value" id="navTopicQuizzes">0</div>
                                    <div class="profile-stat-label">Topic Quizzes</div>
                                </div>
                                <div class="profile-stat-box">
                                    <div class="profile-stat-value" id="navHRCount">0</div>
                                    <div class="profile-stat-label">HR Interviews</div>
                                </div>
                                <div class="profile-stat-box">
                                    <div class="profile-stat-value" id="navTechCount">0</div>
                                    <div class="profile-stat-label">Tech Interviews</div>
                                </div>
                            </div>

                            <div class="profile-progress-bar-container">
                                <div class="profile-progress-label">
                                    <span>Overall Completion</span>
                                    <span id="navProgressPct">0%</span>
                                </div>
                                <div class="profile-progress-bar">
                                    <div class="profile-progress-fill" id="navProgressFill"></div>
                                </div>
                            </div>

                            <div class="profile-actions">
                                <a href="progress.html" class="profile-btn profile-btn-primary">📈 View Detailed Progress</a>
                                <button class="profile-btn profile-btn-logout" onclick="headerLogout()">🚪 Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;

        // Prepend to body
        document.body.insertAdjacentHTML("afterbegin", navbarHTML);

        // Load stats into profile dropdown
        loadNavbarProfileStats(userEmail);

        // Close dropdown when clicking outside
        document.addEventListener("click", function (e) {
            let container = document.querySelector(".profile-menu-container");
            let card = document.getElementById("profileDropdownCard");
            if (container && !container.contains(e.target) && card) {
                card.classList.remove("show");
            }
        });
    }

    window.toggleProfileDropdown = function (e) {
        if (e) e.stopPropagation();
        let card = document.getElementById("profileDropdownCard");
        if (card) {
            card.classList.toggle("show");
        }
    };

    window.headerLogout = function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    };

    function loadNavbarProfileStats(email) {
        let compCount = 0;
        let topicCount = 0;
        let hrCount = 0;
        let techCount = 0;

        let compPrefix = "progress_" + email + "_";
        let topicPrefix = "topicQuizResult_" + email + "_";
        let hrPrefix = "hrInterviewCompleted_" + email + "_";
        let techPrefix = "technicalInterviewCompleted_" + email + "_";

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (!key) continue;

            if (key.startsWith(compPrefix)) {
                let val = Number(localStorage.getItem(key));
                if (!isNaN(val)) compCount++;
            } else if (key.startsWith(topicPrefix)) {
                topicCount++;
            } else if (key.startsWith(hrPrefix) && localStorage.getItem(key) === "true") {
                hrCount++;
            } else if (key.startsWith(techPrefix) && localStorage.getItem(key) === "true") {
                techCount++;
            }
        }

        let totalActivities = compCount + topicCount + hrCount + techCount;
        let completionPct = Math.min(100, Math.round((totalActivities / 10) * 100));

        let compEl = document.getElementById("navCompanyQuizzes");
        let topEl = document.getElementById("navTopicQuizzes");
        let hrEl = document.getElementById("navHRCount");
        let techEl = document.getElementById("navTechCount");
        let pctEl = document.getElementById("navProgressPct");
        let fillEl = document.getElementById("navProgressFill");

        if (compEl) compEl.innerText = compCount;
        if (topEl) topEl.innerText = topicCount;
        if (hrEl) hrEl.innerText = hrCount;
        if (techEl) techEl.innerText = techCount;
        if (pctEl) pctEl.innerText = completionPct + "%";
        if (fillEl) fillEl.style.width = completionPct + "%";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavbar);
    } else {
        initNavbar();
    }
})();
