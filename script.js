// Local Storage Keys
const STORAGE_KEYS = {
    USERS: 'affilite_users',
    CURRENT_USER: 'affilite_current_user',
    TASKS: 'affilite_tasks',
    TRANSACTIONS: 'affilite_transactions'
};

// Initialize data
function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(null));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        const defaultTasks = [
            {
                id: 1,
                type: 'trivia',
                title: 'Daily Trivia Question',
                description: 'Answer a random trivia question and earn money!',
                reward: 2.50,
                completed: false
            },
            {
                id: 2,
                type: 'referral',
                title: 'Refer a Friend',
                description: 'Share your referral code and earn $5 when someone signs up!',
                reward: 5.00,
                completed: false
            },
            {
                id: 3,
                type: 'survey',
                title: 'Complete Survey',
                description: 'Fill out a quick survey and earn $3.00',
                reward: 3.00,
                completed: false
            },
            {
                id: 4,
                type: 'watch',
                title: 'Watch Video',
                description: 'Watch a promotional video to earn $1.50',
                reward: 1.50,
                completed: false
            }
        ];
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
}

// Get data from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
}

function getTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
}

function getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
}

// Save data to localStorage
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// Activation Fee Constant
const ACTIVATION_FEE = 25.00;

// Generate referral code
function generateReferralCode(name) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const namePart = name.substring(0, 3).toUpperCase();
    return `${namePart}${random}`;
}

function generateAccountNumber() {
    return 'ACC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + Math.floor(Math.random() * 1000);
}

// Trivia Questions
const triviaQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correct: 2
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
        correct: 2
    },
    {
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correct: 2
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correct: 2
    }
];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    initData();

    // Check if user is logged in on dashboard
    if (window.location.pathname.includes('dashboard.html') || window.location.href.includes('dashboard.html')) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            window.location.href = 'index.html';
        } else {
            // Wait a bit to ensure DOM is ready
            setTimeout(() => {
                loadDashboard();
                checkWelcomeMessage(currentUser);
            }, 100);
        }
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Please fill in all fields!');
                return;
            }

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setCurrentUser(user);
                // Set flag to show welcome message
                sessionStorage.setItem('showWelcomeLogin', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const referralCode = document.getElementById('referralCode').value;
            const terms = document.getElementById('terms').checked;

            // Validation
            if (!fullName || !email || !phone || !password || !confirmPassword) {
                alert('Please fill in all required fields!');
                return;
            }

            if (!terms) {
                alert('Please agree to the Terms & Conditions and Privacy Policy!');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }

            const users = getUsers();
            if (users.find(u => u.email === email)) {
                alert('Email already registered!');
                return;
            }

            // Handle referral bonus
            let bonusBalance = 0;
            if (referralCode) {
                const referrer = users.find(u => u.referralCode === referralCode.toUpperCase().trim());
                if (referrer) {
                    bonusBalance = 2.00; // Bonus for using referral code
                    // Add referral to referrer
                    if (!referrer.referrals) referrer.referrals = [];
                    referrer.referrals.push({
                        email: email,
                        name: fullName,
                        date: new Date().toISOString()
                    });
                    referrer.totalEarnings = (referrer.totalEarnings || 0) + 5.00;
                    referrer.balance = (referrer.balance || 0) + 5.00;
                    
                    // Add transaction for referrer
                    const transactions = getTransactions();
                    transactions.push({
                        userId: referrer.id,
                        type: 'referral',
                        amount: 5.00,
                        description: `Referral bonus for ${fullName}`,
                        date: new Date().toISOString()
                    });
                    saveTransactions(transactions);
                    
                    saveUsers(users);
                } else if (referralCode.trim() !== '') {
                    alert('Invalid referral code!');
                    return;
                }
            }

            const newUser = {
                id: Date.now(),
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                password: password,
                referralCode: generateReferralCode(fullName),
                accountNumber: generateAccountNumber(),
                balance: 0,
                bonusBalance: bonusBalance,
                totalEarnings: 0,
                tasksCompleted: 0,
                referrals: [],
                isActivated: false,
                activationFee: ACTIVATION_FEE,
                hasWelcomeSpin: true,
                welcomeSpinUsed: false,
                lastSpinDate: null,
                dailySpinUsed: false,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);
            setCurrentUser(newUser);

            // Add welcome transaction
            const transactions = getTransactions();
            if (bonusBalance > 0) {
                transactions.push({
                    userId: newUser.id,
                    type: 'bonus',
                    amount: bonusBalance,
                    description: 'Welcome bonus (Referral code used)',
                    date: new Date().toISOString()
                });
                saveTransactions(transactions);
            }

            // Add account creation transaction
            transactions.push({
                userId: newUser.id,
                type: 'system',
                amount: 0,
                description: 'Account created',
                date: new Date().toISOString()
            });
            saveTransactions(transactions);

            // Set flag to show welcome message
            sessionStorage.setItem('showWelcomeSignup', 'true');
            alert('Account created successfully! Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        });
    }
});

// Also run if DOM is already loaded (for compatibility)
if (document.readyState === 'loading') {
    // DOM hasn't finished loading yet, wait for it
} else {
    // DOM is already loaded, run immediately
    initData();
}

// Dashboard Functions
function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    // Update user info
    document.getElementById('userName').textContent = user.fullName || 'User';
    document.getElementById('totalBalance').textContent = `$${(user.balance || 0).toFixed(2)}`;
    document.getElementById('bonusBalance').textContent = `$${(user.bonusBalance || 0).toFixed(2)}`;
    document.getElementById('userAccountNumber').textContent = user.accountNumber;

    // Update stats
    updateStats();
    
    // Load account status
    loadAccountStatus();
    
    // Load tasks
    if (document.getElementById('tasksPage')) {
        loadTasks();
    }
    
    // Load referrals
    if (document.getElementById('referralsPage')) {
        loadReferrals();
    }
    
    // Load earnings
    if (document.getElementById('earningsPage')) {
        loadEarnings();
    }
    
    // Load profile
    if (document.getElementById('profilePage')) {
        loadProfile();
    }
    
    // Load spin page
    if (document.getElementById('spinPage')) {
        loadSpinPage();
    }
    
    // Load activity
    loadActivity();
}

function updateStats() {
    const user = getCurrentUser();
    const transactions = getTransactions().filter(t => t.userId === user.id);
    
    document.getElementById('totalEarnings').textContent = `$${(user.totalEarnings || 0).toFixed(2)}`;
    document.getElementById('tasksCompleted').textContent = user.tasksCompleted || 0;
    document.getElementById('totalReferrals').textContent = (user.referrals || []).length;
    
    const totalTasks = getTasks().length;
    const successRate = totalTasks > 0 ? Math.round((user.tasksCompleted / totalTasks) * 100) : 0;
    document.getElementById('successRate').textContent = `${successRate}%`;
}

function loadAccountStatus() {
    const user = getCurrentUser();
    const statusCard = document.getElementById('accountStatusCard');
    
    if (user.isActivated) {
        statusCard.classList.add('activated');
        statusCard.querySelector('.status-icon').textContent = '✅';
        statusCard.querySelector('.status-text h3').textContent = 'Account Activated';
        statusCard.querySelector('.status-text p').textContent = 'Your account is active. Start completing tasks to earn money!';
        
        // Hide activation fee section when activated
        const feeDisplay = document.querySelector('.activation-fee-display');
        if (feeDisplay) feeDisplay.style.display = 'none';
        document.getElementById('activateBtn').style.display = 'none';
    } else {
        statusCard.classList.remove('activated');
        // Show activation fee
        const feeDisplay = document.querySelector('.activation-fee-display');
        if (feeDisplay) feeDisplay.style.display = 'block';
        
        // Display activation fee amount
        const activationFee = user.activationFee || ACTIVATION_FEE;
        document.getElementById('activationFeeAmount').textContent = `$${activationFee.toFixed(2)}`;
        document.getElementById('paybillAmount').textContent = `$${activationFee.toFixed(2)}`;
    }
}

function loadTasks() {
    const tasks = getTasks();
    const tasksGrid = document.getElementById('tasksGrid');
    const user = getCurrentUser();
    
    tasksGrid.innerHTML = tasks.map(task => {
        const isCompleted = task.userId === user.id && task.completed;
        return `
            <div class="task-card">
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <div class="task-type">${task.type.toUpperCase()}</div>
                    </div>
                    <div class="task-reward">$${task.reward.toFixed(2)}</div>
                </div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span class="task-type">Reward: $${task.reward.toFixed(2)}</span>
                    <button class="task-btn" 
                            onclick="handleTask(${task.id})" 
                            ${isCompleted ? 'disabled' : ''}
                            ${!user.isActivated && !isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? 'Completed' : 'Start Task'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function handleTask(taskId) {
    const user = getCurrentUser();
    if (!user.isActivated) {
        alert('Please activate your account first!');
        return;
    }

    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task || (task.userId === user.id && task.completed)) {
        return;
    }

    if (task.type === 'trivia') {
        showTriviaModal(task);
    } else if (task.type === 'referral') {
        window.location.hash = 'referrals';
        document.querySelector('[data-page="referrals"]').click();
    } else if (task.type === 'survey') {
        if (confirm('This is a demo. Would you like to mark this survey as completed?')) {
            completeTask(task, user);
        }
    } else if (task.type === 'watch') {
        if (confirm('This is a demo. Would you like to mark this video as watched?')) {
            completeTask(task, user);
        }
    }
}

function showTriviaModal(task) {
    const modal = document.getElementById('triviaModal');
    const questionData = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    
    document.getElementById('triviaQuestion').innerHTML = `<p style="font-size: 18px; margin-bottom: 20px;">${questionData.question}</p>`;
    
    const optionsDiv = document.getElementById('triviaOptions');
    optionsDiv.innerHTML = questionData.options.map((opt, idx) => 
        `<div class="trivia-option" onclick="selectTriviaOption(${idx}, ${questionData.correct}, ${task.id})">${opt}</div>`
    ).join('');
    
    const submitBtn = document.getElementById('submitTrivia');
    submitBtn.disabled = true;
    submitBtn.setAttribute('data-correct', questionData.correct);
    submitBtn.setAttribute('data-task', task.id);
    submitBtn.onclick = () => submitTriviaAnswer(questionData.correct, task);
    
    modal.classList.add('show');
}

function selectTriviaOption(selectedIdx, correctIdx, taskId) {
    document.querySelectorAll('.trivia-option').forEach((opt, idx) => {
        opt.classList.remove('selected');
        if (idx === selectedIdx) {
            opt.classList.add('selected');
            opt.setAttribute('data-selected', 'true');
        }
    });
    document.getElementById('submitTrivia').disabled = false;
    document.getElementById('submitTrivia').setAttribute('data-selected', selectedIdx);
}

function submitTriviaAnswer(correctIdx, task) {
    const selectedIdx = parseInt(document.getElementById('submitTrivia').getAttribute('data-selected'));
    const modal = document.getElementById('triviaModal');
    
    if (selectedIdx === correctIdx) {
        alert('Correct! You earned $' + task.reward.toFixed(2));
        completeTask(task, getCurrentUser());
    } else {
        alert('Wrong answer! Try another task.');
    }
    
    modal.classList.remove('show');
}

function completeTask(task, user) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    
    tasks[taskIndex].completed = true;
    tasks[taskIndex].userId = user.id;
    saveTasks(tasks);
    
    // Update user balance
    user.balance = (user.balance || 0) + task.reward;
    user.totalEarnings = (user.totalEarnings || 0) + task.reward;
    user.tasksCompleted = (user.tasksCompleted || 0) + 1;
    
    // Update users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = user;
    saveUsers(users);
    setCurrentUser(user);
    
    // Add transaction
    const transactions = getTransactions();
    transactions.push({
        userId: user.id,
        type: 'task',
        amount: task.reward,
        description: `Completed: ${task.title}`,
        date: new Date().toISOString()
    });
    saveTransactions(transactions);
    
    // Reload dashboard
    loadDashboard();
    loadTasks();
}

function loadReferrals() {
    const user = getCurrentUser();
    document.getElementById('referralCodeDisplay').value = user.referralCode || '';
    document.getElementById('refCount').textContent = (user.referrals || []).length;
    
    const refEarnings = (user.referrals || []).length * 5.00;
    document.getElementById('refEarnings').textContent = refEarnings.toFixed(2);
    
    const referralsList = document.getElementById('referralsList');
    if ((user.referrals || []).length === 0) {
        referralsList.innerHTML = '<p class="empty-state">No referrals yet. Share your code to start earning!</p>';
    } else {
        referralsList.innerHTML = user.referrals.map(ref => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-title">${ref.name}</div>
                    <div class="transaction-date">${new Date(ref.date).toLocaleDateString()}</div>
                </div>
                <div class="transaction-amount">$5.00</div>
            </div>
        `).join('');
    }
}

function loadEarnings() {
    const user = getCurrentUser();
    const transactions = getTransactions().filter(t => t.userId === user.id);
    
    document.getElementById('earningsTotal').textContent = `$${(user.totalEarnings || 0).toFixed(2)}`;
    document.getElementById('earningsBonus').textContent = `$${(user.bonusBalance || 0).toFixed(2)}`;
    document.getElementById('earningsAvailable').textContent = `$${(user.balance || 0).toFixed(2)}`;
    
    const transactionsList = document.getElementById('transactionsList');
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-state">No transactions yet</p>';
    } else {
        transactionsList.innerHTML = transactions.reverse().map(trans => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-title">${trans.description}</div>
                    <div class="transaction-date">${new Date(trans.date).toLocaleString()}</div>
                </div>
                <div class="transaction-amount">+$${trans.amount.toFixed(2)}</div>
            </div>
        `).join('');
    }
}

function loadProfile() {
    const user = getCurrentUser();
    document.getElementById('profileName').value = user.fullName || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profilePhone').value = user.phone || '';
    document.getElementById('accountNumberDisplay').textContent = user.accountNumber || '';
    document.getElementById('memberSince').textContent = new Date(user.createdAt).getFullYear();
    
    const statusDisplay = document.getElementById('accountStatusDisplay');
    statusDisplay.textContent = user.isActivated ? 'Active' : 'Inactive';
    statusDisplay.classList.toggle('active', user.isActivated);
}

function loadActivity() {
    const user = getCurrentUser();
    const transactions = getTransactions().filter(t => t.userId === user.id).reverse().slice(0, 5);
    
    const activityList = document.getElementById('activityList');
    if (transactions.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">🎉</div>
                <div class="activity-content">
                    <p><strong>Account Created</strong></p>
                    <span class="activity-time">${new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    } else {
        activityList.innerHTML = transactions.map(trans => {
            let icon = '💰';
            if (trans.type === 'referral') icon = '👥';
            if (trans.type === 'bonus') icon = '🎁';
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content">
                        <p><strong>${trans.description}</strong> - +$${trans.amount.toFixed(2)}</p>
                        <span class="activity-time">${new Date(trans.date).toLocaleString()}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Spin Wheel Prizes
const SPIN_PRIZES = [
    { text: '$0.50', value: 0.50, color: '#FF6B6B', probability: 20 },
    { text: '$1.00', value: 1.00, color: '#4ECDC4', probability: 20 },
    { text: '$2.00', value: 2.00, color: '#45B7D1', probability: 15 },
    { text: '$5.00', value: 5.00, color: '#96CEB4', probability: 10 },
    { text: '$10.00', value: 10.00, color: '#FFEAA7', probability: 5 },
    { text: '$0.25', value: 0.25, color: '#DDA15E', probability: 15 },
    { text: '$0.75', value: 0.75, color: '#BC4749', probability: 10 },
    { text: '$3.00', value: 3.00, color: '#A8DADC', probability: 5 }
];

let isSpinning = false;

function loadSpinPage() {
    const user = getCurrentUser();
    if (!user) return;
    
    checkSpinEligibility();
    drawSpinWheel();
    loadPrizes();
    loadSpinHistory();
}

function checkSpinEligibility() {
    const user = getCurrentUser();
    if (!user) return;
    
    const today = new Date().toDateString();
    const lastSpinDate = user.lastSpinDate ? new Date(user.lastSpinDate).toDateString() : null;
    
    // Check if daily spin is available
    const dailySpinAvailable = lastSpinDate !== today || !user.dailySpinUsed;
    
    // Check welcome spin
    const welcomeSpinAvailable = user.hasWelcomeSpin && !user.welcomeSpinUsed;
    
    // Update UI
    const spinStatusText = document.getElementById('spinStatusText');
    const dailySpinCount = document.getElementById('dailySpinCount');
    const welcomeSpinCount = document.getElementById('welcomeSpinCount');
    const spinButton = document.getElementById('spinButton');
    
    if (!spinStatusText || !spinButton) return;
    
    if (welcomeSpinAvailable) {
        spinStatusText.textContent = 'Welcome spin available!';
        if (welcomeSpinCount) welcomeSpinCount.style.display = 'block';
        if (dailySpinCount && dailySpinCount.parentElement) dailySpinCount.parentElement.style.display = 'none';
        spinButton.disabled = false;
    } else if (dailySpinAvailable) {
        spinStatusText.textContent = 'Daily spin available!';
        if (welcomeSpinCount) welcomeSpinCount.style.display = 'none';
        if (dailySpinCount) {
            if (dailySpinCount.parentElement) dailySpinCount.parentElement.style.display = 'block';
            dailySpinCount.textContent = '1';
        }
        spinButton.disabled = false;
    } else {
        spinStatusText.textContent = 'No spins available. Come back tomorrow!';
        if (welcomeSpinCount) welcomeSpinCount.style.display = 'none';
        if (dailySpinCount) {
            if (dailySpinCount.parentElement) dailySpinCount.parentElement.style.display = 'block';
            dailySpinCount.textContent = '0';
        }
        spinButton.disabled = true;
    }
}

function drawSpinWheel() {
    const canvas = document.getElementById('spinWheel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wheel segments
    let currentAngle = -Math.PI / 2; // Start from top
    const totalProbability = SPIN_PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
    
    SPIN_PRIZES.forEach((prize) => {
        const sliceAngle = (prize.probability / totalProbability) * 2 * Math.PI;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Poppins';
        ctx.fillText(prize.text, radius / 2, 0);
        ctx.restore();
        
        currentAngle += sliceAngle;
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function loadPrizes() {
    const prizesGrid = document.getElementById('prizesGrid');
    if (!prizesGrid) return;
    
    prizesGrid.innerHTML = SPIN_PRIZES.map(prize => `
        <div class="prize-item" style="background: ${prize.color}20; border: 2px solid ${prize.color};">
            <div class="prize-amount">${prize.text}</div>
            <div class="prize-probability">${prize.probability}%</div>
        </div>
    `).join('');
}

function spinWheelFunction() {
    if (isSpinning) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    const today = new Date().toDateString();
    const lastSpinDate = user.lastSpinDate ? new Date(user.lastSpinDate).toDateString() : null;
    const dailySpinAvailable = lastSpinDate !== today || !user.dailySpinUsed;
    const welcomeSpinAvailable = user.hasWelcomeSpin && !user.welcomeSpinUsed;
    
    if (!dailySpinAvailable && !welcomeSpinAvailable) {
        alert('No spins available!');
        return;
    }
    
    isSpinning = true;
    const spinButton = document.getElementById('spinButton');
    if (spinButton) {
        spinButton.disabled = true;
        spinButton.textContent = 'SPINNING...';
    }
    
    // Select random prize based on probability
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = SPIN_PRIZES[0];
    
    for (const prize of SPIN_PRIZES) {
        cumulative += prize.probability;
        if (random <= cumulative) {
            selectedPrize = prize;
            break;
        }
    }
    
    // Calculate angle for selected prize
    const prizeIndex = SPIN_PRIZES.indexOf(selectedPrize);
    const totalProbability = SPIN_PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
    let targetAngle = -Math.PI / 2; // Start from top
    
    for (let i = 0; i < prizeIndex; i++) {
        targetAngle += (SPIN_PRIZES[i].probability / totalProbability) * 2 * Math.PI;
    }
    targetAngle += (selectedPrize.probability / totalProbability) * Math.PI;
    
    // Add multiple full rotations
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = targetAngle + spins * 2 * Math.PI;
    
    // Animate spin
    let currentRotation = 0;
    const totalRotation = finalAngle;
    
    function animate() {
        if (currentRotation < totalRotation) {
            currentRotation += (totalRotation - currentRotation) * 0.15 + 0.05;
            
            const canvas = document.getElementById('spinWheel');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = 180;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw rotated wheel
                let angle = -Math.PI / 2 + currentRotation;
                const totalProb = SPIN_PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
                
                SPIN_PRIZES.forEach((prize) => {
                    const sliceAngle = (prize.probability / totalProb) * 2 * Math.PI;
                    
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
                    ctx.closePath();
                    ctx.fillStyle = prize.color;
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Draw text
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(angle + sliceAngle / 2);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 16px Poppins';
                    ctx.fillText(prize.text, radius / 2, 0);
                    ctx.restore();
                    
                    angle += sliceAngle;
                });
                
                // Draw center circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
                ctx.fillStyle = '#1e293b';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                requestAnimationFrame(animate);
            }
        } else {
            // Spin complete
            finishSpin(selectedPrize, user, welcomeSpinAvailable);
        }
    }
    
    animate();
}

function finishSpin(prize, user, wasWelcomeSpin) {
    isSpinning = false;
    const spinButton = document.getElementById('spinButton');
    if (spinButton) {
        spinButton.disabled = false;
        spinButton.textContent = 'SPIN';
    }
    
    // Update user
    const amount = prize.value;
    user.balance = (user.balance || 0) + amount;
    user.totalEarnings = (user.totalEarnings || 0) + amount;
    
    if (wasWelcomeSpin) {
        user.hasWelcomeSpin = true;
        user.welcomeSpinUsed = true;
    } else {
        user.dailySpinUsed = true;
        user.lastSpinDate = new Date().toISOString();
    }
    
    // Save user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        saveUsers(users);
        setCurrentUser(user);
    }
    
    // Add transaction
    const transactions = getTransactions();
    transactions.push({
        userId: user.id,
        type: 'spin',
        amount: amount,
        description: `Spin wheel: ${prize.text}`,
        date: new Date().toISOString()
    });
    saveTransactions(transactions);
    
    // Show result
    alert(`Congratulations! You won ${prize.text}!`);
    
    // Reload
    loadDashboard();
    loadSpinPage();
}

function loadSpinHistory() {
    const user = getCurrentUser();
    if (!user) return;
    
    const transactions = getTransactions().filter(t => t.userId === user.id && t.type === 'spin').reverse().slice(0, 10);
    const historyList = document.getElementById('spinHistoryList');
    
    if (!historyList) return;
    
    if (transactions.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No spins yet. Spin the wheel to win rewards!</p>';
    } else {
        historyList.innerHTML = transactions.map(trans => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-title">${trans.description}</div>
                    <div class="transaction-date">${new Date(trans.date).toLocaleString()}</div>
                </div>
                <div class="transaction-amount">+$${trans.amount.toFixed(2)}</div>
            </div>
        `).join('');
    }
}

// Initialize dashboard handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                
                // Update active nav
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Hide all pages
                document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
                
                // Show selected page
                const pageElement = document.getElementById(`${page}Page`);
                if (pageElement) {
                    pageElement.classList.remove('hidden');
                }
                
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) {
                    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
                }
                
                // Reload page data
                if (page === 'tasks') loadTasks();
                if (page === 'referrals') loadReferrals();
                if (page === 'earnings') loadEarnings();
                if (page === 'spin') loadSpinPage();
                if (page === 'profile') loadProfile();
            });
        });
    }

    // Copy referral code
    const copyReferralBtn = document.getElementById('copyReferralBtn');
    if (copyReferralBtn) {
        copyReferralBtn.addEventListener('click', () => {
            const codeInput = document.getElementById('referralCodeDisplay');
            if (codeInput) {
                const code = codeInput.value;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(() => {
                        copyReferralBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyReferralBtn.textContent = 'Copy';
                        }, 2000);
                    }).catch(() => {
                        // Fallback for older browsers
                        codeInput.select();
                        document.execCommand('copy');
                        copyReferralBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyReferralBtn.textContent = 'Copy';
                        }, 2000);
                    });
                } else {
                    // Fallback for older browsers
                    codeInput.select();
                    document.execCommand('copy');
                    copyReferralBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyReferralBtn.textContent = 'Copy';
                    }, 2000);
                }
            }
        });
    }

    // Activate account
    const activateBtn = document.getElementById('activateBtn');
    if (activateBtn) {
        activateBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) {
                alert('Please login first!');
                window.location.href = 'index.html';
                return;
            }
            
            const activationFee = user.activationFee || ACTIVATION_FEE;
            const confirmMessage = `To activate your account, make a payment of $${activationFee.toFixed(2)} to:\n\nPayBill: 529529\nAccount: ${user.accountNumber}\nAmount: $${activationFee.toFixed(2)}\n\nHave you made the payment?`;
            
            if (confirm(confirmMessage)) {
                user.isActivated = true;
                user.bonusBalance = (user.bonusBalance || 0) + 10.00; // Activation bonus
                
                // Give welcome spin after activation
                if (!user.hasWelcomeSpin && !user.welcomeSpinUsed) {
                    user.hasWelcomeSpin = true;
                    user.welcomeSpinUsed = false;
                }
                
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    saveUsers(users);
                    setCurrentUser(user);
                    
                    // Add activation bonus transaction
                    const transactions = getTransactions();
                    transactions.push({
                        userId: user.id,
                        type: 'bonus',
                        amount: 10.00,
                        description: 'Account activation bonus',
                        date: new Date().toISOString()
                    });
                    saveTransactions(transactions);
                    
                    alert('Account activated successfully! You received a $10 welcome bonus!\n\nDon\'t forget to claim your welcome spin!');
                    loadDashboard();
                }
            }
        });
    }

    // Update profile
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            if (!user) {
                alert('Please login first!');
                window.location.href = 'index.html';
                return;
            }
            
            const nameInput = document.getElementById('profileName');
            const emailInput = document.getElementById('profileEmail');
            const phoneInput = document.getElementById('profilePhone');
            
            if (nameInput && emailInput && phoneInput) {
                user.fullName = nameInput.value;
                user.email = emailInput.value;
                user.phone = phoneInput.value;
                
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    saveUsers(users);
                    setCurrentUser(user);
                    
                    alert('Profile updated successfully!');
                    loadDashboard();
                    loadProfile();
                }
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                setCurrentUser(null);
                window.location.href = 'index.html';
            }
        });
    }

    // Close modal
    const closeTrivia = document.getElementById('closeTrivia');
    if (closeTrivia) {
        closeTrivia.addEventListener('click', () => {
            const modal = document.getElementById('triviaModal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('triviaModal');
        if (modal && e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Spin wheel button
    const spinButton = document.getElementById('spinButton');
    if (spinButton) {
        spinButton.addEventListener('click', spinWheelFunction);
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            // Save sidebar state
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }

    if (sidebarToggleMobile) {
        sidebarToggleMobile.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            // Close sidebar when clicking outside on mobile
            if (sidebar.classList.contains('show')) {
                setTimeout(() => {
                    document.addEventListener('click', function closeSidebarOnOutsideClick(e) {
                        if (!sidebar.contains(e.target) && !sidebarToggleMobile.contains(e.target)) {
                            sidebar.classList.remove('show');
                            document.removeEventListener('click', closeSidebarOnOutsideClick);
                        }
                    });
                }, 100);
            }
        });
    }

    // Load sidebar state
    if (sidebar && localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }

    // Welcome modal close
    const welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
    if (welcomeCloseBtn) {
        welcomeCloseBtn.addEventListener('click', function() {
            const welcomeModal = document.getElementById('welcomeModal');
            if (welcomeModal) {
                welcomeModal.classList.remove('show');
            }
        });
    }

    // Close welcome modal on outside click
    window.addEventListener('click', (e) => {
        const welcomeModal = document.getElementById('welcomeModal');
        if (welcomeModal && e.target === welcomeModal) {
            welcomeModal.classList.remove('show');
        }
    });
});

// Show welcome message function
function checkWelcomeMessage(user) {
    const showWelcomeLogin = sessionStorage.getItem('showWelcomeLogin');
    const showWelcomeSignup = sessionStorage.getItem('showWelcomeSignup');
    const welcomeModal = document.getElementById('welcomeModal');
    const welcomeMessageText = document.getElementById('welcomeMessageText');

    if (!welcomeModal || !welcomeMessageText) return;

    if (showWelcomeSignup) {
        // New user signup
        welcomeMessageText.textContent = `Welcome ${user.fullName || 'to Affilite'}! Your account has been created successfully. Let's start your earning journey together!`;
        welcomeModal.classList.add('show');
        sessionStorage.removeItem('showWelcomeSignup');
    } else if (showWelcomeLogin) {
        // Returning user login
        welcomeMessageText.textContent = `Welcome back, ${user.fullName || 'there'}! Ready to continue earning? Let's make some money together!`;
        welcomeModal.classList.add('show');
        sessionStorage.removeItem('showWelcomeLogin');
    }
}

// Make functions available globally for onclick handlers
window.handleTask = handleTask;
window.selectTriviaOption = selectTriviaOption;
window.spinWheelFunction = spinWheelFunction;

