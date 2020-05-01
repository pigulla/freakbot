export interface PromiseParts<T> {
    promise: Promise<T>
    resolve: (value: T) => void
    reject: (error: Error) => void
}

export function new_promise<T = void> (): PromiseParts<T> {
    let resolver: (value: T) => void
    let rejector: (error: Error) => void

    const promise: Promise<T> = new Promise<T>(function (resolve, reject) {
        resolver = resolve
        rejector = reject
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore - We know that the callback in the Promise-constructor is run synchronously
    return {promise, resolve: resolver, reject: rejector}
}
