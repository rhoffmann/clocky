class AnalogClock {
    constructor() {
        this.hourHand = document.getElementById('hourHand');
        this.minuteHand = document.getElementById('minuteHand');
        this.secondHand = document.getElementById('secondHand');
        this.digitalTime = document.getElementById('digitalTime');
        this.themeToggle = document.getElementById('themeToggle');
        this.classicToggle = document.getElementById('classicToggle');
        this.fullscreenToggle = document.getElementById('fullscreenToggle');
        
        this.isFullscreen = false;
        this.isDarkMode = false;
        this.isClassic = false;
        
        this.init();
    }
    
    init() {
        this.updateClock();
        if (this.digitalTime) {
            this.updateDigitalTime();
        }
        this.setupEventListeners();
        this.loadThemePreference();
        this.loadStylePreference();
        
        // Update every second
        setInterval(() => {
            this.updateClock();
            if (this.digitalTime) {
                this.updateDigitalTime();
            }
        }, 1000);
    }
    
    updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours(); // Use 24-hour format but convert for display
        
        // Calculate angles (starting from 12 o'clock position)
        const secondAngle = (seconds * 6); // 6 degrees per second
        const minuteAngle = (minutes * 6) + (seconds * 0.1); // 6 degrees per minute + smooth seconds
        const hourAngle = ((hours % 12) * 30) + (minutes * 0.5); // 30 degrees per hour + smooth minutes
        
        // Apply rotations
        this.secondHand.style.transform = `rotate(${secondAngle}deg)`;
        this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
    }
    
    updateDigitalTime() {
        // Only update digital time if the element exists
        if (this.digitalTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false, // Use 24-hour format
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            this.digitalTime.innerHTML = `
                <div>${timeString}</div>
                <div style="font-size: 0.8em; opacity: 0.8; margin-top: 0.5rem;">${dateString}</div>
            `;
        }
    }
    
    setupEventListeners() {
        // Only add listeners if elements exist
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        if (this.classicToggle) {
            this.classicToggle.addEventListener('click', () => {
                this.toggleClassic();
            });
        }
        
        if (this.fullscreenToggle) {
            this.fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            this.handleFullscreenChange();
        });
        
        document.addEventListener('webkitfullscreenchange', () => {
            this.handleFullscreenChange();
        });
        
        document.addEventListener('mozfullscreenchange', () => {
            this.handleFullscreenChange();
        });
        
        document.addEventListener('MSFullscreenChange', () => {
            this.handleFullscreenChange();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            } else if (e.key === 't' || e.key === 'T') {
                this.toggleTheme();
            } else if (e.key === 'c' || e.key === 'C') {
                this.toggleClassic();
            } else if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
            }
        });
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        if (this.themeToggle) {
            this.themeToggle.textContent = this.isDarkMode ? '☀️' : '🌙';
        }
        
        // Save preference
        localStorage.setItem('clockTheme', this.isDarkMode ? 'dark' : 'light');
    }
    
    loadThemePreference() {
        const savedTheme = localStorage.getItem('clockTheme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.themeToggle) {
                this.themeToggle.textContent = '☀️';
            }
        } else {
            this.isDarkMode = false;
            document.documentElement.setAttribute('data-theme', 'light');
            if (this.themeToggle) {
                this.themeToggle.textContent = '🌙';
            }
        }
    }
    
    toggleClassic() {
        this.isClassic = !this.isClassic;
        document.documentElement.setAttribute('data-style', this.isClassic ? 'classic' : 'modern');
        this.updateNumbers();
        
        // Save preference
        localStorage.setItem('clockStyle', this.isClassic ? 'classic' : 'modern');
    }
    
    loadStylePreference() {
        const savedStyle = localStorage.getItem('clockStyle');
        if (savedStyle === 'classic') {
            this.isClassic = true;
            document.documentElement.setAttribute('data-style', 'classic');
            this.updateNumbers();
        } else {
            this.isClassic = false;
            document.documentElement.setAttribute('data-style', 'modern');
        }
    }
    
    updateNumbers() {
        const numbers = document.querySelectorAll('.number');
        numbers.forEach(number => {
            if (this.isClassic) {
                number.textContent = number.getAttribute('data-roman');
            } else {
                number.textContent = number.getAttribute('data-modern');
            }
        });
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    handleFullscreenChange() {
        this.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        document.body.classList.toggle('fullscreen', this.isFullscreen);
        if (this.fullscreenToggle) {
            this.fullscreenToggle.textContent = this.isFullscreen ? '⛶' : '⛶';
        }
    }
}

// Initialize the clock when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnalogClock();
});

// Add some visual feedback for interactions
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});
