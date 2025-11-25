// error-monitor.js
const ErrorMonitor = {
    errors: [],
    maxErrors: 10,

    init() {
        console.log('ErrorMonitor: Инициализация системы мониторинга ошибок');

        // Перехват обычных ошибок JavaScript
        window.addEventListener('error', (event) => {
            this.captureError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack || 'No stack trace',
                timestamp: new Date().toISOString()
            });
        });

        // Перехват ошибок Promise
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                type: 'Promise Rejection',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack || 'No stack trace',
                timestamp: new Date().toISOString()
            });
        });

        // Загрузка сохраненных ошибок
        this.loadErrors();
    },

    captureError(errorInfo) {
        console.error('ErrorMonitor: Перехвачена ошибка', errorInfo);

        // Добавляем новую ошибку в начало массива
        this.errors.unshift(errorInfo);

        // Ограничиваем количество ошибок
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(0, this.maxErrors);
        }

        // Сохраняем в localStorage
        this.saveErrors();

        // Можно добавить отправку на сервер здесь
        // this.sendToServer(errorInfo);
    },

    saveErrors() {
        try {
            localStorage.setItem('errorMonitor_errors', JSON.stringify(this.errors));
        } catch (e) {
            console.warn('ErrorMonitor: Не удалось сохранить ошибки в localStorage', e);
        }
    },

    loadErrors() {
        try {
            const saved = localStorage.getItem('errorMonitor_errors');
            if (saved) {
                this.errors = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('ErrorMonitor: Не удалось загрузить ошибки из localStorage', e);
        }
    },

    getErrors() {
        return this.errors;
    },

    clearErrors() {
        this.errors = [];
        localStorage.removeItem('errorMonitor_errors');
        console.log('ErrorMonitor: Все ошибки очищены');
    },

    // Метод для тестирования
    testError() {
        // Генерируем тестовую ошибку
        throw new Error('Тестовая ошибка от ErrorMonitor');
    }
};