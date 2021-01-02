import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { login as loginApi } from './AuthApi';
import { Plugins } from '@capacitor/core';


type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;



export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login?: LoginFn;
  logout?: LogoutFn;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: '',
};

let finalState: any = initialState;

function getState(){
  const {Storage} = Plugins;
  asyncState();
  
  return finalState;

  async function asyncState(){
      const aaS = await Storage.get({key: 'AuthState'});
      if(aaS.value){
          finalState = JSON.parse(aaS.value);
      } else{
          finalState = initialState;
      }
  }
}

export const AuthContext = React.createContext<AuthState>(getState());

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(getState());
  const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;
  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallBack, []);
  useEffect(authenticationEffect, [pendingAuthentication]);
  const value = { isAuthenticated, login, logout, isAuthenticating, authenticationError, token };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  function logoutCallBack(){
    setState({
      ...initialState,
      username: undefined,
      password: undefined,
    });

    removeState();

    async function removeState(){
      const {Storage} = Plugins;
      await Storage.remove({key: 'AuthState'});
    }
  }

  function loginCallback(username?: string, password?: string): void {
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password
    });
  }

  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    }

    async function authenticate() {
      if (!pendingAuthentication) {
        return;
      }
      try {
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        const { token } = await loginApi(username, password);
        if (canceled) {
          return;
        }
        setState({
          ...state,
          token,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });

        const {Storage} = Plugins;
        await Storage.set({
          key: 'AuthState',
          value: JSON.stringify({
            ...state,
            token,
            pendingAuthentication: false,
            isAuthenticated: true,
            isAuthenticating: false,
          })
        });

      } catch (error) {
        if (canceled) {
          return;
        }
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
};
