// Simple logger for the application
const DEBUG = process.env.DEBUG === 'true';

function formatMessage(level: string, message: string): string {
	return `[${level.toUpperCase()}] ${message}`;
}

export default {
	debug: (message: string) => {
		if (DEBUG) {
			console.debug(formatMessage('debug', message));
		}
	},
	info: (message: string) => {
		console.info(formatMessage('info', message));
	},
	warn: (message: string) => {
		console.warn(formatMessage('warn', message));
	},
	error: (message: string, error?: Error) => {
		console.error(formatMessage('error', message));
		if (error) {
			console.error(error);
		}
	}
};
