export function compareObjectId(id: unknown, targetId: string): boolean {
  if (typeof id === 'string') {
    return id === targetId;
  }
  // If it's a BSON ObjectId object, convert to string
  if (id && typeof id === 'object' && 'toString' in id && typeof id.toString === 'function') {
    return id.toString() === targetId;
  }
  return false;
}
