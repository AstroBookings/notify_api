import { generateId } from './id.util';

describe('The generateId function', () => {
  it('should generate a valid ID', () => {
    // Act
    const actualId = generateId();
    // Assert
    expect(actualId).toBeDefined(); // Check that an ID is generated
    expect(typeof actualId).toBe('string'); // Check that the ID is a string
    expect(actualId.length).toBeGreaterThan(0); // Check that the ID is not empty
  });
});
