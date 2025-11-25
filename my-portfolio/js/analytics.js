// analytics.js
const SimpleAnalytics = {
    events: [],
    maxEvents: 100,
    analyticsPanel: null,

    init() {
        console.log('SimpleAnalytics: Инициализация системы аналитики');

        // Отслеживание кликов
        document.addEventListener('click', (event) => {
            this.trackClick(event);
        });

        // Отслеживание отправки форм
        document.addEventListener('submit', (event) => {
            this.trackFormSubmit(event);
        });

        // Горячие клавиши для панели аналитики (Ctrl+Shift+A)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'A') {
                event.preventDefault();
                this.toggleAnalyticsPanel();
            }
        });

        // Загрузка сохраненных событий
        this.loadEvents();

        // Создание панели аналитики
        this.createAnalyticsPanel();
    },

    trackClick(event) {
        const target = event.target;
        const eventData = {
            type: 'click',
            element: {
                tagName: target.tagName,
                id: target.id || 'none',
                className: target.className || 'none',
                text: target.textContent?.substring(0, 50) || 'none'
            },
            page: window.location.href,
            timestamp: new Date().toISOString(),
            coordinates: {
                x: event.clientX,
                y: event.clientY
            }
        };

        this.captureEvent(eventData);
    },

    trackFormSubmit(event) {
        const form = event.target;
        const eventData = {
            type: 'form_submit',
            form: {
                id: form.id || 'none',
                className: form.className || 'none',
                action: form.action || 'none',
                method: form.method || 'none'
            },
            page: window.location.href,
            timestamp: new Date().toISOString()
        };

        this.captureEvent(eventData);
    },

    captureEvent(eventData) {
        // Добавляем событие в начало массива
        this.events.unshift(eventData);

        // Ограничиваем количество событий
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(0, this.maxEvents);
        }

        // Сохраняем в localStorage
        this.saveEvents();
    },

    saveEvents() {
        try {
            localStorage.setItem('simpleAnalytics_events', JSON.stringify(this.events));
        } catch (e) {
            console.warn('SimpleAnalytics: Не удалось сохранить события в localStorage', e);
        }
    },

    loadEvents() {
        try {
            const saved = localStorage.getItem('simpleAnalytics_events');
            if (saved) {
                this.events = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('SimpleAnalytics: Не удалось загрузить события из localStorage', e);
        }
    },

    createAnalyticsPanel() {
        this.analyticsPanel = document.createElement('div');
        this.analyticsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            background: white;
            border: 2px solid #3498db;
            border-radius: 10px;
            padding: 20px;
            z-index: 10001;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            display: none;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        `;

        document.body.appendChild(this.analyticsPanel);
    },

    toggleAnalyticsPanel() {
        if (this.analyticsPanel.style.display === 'block') {
            this.analyticsPanel.style.display = 'none';
        } else {
            this.showAnalytics();
        }
    },

    showAnalytics() {
        const clickEvents = this.events.filter(e => e.type === 'click');
        const formEvents = this.events.filter(e => e.type === 'form_submit');

        const popularElements = {};
        clickEvents.forEach(event => {
            const key = `${event.element.tagName}.${event.element.className}`;
            popularElements[key] = (popularElements[key] || 0) + 1;
        });

        const popularSorted = Object.entries(popularElements)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.analyticsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #2c3e50;">Аналитика</h3>
                <button onclick="SimpleAnalytics.toggleAnalyticsPanel()" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">X</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Общая статистика:</strong><br>
                Всего событий: ${this.events.length}<br>
                Кликов: ${clickEvents.length}<br>
                Отправок форм: ${formEvents.length}
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Популярные элементы (топ-5):</strong><br>
                ${popularSorted.map(([element, count]) =>
            `${element}: ${count} кликов`).join('<br>')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Последние 5 событий:</strong><br>
                ${this.events.slice(0, 5).map(event =>
            `[${new Date(event.timestamp).toLocaleTimeString()}] ${event.type}: ${event.element?.tagName || event.form?.id}`).join('<br>')}
            </div>
            
            <button onclick="SimpleAnalytics.clearEvents()" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Очистить данные</button>
            <button onclick="SimpleAnalytics.exportData()" style="background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Экспорт данных</button>
            
            <div style="margin-top: 15px; font-size: 12px; color: #7f8c8d;">
                Панель открыта: Ctrl+Shift+A<br>
                Всего сохранено событий: ${this.events.length}/${this.maxEvents}
            </div>
        `;

        this.analyticsPanel.style.display = 'block';
    },

    clearEvents() {
        this.events = [];
        localStorage.removeItem('simpleAnalytics_events');
        this.showAnalytics();
        console.log('SimpleAnalytics: Все события очищены');
    },

    exportData() {
        const dataStr = JSON.stringify(this.events, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'analytics-data.json';
        link.click();
    },

    getEvents() {
        return this.events;
    }
};