import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginGithub from '@/components/LoginGithub';
import * as authActions from '@/actions/auth'; 

jest.mock('@/actions/auth', () => ({
  login: jest.fn(),
}));

describe('LoginGithub Component', () => {
  it('calls login with "github" when clicked', () => {
    render(<LoginGithub />);

    const githubButton = screen.getByText('Login with Github');
    fireEvent.click(githubButton);

    expect(authActions.login).toHaveBeenCalledWith('github');
  });
});
