import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders mobile app link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Mobile app here!/i);
  expect(linkElement).toBeInTheDocument();
});

test('Make sure the url goes to my apple website', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Mobile app here!/i);
  expect(linkElement.href).toEqual("https://apps.apple.com/us/app/boggle-solve/id1496483167");
});

test("Make sure the button does not say end game when first loaded", () => {
const { getByText } = render(<App />);
let endButton = null;
try { endButton = getByText(/End Game/i); } catch { endButton = null }
expect(endButton).not.toBeTruthy();
});

test('renders title on the page', () => {
  const { getByText } = render(<App />);
  const title = getByText(/Boggle Solve Web/i);
  expect(title).toBeInTheDocument();
});

test('renders button on the page', () => {
  const { getByText } = render(<App />);
  const button = getByText(/New Game/i);
  expect(button).toBeInTheDocument();
});