import '@testing-library/jest-native/extend-expect';

// Mocking some React Native modules that might not work well in node environment
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => ['(app)'],
  Slot: () => null,
  Stack: () => null,
}));
