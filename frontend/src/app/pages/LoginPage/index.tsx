import { Brand } from 'app/components/Brand';
import React from 'react';
import styled from 'styled-components/macro';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <Wrapper>
      <Brand />
      <LoginForm />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
