export function ctor_name(object: object): string {
    return Object.getPrototypeOf(object).constructor.name
}
