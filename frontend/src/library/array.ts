export function aggregate<T>(arr: Array<T>, prop: (x: T) => any, initial: any): any {
  if (arr === null || arr.length == 0) return initial;
  return arr.reduce((r, current) => r + prop(current), initial);
}

export function maxOf<T>(arr: Array<T>, prop: (x: T) => any): T | null {
  if (arr === null || arr.length == 0) return null;
  const max = arr.reduce((prev: any, current: any) => (prev && prop(prev) > prop(current) ? prev : current));
  return max;
}

export function foreach<T>(arr: Array<T>, fn: (x: T) => void): void {
  if (arr === null || arr.length == 0) return;
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    fn(item);
  }
}

export function pushIf<T>(arr: Array<T>, newValue: T): Array<T> {
  if (newValue != null) arr.push(newValue);
  return arr;
}

export function doAll<T>(arr: Array<T>, prop: (x: T) => boolean): boolean {
  if (arr === null || arr.length == 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if (!prop(arr[i])) return false;
  }
  return true;
}

export function doAny<T>(arr: Array<T>, prop: (x: T) => boolean): boolean {
  if (arr === null || arr.length == 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if (prop(arr[i])) return true;
  }
  return false;
}

export function doAnyWith<T>(arr: Array<T>, prop: (x: T) => boolean, callback: (x: T) => void): boolean {
  if (arr === null || arr.length == 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if (prop(arr[i])) {
      callback(arr[i]);
      return true;
    }
  }
  return false;
}

export function findAndDo<T>(arr: Array<T>, prop: (x: T) => boolean, onFound: (x: T) => void, addNew: () => T): boolean {
  if (arr === null || arr.length == 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if (prop(arr[i])) {
      onFound(arr[i]);
      return true;
    }
  }
  let newItem = addNew();
  arr.push(newItem);
  onFound(newItem);
  return false;
}
