const STORAGE_KEY = 'sidequest_bn_data_v3';

class App {
    constructor() {
        this.data = this.loadData();
        this.currentUser = this.data.currentUser;
        this.appMode = this.data.appMode || 'seeker'; // 'seeker' or 'poster'
        this.authMode = 'login';
        this.map = null;
        this.markers = [];

        this.init();

        // Professional Splash Timeout
        setTimeout(() => {
            const splash = document.getElementById('app-splash');
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => splash.remove(), 800);
            }
        }, 2000);
    }

    loadData() {
        const defaultData = { users: {}, jobs: [], chats: {}, currentUser: null, appMode: 'seeker' };
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return defaultData;

        const data = JSON.parse(stored);
        if (!data.chats) data.chats = {};
        if (!data.appMode) data.appMode = 'seeker';
        return data;
    }

    saveData() {
        this.data.appMode = this.appMode;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    init() {
        if (this.data.jobs.length === 0) {
            this.seedDemoData();
        }

        if (this.currentUser) {
            this.navigate('home');
        } else {
            this.navigate('auth');
        }

        document.getElementById('job-modal').addEventListener('click', (e) => {
            if (e.target.id === 'job-modal') this.closeModal();
        });
    }

    seedDemoData() {
        this.data.users['bruneihustler'] = { name: 'Awang Ali', password: 'password123' };
        const now = new Date();
        const job1Id = 'job_' + Date.now() + '1';
        this.data.jobs.push({
            id: job1Id, title: 'Cut grass at home', location: 'Spg 10, Kg Berakas',
            coords: [4.9602, 114.9388], reward: 25, description: 'Lawn needs mowing. Equipment is ready in the garage.',
            poster: 'admin_user', status: 'open', applicants: ['awang_ben', 'dayang_siti'], assignedTo: null, createdAt: now.toISOString(),
            category: 'Outdoor', duration: '2 hours', equipment: 'Provided', radius: 'Within 5km', payment: 'Cash'
        });
        this.data.users['awang_ben'] = { name: 'Awang Ben', password: '123' };
        this.data.users['dayang_siti'] = { name: 'Dayang Siti', password: '123' };

        this.data.jobs.push({
            id: 'job_' + Date.now() + '2', title: 'Fix leaked pipe', location: 'Jalan Rimba',
            coords: [4.9392, 114.9126], reward: 45, description: 'Kitchen pipe is bursting!',
            poster: 'admin_user', status: 'open', applicants: [], assignedTo: null, createdAt: now.toISOString(),
            category: 'Indoor', duration: '1 hour', equipment: 'Own Tools Required', radius: 'Within 10km', payment: 'Transfer'
        });
        this.data.jobs.push({
            id: 'job_' + Date.now() + '3', title: 'Deliver Cake', location: 'Kiulap Mall',
            coords: [4.8974, 114.9304], reward: 15, description: 'Need someone to drive and deliver a cake to KB securely.',
            poster: 'baker_jane', status: 'open', applicants: [], assignedTo: null, createdAt: now.toISOString(),
            category: 'Outdoor', duration: '3 hours', equipment: 'Car & AC', radius: 'Anywhere', payment: 'Transfer'
        });
        this.saveData();
    }

    initMap() {
        if (!this.map) {
            const standard = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO'
            });

            const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
            });

            this.map = L.map('map-container', {
                zoomControl: false,
                layers: [standard]
            }).setView([4.8903, 114.9401], 13);

            const baseMaps = {
                "Standard View": standard,
                "Satellite View": satellite
            };

            L.control.layers(baseMaps, null, { position: 'topright' }).addTo(this.map);
            L.control.zoom({ position: 'topright' }).addTo(this.map);
        }

        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        // Add markers based on Mode
        const visibleJobs = this.data.jobs.filter(j => {
            // Apply category filter if active
            if (this.activeCategory && j.category !== this.activeCategory) return false;

            if (this.appMode === 'seeker') {
                // Seeker sees open jobs from others
                if (j.status === 'open' && j.poster !== this.currentUser) return true;
                // Seeker also sees their OWN open jobs (to verify they are posted)
                if (j.status === 'open' && j.poster === this.currentUser) return true;
                // Seeker sees their assigned tasks
                if (j.status === 'assigned' && j.assignedTo === this.currentUser) return true;
            } else {
                // Poster sees only their own jobs (Open or Assigned)
                if (j.poster === this.currentUser) return true;
            }
            return false;
        });

        visibleJobs.forEach(job => {
            if (job.coords) {
                const isActive = job.status === 'assigned';
                const isMine = job.poster === this.currentUser;

                // Color Code: Green (Others), Blue (Active), Orange (My Posts)
                let markerColor = 'var(--primary)'; // Green
                if (isActive) markerColor = 'var(--blue)';
                else if (isMine) markerColor = 'var(--orange)';

                const priceIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class='marker-pin' style='border-top-color: ${markerColor}'></div>
                           <span class='marker-text' style='background: ${markerColor}'>
                                ${isActive ? '<i class="fa-solid fa-person-running"></i> ACTIVE' :
                            (isMine ? '<i class="fa-solid fa-bullhorn"></i> MY POST' : '$' + job.reward)}
                           </span>`,
                    iconSize: [45, 48],
                    iconAnchor: [22, 48]
                });

                const marker = L.marker(job.coords, { icon: priceIcon }).addTo(this.map);
                marker.on('click', () => {
                    this.openModal(job.id);
                });
                this.markers.push(marker);
            }
        });
    }

    centerMapToMe() {
        if (!this.map) return;

        // Visual feedback on the button
        const btnIcon = document.querySelector('.action-card[onclick*="centerMapToMe"] i');
        if (btnIcon) btnIcon.classList.add('fa-spin');

        if ("geolocation" in navigator) {
            this.showToast('Finding your precise location...', 'success');

            // 1st Attempt: High Accuracy
            navigator.geolocation.getCurrentPosition(position => {
                if (btnIcon) btnIcon.classList.remove('fa-spin');
                this.setMockPosition([position.coords.latitude, position.coords.longitude]);
            }, (err) => {
                // 2nd Attempt: If high accuracy fails/delays, try faster network location
                console.warn('GPS High Accuracy failed, trying network...', err);

                navigator.geolocation.getCurrentPosition(pos => {
                    if (btnIcon) btnIcon.classList.remove('fa-spin');
                    this.showToast('Location approximate (Network)', 'success');
                    this.setMockPosition([pos.coords.latitude, pos.coords.longitude]);
                }, (err2) => {
                    if (btnIcon) btnIcon.classList.remove('fa-spin');
                    this.showToast('Location unavailable. Centering on BSB.', 'error');
                    this.setMockPosition([4.8903, 114.9401]);
                }, { enableHighAccuracy: false, timeout: 4000 });

            }, {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 60000 // Use results up to 1 minute old for instant response
            });
        } else {
            this.showToast('Geolocation not supported.', 'error');
        }
    }

    setMockPosition(coords) {
        // Add or move User Marker (Blue Dot)
        if (this.userMarker) {
            this.userMarker.setLatLng(coords);
        } else {
            const userIcon = L.divIcon({
                className: 'user-marker-icon',
                html: '<div class="user-dot"></div><div class="user-pulse"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            this.userMarker = L.marker(coords, { icon: userIcon }).addTo(this.map);
        }

        // Add or move Search Radius Circle (5km)
        if (this.userRadius) {
            this.userRadius.setLatLng(coords);
        } else {
            this.userRadius = L.circle(coords, {
                color: 'var(--primary)',
                fillColor: 'var(--primary)',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 5',
                radius: 5000 // 5km radius
            }).addTo(this.map);
        }

        // Fit the map to smoothly zoom and show the entire circle
        if (this.map) {
            this.map.flyToBounds(this.userRadius.getBounds(), { padding: [10, 10], maxZoom: 13, duration: 1.5 });
        }

        // Calculate how many open jobs are inside this radius
        let nearbyCount = 0;
        this.data.jobs.forEach(job => {
            if (job.status === 'open' && job.poster !== this.currentUser && job.coords) {
                // distance in meters
                const dist = this.map.distance(coords, job.coords);
                if (dist <= 5000) {
                    nearbyCount++;
                }
            }
        });

        setTimeout(() => {
            if (nearbyCount > 0) {
                this.showToast(`Found ${nearbyCount} quest(s) within 5km!`, 'success');
                // Trigger an explicit browser alert per user request
                setTimeout(() => {
                    alert(`🚨 QUESTS FOUND!\n\nThere are ${nearbyCount} open quest(s) within a 5km radius of your location. Check the map to grab them!`);
                }, 100);
            } else {
                this.showToast('No open quests within 5km of you.', 'error');
            }
        }, 1500); // slight delay to show after flying
    }

    handleSearch(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.toLowerCase();
            const regions = {
                'gadong': [4.9000, 114.9000],
                'kiulap': [4.8974, 114.9304],
                'rimba': [4.9392, 114.9126],
                'berakas': [4.9602, 114.9388],
                'tutong': [4.8014, 114.6543],
                'belait': [4.5833, 114.1834],
                'temburong': [4.7431, 115.1384]
            };

            for (let key in regions) {
                if (query.includes(key)) {
                    this.map.flyTo(regions[key], 15);
                    this.showToast(`Navigating to ${key.toUpperCase()}...`, 'success');
                    return;
                }
            }
            this.showToast('Location not found. Try "Gadong" or "Berakas".', 'error');
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
        container.appendChild(t);

        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translateY(-20px)';
            t.style.transition = 'all 0.3s';
            setTimeout(() => t.remove(), 300);
        }, 3000);
    }

    navigate(view) {
        document.querySelectorAll('.view').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active-view');
        });

        const target = document.getElementById(`view-${view}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active-view');
        }

        const bottomNav = document.getElementById('bottom-nav');
        if (view === 'auth' || view === 'postJob') {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }

        if (view !== 'auth' && view !== 'postJob') {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            if (view === 'home' || view === 'explore') document.querySelectorAll('.nav-item')[0].classList.add('active');
            if (view === 'activity') document.querySelectorAll('.nav-item')[1].classList.add('active');
            if (view === 'account') document.querySelectorAll('.nav-item')[2].classList.add('active');
        }

        // Run Logic
        if (view === 'home') {
            this.loadHome();
            // Need setTimeout so map container finishes rendering before invalidating size
            setTimeout(() => { if (this.map) this.map.invalidateSize(); }, 100);
        }
        if (view === 'explore') this.loadExplore();
        if (view === 'activity') {
            const defaultTab = this.appMode === 'poster' ? 'requests' : 'tasks';
            this.switchActivityTab(defaultTab);
            this.loadActivity();
        }
        if (view === 'account') this.loadAccount();
        if (view === 'chat') {
            this.renderMessages();
            document.getElementById('bottom-nav').classList.add('hidden');
        }
    }

    setMode(mode) {
        this.appMode = mode;
        this.saveData();
        this.showToast(`Switched to ${mode.toUpperCase()} mode`, 'success');

        // Refresh UI
        this.loadHome();
        this.updateModeUI();
        if (this.activeView === 'activity') this.loadActivity();

        // Return to home map for fresh start
        this.navigate('home');
    }

    updateModeUI() {
        const isPoster = this.appMode === 'poster';
        document.body.classList.toggle('poster-mode', isPoster);
        document.body.classList.toggle('seeker-mode', !isPoster);

        const modeLabel = document.getElementById('current-mode-label');
        if (modeLabel) modeLabel.innerText = isPoster ? 'POSTER PORTAL' : 'SEEKER PORTAL';

        const quickActions = document.querySelector('.quick-actions-grid');
        if (quickActions) {
            // Modify visibility or order based on mode
        }
    }

    toggleAuth(mode) {
        this.authMode = mode;
        const tabs = document.querySelectorAll('#view-auth .tab-btn');
        tabs[0].classList.toggle('active', mode === 'login');
        tabs[1].classList.toggle('active', mode === 'signup');
        document.getElementById('signup-fields').classList.toggle('hidden', mode === 'login');
        document.getElementById('auth-submit').innerText = mode === 'login' ? 'Log In' : 'Sign Up';
    }

    handleAuth(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value.trim();

        if (this.authMode === 'signup') {
            if (this.data.users[username]) return this.showToast('Username already taken', 'error');
            this.data.users[username] = { name: name || username, password };
            this.showToast('Account Created!');
        } else {
            const user = this.data.users[username];
            if (!user || user.password !== password) return this.showToast('Incorrect password', 'error');
        }

        this.data.currentUser = username;
        this.currentUser = username;
        this.saveData();
        this.navigate('home');
        e.target.reset();
    }

    logout() {
        this.data.currentUser = null;
        this.currentUser = null;
        this.saveData();
        this.navigate('auth');
    }

    handlePaymentChange(e) {
        const note = document.getElementById('payment-proof-note');
        if (e.target.value === 'Transfer') {
            note.classList.remove('hidden');
        } else {
            note.classList.add('hidden');
        }
    }

    postJob(e) {
        e.preventDefault();
        const title = document.getElementById('job-title').value.trim();
        const location = document.getElementById('job-location').value.trim();
        const regionCoords = document.getElementById('job-region').value.split(',').map(Number);
        const reward = document.getElementById('job-reward').value;
        const description = document.getElementById('job-description').value.trim();

        const category = document.getElementById('job-category').value;
        const durationValue = document.getElementById('job-duration-value').value.trim();
        const durationUnit = document.getElementById('job-duration-unit').value;
        const duration = `${durationValue} ${durationUnit}`;
        const equipment = document.getElementById('job-equipment').value.trim();
        const radius = document.getElementById('job-radius').value;
        const payment = document.getElementById('job-payment').value;

        const newJob = {
            id: 'job_' + Date.now(),
            title, location, category, duration, equipment, radius, payment,
            coords: [regionCoords[0] + (Math.random() * 0.01 - 0.005), regionCoords[1] + (Math.random() * 0.01 - 0.005)], // Offset slightly
            reward: parseFloat(reward), description,
            poster: this.currentUser, status: 'open', applicants: [], assignedTo: null,
            createdAt: new Date().toISOString()
        };

        this.data.jobs.unshift(newJob);
        this.saveData();
        this.showToast('Quest broadcasted to map!');
        e.target.reset();
        document.getElementById('payment-proof-note').classList.add('hidden');
        this.navigate('home');
    }

    loadHome() {
        const u = this.data.users[this.currentUser];
        document.getElementById('greeting-name').innerText = u.name.split(' ')[0] + '!';
        document.getElementById('home-wallet').innerText = '$' + this.calculateEarnings().toFixed(2);

        this.updateModeUI();

        // Show status of current task/request if any
        const handle = document.querySelector('.map-handle');
        handle.innerHTML = '';
        handle.style.cursor = 'default';
        handle.onclick = null;

        if (this.appMode === 'seeker') {
            const activeTask = this.data.jobs.find(j => j.assignedTo === this.currentUser && j.status === 'assigned');
            if (activeTask) {
                handle.style.cursor = 'pointer';
                handle.onclick = () => this.openModal(activeTask.id);
                handle.innerHTML = `<div class="active-badge"><i class="fa-solid fa-person-running"></i> Task In Progress: ${activeTask.title}</div>`;
            }
        } else {
            const activePost = this.data.jobs.find(j => j.poster === this.currentUser && j.status === 'open' && j.applicants.length > 0);
            if (activePost) {
                handle.style.cursor = 'pointer';
                handle.onclick = () => this.openModal(activePost.id);
                handle.innerHTML = `<div class="active-badge" style="background:var(--orange);"><i class="fa-solid fa-bell"></i> ${activePost.applicants.length} New Applicants for "${activePost.title}"</div>`;
            } else {
                const assignedPost = this.data.jobs.find(j => j.poster === this.currentUser && j.status === 'assigned');
                if (assignedPost) {
                    handle.style.cursor = 'pointer';
                    handle.onclick = () => this.openModal(assignedPost.id);
                    handle.innerHTML = `<div class="active-badge" style="background:var(--blue);"><i class="fa-solid fa-user-check"></i> Active Help: ${assignedPost.title}</div>`;
                }
            }
        }
        this.initMap();
    }

    toggleMapFilters() {
        const f = document.getElementById('map-filters');
        f.classList.toggle('hidden');
    }

    filterMap(category, event) {
        this.activeCategory = category === 'all' ? null : category;

        // Update chip UI
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        if (event) event.target.classList.add('active');

        this.initMap();
    }

    clearRadius() {
        if (this.userRadius) {
            this.map.removeLayer(this.userRadius);
            this.userRadius = null;
        }
    }

    zoomToJob(jobId, event) {
        if (event) event.stopPropagation();
        const job = this.data.jobs.find(j => j.id === jobId);
        if (job && job.coords) {
            this.navigate('home');
            setTimeout(() => {
                this.map.flyTo(job.coords, 16, { duration: 1.5 });
                // Briefly highlight the marker if needed, but flyTo is usually enough
                this.showToast(`Zooming to: ${job.title}`, 'success');
            }, 300);
        }
    }

    getDirections(jobId) {
        const job = this.data.jobs.find(j => j.id === jobId);
        if (job && job.coords) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${job.coords[0]},${job.coords[1]}`;
            window.open(url, '_blank');
        }
    }

    generateJobCard(job) {
        const isPoster = job.poster === this.currentUser;

        let jobTags = '';
        if (job.category) jobTags += `<span class="status-badge" style="background:var(--bg-color); color:var(--text-secondary); margin-right:5px; border:1px solid var(--border-color);"><i class="fa-solid ${job.category === 'Indoor' ? 'fa-house' : 'fa-tree'}"></i> ${job.category}</span>`;
        if (job.payment) jobTags += `<span class="status-badge" style="background:var(--bg-color); color:var(--text-secondary); border:1px solid var(--border-color);"><i class="fa-solid ${job.payment === 'Cash' ? 'fa-money-bill' : 'fa-building-columns'}"></i> ${job.payment}</span>`;

        let html = `
            <div class="grab-card" onclick="app.openModal('${job.id}')" style="cursor:pointer; position:relative; overflow:hidden;">
                <div class="grab-card-header">
                    <div>
                        <h3 class="grab-title">${job.title}</h3>
                        <p class="grab-location"><i class="fa-solid fa-map-pin text-danger"></i> ${job.location}</p>
                        <div style="margin-top:0.5rem; margin-bottom:0.5rem;">
                            <span class="status-badge badge-${job.status}">${job.status.toUpperCase()}</span>
                            ${jobTags}
                        </div>
                    </div>
                    <div class="grab-reward" style="text-align:right;">
                        $${job.reward}
                        ${(isPoster && job.applicants.length > 0 && job.status === 'open') ? `<div class="pulse" style="width:10px; height:10px; background:var(--danger); border-radius:50%; display:inline-block; margin-left:5px;"></div>` : ''}
                        <div style="margin-top:5px;">
                            <button onclick="app.zoomToJob('${job.id}', event)" class="btn-outline" style="padding:4px 8px; font-size:0.7rem; border-radius:6px;"><i class="fa-solid fa-crosshairs"></i> Zoom</button>
                        </div>
                    </div>
                </div>
        `;
        if (isPoster) {
            if (job.status === 'open') {
                html += `<div style="display:flex; align-items:center; gap:0.5rem; background:rgba(0,0,0,0.03); padding:0.5rem; border-radius:8px; margin-top:0.5rem;">
                            <i class="fa-solid fa-users text-gray"></i>
                            <span style="font-weight:600; font-size:0.85rem;">${job.applicants.length} Interested Seekers</span>
                            ${job.applicants.length > 0 ? '<span class="status-badge" style="margin:0; background:var(--orange); color:white; font-size:0.7rem;">ACTION NEEDED</span>' : ''}
                        </div>`;
            } else if (job.status === 'assigned') {
                html += `<div style="background:rgba(0,165,80,0.05); padding:0.5rem; border-radius:8px; margin-top:0.5rem; font-size:0.85rem;">
                            <i class="fa-solid fa-user-check text-success"></i> Assigned to <strong>@${job.assignedTo}</strong>
                        </div>`;
            }
        } else if (!isPoster) {
            html += `<div style="font-size:0.85rem; color:var(--text-secondary);"><i class="fa-solid fa-user-circle"></i> @${job.poster}</div>`;
        }
        html += `</div>`;
        return html;
    }

    loadExplore() {
        const feed = document.getElementById('explore-feed');
        const availableJobs = this.data.jobs.filter(j => j.status === 'open' && j.poster !== this.currentUser);
        feed.innerHTML = availableJobs.length ? availableJobs.map(j => this.generateJobCard(j)).join('') : '<p class="text-center text-gray">No quests available.</p>';
    }

    switchActivityTab(tab, event) {
        if (event) {
            document.querySelectorAll('.tab-slider .slider-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
        }
        document.querySelector('.tab-slider .slider-bg').style.transform = tab === 'requests' ? 'translateX(0)' : 'translateX(100%)';
        document.getElementById('activity-requests').classList.toggle('hidden', tab !== 'requests');
        document.getElementById('activity-tasks').classList.toggle('hidden', tab !== 'tasks');
    }

    loadActivity() {
        const reqContainer = document.getElementById('activity-requests');
        const postedJobs = this.data.jobs.filter(j => j.poster === this.currentUser);
        reqContainer.innerHTML = postedJobs.length ? postedJobs.map(j => this.generateJobCard(j)).join('') : '<p class="text-gray text-center mt-4">You have no requests.</p>';

        const taskContainer = document.getElementById('activity-tasks');
        const appliedJobs = this.data.jobs.filter(j => j.applicants.includes(this.currentUser) || j.assignedTo === this.currentUser);
        taskContainer.innerHTML = appliedJobs.length ? appliedJobs.map(j => this.generateJobCard(j)).join('') : '<p class="text-gray text-center mt-4">No active tasks.</p>';
    }

    calculateEarnings() {
        let total = 0;
        this.data.jobs.forEach(j => { if (j.status === 'closed' && j.assignedTo === this.currentUser) total += j.reward; });
        return total;
    }

    loadAccount() {
        const u = this.data.users[this.currentUser];
        document.getElementById('account-name').innerText = u.name;
        document.getElementById('account-username').innerText = '@' + this.currentUser;
        document.getElementById('wallet-balance-full').innerText = '$' + this.calculateEarnings().toFixed(2);

        // Populate History
        const list = document.getElementById('history-list');
        const closedTasks = this.data.jobs.filter(j => j.status === 'closed' && j.assignedTo === this.currentUser);
        if (closedTasks.length === 0) {
            list.innerHTML = '<p class="text-sm text-gray">No transactions yet.</p>';
        } else {
            list.innerHTML = closedTasks.map(j => `
                <div class="history-item">
                    <div>
                        <div style="font-weight:600; font-size:0.9rem;">${j.title}</div>
                        <div class="text-sm text-gray">${new Date(j.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style="color:var(--primary); font-weight:800;">+$${j.reward.toFixed(2)}</div>
                </div>
            `).join('');
        }
    }

    withdrawAlert() {
        const balance = this.calculateEarnings();
        if (balance <= 0) return this.showToast('Balance is zero.', 'error');
        this.showToast('Withdrawal processing to your BIBD/Baiduri...', 'success');
    }

    openModal(id) {
        const job = this.data.jobs.find(j => j.id === id);
        if (!job) return;

        const isPoster = job.poster === this.currentUser;
        const modal = document.getElementById('job-modal');
        const content = document.getElementById('modal-content');

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 1rem;">
                <div>
                   <h2 style="font-size:1.5rem; margin-bottom:0.2rem;">${job.title}</h2>
                   <p class="text-gray" style="font-size:0.9rem;"><i class="fa-solid fa-location-dot text-danger"></i> ${job.location}</p>
                </div>
                <div style="font-size:1.6rem; font-weight:800; color:var(--primary);">$${job.reward}</div>
            </div>
            
            <div style="background:var(--bg-color); padding:1rem; border-radius:12px; margin-bottom:1.5rem; font-size:0.95rem;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                    <div><strong class="text-gray" style="font-size:0.8rem;">Category</strong><br>${job.category ? `<i class="fa-solid ${job.category === 'Indoor' ? 'fa-house' : 'fa-tree'}"></i> ` + job.category : 'N/A'}</div>
                    <div><strong class="text-gray" style="font-size:0.8rem;">Duration</strong><br>${job.duration || 'N/A'}</div>
                    <div><strong class="text-gray" style="font-size:0.8rem;">Equipment</strong><br>${job.equipment || 'N/A'}</div>
                    <div><strong class="text-gray" style="font-size:0.8rem;">Radius</strong><br>${job.radius || 'N/A'}</div>
                    <div style="grid-column: span 2;"><strong class="text-gray" style="font-size:0.8rem;">Payment Options</strong><br>
                        ${job.payment === 'Transfer' ? '<span class="text-danger"><i class="fa-solid fa-building-columns"></i> Bank Transfer (Verified receipt/proof required)</span>' : (job.payment === 'Cash' ? '<strong style="color:var(--primary);"><i class="fa-solid fa-money-bill"></i> Cash on Delivery</strong>' : 'N/A')}
                    </div>
                </div>
                <p style="margin-bottom:0.5rem; color:var(--text-secondary); font-size:0.85rem; font-weight:600;">NOTES FROM POSTER</p>
                ${job.description || "No description provided."}
            </div>
        `;

        if (isPoster) {
            if (job.status === 'open') {
                html += `<h3 style="margin-bottom:1rem; font-size:1.1rem;">Applicants (${job.applicants.length})</h3>`;
                if (job.applicants.length === 0) {
                    html += `<p class="text-gray text-sm">Waiting for someone to accept...</p>`;
                } else {
                    job.applicants.forEach(uname => {
                        const u = this.data.users[uname];
                        html += `
                            <div style="border:1px solid var(--border-color); padding:1rem; border-radius:12px; margin-bottom:1rem;">
                                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.8rem;">
                                    <i class="fa-solid fa-user-circle fa-2x text-gray"></i>
                                    <div><strong>${u ? u.name : uname}</strong><div class="text-sm text-gray">@${uname}</div></div>
                                </div>
                                <div style="display:flex; gap:0.5rem;">
                                    <button class="btn-primary" style="flex:1;" onclick="app.acceptOffer('${job.id}', '${uname}')">Accept Helper</button>
                                    <button class="btn-outline" style="flex:1;" onclick="app.openChat('${job.id}', '${uname}')"><i class="fa-solid fa-comment"></i> Message</button>
                                    <button class="btn-outline" style="border-color:var(--danger); color:var(--danger); flex:0.5;" onclick="app.rejectOffer('${job.id}', '${uname}')">Reject</button>
                                </div>
                            </div>
                        `;
                    });
                }
                html += `<button class="btn-outline btn-block text-danger mt-4" style="border-color:var(--border-color);" onclick="app.closeQuest('${job.id}')">Cancel & Delete Quest</button>`;
            } else if (job.status === 'assigned') {
                html += `
                     <div style="background:rgba(0,165,80,0.1); padding:1.5rem; border-radius:12px; text-align:center;">
                        <h4 style="color:var(--primary); margin-bottom:0.5rem;"><i class="fa-solid fa-comment-dots"></i> You are chat-ready</h4>
                        <p><strong>@${job.assignedTo}</strong> is working on it.</p>
                     </div>
                     <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                        <button class="btn-primary" style="flex:1;" onclick="app.openChat('${job.id}')">Open Chat</button>
                        <button class="btn-outline" style="flex:1;" onclick="app.markCompleted('${job.id}')">Mark Finished</button>
                     </div>
                 `;
            }
        } else {
            // Not Poster (Job Seeker)
            if (job.status === 'open') {
                const isApplied = job.applicants.includes(this.currentUser);
                if (isApplied) {
                    html += `
                        <div style="background:var(--bg-color); padding:1rem; border-radius:12px; text-align:center; margin-bottom:1rem;">
                            You have requested to help. Waiting for approval.
                        </div>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn-primary" style="flex:1;" onclick="app.openChat('${job.id}')"><i class="fa-solid fa-comment"></i> Chat with Poster</button>
                            <button class="btn-outline" style="flex:1;" onclick="app.withdrawJob('${job.id}'); app.closeModal()">Withdraw</button>
                        </div>`;
                } else {
                    html += `
                        <div style="display:flex; gap:0.8rem;">
                            <button class="btn-primary btn-lg shadow-btn" style="flex:2;" onclick="app.applyJob('${job.id}')">Accept Quest</button>
                            <button class="btn-outline btn-lg" style="flex:1;" onclick="app.closeModal()">Reject</button>
                        </div>
                    `;
                }
            } else if (job.assignedTo === this.currentUser) {
                html += `
                    <div style="background:rgba(0,165,80,0.1); padding:1.5rem; border-radius:12px; text-align:center;">
                        <h3 style="color:var(--primary); margin-bottom:0.5rem;">You are the Helper!</h3>
                        <p>Message the poster to finalize details.</p>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-top:1rem;">
                        <button class="btn-primary" style="grid-column: span 2;" onclick="app.openChat('${job.id}')"><i class="fa-solid fa-comment"></i> Chat with Poster</button>
                        <button class="btn-outline" onclick="app.zoomToJob('${job.id}')"><i class="fa-solid fa-location-crosshairs"></i> Locate</button>
                        <button class="btn-outline" onclick="app.getDirections('${job.id}')"><i class="fa-solid fa-route"></i> Directions</button>
                    </div>
                 `;
            } else {
                html += `<button class="btn-outline btn-block" disabled>Job Closed / Assigned</button>`;
            }
        }

        content.innerHTML = html;
        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('job-modal').classList.add('hidden');
    }

    applyJob(id) {
        const job = this.data.jobs.find(j => j.id === id);
        if (job) {
            if (job.poster === this.currentUser) return this.showToast('You cannot apply to your own quest!', 'error');
            if (job.applicants.includes(this.currentUser)) return this.showToast('Already applied.', 'error');

            job.applicants.push(this.currentUser);
            this.saveData();
            this.showToast('Quest request sent!');
            this.initMap();
            this.closeModal();
            if (!document.getElementById('view-activity').classList.contains('hidden')) this.loadActivity();
        }
    }

    withdrawJob(id) {
        const job = this.data.jobs.find(j => j.id === id);
        if (job) {
            job.applicants = job.applicants.filter(u => u !== this.currentUser);
            this.saveData();
            this.showToast('Withdrawn.');
            if (!document.getElementById('view-activity').classList.contains('hidden')) this.loadActivity();
        }
    }

    acceptOffer(jobId, username) {
        const job = this.data.jobs.find(j => j.id === jobId);
        if (job) {
            job.status = 'assigned';
            job.assignedTo = username;
            this.saveData();
            this.showToast(`Accepted @${username}!`);
            this.initMap();
            this.openModal(jobId);
            if (!document.getElementById('view-activity').classList.contains('hidden')) this.loadActivity();
        }
    }

    rejectOffer(jobId, username) {
        const job = this.data.jobs.find(j => j.id === jobId);
        if (job) {
            job.applicants = job.applicants.filter(u => u !== username);
            this.saveData();
            this.showToast(`Rejected offer.`);
            this.openModal(jobId);
        }
    }

    closeQuest(jobId) {
        const index = this.data.jobs.findIndex(j => j.id === jobId);
        if (index !== -1) {
            this.data.jobs.splice(index, 1);
            this.saveData();
            this.showToast(`Quest deleted.`);
            this.initMap();
            this.closeModal();
            if (!document.getElementById('view-activity').classList.contains('hidden')) this.loadActivity();
        }
    }

    markCompleted(jobId) {
        const job = this.data.jobs.find(j => j.id === jobId);
        if (job) {
            job.status = 'closed';
            this.saveData();
            this.showToast(`Quest completed!`, 'success');
            this.closeModal();
            if (!document.getElementById('view-activity').classList.contains('hidden')) this.loadActivity();
            if (!document.getElementById('view-account').classList.contains('hidden')) this.loadAccount();
            this.initMap();
        }
    }
    // Chat Logic
    openChat(jobId, targetUser = null) {
        this.activeChatJobId = jobId;
        const job = this.data.jobs.find(j => j.id === jobId);
        if (!job) return;

        this.closeModal();
        this.navigate('chat');

        // If targetUser is provided (Poster pre-approving), use that.
        // Otherwise, use the assigned user or the poster.
        const otherUser = targetUser || (job.poster === this.currentUser ? job.assignedTo : job.poster);
        const u = this.data.users[otherUser];

        document.getElementById('chat-title').innerText = u ? u.name : otherUser;
        document.getElementById('chat-subtitle').innerText = `@${otherUser} | ${job.title}`;
        this.renderMessages();
    }

    exitChat() {
        this.navigate('home');
        this.activeChatJobId = null;
    }

    showJobFromChat() {
        if (this.activeChatJobId) this.openModal(this.activeChatJobId);
    }

    handleSendMessage(e) {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text || !this.activeChatJobId) return;

        if (!this.data.chats[this.activeChatJobId]) {
            this.data.chats[this.activeChatJobId] = [];
        }

        const msg = {
            sender: this.currentUser,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.data.chats[this.activeChatJobId].push(msg);
        this.saveData();
        input.value = '';
        this.renderMessages();

        // Simulated Reply for Demo Professionalism
        const botReplies = [
            "Terima kasih! I will reach out soon.",
            "Alright, noted on that. See you later!",
            "Can you share the exact Spg number?",
            "Okay, I'm on my way now."
        ];

        setTimeout(() => {
            const replyMsg = {
                sender: 'system_demo',
                text: botReplies[Math.floor(Math.random() * botReplies.length)],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            this.data.chats[this.activeChatJobId].push(replyMsg);
            this.renderMessages();
        }, 2000);
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        const jobId = this.activeChatJobId;
        if (!jobId || !container) return;

        const messages = this.data.chats[jobId] || [];
        container.innerHTML = messages.map(msg => `
            <div class="msg-bubble ${msg.sender === this.currentUser ? 'msg-sent' : 'msg-received'}">
                ${msg.text}
                <span class="msg-time">${msg.time}</span>
            </div>
        `).join('');

        // Auto scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
}

const app = new App();
