export function isObjectEmpty(obj: Record<string, unknown>): boolean {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}


export function convertCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const result = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return `startDate=${result}`
}

export function debounce<T extends (...args: unknown[]) => unknown>(func: T): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return function (this: unknown, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
            func.apply(this, args);
        }, 800);
    };
};


