function generateSafeValue(input) {
  if (input.type === 'email') return 'test@example.com';
  if (input.type === 'number') return '1';
  if (input.type === 'password') return 'Test@1234';
  if (input.tag === 'textarea') return 'Test message';

  return 'test';
}

module.exports = { generateSafeValue };
