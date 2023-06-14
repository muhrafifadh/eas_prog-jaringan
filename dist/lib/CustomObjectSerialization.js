const __typename__ = '__typename__';
const TYPENAME_MAP = 'Map';
export function getReplacerReviver(types) {
    const numSuperclasses = new Map();
    for (const [typename, type] of Object.entries(types)) {
        for (const [typenameOther, typeOther] of Object.entries(types)) {
            if (typename === typenameOther) {
                continue;
            }
            const currentSuperclasses = numSuperclasses.get(typename) || 0;
            if (Object.prototype.isPrototypeOf.call(typeOther, type)) {
                numSuperclasses.set(typename, currentSuperclasses + 1);
            } else {
                numSuperclasses.set(typename, currentSuperclasses);
            }
        }
    }
    const levelOrderTypes = new Map([...numSuperclasses.entries()]
        .sort((a, b) => b[1] - a[1])
        .map((value) => [value[0], types[value[0]]]));
    return {
        replacer(_key, value) {
            if (!value) {
                return value;
            }
            if (Object.prototype.hasOwnProperty.call(value, __typename__)) {
                throw new Error('Objects to be serialized cannot have a __typename__ property');
            }
            if (value instanceof Map) {
                return {
                    __typename__: TYPENAME_MAP,
                    entries: Array.from(value.entries()),
                };
            }
            for (const [typename, type] of levelOrderTypes.entries()) {
                if (value instanceof type) {
                    Object.defineProperty(value, __typename__, {
                        value: typename,
                        enumerable: true,
                    });
                    return value;
                }
            }
            return value;
        },
        reviver(_key, value) {
            if (!value) {
                return value;
            }
            const typename = Object.getOwnPropertyDescriptor(value, __typename__);
            if (!typename || !typename.value) {
                return value;
            }
            if (typename.value === TYPENAME_MAP) {
                return new Map(value.entries);
            }
            const constructor = levelOrderTypes.get(typename.value);
            if (constructor) {
                const newObject = new constructor();
                delete value.__typename__;
                Object.assign(newObject, value);
                return newObject;
            }
            return value;
        },
    };
}